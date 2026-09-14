// ============================================================
// check-exceptions.mjs — design-exceptions.yml 台账校验（R19，CI 门禁）
// 规则：缺 owner / 缺复审日期 / 复审过期 / 未知规则 ID / 重复 id 均 FAIL（exit 1）
// 用法：node check-exceptions.mjs   （仓库根 design-exceptions.yml；npm run exceptions:check）
// 规则 ID 真源：docs/v6/**/*.md 的 BEGIN:must-registry 注册表（与 rules:check 同源）
// ============================================================
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
const FILE = path.join(REPO, "design-exceptions.yml");

/* 规则 ID 收集：与 scan-rules.mjs 同一注册表来源 */
function collectRuleIds() {
  const ids = new Set();
  const walk = (dir) => {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, f.name);
      if (f.isDirectory()) walk(p);
      else if (f.name.endsWith(".md")) {
        const raw = fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");
        const m = /<!-- BEGIN:must-registry -->[\s\S]*?<!-- END:must-registry -->/.exec(raw);
        if (!m) continue;
        for (const row of m[0].split("\n")) {
          const id = /^\|\s*([A-Z][A-Z0-9]*(-[A-Z0-9]+)+)\s*\|/.exec(row);
          if (id) ids.add(id[1]);
        }
      }
    }
  };
  walk(path.join(REPO, "docs", "v6"));
  return ids;
}

const errors = [];
const ruleIds = collectRuleIds();
if (!ruleIds.size) errors.push("规则 ID 注册表为空（docs/v6 must-registry 未解析到任何 ID）");

let entries = [];
if (!fs.existsSync(FILE)) {
  errors.push("缺少 design-exceptions.yml（仓库根；允许空数组起步，但文件必须存在）");
} else {
  const doc = parse(fs.readFileSync(FILE, "utf8"));
  entries = doc?.exceptions ?? [];
  if (!Array.isArray(entries)) errors.push("exceptions 必须是数组（允许空数组起步）");

  const seen = new Set();
  const today = new Date().toISOString().slice(0, 10);
  entries.forEach((e, i) => {
    const at = `#${i + 1}${e?.id ? `(${e.id})` : ""}`;
    if (!["not-applicable", "exception"].includes(e.kind)) errors.push(`${at} 缺/非法 kind(R4-07 schema v2: not-applicable 或 exception)`);
    if (!e.id) errors.push(`${at} 缺 id`);
    else {
      if (!/^EXC-\d{4}-\d{4}$/.test(e.id)) errors.push(`${at} id 不符合 EXC-YYYY-NNNN`);
      if (seen.has(e.id)) errors.push(`${at} id 重复`);
      seen.add(e.id);
    }
    if (!e.rule) errors.push(`${at} 缺 rule（规则 ID）`);
    else if (ruleIds.size && !ruleIds.has(e.rule)) errors.push(`${at} 未知规则 ID: ${e.rule}（必须出自 docs/v6 注册表）`);
    if (!e.owner || !String(e.owner).trim()) errors.push(`${at} 缺 owner（无负责人的例外不得合并）`);
    if (!e.reviewBy && !e["review-by"]) errors.push(`${at} 缺 review-by 复审日期`);
    else {
      const d = String(e.reviewBy ?? e["review-by"]);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || Number.isNaN(Date.parse(d))) errors.push(`${at} review-by 非法日期: ${d}`);
      else if (d < today) errors.push(`${at} 复审已过期（review-by=${d}），例外自动失效，须重新登记`);
      // R4-07: 绑定里程碑的例外, review-by 不得晚于今天+45d(防止"年度宽松期"架空里程碑)
      if (e.milestone) {
        const limit = new Date(Date.now() + 45 * 864e5).toISOString().slice(0, 10);
        if (d > limit) errors.push(`${at} 里程碑(${e.milestone})绑定例外的 review-by=${d} 超出窗口(>${limit})`);
      }
    }
    if (!e.reason || !String(e.reason).trim()) errors.push(`${at} 缺 reason`);
    if (!e.project) errors.push(`${at} 缺 project`);
    if (!e.mitigation || !String(e.mitigation).trim()) errors.push(`${at} 缺 mitigation（缓解措施）`);
  });
}

const na = entries.filter((e) => e.kind === "not-applicable").length;
const ex = entries.filter((e) => e.kind === "exception").length;
console.log(`design-exceptions.yml：${entries.length} 条例外(not-applicable ${na} / exception ${ex})；规则 ID 注册表 ${ruleIds.size} 条`);
if (errors.length) {
  console.error("exceptions:check FAILED:");
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("exceptions:check OK（schema / owner / review-by / 规则 ID 全部通过）");
