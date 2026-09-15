# START HERE — ALE WebUI 开发上手指南

> 你只需要这个仓库(或它的一份本地克隆)即可开展全部日常工作。本文是唯一入口,5 分钟读完即可动手。
> 当前正式版本:**6.0.0**(tag `v6.0.0`,发布组合锁定见 `release-lock.json`)。

## 这是什么

ALE 品牌的 WebUI 设计体系:设计令牌单一真源(JSON 生成链)→ 三档工程骨架(React/Alpine/Static)→ 自动化设计门禁 → 治理机制(例外台账/发布锁定/性能基线/CI 自诊断)。线上演示:规范站 `:8091`,Kit 四入口 `:8095`(Hub/`react/`/`alpine/`/`static/`)。

## 环境要求

- Node ≥ 22(`kit/tools` 与 `kit/skeleton-react` 各自 `npm ci`)
- Python ≥ 3.12(+`jinja2` 构建 Static 骨架;`fonttools/brotli` 仅重建字体子集时需要)
- Git(SSH key 已在 apllozhang 账号下)
- 试点仓库 ale-dan-cpl-system **仅支持 pnpm**(`pnpm install --frozen-lockfile`,preinstall guard 会拦截 npm/yarn)

## 快速开始(三条命令)

```bash
git clone git@github.com:apllozhang/webui.git && cd webui
cd kit/tools && npm ci
npm run design:check        # 全量设计门禁(规范站+Kit 四入口;需本机有 Chrome/Edge)
```

全绿即环境就绪。改设计请只改 `kit/tokens/*.json`(真源),`npm run tokens:build` 重新生成,禁止手改生成物。

## 目录地图

| 路径 | 内容 |
|---|---|
| `kit/tokens/` | ★ 令牌 JSON 真源(改设计只改这里) |
| `kit/shared/` + `kit/skeleton-{react,alpine,static}/` | 共享层与三档骨架 |
| `kit/tools/` | 全部门禁与工具(见下表) |
| `docs/v6/` | 四层规范文档(62 条 must 规则注册表) |
| `docs/release/v6-readiness.md` | ★ 发布就绪台账(全部发现的核销记录 + 6.1 路线) |
| `docs/review/` | 历史评审/验收全记录(审计链) |
| `spec-site/` | 规范演示站(8091) |
| `deploy/` | 部署脚本(kit + spec-site) |
| `release-lock.json` | 发布组合锁定(三试点 SHA) |
| `AGENTS.md` / `docs/HANDOVER.md` | 协作规则 / 交接史与教训 F1-F22 |

## 门禁速查(都在 `kit/tools` 下执行)

| 命令 | 断言 |
|---|---|
| `npm run tokens:check` | 令牌生成链零漂移 |
| `npm run tokens:contrast` | 对比度三分类(PASS/EXEMPT/SKIP=0) |
| `npm run rules:check` | 62 条规则注册表零漂移 |
| `npm run exceptions:check` | 例外台账 schema/owner/里程碑 |
| `npm run lock:check[:remote]` | 发布锁定一致性(+:试点 SHA 网络核验) |
| `npm run design:check` | 全量:规范站 + Kit 四入口(渲染/资产/控制台/320+768/键盘链/主题/字体双门禁) |
| `npm run pilot:tokens:check` | 试点硬编码扫描(颜色硬门槛;非颜色为迁移观测指标) |
| `npm run font:cov` | 方案 C 字符覆盖(C 子集页面必跑) |
| `node verify-colresize.mjs` | F14 列宽独立性(双目标) |

CI(GitHub Actions `design-gate`)push 即跑全部;失败时 `ci-state.json` 自带失败步骤/逐项结果/环境/指标——无需日志权限即可判读。

## 部署

凭据放仓库根 `deploy.secret.json`(gitignored,找负责人要;格式见 `deploy.secret.example.json`)。

```bash
# 构建(Kit 部署读取骨架 dist 产物)
cd kit/skeleton-react && npm ci && npx vite build
cd ../skeleton-static && python build.py
# 部署(默认 10.10.10.218;DEPLOY_HOST 可覆盖)
node deploy/kit/deploy-kit.js
node deploy/spec-site/deploy.js
```

⚠️ **网络视图**:10.10.10.218 与 10.20.30.203 分属不同网段,各自可达的机器不同(历史记录:开发机可达 218,评估机可达 203)。若你所在网段可达 203,同步 203 用同一脚本加环境变量:`DEPLOY_HOST=10.20.30.203 node deploy/kit/deploy-kit.js`(spec-site 同理)。两台内容应保持与 `release-lock.json` 版本一致;部署后跑一遍 `design:check`(CHECK_URL/KIT_URL 指向对应服务器)确认。

## 三个试点仓库(v6-pilot 分支,SHA 锁定于 release-lock.json)

TSSKB(Static 链路)/ ale-dan-cpl-system(React,仅 pnpm)/ nvci-lite(轻量)。验证脚本:`kit/tools/_pilot/verify-{tsskb,dancpl,nvci}.mjs <base> <outdir>`。试点变更流程:改 v6-pilot → 三验证脚本过 → 更新 release-lock.json 的对应 SHA + 台账记录原因。

## 版本与发布

版本真源 = 两处 `design-system.version.json`(VER 门禁强制与 title 一致)。发布流程与判据见 `docs/release/v6-readiness.md` §六-八;6.1 待办见同文件 §七。tag 不可移动;新变更走新版本号。

## 找历史

六轮独立评审报告、每次整改与验收、22 条教训(F1-F22)全部在 `docs/review/` 与台账里,按日期命名可直接翻。一句话索引:`docs/release/v6-readiness.md` 是现在,`docs/review/` 是怎么走到现在的。
