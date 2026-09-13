// ============================================================
// ALE WebUI — design:check 增补：Kit 站四入口门禁（R10）
// 覆盖 8095 Kit 站的 Hub + /react/ + /alpine/ + /static/：
//   空白页 / 破图(≥400 与请求失败) / 空 title / 控制台错误 / 320 根级溢出 —— 任一即红
// 用法：
//   node check-kit.mjs                       # 默认 http://10.20.30.203:8095/（部署的 Kit 站，需 VPN）
//   KIT_URL=http://127.0.0.1:8766/ node check-kit.mjs   # CI：对本地装配目录（KIT_URL 优先级最高）
//   node check-kit.mjs --url http://host:port           # 显式指定（低于 KIT_URL）
// 输出：artifacts/kit-check.json + 每入口 320/1440 截图；任一 FAIL 则 exit 1
// ============================================================
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const argUrl = args.includes("--url") ? args[args.indexOf("--url") + 1] : null;
const BASE = (process.env.KIT_URL || argUrl || "http://10.20.30.203:8095/").replace(/\/?$/, "/");
const ENTRIES = [
  { id: "HUB", path: "" },
  { id: "REACT", path: "react/" },
  { id: "ALPINE", path: "alpine/" },
  { id: "STATIC", path: "static/" },
];

const report = { url: BASE, time: new Date().toISOString(), checks: [], pass: true };
function record(id, name, pass, detail) {
  report.checks.push({ id, name, pass, detail });
  if (!pass) report.pass = false;
  console.log(`${pass ? "PASS" : "FAIL"}  ${id}  ${name}${detail ? "  — " + JSON.stringify(detail) : ""}`);
}

function findBrowser() {
  const env = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH;
  if (env && fs.existsSync(env)) return env;
  const cands = [
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
    "/snap/bin/chromium",
  ];
  for (const p of cands) if (fs.existsSync(p)) return p;
  throw new Error("未找到 Edge/Chrome，可设 PUPPETEER_EXECUTABLE_PATH 或 CHROME_PATH 指定");
}

const shotDir = path.join(HERE, "artifacts");
fs.mkdirSync(shotDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: findBrowser(),
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1440,900"],
});
const page = await browser.newPage();

for (const e of ENTRIES) {
  const url = BASE + e.path;
  const bad = [];
  const consoleErrors = [];
  const onResponse = (r) => { if (r.status() >= 400) bad.push({ url: r.url(), status: r.status() }); };
  const onFailed = (r) => bad.push({ url: r.url(), error: "requestfailed" });
  const onConsole = (m) => { if (m.type() === "error") consoleErrors.push(m.text().slice(0, 160)); };
  page.on("response", onResponse);
  page.on("requestfailed", onFailed);
  page.on("console", onConsole);

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1800));

    const state = await page.evaluate(() => ({
      title: document.title,
      textLen: (document.body?.innerText || "").replace(/\s+/g, "").length,
      els: document.querySelectorAll("body *").length,
      rootChildren: document.querySelector("#root")?.children.length ?? null,
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }));

    const blank = state.textLen < 10 || state.els < 3 || (e.id === "REACT" && state.rootChildren === 0);
    record(`${e.id}-RENDER`, `${e.id} 非空白渲染`, !blank, {
      textLen: state.textLen, els: state.els, rootChildren: state.rootChildren,
    });
    record(`${e.id}-TITLE`, `${e.id} title 非空`, state.title.trim().length > 0, { title: state.title });
    const assetFail = bad.filter((b) => /\.(css|js|png|svg|woff2?|ttf)($|\?)/.test(b.url));
    record(`${e.id}-ASSET`, `${e.id} 子资源全部 200`, assetFail.length === 0 && bad.length === 0, {
      bad: bad.slice(0, 6),
    });
    record(`${e.id}-CONSOLE`, `${e.id} 控制台零错误`, consoleErrors.length === 0, {
      errors: consoleErrors.slice(0, 6),
    });

    await page.setViewport({ width: 320, height: 900 });
    await new Promise((r) => setTimeout(r, 400));
    const ovf = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }));
    record(`${e.id}-OVF320`, `${e.id} 320px 根级无横向溢出`, ovf.scrollW <= ovf.clientW, ovf);

    for (const w of [320, 1440]) {
      await page.setViewport({ width: w, height: 900 });
      await new Promise((r) => setTimeout(r, 300));
      await page.screenshot({ path: path.join(shotDir, `kit-${e.id.toLowerCase()}-${w}.png`) });
    }
    await page.setViewport({ width: 1440, height: 900 });
  } catch (err) {
    record(`${e.id}-RUNNER`, `${e.id} 运行器错误`, false, { error: String(err).slice(0, 200) });
  } finally {
    page.off("response", onResponse);
    page.off("requestfailed", onFailed);
    page.off("console", onConsole);
  }
}

await browser.close();
fs.writeFileSync(path.join(shotDir, "kit-check.json"), JSON.stringify(report, null, 2));
console.log(`\n=== check-kit ${report.pass ? "PASS" : "FAILED"} ===  报告：tools/design-check/artifacts/kit-check.json`);
process.exit(report.pass ? 0 : 1);
