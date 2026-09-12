/* 部署 ale-webui-kit（hub + react/alpine/static）到目标机 docker */
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

// F-依赖：ssh2 解析（仓库内 kit/tools/node_modules 随库提交；兼容本目录安装）
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
const PORT = process.env.DEPLOY_PORT || "8095";
// Windows 下 GNU tar 会把 "D:\..." 当远程主机，指定系统自带 bsdtar（认盘符）
const TAR = process.env.TAR_BIN || (process.platform === "win32" ? "C:\\Windows\\System32\\tar.exe" : "tar");
const KIT = path.join(__dirname, "..");
const BUILD = path.join(__dirname, "build");
const TARGZ = path.join(__dirname, "kit.tgz");
const REMOTE_DIR = "/home/alec/ale-webui-kit";
const NAME = "ale-webui-kit";

function pack() {
  fs.rmSync(BUILD, { recursive: true, force: true });
  fs.mkdirSync(BUILD, { recursive: true });
  // 组装构建上下文
  fs.cpSync(path.join(KIT, "deploy", "hub"), path.join(BUILD, "hub"), { recursive: true });
  fs.cpSync(path.join(KIT, "deploy", "nginx.conf"), path.join(BUILD, "nginx.conf"));
  fs.cpSync(path.join(KIT, "deploy", "Dockerfile"), path.join(BUILD, "Dockerfile"));
  fs.cpSync(path.join(KIT, "skeleton-react", "dist"), path.join(BUILD, "react"), { recursive: true });
  fs.cpSync(path.join(KIT, "skeleton-alpine"), path.join(BUILD, "alpine"), {
    recursive: true,
    filter: (s) => !s.includes("node_modules") && !s.includes(".git"),
  });
  fs.cpSync(path.join(KIT, "skeleton-static", "dist"), path.join(BUILD, "static"), { recursive: true });
  execSync(`"${TAR}" -czf "${TARGZ}" -C "${BUILD}" .`, { stdio: "inherit" });
  console.log("packed:", fs.statSync(TARGZ).size, "bytes");
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
      ws.on("close", resolve);
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

  await run(conn, `docker rm -f ${NAME} >/dev/null 2>&1 || true`);
  await new Promise((r) => setTimeout(r, 800));
  const chk = await run(conn, `docker --version && (ss -tln | grep -q ':${PORT} ' && echo PORT_BUSY || echo PORT_FREE)`);
  if (chk.out.includes("PORT_BUSY")) { console.error(`port ${PORT} busy`); conn.end(); process.exit(2); }

  const steps = [
    `mkdir -p ${REMOTE_DIR}`,
    `cd ${REMOTE_DIR} && tar -xzf ~/kit.tgz 2>/dev/null || true`,
    `cd ${REMOTE_DIR} && docker build -t ${NAME} . 2>&1 | tail -3`,
    `docker run -d --name ${NAME} -p ${PORT}:80 --restart unless-stopped ${NAME}`,
    `sleep 1 && for u in / /react/ /alpine/ /static/ /react/fonts/noto.css /alpine/assets/fonts/noto.css /static/fonts/noto.css; do code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:${PORT}$u); echo "$code $u"; if [ "$code" != "200" ]; then echo "ASSET GATE FAILED: $u"; exit 1; fi; done`,
  ];
  // 先上传 tar（放在 REMOTE_DIR 外，避免打进镜像）
  await put(conn, TARGZ, `/home/alec/kit.tgz`);
  console.log("uploaded");
  for (const s of steps) {
    const res = await run(conn, s);
    if (res.code !== 0) { console.error("step failed:", s); conn.end(); process.exit(1); }
  }
  console.log(`DEPLOY OK → http://${HOST}:${PORT}/`);
  conn.end();
})().catch((e) => { console.error("DEPLOY FAILED:", e.message); process.exit(1); });
