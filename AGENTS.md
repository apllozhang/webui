# AGENTS.md — AI 协作上下文入口（本工作区）

> 给 AI 编码助手：这是一个 ALE WebUI 设计体系项目的工作区。先读本文件，再读 `HANDOVER.md`（完整交接：起因/经过/专家意见/已完成/待办）。
> 本文件存在意味着：工作区是从上一个 AI 协作会话整体移交的，对话历史不可迁移，本文件 + HANDOVER.md 就是上下文桥梁。

## 这个工作区是什么

ALE 品牌的 WebUI 设计体系（v5.4.1 基线，v6.0 治理版进行中）：

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
- 部署目标 10.10.10.218 ≡ 10.20.30.203（同一台机），SSH `alec`，密码见 `D:\AIWork\10.20.30.203.txt`；容器 ale-webui-spec:8091 / ale-webui-kit:8095（密码也硬编码在 deploy 脚本内——仓库 Private 是前提，已由负责人拍板接受；永不转 Public）
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

## 当前状态速查（截至移交）

- 基线 tag：`v5.4.1`（只读）；main 分支 ≈ commit 3db914d 之后
- 已完成：M1 门禁 / M2 docs/v6 四层 / M3 Token 生成链 / M4 第一批（AppShell/Form/Feedback 链路）
- 进行中/待办：M4 收尾（示例库/骨架对齐）→ CI 化 → M5 三项目试点 → M6 干净发布包
- 完整上下文：`HANDOVER.md`（起因/经过/专家两轮意见/环境/教训 F1-F15/移交清单）
