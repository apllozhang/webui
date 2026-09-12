// ============================================================
// scan-rules.mjs — Must 条款扫描器 + 规则 ID 注册表生成（M4 收尾）
// 扫描 docs/v6/**/*.md 中含「必须 / 禁止」的行（标题/段落/列表/表格行，
// 与旧生成脚本语义一致：不跳过代码围栏），在每个文件的
// 「## 规则 ID 注册表（本文件 Must 条款）」段重建注册表。
// 规则：
//   - 已注册 ID 永不改变（GOV-VER：ID 稳定）；新条款接续编号
//   - 旧摘录可能是截断文本，按归一化相等 / 前缀-包含关系匹配回源行
//   - 正文已删除的条款保留原行（删除需走弃用周期，不静默丢弃）
//   - 注册表表格包裹 BEGIN/END 标记，幂等重建；单元格内 | 转义为 \|
// 用法：
//   node scan-rules.mjs           # 重建注册表
//   node scan-rules.mjs --check   # 漂移校验（有差异 exit 1，供 CI 使用）
// ============================================================
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
const DOCS = path.join(REPO, "docs", "v6");
const CHECK = process.argv.includes("--check");
const BEGIN = "<!-- BEGIN:must-registry -->";
const END = "<!-- END:must-registry -->";
const HEADING = "## 规则 ID 注册表（本文件 Must 条款）";
const HEADING_RE = /^## 规则 ID 注册表/;
const CLAUSE_RE = /必须|禁止/;
const ROW_RE = /^\|\s*([A-Z]+(?:-[A-Z0-9]+)*-\d{3})\s*\|\s*(.*?)\s*\|\s*$/;

const norm = (s) => s.replace(/\s+/g, "").trim();
const esc = (s) => s.replace(/\|/g, "\\|");
const unesc = (s) => s.replace(/\\\|/g, "|");

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

function parseFile(file) {
  const raw = fs.readFileSync(file, "utf8");
  const lines = raw.split("\n");
  let idPrefix = null, inFront = false;
  for (let i = 0; i < Math.min(lines.length, 12); i++) {
    if (lines[i].trim() === "---") { inFront = !inFront; continue; }
    if (inFront) {
      const m = /^id-prefix:\s*(\S+)\s*$/.exec(lines[i]);
      if (m) idPrefix = m[1];
    }
  }
  let regStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (HEADING_RE.test(lines[i])) { regStart = i; break; }
  }
  let regEnd = lines.length, existing = [];
  if (regStart >= 0) {
    let i = regStart + 1;
    while (i < lines.length) {
      const t = lines[i].trim();
      if (t === "") {
        let j = i + 1;
        while (j < lines.length && lines[j].trim() === "") j++;
        const nt = j < lines.length ? lines[j].trim() : "";
        if (nt === BEGIN || nt.startsWith("|")) { i = j; continue; }
        break;
      }
      if (t === BEGIN) { i++; continue; }
      if (t === END) { i++; break; }
      if (t.startsWith("|")) {
        const m = ROW_RE.exec(lines[i]);
        if (m) existing.push({ id: m[1], text: unesc(m[2]) });
        i++; continue;
      }
      break; // 注册表表格结束（第一处非表格内容）
    }
    regEnd = i;
  }
  const clauses = [];
  for (let i = 0; i < lines.length; i++) {
    if (regStart >= 0 && i >= regStart && i < regEnd) continue;
    if (CLAUSE_RE.test(lines[i])) clauses.push(lines[i].trim());
  }
  return { raw, lines, idPrefix, regStart, regEnd, existing, clauses };
}

function buildSection(entries) {
  const rows = entries.map((e) => `| ${e.id} | ${esc(e.text)} |`);
  return [HEADING, "", BEGIN, "| ID | 条款（摘录） |", "|---|---|", ...rows, END].join("\n");
}

const files = walk(DOCS).sort();
const report = [];
let changedFiles = 0, totalIds = 0, totalNew = 0;

for (const file of files) {
  const { raw, lines, idPrefix, regStart, regEnd, existing, clauses } = parseFile(file);
  const rel = path.relative(REPO, file).replace(/\\/g, "/");
  if (!idPrefix) {
    if (clauses.length) report.push(`${rel}: 无 id-prefix，跳过（${clauses.length} 条 Must 行未注册，需人工确认）`);
    continue;
  }
  if (!clauses.length) { // 无条款：注册表维持原样（含「无条款」占位行）
    if (regStart < 0) continue;
    totalIds += existing.length;
    report.push(`${rel}: 无 Must 行，注册表维持原样（${existing.length} 条）`);
    continue;
  }

  const byNorm = new Map(existing.map((e) => [norm(e.text), e.id]));
  const usedOld = new Set();
  let nextNum = existing.length
    ? Math.max(...existing.map((e) => parseInt(e.id.match(/(\d{3})$/)[1], 10))) + 1
    : 1;
  const entries = [];
  const seenNorm = new Set();
  for (const c of clauses) {
    const n = norm(c);
    if (seenNorm.has(n)) continue;
    seenNorm.add(n);
    let id = byNorm.get(n);
    if (!id) {
      for (const [on, oid] of byNorm) {   // 弱匹配：旧摘录（可能截断）与新行互为包含
        if (!usedOld.has(oid) && on.length > 12 && (n.includes(on) || on.includes(n))) { id = oid; break; }
      }
    }
    if (!id) { id = `${idPrefix}-${String(nextNum).padStart(3, "0")}`; nextNum++; }
    usedOld.add(id);
    entries.push({ id, text: c, stale: false });
  }
  for (const e of existing) {
    if (!usedOld.has(e.id)) entries.push({ id: e.id, text: e.text, stale: true });
  }
  entries.sort((a, b) => a.id.localeCompare(b.id));
  totalIds += entries.length;
  totalNew += entries.filter((e) => !e.stale && !existing.some((x) => x.id === e.id)).length;

  const newLines = buildSection(entries).split("\n");
  const out = regStart >= 0
    ? [...lines.slice(0, regStart), ...newLines, ...lines.slice(regEnd)]
    : [...lines, "", ...newLines];
  let result = out.join("\n");
  if (!result.endsWith("\n")) result += "\n";

  const added = entries.filter((e) => !e.stale && !existing.some((x) => x.id === e.id)).length;
  if (result !== raw) {
    changedFiles++;
    report.push(`${rel}: ${entries.length} 条（新增 ${added}，保留 ${entries.length - added}）${CHECK ? " → DRIFT" : ""}`);
    if (!CHECK) fs.writeFileSync(file, result);
  } else {
    report.push(`${rel}: ${entries.length} 条（无变化）`);
  }
}

console.log(report.join("\n"));
console.log(`\n合计注册条款：${totalIds}（其中本次新增 ${totalNew}）；${CHECK ? (changedFiles ? `漂移：${changedFiles} 个文件` : "零漂移") : `更新：${changedFiles} 个文件`}`);
if (CHECK && changedFiles) process.exit(1);
