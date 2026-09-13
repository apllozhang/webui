// contrast-check.mjs — 对比度活断言（附录 G → CI 门禁）
// 输入：tokens/token-pairs.json（由 build-tokens.mjs 生成）
// 规则：文本 ≥4.5:1，非文本图形 ≥3:1（WCAG 2.2 AA；1.4.3 / 1.4.11）
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(HERE, "..", "tokens", "token-pairs.json"), "utf8"));
const darkCanvas = (JSON.parse(fs.readFileSync(path.join(HERE, "..", "tokens", "semantic.dark.json"), "utf8"))
  .tokens["color-canvas"]?.value ?? "#171420").trim();

// rgba/rgb 半透明背景 → 与暗画布合成后的不透明色
function flatten(c) {
  const m = /rgba?\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:,\s*|\/)\s*([\d.]+)%?\s*\)/.exec(c || "");
  if (!m) return c;
  const [r, g, b, aRaw] = [+m[1], +m[2], +m[3], +m[4]];
  const a = aRaw > 1 ? aRaw / 100 : aRaw;   // "14%" → 0.14
  const base = darkCanvas.replace("#", "");
  const br = parseInt(base.slice(0, 2), 16), bg2 = parseInt(base.slice(2, 4), 16), bb = parseInt(base.slice(4, 6), 16);
  const mix = (f, t) => Math.round(f * a + t * (1 - a));
  const hex = (v) => v.toString(16).padStart(2, "0");
  return "#" + hex(mix(r, br)) + hex(mix(g, bg2)) + hex(mix(b, bb));
}

function luminance(hex) {
  const h = String(hex).trim().replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  const f = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrast(fg, bg) {
  const a = luminance(fg), b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

let pass = 0, fail = 0, skip = 0, exempt = 0;
const lines = [];
for (const p of data.pairs) {
  if (!p.fg || !p.bg) { skip++; lines.push(`SKIP ${p.ids}（值缺失）`); continue; }
  if (p.exempt) { exempt++; lines.push(`EXEMPT  ${p.ids}（${p.exemptReason ?? "设计豁免，见规范 15 章附录 G"}）`); continue; }
  const fg = flatten(p.fg), bg = flatten(p.bg);
  const ratio = contrast(fg, bg);
  const ok = ratio >= p.min;
  if (!ok) fail++; else pass++;
  lines.push(`${ok ? "PASS" : "FAIL"}  ${p.ids}  ${ratio.toFixed(2)}:1  (min ${p.min}:1)`);
}
console.log(lines.join("\n"));
// R17 三分类口径：总述只按实际分类计数；SKIP 非零 = 核心交互角色缺值，属 FAIL
console.log(`\ncontrast-check: PASS ${pass} / EXEMPT ${exempt}（出处见各行，规范 15 章附录 G） / SKIP ${skip} / FAIL ${fail}`);
if (skip > 0) console.log(`contrast-check: SKIP=${skip} —— 核心交互角色缺值不得静默跳过，判 FAIL`);
fs.mkdirSync(path.join(HERE, "artifacts"), { recursive: true });
fs.writeFileSync(path.join(HERE, "artifacts", "contrast-report.txt"), lines.join("\n") + `\n\nPASS ${pass} / EXEMPT ${exempt} / SKIP ${skip} / FAIL ${fail}\n`);
process.exit(fail === 0 && skip === 0 ? 0 : 1);
