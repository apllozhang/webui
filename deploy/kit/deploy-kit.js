/* 部署 ale-webui-kit（hub + react/alpine/static）到目标机 docker */
"use strict";
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { Client } = require(path.join(__dirname, "..", "..", "_deploy", "node_modules", "ssh2"));

const HOST = process.env.DEPLOY_HOST || "10.10.10.218";
const USER = "alec";
const PASS = JSON.parse(fs.readFileSync(
  path.resolve(__dirname, "..", "deploy.secret.json"), "utf8")).password;
const PORT = process.env.DEPLOY_PORT || "8095";
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
  execSync(`tar -czf "${TARGZ}" -C "${BUILD}" .`, { stdio: "inherit" });
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
