// ============================================================
// pilot:tokens-check(R4-03):试点页面层硬编码审计
// 口径:
//   颜色:迁移面内 hex 裸值必须 ∈ 白名单或登记 design-exceptions,否则 FAIL;
//   间距/圆角/阴影:token 命中率统计(信息项,RC 阈值 ≥95% 写入台账,M6-R1 不硬卡)。
// 用法:node pilot-tokens-check.mjs <projectRoot> <projectKey>
// 配置:pilot-tokens.config.json —— 每项目声明扫描面(glob 前缀)与白名单。
// ============================================================
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const [rootArg, keyArg] = process.argv.slice(2);
if (!rootArg || !keyArg) {
  console.error("用法: node pilot-tokens-check.mjs <projectRoot> <projectKey>");
  process.exit(2);
}
const config = JSON.parse(fs.readFileSync(path.join(HERE, "pilot-tokens.config.json"), "utf8"));
const proj = config.projects[keyArg];
if (!proj) { console.error(`未知项目 ${keyArg}(config 里没有)`); process.exit(2); }

const root = path.resolve(rootArg);
const HEX = /#[0-9a-fA-F]{3,8}\b/g;
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", ".next", "build", "coverage"]);

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) { if (!SKIP_DIRS.has(entry.name)) yield* walk(path.join(dir, entry.name)); continue; }
    const ext = path.extname(entry.name).toLowerCase();
    const relNorm = path.relative(root, path.join(dir, entry.name)).replace(/\\/g, "/");
    if (proj.scanExts.includes(ext) && !proj.exclude.some((p) => relNorm.includes(p) || relNorm.includes(p.replace(/\//g, "\\")))) yield path.join(dir, entry.name);
  }
}

const allow = new Set(proj.allowHex.map((x) => (typeof x === "string" ? x : x.hex).toLowerCase()));
const offenders = new Map(); // hex -> [file:line]
let filesScanned = 0;
const spacingTotal = { token: 0, literal: 0 };

for (const file of walk(root)) {
  filesScanned++;
  const rel = path.relative(root, file).replace(/\\/g, "/");
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (/tokens\.css|noto\.css/i.test(rel)) return; // vendored 真源与字体文件豁免
    for (const m of line.matchAll(HEX)) {
      const hex = m[0].toLowerCase();
      if (allow.has(hex) || allow.has("*")) continue;
      if (!offenders.has(hex)) offenders.set(hex, []);
      offenders.get(hex).push(`${rel}:${i + 1}`);
    }
    // 间距/圆角/阴影 token 命中率(粗口径:该行含 spacing/radius/shadow 类属性时)
    if (/(padding|margin|gap|border-radius|box-shadow)/.test(line)) {
      if (/var\(--/.test(line)) spacingTotal.token++;
      else if (/\d+(px|rem)/.test(line)) spacingTotal.literal++;
    }
  });
}

const total = spacingTotal.token + spacingTotal.literal;
const rate = total ? Math.round((spacingTotal.token / total) * 100) : 100;
console.log(`pilot-tokens-check: ${keyArg}  files=${filesScanned}  间距/圆角/阴影 token 命中率=${rate}%(${spacingTotal.token}/${total})`);
if (offenders.size) {
  console.log(`FAIL  未白名单 hex 裸值 ${offenders.size} 种:`);
  for (const [hex, locs] of [...offenders].sort((a, b) => b[1].length - a[1].length).slice(0, 20)) {
    console.log(`  ${hex}  ×${locs.length}  e.g. ${locs.slice(0, 3).join(", ")}`);
  }
  const enforce = proj.enforce === true;
  console.log(enforce
    ? `处置:改用 v6 令牌;确需保留 → design-exceptions.yml 登记(rule=FND-COLOR-004)或加入白名单(需理由)。`
    : `处置(REPORT 模式,baseline 已记录于 pilot-tokens.config.json;M6-R2 收敛后该项目 enforce=true):`);
  if (enforce) process.exit(1);
  console.log(`REPORT  ${offenders.size} 种裸值留待 M6-R2 迁移(RC 目标:命中率 ≥95%,当前 ${rate}%)`);
  process.exit(0);
}
console.log(`PASS  颜色零未授权裸值(enforce=${proj.enforce === true};RC 目标:命中率 ≥95%,当前 ${rate}% 已记录)`);
