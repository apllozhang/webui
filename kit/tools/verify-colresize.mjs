// 列宽独立性验证 v2（两次拖动法）：
// 第 1 次拖动 = 激活精确模式（各列归位到定义宽）；
// 第 2 次拖动 = 真正的独立性断言：除目标列外所有列 clientWidth 必须逐像素不变（±1）。
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const exe = ["C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
             "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"].find((p) => fs.existsSync(p));

const TARGETS = [
  { name: "react", url: "http://10.10.10.218:8095/react/" },
  { name: "spec-site", url: "http://10.10.10.218:8091/#table" },
];

async function drag(page, delta) {
  const handle = (await page.$$("table.data thead th .col-resizer"))[1];
  const box = await handle.boundingBox();
  const x = box.x + box.width / 2, y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + delta, y, { steps: 6 });
  await page.mouse.up();
  await new Promise((r) => setTimeout(r, 350));
}

const widths = (page) => page.evaluate(() =>
  [...document.querySelectorAll("table.data thead th")]
    .filter((th) => !th.className.includes("filler"))
    .map((th) => Math.round(th.getBoundingClientRect().width)));

const browser = await puppeteer.launch({ executablePath: exe, headless: "new", args: ["--no-sandbox"] });
let allPass = true;
for (const { name, url } of TARGETS) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1200));

  await drag(page, 120);            // 激活精确模式
  const w2 = await widths(page);
  await drag(page, 80);             // 第二次拖动：独立性检验
  const w3 = await widths(page);

  const stable = w2.every((w, i) => i === 2 || Math.abs(w - w3[i]) <= 1);  // 目标列 = th[2]（th[0]=select, th[1]=编号）
  const grew = w3[2] - w2[2];
  const grewOk = grew >= 70;
  console.log(`[${name}] 2nd-drag before: ${w2.join(",")}`);
  console.log(`[${name}] 2nd-drag after : ${w3.join(",")}`);
  console.log(`[${name}] 其他列逐像素稳定: ${stable ? "PASS" : "FAIL"} | 目标列 +${grew}px: ${grewOk ? "PASS" : "FAIL"}`);
  if (!stable || !grewOk) allPass = false;
  await page.close();
}
await browser.close();
console.log("\nF14 FIX:", allPass ? "VERIFIED ✅" : "NOT VERIFIED ❌");
process.exit(allPass ? 0 : 1);
