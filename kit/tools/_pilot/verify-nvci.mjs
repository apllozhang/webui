// M5 试点审计：nvci-lite 向导第 1→2 步（Alpine 档候选：轻量单任务向导）
// 用法：node verify-nvci.mjs <base> <outdir>
// 断言：品牌令牌生效 / 向导 1→2 流转（Stepper active） / 跨步数据保持（返回后勾选不丢）
//      / 320 根级无溢出 / 控制台零错 / 子资源 200；截图 step1/step2 × 320/1440
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const [, , BASE = "http://127.0.0.1:8814/", OUT = "pilot-evidence/nvci"] = process.argv;
const exe = ["C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"].find((p) => fs.existsSync(p));
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: exe, headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
let fail = 0;
const rec = (name, pass, detail) => {
  if (!pass) fail++;
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}  — ${JSON.stringify(detail).slice(0, 220)}`);
};
const bad = []; const cerr = [];
page.on("response", (r) => { if (r.status() >= 400 && !r.url().includes("/api/")) bad.push({ u: r.url(), s: r.status() }); });
page.on("requestfailed", (r) => bad.push({ u: r.url(), e: "requestfailed" }));
page.on("console", (m) => { if (m.type() === "error") cerr.push(m.text().slice(0, 120)); });

await page.goto(BASE, { waitUntil: "networkidle2", timeout: 30000 });
await new Promise((r) => setTimeout(r, 1800));

/* 0. 登录掩码未出现（本环境无密码） */
const masked = await page.evaluate(() => !document.getElementById("loginMask")?.classList.contains("hidden"));
rec("NO-LOGIN-MASK", !masked, { masked });

/* 1. 品牌令牌：--ale-purple-600 来自 kit 真源，--primary 指向它 */
const tok = await page.evaluate(() => {
  const cs = getComputedStyle(document.documentElement);
  return {
    purple: cs.getPropertyValue("--ale-purple-600").trim(),
    primary: cs.getPropertyValue("--primary").trim(),
    canvas: cs.getPropertyValue("--color-canvas").trim(),
  };
});
rec("BRAND-TOKEN", tok.purple === "#6b489d" && tok.primary === "#6b489d", tok);

/* 2. 第 1 步勾选一份资料 */
const picked = await page.evaluate(() => {
  const boxes = [...document.querySelectorAll('#step1 input[type="checkbox"]')]
    .filter((b) => !b.disabled && b.offsetParent !== null);
  if (!boxes.length) return { picked: false };
  boxes[0].click();
  return { picked: true, count: boxes.length };
});
await new Promise((r) => setTimeout(r, 400));
const selCount1 = await page.evaluate(() => document.getElementById("selCount")?.textContent?.trim());
const nextEnabled = await page.evaluate(() => !document.getElementById("toStep2")?.disabled);
rec("STEP1-SELECT", picked.picked && nextEnabled, { ...picked, selCount: selCount1, nextEnabled });

/* 3. 向导 1→2：下一步后 step2 面板可见 + 步骤条 active=2 */
await page.click("#toStep2");
await new Promise((r) => setTimeout(r, 600));
const st2 = await page.evaluate(() => ({
  pane2Visible: !document.getElementById("step2")?.classList.contains("hidden"),
  activeStep: document.querySelector(".step.active")?.dataset.step,
}));
rec("WIZARD-1TO2", st2.pane2Visible && st2.activeStep === "2", st2);
await page.screenshot({ path: path.join(OUT, "nvci-step2-1440.png") });

/* 4. 跨步数据保持：点步骤条回 1 → 勾选保留、计数一致 */
await page.evaluate(() => document.querySelector('.step[data-step="1"]')?.click());
await new Promise((r) => setTimeout(r, 600));
const back = await page.evaluate(() => ({
  pane1Visible: !document.getElementById("step1")?.classList.contains("hidden"),
  selCount: document.getElementById("selCount")?.textContent?.trim(),
  checked: [...document.querySelectorAll('#step1 input[type="checkbox"]')].filter((b) => b.checked).length,
}));
rec("STATE-KEEP", back.pane1Visible && back.checked >= 1 && back.selCount === selCount1, back);

/* 5. 320 无溢出 + 截图 */
await page.setViewport({ width: 320, height: 900 });
await new Promise((r) => setTimeout(r, 500));
const ovf = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
rec("OVF320", ovf.sw <= ovf.cw, ovf);
await page.setViewport({ width: 768, height: 900 });
await new Promise((r) => setTimeout(r, 500));
const ovf768 = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
rec("OVF768", ovf768.sw <= ovf768.cw, ovf768); // M6-R1/R4-01 类:768 平板档
await page.screenshot({ path: path.join(OUT, "nvci-step1-320.png") });
await page.setViewport({ width: 1440, height: 900 });
await new Promise((r) => setTimeout(r, 500));
await page.evaluate(() => document.querySelector('.step[data-step="2"]')?.click());
await new Promise((r) => setTimeout(r, 500));
await page.screenshot({ path: path.join(OUT, "nvci-step2-320.png") });

rec("ASSET", bad.length === 0, { bad: bad.slice(0, 4) });
rec("CONSOLE", cerr.length === 0, { errors: cerr.slice(0, 4) });

await browser.close();
console.log(`\n=== nvci pilot ${fail === 0 ? "PASS" : fail + " FAILURES"} ===`);
process.exit(fail === 0 ? 0 : 1);
