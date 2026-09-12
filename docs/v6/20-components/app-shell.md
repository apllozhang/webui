---
title: Component — App Shell（应用外壳）
id-prefix: CMP-SHELL
source: M4 链路建设（v6.0）；前身 = v5.4 第 8/10 章
status: M4 第一批（React 实现已交付；Alpine/Static 为模式变体）
---
# App Shell（应用外壳）

## 何时使用 / 何时不用

| 变体 | 结构 | 适用 |
|---|---|---|
| 内容站外壳 | 顶栏(3px 紫底条) + 可选侧栏 + 内容容器 | 内容网站型 |
| 工作台外壳 | 顶栏(工具区) + 侧栏 + 面包屑 + 页头(标题+主动作) + 内容 | 工具应用型（数据工作台） |
| 轻量外壳 | 顶栏 + 单列内容 | 轻量单任务 |

**不用**：登录页（authentication.md）；向导步骤页可省侧栏。

## Anatomy

```
┌──────────────────────────────────────────────┐
│ Topbar: Logo | 产品名 | 全局工具 | 用户区      │ ← sticky, z-100
├────────┬─────────────────────────────────────┤
│Sidebar │ Breadcrumb: 首页 / 列表 / 详情        │
│(240px) │ PageHeader: H1 + 说明 + 主动作        │
│        │ Content                              │
└────────┴─────────────────────────────────────┘
```

## 令牌与尺寸

| 部件 | 令牌/值 |
|---|---|
| 顶栏高度 | `--topbar-height`（64/58px）；底边 3px `--ale-purple-600`（内容站必须） |
| 侧栏宽度 | 240px，sticky |
| 内容宽度 | `--content-max`（1180px）；阅读区 `--reading-max`（760px） |
| 面包屑 | 13px `--color-text-muted`；当前页不加链接 |
| 页头 H1 | `--font-size-page-title`（32/26） |

## 状态

顶栏 sticky + 半透明模糊；导航当前项双线索（tint 底 + 3px 紫底条）；移动端（≤980px）侧栏转抽屉，汉堡 `aria-expanded`，Esc 可关。

## 键盘与读屏

Skip link → `#main`；`nav aria-label`；抽屉焦点圈闭/归还；页面唯一 h1。

## 响应式

≤1100 品牌文字隐藏 ｜ ≤980 侧栏转抽屉 ｜ ≤640 主动作换行。

## 正确 / 错误示例

✅ 一页一个 H1、一个 Primary；面包屑只表层级。
❌ 侧栏嵌侧栏；页头两个 Primary；面包屑当步骤条。

## 骨架支持矩阵

| 能力 | React | Alpine | Static |
|---|---|---|---|
| 工作台外壳 | ✅ `components/AppShell.tsx` | ✅ 简版 | — |
| 内容站外壳 | ✅ | ✅ | ✅ `templates/base.html` |
| 移动抽屉 | ✅ | ✅ | ✅ |

## 自动化验收 ID

| ID | 检查 | 工具 |
|---|---|---|
| SHELL-OVF-001 | 五档视口根级无溢出 | design:check OVF-* |
| SHELL-HIT-001 | 导航链接 elementFromPoint 命中自身 | design:check HIT-NAV |
| SHELL-SEM-001 | 唯一 h1、标题不跳级 | 人工/axe（M4+） |
