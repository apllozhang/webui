
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
page.on("pageerror", (e) => log.push(`[pageerror] ${String(e).slice(0, 300)}`));
page.on("requestfailed", (r) => log.push(`[reqfail] ${r.url()} ${r.failure()?.errorText}`));
await page.goto("http://127.0.0.1:8901/", { waitUntil: "networkidle2", timeout: 30000 });
await new Promise((r) => setTimeout(r, 1500));
const rootLen = await page.evaluate(() => (document.getElementById("root")?.innerHTML || "").length);
console.log("rootLen:", rootLen);
console.log(log.join("\n") || "(no messages)");
await browser.close();
