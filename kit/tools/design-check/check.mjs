// ============================================================
// ALE WebUI — design:check（v5.4.1 最小门禁 · 专家复核 §门禁 1/2/3/4/5 项）
// 用法：
//   node check.mjs                          # 对默认站点跑全量检查
//   node check.mjs --url http://host:port   # 指定站点
//   node check.mjs --selftest               # 注入三类缺陷，验证门禁能失败
// 输出：artifacts/design-check.json（机器可读）+ 控制台摘要；任一 FAIL 则 exit 1
// 依赖：puppeteer-core + 本机 Edge/Chrome（无浏览器下载，内网友好）
// ============================================================
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");            // kit/
const REPO = path.resolve(ROOT, "..");                  // 仓库根（stage 内为 _repo_stage；工作区为 WEBUI）
const args = process.argv.slice(2);
// URL 解析：CHECK_URL 环境变量 > --url 参数 > 默认（npm run 串联多脚本时尾部参数只会落在最后一个命令上）
const urlArg = process.env.CHECK_URL
  || (args.includes("--url") ? args[args.indexOf("--url") + 1] : "http://10.10.10.218:8091/");
const SELFTEST = args.includes("--selftest");

// 候选 spec-site 目录（stage 与工作区布局不同，按存在性选择）
const SITE_DIRS = [
  path.join(REPO, "spec-site"),
  path.join(REPO, "ale-webui-site"),
].filter((d) => fs.existsSync(path.join(d, "index.html")));
const DIST_DIR = fs.existsSync(path.join(ROOT, "skeleton-static", "dist"))
  ? path.join(ROOT, "skeleton-static", "dist") : null;

const report = { url: urlArg, time: new Date().toISOString(), checks: [], pass: true };
function record(id, name, pass, detail) {
  report.checks.push({ id, name, pass, detail });
  if (!pass) report.pass = false;
  console.log(`${pass ? "PASS" : "FAIL"}  ${id}  ${name}${detail ? "  — " + JSON.stringify(detail) : ""}`);
}

function findBrowser() {
  const env = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH;
  if (env && fs.existsSync(env)) return env;
  const cands = [
    // Windows（开发机 / windows runner）
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    // Linux（CI runner）
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
    "/snap/bin/chromium",
  ];
  for (const p of cands) if (fs.existsSync(p)) return p;
  throw new Error("未找到 Edge/Chrome，可设 PUPPETEER_EXECUTABLE_PATH 或 CHROME_PATH 指定");
}

/* ── 检查 1：版本一致性（version.json ↔ index.html title） ── */
function checkVersions() {
  if (!SITE_DIRS.length) { record("VER", "版本真源存在", false, { error: "未找到 spec-site 目录" }); return; }
  for (const dir of SITE_DIRS) {
    const vjPath = path.join(dir, "design-system.version.json");
    if (!fs.existsSync(vjPath)) { record("VER", "版本真源存在", false, { missing: vjPath }); continue; }
    const vj = JSON.parse(fs.readFileSync(vjPath, "utf8"));
    const html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
    const expect = vj.sites["spec-site"]?.title;
    const ok = expect && html.includes(`<title>${expect}</title>`);
    record("VER", "版本一致性（title ↔ version.json）", !!ok, { expect, dir: path.basename(dir) });
  }
}

/* ── 检查 2：核心静态资产存在（本地产物） ── */
function checkAssetsLocal() {
  const required = ["fonts/noto.css",
    "assets/ale-logo.png", "js/i18n.js", "css/tokens.css"];
  let allOk = true;
  for (const site of [...SITE_DIRS, DIST_DIR].filter(Boolean)) {
    const missing = required.filter((f) => !fs.existsSync(path.join(site, f)));
    // M6-F:分片字体目录必须存在且非空(真 unicode-range)
    const splitDir = path.join(site, "fonts/noto-split");
    const slices = fs.existsSync(splitDir) ? fs.readdirSync(splitDir).filter((f) => f.endsWith(".woff2")) : [];
    if (slices.length < 50) missing.push(`fonts/noto-split/(仅 ${slices.length} 片)`);
    if (missing.length) { allOk = false; record("ASSET-LOCAL", "核心资产存在", false, { site: path.basename(site), missing }); }
  }
  if (allOk) record("ASSET-LOCAL", "核心资产存在（全部候选目录）", true, { dirs: [...SITE_DIRS, DIST_DIR].filter(Boolean).map((d) => path.basename(d)) });
}

/* ── 浏览器检查：五档溢出 / hit-test / 资产与控制台 ── */
async function checkBrowser() {
  const browser = await puppeteer.launch({
    executablePath: findBrowser(),
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--window-size=1440,900"],
  });
  const page = await browser.newPage();
  const badResponses = [];
  const consoleErrors = [];
  let fontBytesSpec = 0;
  page.on("response", (r) => {
    if (r.status() >= 400) badResponses.push({ url: r.url(), status: r.status() });
    if (/\.woff2?\b/i.test(r.url())) fontBytesSpec += Number(r.headers()["content-length"] || 0);
  });
  page.on("requestfailed", (r) => badResponses.push({ url: r.url(), error: "requestfailed" }));
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text().slice(0, 160)); });

  if (SELFTEST) {
    // 缺陷③（资产 404）：拦截并中止一个核心 CSS —— 验证 ASSET-HTTP 门禁能失败
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (/\/css\/tokens\.css/.test(req.url())) req.abort();
      else req.continue();
    });
  }

  await page.goto(urlArg, { waitUntil: "networkidle2", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1800));

  if (SELFTEST) {
    // 缺陷①（溢出）：超宽静态元素；缺陷②（hit-test）：全屏透明覆盖层（等价 F13 场景）
    await page.evaluate(() => {
      const d = document.createElement("div");
      d.style.cssText = "position:static;width:500px;height:2px";
      document.body.appendChild(d);
      const cover = document.createElement("div");
      cover.style.cssText = "position:fixed;left:0;top:0;width:100vw;height:80px;z-index:9999;background:transparent";
      document.body.appendChild(cover);
    });
    console.log("[selftest] 已注入缺陷：超宽元素 + 全屏覆盖层 + tokens.css 404");
  }

  // 检查 3：五档视口根级溢出
  for (const w of [320, 375, 768, 1024, 1440]) {
    await page.setViewport({ width: w, height: 900 });
    await new Promise((r) => setTimeout(r, 400));
    const r2 = await page.evaluate(() => {
      const d = document.documentElement;
      const overflowEls = [];
      for (const el of document.querySelectorAll("body *")) {
        const rc = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (rc.right > d.clientWidth + 1 && cs.position !== "fixed") {
          let p = el.parentElement, clipped = false;
          while (p && p !== document.body) {
            const pcs = getComputedStyle(p);
            if (/(auto|hidden|clip|scroll)/.test(pcs.overflowX)) { clipped = true; break; }
            p = p.parentElement;
          }
          if (!clipped) overflowEls.push(el.tagName + "." + String(el.className).slice(0, 40));
        }
      }
      return { scrollW: d.scrollWidth, clientW: d.clientWidth, overflowEls: overflowEls.slice(0, 5) };
    });
    const pass = r2.scrollW <= r2.clientW;
    record(`OVF-${w}`, `${w}px 根级无横向溢出`, pass, r2);
  }

  // 检查 4：hit-test（导航链接中心命中自身）+ 关键控件热区
  await page.setViewport({ width: 1440, height: 900 });
  await new Promise((r) => setTimeout(r, 500));
  const hit = await page.evaluate(() => {
    const misses = [];
    for (const a of document.querySelectorAll(".primary-nav a")) {
      const r = a.getBoundingClientRect();
      const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      if (!(el === a || a.contains(el))) misses.push(a.textContent);
    }
    function hitPx(el) {
      if (!el) return null;
      const cs = getComputedStyle(el, "::before");
      const b = el.getBoundingClientRect();
      if (!cs.content || cs.content === "none") return Math.round(Math.min(b.width, b.height));
      const f = (v) => Math.abs(parseFloat(v) || 0);
      return Math.round(Math.min(b.width + f(cs.left) + f(cs.right), b.height + f(cs.top) + f(cs.bottom)));
    }
    const sort = document.querySelector(".sort-btn");
    const pg = [...document.querySelectorAll(".pg-btn")].find((b) => !b.disabled);
    const cb = document.querySelector("table.data input[type=checkbox]");
    return {
      navMisses: misses,
      sort: hitPx(sort), pg: hitPx(pg), checkbox: hitPx(cb),
      iconBtn: hitPx(document.querySelector(".icon-btn")),
    };
  });
  record("HIT-NAV", "导航链接命中自身", hit.navMisses.length === 0, { misses: hit.navMisses });
  record("HIT-CTRL", "表格控件热区 ≥44px", [hit.sort, hit.pg, hit.checkbox].every((v) => v >= 44), hit);
  record("HIT-ICON", "图标按钮热区 ≥40px（桌面口径）", hit.iconBtn >= 40, { iconBtn: hit.iconBtn });

  // 检查 5：核心资产 HTTP 200 + 控制台零错误
  const assetFail = badResponses.filter((b) => /\.(css|js|png|woff2?)($|\?)/.test(b.url));
  record("ASSET-HTTP", "核心资产全部 HTTP 200", assetFail.length === 0, { bad: badResponses.slice(0, 6) });
  record("CONSOLE", "控制台零未解释错误", consoleErrors.length === 0, { errors: consoleErrors.slice(0, 6) });

  // M6-R2(R5 发现):字体预算覆盖规范站(内容页基线实测 894KB → 校准 950KB;RC 目标见台账 R4-04)
  const specFontKB = Math.round(fontBytesSpec / 1024);
  record("FONT-BUDGET", "首屏字体传输 ≤950KB(M6-F 校准门禁,基线 894)", specFontKB <= 950, { fontKB: specFontKB });

  // 基线截图（320 + 1440）
  const shotDir = path.join(HERE, "artifacts");
  fs.mkdirSync(shotDir, { recursive: true });
  for (const w of [320, 1440]) {
    await page.setViewport({ width: w, height: 900 });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: path.join(shotDir, `baseline-${w}.png`) });
  }
  report.screenshots = ["baseline-320.png", "baseline-1440.png"].map((f) => path.join(shotDir, f));

  await browser.close();
}

try {
  checkVersions();
  checkAssetsLocal();
  await checkBrowser();
} catch (e) {
  record("RUNNER", "运行器错误", false, { error: String(e).slice(0, 300) });
}

fs.mkdirSync(path.join(HERE, "artifacts"), { recursive: true });
fs.writeFileSync(path.join(HERE, "artifacts", "design-check.json"), JSON.stringify(report, null, 2));
console.log(`\n=== design:check ${report.pass ? "PASS" : "FAILED"} ===  报告：tools/design-check/artifacts/design-check.json`);
process.exit(report.pass ? 0 : 1);
