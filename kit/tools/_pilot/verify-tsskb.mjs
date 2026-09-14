// M5 试点审计：TSSKB 课程内容页（Static + content-site）
// 用法：node verify-pilot-tsskb.mjs <base> <outdir>
// 断言：资产 200 / 阅读宽度 --reading-max / 内容层级 / 320 根级无溢出 / 控制台零错；截图 320+1440
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const [, , BASE = "http://127.0.0.1:8811/", OUT = "pilot-evidence/tsskb"] = process.argv;
const exe = ["C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"].find((p) => fs.existsSync(p));
const pages = ["aos/advanced-routing/skills/aos-ar-bgp.html", "aos/advanced-routing/overview.html"];
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: exe, headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
let fail = 0;
const rec = (name, pass, detail) => {
  if (!pass) fail++;
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}  — ${JSON.stringify(detail).slice(0, 220)}`);
};

for (const rel of pages) {
  const url = BASE + rel;
  const bad = []; const cerr = [];
  page.on("response", (r) => { if (r.status() >= 400) bad.push({ u: r.url(), s: r.status() }); });
  page.on("requestfailed", (r) => bad.push({ u: r.url(), e: "requestfailed" }));
  page.on("console", (m) => { if (m.type() === "error") cerr.push(m.text().slice(0, 120)); });
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 800));
  const id = rel.split("/").pop().replace(".html", "");

  const d1440 = await page.evaluate(() => {
    const mb = document.querySelector(".markdown-body");
    const h = [...document.querySelectorAll("main h1, main h2, main h3")].map((x) => +x.tagName[1]);
    let skip = false, prev = h[0] ?? 0;
    for (const v of h) { if (v > prev + 1) skip = true; prev = v; }
    return {
      readingW: mb ? Math.round(mb.getBoundingClientRect().width) : null,
      readingMax: getComputedStyle(document.documentElement).getPropertyValue("--reading-max").trim(),
      headings: h.slice(0, 12), hierarchySkip: skip,
      tokens: getComputedStyle(document.documentElement).getPropertyValue("--ale-purple-600").trim(),
    };
  });
  rec(`${id}-READING`, d1440.readingW === 760, { measured: d1440.readingW, max: d1440.readingMax });
  rec(`${id}-HIERARCHY`, !d1440.hierarchySkip, { headings: d1440.headings });
  rec(`${id}-TOKENS`, d1440.tokens === "#6b489d", { alePurple600: d1440.tokens });
  rec(`${id}-ASSET`, bad.length === 0, { bad: bad.slice(0, 4) });
  rec(`${id}-CONSOLE`, cerr.length === 0, { errors: cerr.slice(0, 3) });

  await page.setViewport({ width: 320, height: 900 });
  await new Promise((r) => setTimeout(r, 400));
  const ovf = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  rec(`${id}-OVF320`, ovf.sw <= ovf.cw, ovf);
  await page.screenshot({ path: path.join(OUT, `${id}-320.png`), fullPage: false });
  await page.setViewport({ width: 1440, height: 900 });
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: path.join(OUT, `${id}-1440.png`), fullPage: false });
  page.removeAllListeners("response"); page.removeAllListeners("requestfailed"); page.removeAllListeners("console");
}

await browser.close();
console.log(`\n=== tsskb pilot ${fail === 0 ? "PASS" : fail + " FAILURES"} ===`);
process.exit(fail === 0 ? 0 : 1);
