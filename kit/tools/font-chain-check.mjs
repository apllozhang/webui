// R4-02 验证:页面真实加载自托管 Noto(请求≥1 + 全 200 + FontFaceSet 命中)
import fs from "node:fs";
import puppeteer from "puppeteer-core";
const exe = ["C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
             "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"].find((p) => fs.existsSync(p));
const [label, url] = process.argv.slice(2);
const browser = await puppeteer.launch({ executablePath: exe, headless: "new" });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const fonts = []; const bad = [];
page.on("response", (r) => { if (/woff2?|font/i.test(r.url())) { const s = r.status(); (s >= 400 ? bad : fonts).push({ u: r.url().split("/").pop(), s, kb: Math.round((r.headers()["content-length"] || 0) / 1024) }); } });
page.on("requestfailed", (r) => bad.push({ u: r.url(), e: "failed" }));
await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 });
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 800));
const check = await page.evaluate(() => ({
  loaded: [...document.fonts].filter((f) => f.family.includes("Noto") && f.status === "loaded").map((f) => f.weight),
  hit400: document.fonts.check('16px "Noto Sans SC"', "中文字体测试"),
}));
console.log(JSON.stringify({ label, fontRequests: fonts.length, fonts, bad, notoLoadedWeights: check.loaded, glyphHit400: check.hit400 }, null, 1));
const ok = fonts.length >= 1 && bad.length === 0 && check.loaded.length >= 1 && check.hit400;
console.log(ok ? `${label}: FONT-CHAIN PASS` : `${label}: FONT-CHAIN FAIL`);
await browser.close();
process.exit(ok ? 0 : 1);
