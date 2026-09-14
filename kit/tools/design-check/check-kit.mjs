// ============================================================
// ALE WebUI — design:check 增补：Kit 站四入口门禁（R10 + M6-R1/R4-05 扩展）
// 覆盖 8095 Kit 站的 Hub + /react/ + /alpine/ + /static/：
//   空白页 / 破图 / 空 title / 控制台错误 / 320 与 768 根级溢出（各 6 项）
//   + R18 交互断言：必选同意契约、抽屉焦点、主题单击、面包屑目的地
//   + M6-R1 键盘链断言（R4-05 第一批）：键盘排序 / 键盘分页 / 键盘勾选 /
//     键盘列宽 / focus-visible —— 任一即红
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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ── R18 交互断言（从"页面存在"到"行为正确"；第二轮 N1/N2/N4/N5 回归门禁） ── */

// N1：主题按钮单击即切换，localStorage 与 .dark 同步（双绑定则单击切两次回到原点 → FAIL）
async function ixTheme(page) {
  if (!(await page.$("[data-theme-toggle]"))) return { na: true };
  await page.evaluate(() => localStorage.removeItem("theme"));
  await page.reload({ waitUntil: "networkidle2" });
  await sleep(700);
  await page.click("[data-theme-toggle]");
  await sleep(450);
  const s1 = await page.evaluate(() => ({
    dark: document.documentElement.classList.contains("dark"),
    stored: localStorage.getItem("theme"),
  }));
  await page.click("[data-theme-toggle]");
  await sleep(450);
  const s2 = await page.evaluate(() => ({
    dark: document.documentElement.classList.contains("dark"),
    stored: localStorage.getItem("theme"),
  }));
  return {
    na: false,
    pass: s1.dark === true && s1.stored === "dark" && s2.dark === false && s2.stored === "light",
    click1: s1, click2: s2,
  };
}

// N2：必选同意纳入提交契约——未勾选提交无成功 Toast 且出现同意错误；勾选后成功
// R20 扩展：错误态 #demo-agree 必须 aria-invalid="true"（断言增强，条目数不变）
async function ixAgreeSubmit(page) {
  await page.goto(BASE + "react/#/forms", { waitUntil: "networkidle2", timeout: 30000 });
  await sleep(1200);
  await page.type("#demo-name", "R18 自测");
  const clickCreate = () => page.evaluate(() => {
    [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "创建")?.click();
  });
  await clickCreate();
  await sleep(350);
  const afterFail = await page.evaluate(() => document.body.innerText);
  const agreeInvalid = await page.evaluate(() =>
    document.getElementById("demo-agree")?.getAttribute("aria-invalid"));
  await page.click("#demo-agree");
  await clickCreate();
  await sleep(350);
  const afterOk = await page.evaluate(() => document.body.innerText);
  return {
    pass: afterFail.includes("必须先阅读并同意条款") && !afterFail.includes("已创建")
      && afterOk.includes("已创建") && agreeInvalid === "true",
    failShown: afterFail.includes("必须先阅读并同意条款"),
    successToastOnFail: afterFail.includes("已创建"),
    successAfterAgree: afterOk.includes("已创建"),
    agreeAriaInvalidOnError: agreeInvalid,
  };
}

// N4：AppShell 抽屉 320 打开焦点入圈、Tab 循环不出圈、Esc 关闭归还触发按钮
async function ixDrawerFocus(page) {
  await page.setViewport({ width: 320, height: 900 });
  await page.goto(BASE + "react/#/forms", { waitUntil: "networkidle2", timeout: 30000 });
  // 强制真刷新：脱离上一步残留的 DOM 状态（如右下角成功 Toast 会盖住 FAB 拦截点击）
  await page.reload({ waitUntil: "networkidle2" });
  await sleep(1200);
  const fab = 'button[aria-label="打开导航菜单"]';
  await page.click(fab);
  await sleep(350);
  const expanded = await page.evaluate((sel) =>
    document.querySelector(sel)?.getAttribute("aria-expanded"), fab);
  const focusInPanel = await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'));
  for (let i = 0; i < 3; i++) { await page.keyboard.press("Tab"); await sleep(120); }
  const tabStillInPanel = await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'));
  await page.keyboard.press("Escape");
  await sleep(300);
  const focusReturned = await page.evaluate(() =>
    document.activeElement?.getAttribute("aria-label") === "打开导航菜单"
    && document.activeElement.getAttribute("aria-expanded") === "false");
  await page.setViewport({ width: 1440, height: 900 });
  return { pass: expanded === "true" && focusInPanel && tabStillInPanel && focusReturned, expanded, focusInPanel, tabStillInPanel, focusReturned };
}

// N5：面包屑"首页"必须落在 /static/ 内（不跳出工程档到站点根）
async function ixBreadcrumb(page) {
  await page.goto(BASE + "static/article.html", { waitUntil: "networkidle2", timeout: 30000 });
  await sleep(600);
  await page.click('nav[aria-label="面包屑"] a');
  await sleep(600);
  const dest = page.url();
  return { pass: /\/static\/index\.html$/.test(dest), dest };
}

/* ── M6-R1/R4-05 第一批键盘链断言(评估方 §5 草案转化;实现已在,缺的是 CI 保护) ── */
async function ixKeyboardSort(page) {
  await page.goto(BASE + "react/", { waitUntil: "networkidle2", timeout: 30000 });
  await sleep(1200);
  const before = await page.evaluate(() => ({
    sort: document.querySelector("table.data thead th[aria-sort]")?.getAttribute("aria-sort"),
    firstRow: document.querySelector("table.data tbody tr td:nth-child(3)")?.textContent.trim(),
  }));
  await page.evaluate(() => document.querySelector("table.data thead .sort-btn").focus());
  await page.keyboard.press("Enter");
  await sleep(450);
  const after = await page.evaluate(() => ({
    sort: document.querySelector("table.data thead th[aria-sort='ascending'], table.data thead th[aria-sort='descending']")?.getAttribute("aria-sort"),
    firstRow: document.querySelector("table.data tbody tr td:nth-child(3)")?.textContent.trim(),
  }));
  return {
    pass: after.sort && after.sort !== "none" && before.sort !== after.sort && before.firstRow !== after.firstRow,
    before, after,
  };
}

async function ixKeyboardPagination(page) {
  await page.goto(BASE + "react/", { waitUntil: "networkidle2", timeout: 30000 });
  await sleep(1200);
  const before = await page.evaluate(() => document.querySelector("table.data tbody tr td:nth-child(3)")?.textContent.trim());
  await page.evaluate(() => [...document.querySelectorAll(".pg-btn")].find((b) => b.getAttribute("aria-label") === "下一页")?.focus());
  await page.keyboard.press("Enter");
  await sleep(450);
  const after = await page.evaluate(() => ({
    firstRow: document.querySelector("table.data tbody tr td:nth-child(3)")?.textContent.trim(),
    current: [...document.querySelectorAll(".pg-btn, .pg-current, [aria-current='page']")].map((b) => b.textContent.trim()).join(","),
  }));
  return { pass: before !== after.firstRow, before, after: after.firstRow };
}

async function ixKeyboardSelect(page) {
  await page.goto(BASE + "react/", { waitUntil: "networkidle2", timeout: 30000 });
  await sleep(1200);
  await page.evaluate(() => document.querySelector("table.data tbody input[type='checkbox']").focus());
  await page.keyboard.press("Space");
  await sleep(450);
  const r = await page.evaluate(() => ({
    checked: document.querySelector("table.data tbody input[type='checkbox']").checked,
    rowSelected: document.querySelector("table.data tbody tr[aria-selected='true']") !== null,
    batchBar: document.querySelector(".btn-danger") !== null,
  }));
  return { pass: r.checked && r.rowSelected && r.batchBar, ...r };
}

async function ixKeyboardColWidth(page) {
  await page.goto(BASE + "react/", { waitUntil: "networkidle2", timeout: 30000 });
  await sleep(1200);
  await page.evaluate(() => document.querySelector("table.data .col-resizer")?.focus());
  const width = () => page.evaluate(() => {
    const th = document.querySelector("table.data .col-resizer").closest("th");
    return Math.round(th.getBoundingClientRect().width);
  });
  // 第一次按键切换到精确模式(fill→exact 渲染宽度有跳变),增量取同模式的后续按键
  await page.keyboard.press("ArrowRight");
  await sleep(400);
  const after1 = await width();
  await page.keyboard.press("ArrowRight");
  await sleep(400);
  const after2 = await width();
  const delta = after2 - after1;
  return { pass: delta >= 8 && delta <= 12, after1, after2, delta };
}

async function ixFocusVisible(page) {
  await page.goto(BASE + "react/", { waitUntil: "networkidle2", timeout: 30000 });
  await sleep(1000);
  // 键盘 Tab 走 3 步,断言落点有 ≥2px 可见 outline(规范 :focus-visible = 2px solid)
  let ok = false; const seen = [];
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press("Tab");
    await sleep(120);
    const s = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      return { tag: el.tagName, w: parseFloat(cs.outlineWidth), style: cs.outlineStyle };
    });
    if (s) seen.push(s);
    if (s && s.style !== "none" && s.w >= 2) { ok = true; break; }
  }
  return { pass: ok, seen };
}

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
  let fontBytes = 0;
  const onResponse = (r) => {
    if (r.status() >= 400) bad.push({ url: r.url(), status: r.status() });
    // M6-R2/R4-04:字体传输预算(真分片后按需加载,首屏 ≤350KB)
    if (/\.woff2?\b/i.test(r.url())) fontBytes += Number(r.headers()["content-length"] || 0);
  };
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

    // M6-R1/R4-01 类:768 平板档纳入门禁(NVCI 破版教训——只测 320/1440 会漏中间档)
    await page.setViewport({ width: 768, height: 900 });
    await new Promise((r) => setTimeout(r, 400));
    const ovf768 = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }));
    record(`${e.id}-OVF768`, `${e.id} 768px 根级无横向溢出`, ovf768.scrollW <= ovf768.clientW, ovf768);
    const fontKB = Math.round(fontBytes / 1024);
    // M6-R2 校准门禁:实测基线 REACT 586 / ALPINE 677 / STATIC 538(演示页 CJK 文字量大),
    // 门禁取最大基线 +10% ≈ 750KB;RC 目标 ≤350KB(台账 docs/release/v6-readiness.md R4-04)。
    // 无 webfont 的入口(如 HUB)记 na 通过。
    const BUDGET = 750;
    record(`${e.id}-FONT-BUDGET`, `${e.id} 首屏字体传输 ≤${BUDGET}KB(M6-F 校准门禁)`, fontKB <= BUDGET, { fontKB, na: fontKB === 0 });

    for (const w of [320, 768, 1440]) {
      await page.setViewport({ width: w, height: 900 });
      await new Promise((r) => setTimeout(r, 300));
      await page.screenshot({ path: path.join(shotDir, `kit-${e.id.toLowerCase()}-${w}.png`) });
    }
    await page.setViewport({ width: 1440, height: 900 });

    // R18 交互断言（按入口分派）+ M6-R1/R4-05 第一批键盘链断言
    const IX = {
      HUB: [],
      REACT: [["IX-AGREE", "必选同意提交契约", ixAgreeSubmit], ["IX-DRAWER", "抽屉焦点圈闭/归还", ixDrawerFocus],
              ["IX-KBD-SORT", "键盘排序(Enter→aria-sort+行序变化)", ixKeyboardSort],
              ["IX-KBD-PAGE", "键盘分页(Enter→数据翻页)", ixKeyboardPagination],
              ["IX-KBD-SELECT", "键盘勾选(Space→aria-selected+批量条)", ixKeyboardSelect],
              ["IX-KBD-COLW", "键盘列宽(ArrowRight→+10px)", ixKeyboardColWidth],
              ["IX-FOCUS-VISIBLE", "键盘焦点可见(outline≥2px)", ixFocusVisible]],
      ALPINE: [["IX-THEME", "主题单击切换（含 localStorage 同步）", ixTheme]],
      STATIC: [["IX-THEME", "主题单击切换（含 localStorage 同步）", ixTheme], ["IX-CRUMB", "面包屑目的地不跳出 /static/", ixBreadcrumb]],
    }[e.id] ?? [];
    for (const [id, name, fn] of IX) {
      try {
        const r = await fn(page);
        if (r.na) record(`${e.id}-${id}`, `${name}（本入口无该交互，跳过）`, true, { na: true });
        else record(`${e.id}-${id}`, name, !!r.pass, r);
      } catch (err) {
        record(`${e.id}-${id}`, name, false, { error: String(err).slice(0, 200) });
      }
    }
  } catch (err) {
    record(`${e.id}-RUNNER`, `${e.id} 运行器错误`, false, { error: String(err).slice(0, 200) });
  } finally {
    page.off("response", onResponse);
    page.off("requestfailed", onFailed);
    page.off("console", onConsole);
  }
}

/* ── M6-RC 第二批断言(R4-05 §5 草案转化) ── */
// ① reduced-motion:全局 reduce 规则把过渡压到 ≈0(规范 23 章硬性要求)
try {
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto(BASE + "react/", { waitUntil: "networkidle2", timeout: 30000 });
  await sleep(800);
  const rm = await page.evaluate(() => getComputedStyle(document.body).transitionDuration);
  const ms = String(rm).split(",").map((s) => parseFloat(s) * 1000);
  record("CROSS-REDUCED-MOTION", "reduced-motion 下过渡时长 ≈0(全局兜底生效)", ms.length > 0 && ms.every((v) => v < 2), { durations: rm });
  await page.emulateMediaFeatures([]).catch(() => {});
} catch (err) {
  record("CROSS-REDUCED-MOTION", "reduced-motion 下过渡时长 ≈0", false, { error: String(err).slice(0, 160) });
}

// ② 主题跨入口持久:alpine 切暗 → static/react/alpine 一致恢复(同一 localStorage key + html.dark)
try {
  await page.goto(BASE + "alpine/", { waitUntil: "networkidle2", timeout: 30000 });
  await sleep(600);
  await page.click("[data-theme-toggle]");
  await sleep(500);
  const seq = [];
  for (const p of ["static/", "react/", "alpine/"]) {
    await page.goto(BASE + p, { waitUntil: "networkidle2", timeout: 30000 });
    await sleep(500);
    seq.push(await page.evaluate(() => ({
      p: location.pathname,
      dark: document.documentElement.classList.contains("dark"),
      stored: localStorage.getItem("theme"),
    })));
  }
  await page.click("[data-theme-toggle]").catch(() => {});
  await sleep(300);
  const allDark = seq.every((s) => s.dark && s.stored === "dark");
  record("CROSS-THEME-PERSIST", "主题跨入口持久(alpine 切暗,static/react/alpine 一致恢复)", allDark, { seq });
} catch (err) {
  record("CROSS-THEME-PERSIST", "主题跨入口持久", false, { error: String(err).slice(0, 160) });
}

await browser.close();
fs.writeFileSync(path.join(shotDir, "kit-check.json"), JSON.stringify(report, null, 2));
console.log(`\n=== check-kit ${report.pass ? "PASS" : "FAILED"} ===  报告：tools/design-check/artifacts/kit-check.json`);
process.exit(report.pass ? 0 : 1);
