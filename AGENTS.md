## AI 调用路由(交互式)

用户要求"调用 WEBUI 规范/按规范做 XX"但信息不全时,**先问后做**:出示三问(场景/环境/版本素材,全文见 docs/prompts/提示词样例.md §0),按路由表匹配模板一/二/三或试点流程。禁止在缺素材(如 Logo)或缺版本号时直接动手。

# AGENTS.md — AI 协作上下文入口（本工作区）

> 给 AI 编码助手：这是一个 ALE WebUI 设计体系项目的工作区。先读本文件，再读 `HANDOVER.md`（完整交接：起因/经过/专家意见/已完成/待办）。
> 本文件存在意味着：工作区是从上一个 AI 协作会话整体移交的，对话历史不可迁移，本文件 + HANDOVER.md 就是上下文桥梁。

## 这个工作区是什么

ALE 品牌的 WebUI 设计体系（**v6.0.0 正式版**，2026-09-15 发布，tag v6.0.0）：

```
ale-webui-site/          规范演示站源码（纯 HTML/CSS/JS）—— 已部署 :8091
ale-webui-kit/           工程骨架包
  ├─ tokens/             ★ 令牌 JSON 真源（改设计只改这里，禁止改生成物）
  ├─ shared/             生成的 css/js/preset + 字体（禁止手改 tokens.css）
  ├─ skeleton-react|alpine|static/   三个可拷贝的项目骨架
  ├─ tools/              design:check 门禁 + build-tokens 生成链 + verify 脚本
  └─ deploy/             deploy-kit.js（部署 :8095）
_deploy/                 deploy.js（部署规范站 :8091）
_repo_stage/             GitHub 仓库 apllozhang/webui 的镜像（push 从这里）
docs 里的规范在 _repo_stage/docs/（v6/ 四层 + HANDOVER.md + 评审材料）
ALE-WEBUI-设计规范-v5.x.md   各版规范（工作副本）
_*.py / _*.mjs           历次整改的操作脚本（操作记录，可读可参考，别删）
```

## 环境事实（这台机器）

- Windows 10，shell 是 cmd（bash 语法不可用；长 python 逻辑写成脚本文件跑，`python -c` 传多行/引号会坏）
- git 在 `C:\Program Files\Git\cmd\git.exe`（PATH 里没有）；commit 需带身份参数
- GitHub 走 SSH（HTTPS 443 被墙，22 通）；SSH key 在 `C:\Users\Administrator\.ssh\id_ed25519`（若换了机器需重建并加到 GitHub）
- github.com:443 超时是常态，push 失败先 `python _probe.py` 测通道
- 部署目标 10.10.10.218 ≡ 10.20.30.203（同一台机），SSH `alec`，密码见仓库根 `deploy.secret.json`（不入库）与 `D:\AIWork.20.30.203.txt`；容器 ale-webui-spec:8091 / ale-webui-kit:8095。**M5-0.2 已密码外置（deploy 脚本零硬编码口令）；M5-0.3 曾轮换、负责人裁决测试阶段回退原口令（暴露风险已知悉，建议 M6 发布前再轮换）**
- 品牌资料在 `X:\BP 目录\Marketing Resources\`（网络盘）
- 本机有 Edge/Chrome，puppeteer-core 门禁可用（node_modules 已装在 ale-webui-kit/tools）

## 铁律（违反会翻车，都是踩过的坑）

1. **改设计只改 `ale-webui-kit/tokens/*.json`，然后 `npm run tokens:build`**——tokens.css×2、preset、文档表格、对比度输入全部自动同步；生成物手改会被 --check 抓
2. **bootstrap 类反解脚本禁止重跑**（css 已是生成产物，重跑污染真源——v5.4.1 事故）
3. **伪元素做热区/状态层的控件必须 `position:relative`**（漏了会铺满祖先造成全栏点击串扰，F13）；改完跑 hit-test
4. **fixed 表格 + min-width:100% 会让拖列宽带动全表**；正确做法是"拖过即切精确像素模式"（F14，见 verify:colresize）
5. **push 前必须把工作区改动拷进 `_repo_stage`**（双副本手动同步；漏拷 = 线上有仓库没有）
6. **build 绿 ≠ 运行对**：React 改动必须浏览器实际打开验证（React import 丢失/FAB 断点写反都是 build 不报错的）
7. **npm run design:check + tokens:contrast 全绿才算完成**；verify 脚本在 kit/tools
8. JSX 标签内禁止行内 `//` 注释（会被当文本渲染，F15）；按钮类必须 `font: inherit`（F11）
9. 320px 网格列写法：`minmax(min(Npx,100%),1fr)`（F10）

## UI 调整交付定义（DoD）——外部 AI 开发必读

对任何页面做 UI 调整，交付前必须三件事：① 对照 **`docs/UI-CHECKLIST.md`** 组件×交互矩阵逐项实现（表格列宽拖拽/分页/查询/升降序排序、暗亮切换+刷新持久化、Esc 关弹层这类运行时交互最容易漏）；② 附 `cd kit/tools && npm run design:check` 的 ALL PASS 输出；③ 把 CHECKLIST 文末「交付自查表」勾选后贴进交付说明。**没有机器证据 = 未完成**；禁止用改阈值/删断言/skip 让门禁变绿（F21/F22）。

## 环境差异（多机协作记录，v6.0 移交复核时确认）

接手方（Git Bash / C:\Users\tinal）与原工作区（cmd / C:\Users\Administrator）环境不同，以下按机器记录：

| 项 | 原工作区 (Administrator) | 接手方 (tinal) |
|---|---|---|
| shell | cmd | Git Bash |
| SSH key | C:\Users\Administrator\.ssh\id_ed25519 | C:\Users\tinal\.ssh\id_ed25519（同一账号 apllozhang） |
| node | D:\Program Files\nodejs（PATH 内） | D:\Tools\nodejs 便携版（需手动 PATH） |
| 内网站点 | 218 可达 / 203 亦可达 | 218 不可达，用 203 |
| 仓库结构 | 旧模式：工作区 + _repo_stage 双副本 | **新模式（移交后标准）：直接克隆 webui 仓库开发，单一真源；双副本规则已废止** |

npm 慢/不稳时用 `--registry=https://registry.npmmirror.com`。
Z: 网络盘挂载不稳定——**凭据与交付物一律存本地 D 盘，不依赖 Z 盘**（品牌资料 X: 盘不受影响）。

## 当前状态速查（M4 收尾完成，2026-09-12）

- 只读基线 tag：`v5.4.1`；正式版本：`v6.0.0` tag（发布锁定见 release-lock.json）
- 已完成：M1 门禁 / M2 docs/v6 四层 / M3 Token 生成链 / M4 四链路 + **收尾六项**：
  1. **CI 化**：`.github/workflows/design-gate.yml`——push 即跑 tokens:check + tokens:contrast + design:check（12 项）；首次绿勾 run 34691219270；运行结论回写 `.github/ci-state.json` 台账 + Run Summary
  2. **示例库**：20-components 四链路代码级 ✅/❌ 对照（app-shell / data-table / form / feedback）
  3. **骨架对齐**：Alpine/Static 支持矩阵按实绩核对重写，"未提供"逐项明示（USAGE.md 成熟度表同步）
  4. **规则 ID 全覆盖**：`kit/tools/scan-rules.mjs`（`rules:build` / `rules:check`）扫全类型条款行（含表格行）；59 条注册、历史 ID 零变动、幂等零漂移
  5. **success-bg 已登记 primitives**（advisory WARN 清零，值 = v5.4.1 修复值 #dff4f2）
  6. **回归全绿**：design:check 12/12 + tokens:contrast 46 对 ALL PASS + tokens:check/rules:check 零漂移
- 待办：M5 三项目试点 → M6 干净发布包与 v6.0 正式发布（细节见 HANDOVER §6）
- 完整上下文：`HANDOVER.md`（起因/经过/专家两轮意见/环境/教训 F1-F15/移交清单）
