// ============================================================
// font-coverage-check.mjs — 方案 C 字符覆盖门禁(终审前置项 1)
// 用法:node font-coverage-check.mjs <html文件或目录> [corpus.txt]
//   corpus 默认仓库根 fonts-text-corpus.txt(C 子集的字库真源)
// 规则:页面可见文本中每出一个 corpus 未包含的可打印字符 → FAIL(逐字列出)
// ============================================================
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
const [targetArg, corpusArg] = process.argv.slice(2);
if (!targetArg) { console.error("用法: node font-coverage-check.mjs <html文件或目录> [corpus.txt]"); process.exit(2); }

const corpusPath = corpusArg ? path.resolve(corpusArg) : path.join(REPO, "fonts-text-corpus.txt");
const corpus = new Set(fs.readFileSync(corpusPath, "utf8").replace(/\s/g, ""));

const files = [];
(function collect(p) {
  const st = fs.statSync(p);
  if (st.isDirectory()) for (const e of fs.readdirSync(p)) collect(path.join(p, e));
  else if (p.toLowerCase().endsWith(".html") && !/fonts-compare/.test(path.basename(p))) files.push(p);
})(path.resolve(targetArg));

let totalMiss = 0; const missByFile = [];
for (const f of files) {
  let html = fs.readFileSync(f, "utf8");
  html = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ");
  html = html.replace(/&[a-z#0-9]+;/gi, " ");
  const miss = new Set();
  for (const ch of html) {
    if (/[\s]/.test(ch)) continue;
    if (!corpus.has(ch)) miss.add(ch);
  }
  if (miss.size) { totalMiss += miss.size; missByFile.push({ file: path.relative(process.cwd(), f), chars: [...miss].slice(0, 30) }); }
}
console.log(`font-coverage: ${files.length} 页 vs corpus(${corpus.size} 字符)`);
if (totalMiss) {
  console.error(`FAIL  ${missByFile.length} 页存在子集未覆盖字符(C 方案禁用回落,须重建 corpus):`);
  for (const m of missByFile.slice(0, 10)) console.error(`  ${m.file}: ${m.chars.join(" ")}`);
  process.exit(1);
}
console.log("font-coverage: PASS(C 方案字库全覆盖)");
