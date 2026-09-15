// ============================================================
// check-release-lock.mjs — 发布组合锁定校验(签收后 6.0.0 前置,F20 对策)
// 模式:
//   node check-release-lock.mjs             # CI 模式:仓库内一致性(锁文件 ↔ 双 version.json ↔ 锁定 SHA 溯源)
//   node check-release-lock.mjs --remote    # 发布模式:另加 git ls-remote 网络核验三试点 v6-pilot 分支 SHA
// 规则:
//   1. release-lock.json 存在且 schema 完整;
//   2. lock.version === spec-site/design-system.version.json.version === kit/shared/.../version(6.0.0);
//   3. lock.rc-baseline 必须是当前 HEAD 的祖先(git merge-base --is-ancestor)——证明门禁绿的那个 SHA 在本发布线上;
//   4. --remote:三试点 ls-remote 的 v6-pilot HEAD 必须逐字等于锁值。
// ============================================================
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
const REMOTE = process.argv.includes("--remote");
const errors = [];

const lock = JSON.parse(fs.readFileSync(path.join(REPO, "release-lock.json"), "utf8"));
for (const k of ["version", "rc-baseline", "tsskb", "nvci-lite", "ale-dan-cpl-system"]) {
  if (!lock[k] || typeof lock[k] !== "string" || !/^[0-9a-f]{7,40}/.test(lock[k]) && k !== "version") errors.push(`锁文件缺/非法字段: ${k}`);
}
if (!lock.version?.match(/^\d+\.\d+\.\d+/)) errors.push("version 非语义化");

// 2) version 三方一致
for (const f of ["spec-site/design-system.version.json", "kit/shared/design-system.version.json"]) {
  const v = JSON.parse(fs.readFileSync(path.join(REPO, f), "utf8")).version;
  if (v !== lock.version) errors.push(`${f}.version=${v} ≠ lock.version=${lock.version}`);
}

// 3) rc-baseline 是 HEAD 祖先
try {
  execSync(`git merge-base --is-ancestor ${lock["rc-baseline"]} HEAD`, { cwd: REPO, stdio: "pipe" });
} catch {
  errors.push(`rc-baseline ${lock["rc-baseline"].slice(0, 8)} 不是当前 HEAD 的祖先(发布线断裂)`);
}

// 4) 远端核验(发布模式)
if (REMOTE) {
  const pilots = { tsskb: "TSSKB", "nvci-lite": "nvci-lite", "ale-dan-cpl-system": "ale-dan-cpl-system" };
  for (const [key, repo] of Object.entries(pilots)) {
    try {
      const out = execSync(`git ls-remote git@github.com:apllozhang/${repo}.git refs/heads/${lock["pilot-branch"]}`, { encoding: "utf8" });
      const sha = out.split("\t")[0].trim();
      if (sha !== lock[key]) errors.push(`${repo} v6-pilot 实际 ${sha.slice(0, 8)} ≠ 锁定 ${lock[key].slice(0, 8)}(远端漂移,先更新锁文件+台账)`);
      else console.log(`remote OK  ${repo} @ ${sha.slice(0, 8)}`);
    } catch (e) {
      errors.push(`${repo} ls-remote 失败(网络/凭据): ${String(e.message).slice(0, 80)}`);
    }
  }
}

console.log(`release-lock: version=${lock.version} rc-baseline=${lock["rc-baseline"].slice(0, 8)} remote=${REMOTE}`);
if (errors.length) {
  console.error("release-lock FAILED:");
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("release-lock: check passed");
