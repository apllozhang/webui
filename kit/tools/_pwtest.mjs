// 密码轮换实测：旧凭据连接两地址，预期被拒（若成功=轮换未生效）
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SSH2_ENTRY = path.resolve(HERE, "..", "..", "..", "_deploy", "node_modules", "ssh2", "lib", "index.js");
const ssh2mod = await import(pathToFileURL(SSH2_ENTRY).href);
const Client = ssh2mod.Client;

const HOSTS = ["10.10.10.218", "10.20.30.203"];
const OLD_PW = JSON.parse(fs.readFileSync(path.resolve(HERE, "..", "..", "..", "_deploy", "deploy.secret.json"), "utf8")).password;

function tryAuth(host, password) {
  return new Promise((resolve) => {
    const conn = new Client();
    let done = false;
    const finish = (r) => { if (!done) { done = true; try { conn.end(); } catch {} resolve(r); } };
    conn.on("ready", () => finish("AUTH-SUCCESS"));
    conn.on("error", (e) => finish("AUTH-FAIL: " + (e.level || "") + " " + e.message.slice(0, 60)));
    conn.on("close", () => finish("CLOSED"));
    conn.connect({ host, port: 22, username: "alec", password, readyTimeout: 12000 });
    setTimeout(() => finish("TIMEOUT"), 14000);
  });
}

for (const host of HOSTS) {
  const r = await tryAuth(host, OLD_PW);
  console.log(`[${host}] 旧密码 → ${r}`);
}
process.exit(0);
