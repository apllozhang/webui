// ============================================================
// build-fonts.mjs(M6-R2/M6-F):Noto Sans SC 真 unicode-range 分片
// 来源:@fontsource/noto-sans-sc(SIL OFL 1.1)400/500/700 的分片 CSS;
// 产物:shared/fonts/noto.css(重写 url)+ shared/fonts/noto-split/*.woff2(仅 woff2)。
// 浏览器按 unicode-range 按需下载分片——替代旧 chinese-simplified 整块(1.1MB×3)。
// 用法:node build-fonts.mjs && node sync-shared.mjs
// ============================================================
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TOOLS = HERE; // kit/tools
const ROOT = path.resolve(TOOLS, "..");               // kit/
const SRC = path.join(TOOLS, "node_modules", "@fontsource", "noto-sans-sc");
const OUT_CSS = path.join(ROOT, "shared", "fonts", "noto.css");
const OUT_DIR = path.join(ROOT, "shared", "fonts", "noto-split");

// ⚠️ 字重策略(负责人裁决 2026-09-14,方案 A):仅 400/700,500 请求按 CSS 匹配算法回落 400。
// 回退开关:若视觉验收不佳 → B 方案改回 [400, 500, 700](FONT-BUDGET 校准 ~600KB 门禁)
//          或 C 方案:构建时按页面文本 text= 子集化(效果最优,构建复杂)。改后重跑本脚本 + sync-shared。
const WEIGHTS = [400, 700];
let cssOut = `/* ============================================================
   Noto Sans SC 自托管分片(M6-F:真 unicode-range,SIL OFL 1.1)
   由 tools/build-fonts.mjs 生成——勿手改;浏览器按需下载分片。
   ============================================================ */
`;
fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

let slices = 0;
for (const w of WEIGHTS) {
  const src = fs.readFileSync(path.join(SRC, `${w}.css`), "utf8");
  // 丢弃 woff 回退,仅保留 woff2;url 指向 ./noto-split/
  const blocks = [];
  const re = /@font-face\s*\{[\s\S]*?\}/g;
  for (const m of src.match(re)) {
    const woff2 = /url\(\.\/files\/([^']+\.woff2)\)/.exec(m);
    if (!woff2) continue;
    const fname = woff2[1];
    fs.copyFileSync(path.join(SRC, "files", fname), path.join(OUT_DIR, fname));
    slices++;
    blocks.push(m
      .replace(/url\(\.\/files\/([^']+\.woff2)\) format\('woff2'\),\s*url\(\.\/files\/([^']+\.woff)\) format\('woff'\)/, `url(./noto-split/${fname}) format('woff2')`)
      .replace(/\/\* noto-sans-sc-\[\d+\]-\d+-normal \*\/\n?/, ""));
  }
  cssOut += `/* weight ${w} */\n` + blocks.join("\n") + "\n";
}
fs.writeFileSync(OUT_CSS, cssOut);
console.log(`build-fonts: ${slices} 个分片 → shared/fonts/noto-split/,noto.css 已重写(按需加载)`);
