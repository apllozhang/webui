// 诊断 /react/ 模块脚本为何未执行
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const exe = ["C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
             "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"].find((p) => fs.existsSync(p));

const browser = await puppeteer.launch({ executablePath: exe, headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
const log = [];
page.on("console", (m) => log.push(`[console.${m.type()}] ${m.text().slice(0, 200)}`));
page.on("requestfailed", (r) => log.push(`[reqfail] ${r.url()} ${r.failure()?.errorText}`));
page.on("response", (r) => { if (r.status() >= 400) log.push(`[http] ${r.status()} ${r.url()}`); });
await page.goto("http://10.10.10.218:8095/react/", { waitUntil: "networkidle2", timeout: 30000 });
await new Promise((r) => setTimeout(r, 1500));
const rootLen = await page.evaluate(() => (document.getElementById("root")?.innerHTML || "").length);
console.log("rootLen:", rootLen);
console.log(log.join("\n") || "(no console/network messages)");
await browser.close();
