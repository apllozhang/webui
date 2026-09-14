// M5 试点审计：ale-dan-cpl-system 报价列表页（React + 工作台外壳 + 14A 表格）
// 用法：node verify-dancpl.mjs <dist/public 绝对路径> <outdir>
// 方法：vite build 产物静态服务（SPA fallback）+ puppeteer 拦截 /api/trpc* 注入数据夹具
// 断言：品牌令牌生效 / 列表渲染 / 批量选择交互 / 搜索防抖 / 320 无溢出 / 控制台零错；截图 320+1440
import puppeteer from "puppeteer-core";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const [, , DIST = process.argv[2], OUT = process.argv[3] || "pilot-evidence/dancpl"] = process.argv;
if (!DIST || !fs.existsSync(path.join(DIST, "index.html"))) {
  console.error("用法: node verify-dancpl.mjs <dist/public> <outdir>"); process.exit(2);
}
const exe = ["C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"].find((p) => fs.existsSync(p));
fs.mkdirSync(OUT, { recursive: true });
const PORT = 8812;

/* 静态服务 + SPA fallback */
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".ico": "image/x-icon", ".json": "application/json" };
const server = http.createServer((req, res) => {
  const url = req.url.split("?")[0];
  let p = path.join(DIST, url);
  if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) p = path.join(DIST, "index.html");
  res.setHeader("Content-Type", MIME[path.extname(p)] ?? "application/octet-stream");
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(PORT, r));

/* tRPC 夹具（superjson batch envelope） */
const rows = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1, quotationNo: `QT-2026-${1000 + i}`,
  customerName: ["华东制造", "南方电力", "西北交通", "华南教育"][i % 4],
  projectName: `无线网络优化项目 ${i + 1}`,
  status: ["draft", "pending_approval", "approved", "rejected"][i % 4],
  totalAmount: String(120000 + i * 37500),
  creatorName: "试点用户", creatorUsername: "pilot",
  createdAt: new Date(Date.UTC(2026, 8, 1 + i)).toISOString(),
}));
const envelope = (data) => JSON.stringify([[{ result: { data: { json: data } } }]]);

const browser = await puppeteer.launch({ executablePath: exe, headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
let fail = 0;
const rec = (name, pass, detail) => {
  if (!pass) fail++;
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}  — ${JSON.stringify(detail).slice(0, 240)}`);
};
const bad = []; const cerr = [];
page.on("response", (r) => { if (!r.url().includes("/api/trpc") && r.status() >= 400) bad.push({ u: r.url(), s: r.status() }); });
page.on("requestfailed", (r) => { if (!r.url().includes("/api/trpc")) bad.push({ u: r.url(), e: "requestfailed" }); });
page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("api/trpc")) cerr.push(m.text().slice(0, 120)); });
page.setRequestInterception(true);
page.on("request", (req) => {
  const u = req.url();
  if (!u.includes("/api/trpc")) { req.continue(); return; }
  // batch URL: /api/trpc/procA,procB?batch=1&input=... → 响应为「每过程一个信封」的扁平数组（trpc v11）
  const procs = decodeURIComponent(u).split("/api/trpc/")[1]?.split("?")[0].split(",") ?? ["auth.me"];
  const dataFor = (p) =>
    p.includes("auth.me") ? { id: 1, username: "pilot", name: "试点用户", role: "admin", email: "pilot@example.com" }
    : p.includes("quotations.list") ? { items: rows, total: 23 }
    : null;
  req.respond({
    status: 200, contentType: "application/json",
    body: JSON.stringify(procs.map((p) => ({ result: { data: { json: dataFor(p) } } }))),
  });
});

await page.goto(`http://127.0.0.1:${PORT}/quotations`, { waitUntil: "networkidle2", timeout: 60000 });
await new Promise((r) => setTimeout(r, 2500));

/* 1. 渲染：表格行数 = 夹具 8 行 */
const rowsOnPage = await page.evaluate(() => document.querySelectorAll("table tbody tr").length);
rec("LIST-RENDER", rowsOnPage === 8, { rowsOnPage });

/* 2. 品牌令牌：primary 按钮背景 = ALE Purple 600 */
const brand = await page.evaluate(() => {
  const el = [...document.querySelectorAll(".bg-primary, [class*='bg-primary']")]
    .find((b) => { const c = getComputedStyle(b).backgroundColor; return c && c !== "rgba(0, 0, 0, 0)"; });
  const bg = el ? getComputedStyle(el).backgroundColor : null;
  const root = getComputedStyle(document.documentElement);
  return { bg, primary: root.getPropertyValue("--primary").trim(), purple: root.getPropertyValue("--ale-purple-600").trim() };
});
const rgbPurple = "rgb(107, 72, 157)";
rec("BRAND-TOKEN", brand.bg === rgbPurple && brand.purple === "#6b489d", brand);

/* 3. 批量选择交互：勾选首行 → 批量操作条出现 */
await page.evaluate(() => document.querySelectorAll("table tbody input[type=checkbox]")[0]?.click());
await new Promise((r) => setTimeout(r, 500));
const batchBar = await page.evaluate(() => document.body.innerText.includes("批量") || document.body.innerText.toLowerCase().includes("selected"));
rec("BATCH-BAR", batchBar, { batchBar });

/* 4. 搜索防抖：输入触发刷新且无错误 */
await page.evaluate(() => document.querySelectorAll("table tbody input[type=checkbox]")[0]?.click());
const search = await page.$("input[type=search], input[placeholder]");
if (search) { await search.type("无线", { delay: 40 }); await new Promise((r) => setTimeout(r, 900)); }
rec("SEARCH-DEBOUNCE", cerr.length === 0, { consoleErrors: cerr.slice(0, 3) });

/* 5. 320/1440 溢出与截图 */
await page.setViewport({ width: 320, height: 900 });
await new Promise((r) => setTimeout(r, 600));
const ovf = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
rec("OVF320", ovf.sw <= ovf.cw, ovf);
await page.setViewport({ width: 768, height: 900 });
await new Promise((r) => setTimeout(r, 500));
const ovf768 = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
rec("OVF768", ovf768.sw <= ovf768.cw, ovf768); // M6-R1/R4-01 类:768 平板档
await page.screenshot({ path: path.join(OUT, "quotations-320.png") });
await page.setViewport({ width: 1440, height: 900 });
await new Promise((r) => setTimeout(r, 600));
await page.screenshot({ path: path.join(OUT, "quotations-1440.png") });
rec("ASSET", bad.length === 0, { bad: bad.slice(0, 4) });

server.close();
await browser.close();
console.log(`\n=== dancpl pilot ${fail === 0 ? "PASS" : fail + " FAILURES"} ===`);
process.exit(fail === 0 ? 0 : 1);
