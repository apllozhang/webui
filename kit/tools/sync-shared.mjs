/* 将 shared/ 同步到各骨架（令牌单一来源的落地机制）。
   用法：node tools/sync-shared.mjs */
import { cp, mkdir, copyFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const jobs = [
  ["shared/css", "skeleton-alpine/assets/css"],
  ["shared/js", "skeleton-alpine/assets/js"],
  ["shared/fonts", "skeleton-alpine/assets/fonts"],
  ["shared/css", "skeleton-static/static/css"],
  ["shared/js", "skeleton-static/static/js"],
  ["shared/fonts", "skeleton-static/static/fonts"],
  ["shared/css/tokens.css", "skeleton-react/src/styles/tokens.css"],
  ["shared/tailwind.preset.js", "skeleton-react/tailwind.preset.js"],
];

for (const [src, dest] of jobs) {
  const s = join(root, src);
  const d = join(root, dest);
  await mkdir(dirname(d), { recursive: true });
  // 目录 → 递归拷；文件 → 单文件拷
  await cp(s, d, { recursive: !src.includes(".") });
  console.log("synced", src, "→", dest);
}
console.log("done.");
