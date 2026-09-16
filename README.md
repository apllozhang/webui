# ALE WebUI 设计体系

ALE 品牌下 B/S 系统的 WebUI 设计体系:**6.0.0 正式版**(tag `v6.0.0`)——设计令牌单一真源、三档工程骨架、自动化设计门禁与治理机制。

> **新人请从这里开始 → [docs/START-HERE.md](docs/START-HERE.md)**(5 分钟上手:环境、三条命令跑全量门禁、目录地图、部署、试点仓库、找历史)

## ⚠️ AI 开发者必读(UI 调整前,按顺序读完再动手)

1. **[docs/START-HERE.md](docs/START-HERE.md)** — 上手与环境
2. **[AGENTS.md](AGENTS.md)** — 协作规则与铁律(全是踩过的坑)
3. **[docs/UI-CHECKLIST.md](docs/UI-CHECKLIST.md)** — 组件 × 交互验收矩阵。**最容易漏的是运行时才可见的交互行为**(表格列宽拖拽/分页/查询/升降序排序、暗亮切换+刷新持久化、Esc 关弹层等),逐项对照,不是看完截图就算数

**交付定义(DoD)**:交付说明必须附 ① `cd kit/tools && npm run design:check` 的 ALL PASS 输出;② UI-CHECKLIST 文末「交付自查表」逐项勾选。**没有机器证据 = 未完成**——静态看代码发现不了交互缺失,门禁替你兜底;禁止用改阈值/删断言让门禁变绿。

## 仓库结构(概要)

| 路径 | 内容 |
|---|---|
| `kit/tokens/` | ★ 令牌 JSON 真源(改设计只改这里,生成物勿手改) |
| `kit/shared/` `kit/skeleton-{react,alpine,static}/` | 共享层 + 三档工程骨架 |
| `kit/tools/` | 全部门禁与工具(tokens/contrast/rules/exceptions/lock/design/pilot/font) |
| `docs/v6/` | 四层规范文档(62 条 must 规则注册表) |
| `docs/START-HERE.md` | ★ 上手指南 |
| `docs/release/` | 发布就绪台账(核销记录+6.1 路线)、Release Notes、三方签收 |
| `docs/review/` | 六轮评审与历次整改验收全记录(审计链) |
| `spec-site/` | 规范演示站 |
| `deploy/` | 双站 Docker 部署脚本 |
| `release-lock.json` | 发布组合锁定(含三试点 v6-pilot SHA) |

## 在线演示(内网,两台内容与 v6.0.0 一致)

| 地址 | 内容 |
|---|---|
| http://10.10.10.218:8091 或 http://10.20.30.203:8091 | 规范演示站(组件/14A 表格/亮暗主题/中英切换/字体对比页 `/fonts-compare.html`) |
| http://10.10.10.218:8095 或 http://10.20.30.203:8095 | Kit 导航 + React/Alpine/Static 三骨架 |

(两台服务器分属不同网段,按你所在网络择一可达;部署同步命令见 START-HERE)

## 质量基线

六轮独立评审轨迹:68 BLOCKED → 82 → 91 → 84(深评) → 89 → 93 → **95 PASS(RC)**,三方签收后发布。全部门禁 push 即跑(CI 失败自诊断写入 `.github/ci-state.json`)。治理教训 F1-F22 见 `docs/HANDOVER.md` 与 `docs/review/`。

## 品牌与法律

- 品牌依据:Alcatel-Lucent Enterprise Corporate Brand Guidelines(September 2025)
- Logo 资产来自官方 Marketing Resources,仅用于内部演示
- 页脚法律声明为官方原文:The Alcatel-Lucent name and logo are trademarks of Nokia used under license by ALE.
- 中文自托管字体:Noto Sans SC(SIL OFL 1.1)
