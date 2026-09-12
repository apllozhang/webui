// ============================================================
// build-tokens.mjs — Token JSON 生成链（v6.0 M3）
// 真源：tokens/*.json → 生成：
//   1. shared/css/tokens.css        （+ spec-site/css/tokens.css 同步）
//   2. shared/tailwind.preset.js
//   3. skeleton-react/src/styles/tokens.d.ts
//   4. docs/v6/00-foundations/design-tokens.md 生成表格段
//   5. artifacts/token-pairs.json   （对比度断言输入）
// 用法：
//   node build-tokens.mjs           # 生成
//   node build-tokens.mjs --check   # 零漂移校验（有差异 exit 1）
// 规则：值变更只改 JSON；生成文件禁止手改（头部有标识）。
// ============================================================
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));           // kit/tools
const KIT = path.resolve(HERE, "..");
const TOKENS = path.join(KIT, "tokens");
const REPO = path.resolve(KIT, "..");
const SITE = fs.existsSync(path.join(REPO, "ale-webui-site"))
  ? path.join(REPO, "ale-webui-site") : path.join(REPO, "spec-site");
const CHECK = process.argv.includes("--check");
const changed = [];
const WRITE = (rel, content) => {
  for (const base of [KIT, REPO]) {
    const p = path.join(base, rel);
    if (!fs.existsSync(path.dirname(p))) continue;
    const old = fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
    if (old !== content) {
      if (CHECK) changed.push(rel);
      else { fs.writeFileSync(p, content); changed.push(rel); }
    }
  }
};

const load = (f) => JSON.parse(fs.readFileSync(path.join(TOKENS, f), "utf8"));
const prim = load("primitives.json").tokens;
const semL = load("semantic.light.json").tokens;
const semD = load("semantic.dark.json").tokens;
const layout = load("layout.json").tokens;
const motion = load("motion.json").tokens;
const typo = load("typography.json").tokens;
const comp = load("components.json").tokens;

/* ── 校验 ── */
const errors = [];
const flat = {};
for (const [name, def] of Object.entries(prim)) {
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(def.value)) errors.push(`primitive ${name}: 非法色值 ${def.value}`);
  flat[name] = def.value;
}
const primValues = new Set(Object.values(prim).map((t) => t.value.toLowerCase()));
function checkDomain(tokens, domain, allowedTypes) {
  for (const [name, def] of Object.entries(tokens)) {
    if (!allowedTypes.includes(def.type)) errors.push(`${domain}/${name}: type ${def.type} 越域`);
    if (def.type === "color" && /^#[0-9a-f]{3,6}$/i.test(def.value) && !primValues.has(def.value.toLowerCase())
        && !["#ffffff", "#fff"].includes(def.value.toLowerCase())) {
      console.warn(`  WARN ${domain}/${name}: 字面色 ${def.value} 未登记 primitives（建议登记命名基础值）`);
    }
    const refs = [...String(def.value).matchAll(/var\(--([\w-]+)\)/g)].map((m) => m[1]);
    for (const r of refs) {
      if (!(r in semL) && !(r in comp) && !(r in flat) && !(r in layout))
        errors.push(`${domain}/${name}: 引用不存在的令牌 --${r}`);
    }
  }
}
checkDomain(semL, "semantic.light", ["color", "shadow"]);
checkDomain(semD, "semantic.dark", ["color", "shadow"]);
checkDomain(comp, "component", ["reference"]);
if (errors.length) {
  console.error("TOKEN SCHEMA ERRORS:");
  errors.forEach((e) => console.error("  ✗", e));
  process.exit(1);
}
console.log(`schema OK：${Object.keys(prim).length} primitive / ${Object.keys(semL).length} light / ${Object.keys(semD).length} dark / ${Object.keys(comp).length} component`);

// var() 引用解析到字面值（全局变量表：prim + 语义 + layout/motion/typo/component）
const globalVars = {};
for (const map of [prim, semL, semD, layout, motion, typo, comp]) {
  for (const [k, d] of Object.entries(map)) {
    if (typeof d.value === "string") globalVars[k] ??= d.value;
  }
}

/* ── 生成 1：tokens.css ── */
const line = (k, v) => `  --${k}: ${v};`;
function cssTheme(tokens, comment) {
  const body = Object.entries(tokens).map(([k, d]) => line(k, d.value)).join("\n");
  return `:root${comment === "dark" ? ".dark" : ""} {\n${body}\n}`;
}
const layoutVars = [
  "/* Radius */", ...Object.entries(layout.radius).map(([k, d]) => line(`radius-${k}`, d.value)),
  "/* Spacing */", ...Object.entries(layout.spacing).map(([k, d]) => line(`space-${k}`, d.value)),
  "/* Container / Control / Hit target */",
  line("content-max", layout.container["content-max"].value),
  line("reading-max", layout.container["reading-max"].value),
  line("topbar-height", layout.container["topbar-height"].value),
  line("control-height-compact", layout.control["height-compact"].value),
  line("control-height-default", layout.control["height-default"].value),
  line("hit-target-min", layout.control["hit-target-min"].value),
  "/* z-index */", ...Object.entries(layout["z-index"]).map(([k, d]) => line(`z-index-${k}`, d.value)),
].join("\n");
const motionVars = Object.entries(motion).map(([k, d]) => line(k, d.value)).join("\n");
const typoVars = [
  `  --font-sans: ${typo["font-sans"].value};`,
  `  --font-mono: ${typo["font-mono"].value};`,
  ...["display", "page-title", "section-title", "subsection-title", "card-title", "body", "compact", "aux"]
    .map((k) => `  --font-size-${k}: ${typo[`size-${k}`].value};`),
  `  --line-height-body: ${typo["line-height-body"].value};`,
  `  --font-weight-bold: ${typo["weight-bold"].value};`,
].join("\n");
const compVars = Object.entries(comp).map(([k, d]) => line(k, d.value)).join("\n");

const css = `/* ============================================================
   ⚠️ 本文件由 tokens/*.json 生成（npm run tokens:build）— 禁止手改
   真源：kit/tokens/；规范：docs/v6/00-foundations/design-tokens.md
   ============================================================ */
:root {
${Object.entries(prim).map(([k, d]) => line(k, d.value)).join("\n")}

${layoutVars}

${motionVars}

${typoVars}

${compVars}
}

${cssTheme(semL, "light").replace(":root {", "/* Semantic — light */\n:root {")}
:root.dark {
${Object.entries(semD).map(([k, d]) => line(k, d.value)).join("\n")}
}
`;
WRITE(path.join("shared", "css", "tokens.css"), css);
// spec-site 的 tokens.css = 同一生成产物（消除三骨架手工漂移）
const siteRel = path.relative(REPO, SITE);
WRITE(path.join(siteRel, "css", "tokens.css"), css);

/* ── 生成 2：tailwind.preset.js ── */
const preset = `/**
 * ⚠️ 由 tokens/*.json 生成（npm run tokens:build）— 禁止手改色值
 * 颜色/圆角/阴影/时长全部映射 tokens.css 的 CSS 变量
 * 用法（skeleton-react/tailwind.config.ts）：
 *   import preset from "./tailwind.preset";
 *   export default { presets: [preset], content: [...], darkMode: "class" };
 */
/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        canvas: "var(--color-canvas)",
        surface: "var(--color-surface)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",
        border: "var(--color-border)",
        "border-soft": "var(--color-border-soft)",
        action: { DEFAULT: "var(--color-action)", hover: "var(--color-action-hover)" },
        tint: "var(--color-purple-tint)",
        heading: "var(--color-heading-accent)",
        link: "var(--color-link)",
        "on-action": "var(--color-on-action)",
        "on-tint": "var(--color-on-tint)",
        status: {
          "neutral-text": "var(--status-neutral-text)", "neutral-bg": "var(--status-neutral-bg)",
          "info-text": "var(--status-info-text)", "info-bg": "var(--status-info-bg)",
          "success-text": "var(--status-success-text)", "success-bg": "var(--status-success-bg)",
          "warning-text": "var(--status-warning-text)", "warning-bg": "var(--status-warning-bg)",
          "danger-text": "var(--status-danger-text)", "danger-bg": "var(--status-danger-bg)",
        },
      },
      borderRadius: { sm: "8px", DEFAULT: "8px", md: "12px", lg: "16px" },
      boxShadow: { sm: "var(--shadow-sm)", md: "var(--shadow-md)", hover: "var(--shadow-hover)" },
      transitionDuration: { fast: "var(--motion-fast)", panel: "var(--motion-panel)", enter: "var(--motion-enter)" },
      fontFamily: {
        sans: ${JSON.stringify(typo["font-sans"].value)},
        mono: ${JSON.stringify(typo["font-mono"].value)},
      },
      maxWidth: { content: "var(--content-max)", reading: "var(--reading-max)" },
    },
  },
};
`;
WRITE(path.join("shared", "tailwind.preset.js"), preset);

/* ── 生成 3：React tokens.d.ts ── */
const ts = `// ⚠️ 由 tokens/*.json 生成 — 禁止手改
export interface DesignToken { value: string; type: string; description?: string; }
export const semanticLight: Record<string, DesignToken>;
export const semanticDark: Record<string, DesignToken>;
export const primitives: Record<string, DesignToken>;
`;
WRITE(path.join("skeleton-react", "src", "styles", "tokens.d.ts"), ts);

/* ── 生成 4：文档令牌表格（design-tokens.md markers 段） ── */
const docCandidates = [
  path.join(REPO, "docs", "v6", "00-foundations", "design-tokens.md"),
  path.join(REPO, "_repo_stage", "docs", "v6", "00-foundations", "design-tokens.md"),
];
const docPath = docCandidates.find((p) => fs.existsSync(p));
if (fs.existsSync(docPath)) {
  let doc = fs.readFileSync(docPath, "utf8");
  const BEGIN = "<!-- BEGIN:generated-token-table -->";
  const END = "<!-- END:generated-token-table -->";
  const rows = Object.entries(semL).map(([k, d]) => {
    const darkRaw = semD[k]?.value ?? "（同亮色）";
    const lv = resolve(d.value), dv = resolve(darkRaw);
    const fmt = (raw, resolved) => resolved === raw ? resolved : `${resolved}（= ${raw}）`;
    return `| --${k} | ${fmt(d.value, lv)} | ${fmt(darkRaw, dv)} | ${d.description ?? ""} |`;
  }).join("\n");
  const table = `${BEGIN}\n| 令牌 | 亮色 | 暗色 | 说明 |\n|---|---|---|---|\n${rows}\n${END}`;
  if (doc.includes(BEGIN)) doc = doc.replace(new RegExp(`${BEGIN}[\\s\\S]*?${END}`), table);
  else doc = doc.replace(/(status: .*?\n)/, `$1\n${table}\n`);   // 首次：插入含表格的完整 markers
  fs.writeFileSync(docPath, doc);
  console.log("doc table generated: docs/v6/00-foundations/design-tokens.md");
}

/* ── 生成 5：对比度配对（contrast-check 输入） ── */
const textPairs = [
  ["text-primary", "canvas", 4.5], ["text-primary", "surface", 4.5],
  ["text-secondary", "surface", 4.5], ["text-muted", "surface", 4.5], ["text-muted", "canvas", 4.5],
  ["on-action", "action", 4.5], ["on-action-hover", "action-hover", 4.5],
  ["on-tint", "purple-tint", 4.5], ["link", "surface", 4.5],
  ["action", "surface", 4.5], ["heading-accent", "surface", 4.5],
  ...["neutral", "info", "success", "warning", "danger"].map((t) => [`status-${t}-text`, `status-${t}-bg`, 4.5]),
];
const graphicPairs = [
  ["status-neutral-graphic", "surface", 3], ["status-info-graphic", "surface", 3],
  ["status-success-graphic", "surface", 3], ["status-warning-graphic", "surface", 3],
  ["status-danger-graphic", "surface", 3], ["ale-purple-500", "surface", 3], ["ale-blue", "surface", 3],
];
// 断言模型豁免（依据规范 15 章与附录 G 的明文设计意图，非质量缺陷）：
// - neutral/success/warning 的官方亮色圆点 = 冗余图形（信息由并存文字承载），不适用 1.4.11 单独 3:1；
// - 暗色主题下 action 紫是「按钮底色」而非文字色（链接角色由 color-link 承担，已 PASS）。
const EXEMPT = new Set([
  "light/status-neutral-graphic×surface(graphic)",
  "light/status-success-graphic×surface(graphic)",
  "light/status-warning-graphic×surface(graphic)",
  "dark/action×surface",
]);
const pairs = { light: { fg: semL, note: "亮色" }, dark: { fg: semD, note: "暗色" } };
const out = { pairs: [] };
const get = (map, name) => map[name]?.value ?? map["color-" + name]?.value;   // 简名/全名兼容
function resolve(v, depth = 0) {
  if (depth > 6 || typeof v !== "string") return v;
  const m = /^var\(--([\w-]+)\)$/.exec(v.trim());
  if (m && globalVars[m[1]] != null) return resolve(globalVars[m[1]], depth + 1);
  return v;
}
for (const [theme, { fg }] of Object.entries(pairs)) {
  for (const [fgName, bgName, min] of textPairs) out.pairs.push({ theme, fg: resolve(get(fg, fgName)), bg: resolve(get(fg, bgName)), min, ids: `${theme}/${fgName}×${bgName}`, exempt: EXEMPT.has(`${theme}/${fgName}×${bgName}`) ? true : undefined, exemptReason: EXEMPT.has(`${theme}/${fgName}×${bgName}`) ? "设计豁免：信息由并存文字/其他角色承载（规范 15 章与 3.3A）" : undefined });
  for (const [fgName, bgName, min] of graphicPairs) out.pairs.push({ theme, fg: resolve(fg[fgName]?.value ?? prim[fgName]?.value), bg: resolve(get(fg, bgName)), min, ids: `${theme}/${fgName}×${bgName}(graphic)`, exempt: EXEMPT.has(`${theme}/${fgName}×${bgName}(graphic)`) ? true : undefined, exemptReason: EXEMPT.has(`${theme}/${fgName}×${bgName}(graphic)`) ? "冗余图形：信息由并存文字承载（规范 15 章附录 G）" : undefined });
}
fs.writeFileSync(path.join(TOKENS, "token-pairs.json"), JSON.stringify(out, null, 2));
console.log("token-pairs.json generated:", out.pairs.length, "pairs");

console.log(CHECK ? `--check：${changed.length ? "DRIFT DETECTED" : "零差异"}` : `generated: ${changed.length} files`);
if (CHECK && changed.length) {
  changed.forEach((f) => console.error("  drifted:", f));
  process.exit(1);
}
