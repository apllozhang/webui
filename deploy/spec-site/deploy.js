/* 部署脚本：打包站点 → sftp 上传 → 远端 docker build + run */
"use strict";
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { Client } = require("ssh2");

const HOST = process.env.DEPLOY_HOST || "10.20.30.203";
const USER = "alec";
const PASS = "P@ssw0rd@5121";
const SITE = path.join(__dirname, "..", "ale-webui-site");
const TARGZ = path.join(__dirname, "site.tgz");
const REMOTE_DIR = "/home/alec/ale-webui-spec";
const PORT = process.env.DEPLOY_PORT || "8080";

function pack() {
  execSync(
    `tar -czf "${TARGZ}" -C "${SITE}" index.html css js assets Dockerfile nginx.conf`,
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
    `sleep 1 && curl -s -o /dev/null -w "HTTP %{http_code}" http://127.0.0.1:${PORT}/ && docker ps --filter name=ale-webui-spec --format "{{.Status}}"`
  ];
  for (const s of steps) {
    const res = await run(conn, s);
    if (res.code !== 0) { console.error("step failed:", s); conn.end(); process.exit(1); }
  }
  console.log(`DEPLOY OK → http://${HOST}:${PORT}/`);
  conn.end();
})().catch((e) => { console.error("DEPLOY FAILED:", e.message); process.exit(1); });
