/* 部署脚本：打包站点 → sftp 上传 → 远端 docker build + run */
"use strict";
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// M5-0.2 密码外置：凭据读自仓库根 deploy.secret.json（不入库；模板 deploy.secret.example.json）
function loadSecret() {
  const cands = [
    path.join(__dirname, "..", "..", "deploy.secret.json"),
    path.join(__dirname, "deploy.secret.json"),
    path.join(process.cwd(), "deploy.secret.json"),
  ];
  const f = cands.find((p) => fs.existsSync(p));
  if (!f) {
    console.error("[deploy] 缺少凭据文件 deploy.secret.json（不入库）。\n" +
      "  修复：复制 deploy.secret.example.json 为仓库根目录 deploy.secret.json 并填入 host/user/password。");
    process.exit(1);
  }
  const s = JSON.parse(fs.readFileSync(f, "utf8"));
  for (const k of ["host", "user", "password"]) {
    if (!s[k]) { console.error(`[deploy] deploy.secret.json 缺字段: ${k}`); process.exit(1); }
  }
  return s;
}
const SECRET = loadSecret();

// ssh2 解析（仓库内 kit/tools/node_modules 随库提交；兼容本目录安装）
function requireSsh2() {
  const cands = [
    path.join(__dirname, "..", "..", "kit", "tools", "node_modules", "ssh2"),
    path.join(__dirname, "..", "tools", "node_modules", "ssh2"),
    path.join(__dirname, "node_modules", "ssh2"),
    "ssh2",
  ];
  for (const p of cands) { try { return require(p); } catch (e) { /* 依次尝试 */ } }
  console.error("[deploy] 找不到 ssh2：在 kit/tools 下 npm install ssh2，或在本目录 npm install ssh2");
  process.exit(1);
}
const { Client } = requireSsh2();

const HOST = process.env.DEPLOY_HOST || SECRET.host;
const USER = SECRET.user;
const PASS = SECRET.password;
const SITE = path.join(__dirname, "..", "..", "spec-site");
const TARGZ = path.join(__dirname, "site.tgz");
const REMOTE_DIR = "/home/alec/ale-webui-spec";
const PORT = process.env.DEPLOY_PORT || "8091";
// Windows 下 GNU tar 会把 "D:\..." 当远程主机，指定系统自带 bsdtar（认盘符）
const TAR = process.env.TAR_BIN || (process.platform === "win32" ? "C:\\Windows\\System32\\tar.exe" : "tar");

// v5.4 治理：发布前版本一致性检查（version.json ←→ index.html title）
function checkVersion(siteDir) {
  const vj = JSON.parse(fs.readFileSync(path.join(siteDir, "design-system.version.json"), "utf8"));
  const html = fs.readFileSync(path.join(siteDir, "index.html"), "utf8");
  const expected = vj.sites["spec-site"].title; // "ALE WebUI 设计规范 v5.4"
  const okTitle = html.includes(`<title>${expected}</title>`);
  if (!okTitle) {
    console.error(`VERSION MISMATCH: version.json expects "${expected}"`);
    process.exit(1);
  }
  console.log("version check OK:", expected);
}

function pack() {
  checkVersion(path.join(SITE, "."));
  execSync(
    `"${TAR}" -czf "${TARGZ}" -C "${SITE}" index.html css js fonts assets Dockerfile nginx.conf design-system.version.json`,
    { stdio: "inherit" }
  );
  console.log("packed:", TARGZ, fs.statSync(TARGZ).size, "bytes");
}

function run(conn, cmd) {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = "";
      stream.on("close", (code) => resolve({ code, out }));
      stream.on("data", (d) => { out += d; process.stdout.write(d); });
      stream.stderr.on("data", (d) => { out += d; process.stderr.write(d); });
    });
  });
}

function put(conn, local, remote) {
  return new Promise((resolve, reject) => {
    conn.sftp((err, sftp) => {
      if (err) return reject(err);
      const ws = sftp.createWriteStream(remote);
      ws.on("close", () => resolve());
      ws.on("error", reject);
      fs.createReadStream(local).pipe(ws);
    });
  });
}

(async () => {
  pack();
  const conn = new Client();
  await new Promise((resolve, reject) => {
    conn.on("ready", resolve);
    conn.on("error", reject);
    conn.connect({ host: HOST, port: 22, username: USER, password: PASS, readyTimeout: 20000 });
  });
  console.log("connected to", HOST);

  await run(conn, `mkdir -p ${REMOTE_DIR}`);
  await put(conn, TARGZ, `${REMOTE_DIR}/site.tgz`);
  console.log("uploaded");

  // 重部署：先移除自己的旧容器（若有），再检查端口
  await run(conn, `docker rm -f ale-webui-spec >/dev/null 2>&1 || true`);
  await new Promise((r) => setTimeout(r, 800));
  let r = await run(conn, `docker --version && (ss -tln | grep -q ':${PORT} ' && echo PORT_BUSY || echo PORT_FREE)`);
  if (r.out.includes("PORT_BUSY")) {
    console.error(`port ${PORT} busy — aborting`);
    conn.end();
    process.exit(2);
  }

  const steps = [
    `cd ${REMOTE_DIR} && tar -xzf site.tgz`,
    `cd ${REMOTE_DIR} && docker build -t ale-webui-spec . 2>&1 | tail -3`,
    `docker run -d --name ale-webui-spec -p ${PORT}:80 --restart unless-stopped ale-webui-spec`,
    `sleep 1 && for u in / /css/tokens.css /js/i18n.js /fonts/noto.css /assets/ale-logo.png; do code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:${PORT}$u); echo "$code $u"; if [ "$code" != "200" ]; then echo "ASSET GATE FAILED: $u"; exit 1; fi; done && curl -s http://127.0.0.1:${PORT}/ | grep -q "v5.4" || (echo "COPY GATE FAILED: version"; exit 1) && curl -s http://127.0.0.1:${PORT}/ | grep -qF "三种产品形态" && (echo "COPY GATE FAILED: legacy model"; exit 1) || true && docker ps --filter name=ale-webui-spec --format "{{.Status}}"`
  ];
  for (const s of steps) {
    const res = await run(conn, s);
    if (res.code !== 0) { console.error("step failed:", s); conn.end(); process.exit(1); }
  }
  console.log(`DEPLOY OK → http://${HOST}:${PORT}/`);
  conn.end();
})().catch((e) => { console.error("DEPLOY FAILED:", e.message); process.exit(1); });
