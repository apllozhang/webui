---
title: Component — Data Table（数据表格链路）
id-prefix: CMP-TABLE
source: M4 链路建设（v6.0）；前身 = v5.4 第 14/14A 章
status: M4 第一批（Core/Advanced 已实现；虚拟化列 Advanced 待办）
---
# Data Table（数据表格链路）

## 能力分级（v6.0 起，按复杂度选档）

| 级别 | 能力 | 适用 |
|---|---|---|
| **Core** | 语义表格、排序（aria-sort）、分页（10/20/50+折叠页码）、防抖搜索、空/错/加载态、文字换行 | 所有列表场景 |
| **Advanced** | 列宽拖动（键盘可操作）、批量选择+危险确认、状态筛选、批量操作条 | 数据工作台 |
| **Optional** | 亮暗主题、多语言 —— **应用级能力注入，不是每张表自身职责** | 应用整体 |
| Backlog | 列显隐、持久化布局、虚拟化（>1 万行） | v6.1 |

## Anatomy

```
Toolbar: 搜索(防抖300ms+清除) | 状态筛选
BatchBar: 已选 N 条 | 清除 | 危险操作（选中才出现）
Table: thead(排序按钮+aria-sort+列宽手柄) tbody(换行单元格)
Pagination: 每页 N | 第 x–y 共 z | « ‹ 1 2 … n › »
```

## 令牌与尺寸

表头 tint 底 + `--color-heading-accent`；单元格 13px、`--color-border-soft` 分隔；金额 `tabular-nums` 右对齐；行 hover tint；`table-layout: fixed` + 显式列宽。

## 交互行为（必须）

- 排序：表头**按钮**（非 th onclick）+ `aria-sort`；三态图标（无/升/降）；
- 列宽：手柄 `role="separator"` + `tabindex=0` + 方向键 ±10（Shift ±1）；控件必须 `position:relative`（F13 铁律）；
- 搜索：300ms 防抖、清除按钮、变更重置页码；
- 批量：全选/行选 stopPropagation；删除走危险确认（写明数量与后果）；
- 换行：`overflow-wrap: break-word`，长编号不断表。

## 已知取舍（F14 宽屏呈现）

- 初始状态表格填满容器（行尾 filler 列吸收余量，表头色带到边）；拖过任一列后切换为 Σ列宽 精确像素——宽屏上表格右侧留白、表头色带随表格右缘结束。这是保「拖哪列只有那列变」F14 语义的代价，负责人裁决维持此行为（2026-09-12），未走例外登记（非规则偏离，属实现取舍）。
- 列宽手柄仅在表头（行间不设拖动热区：与单元格内容/热区规则冲突，业界通行做法）；最后一列通过其左侧边界调整。

## 键盘与读屏

表头可 Tab 到达；方向键调列宽；`aria-sort`/`aria-selected`/禁用态清晰；空态含行动按钮。

## 正确 / 错误示例

**状态用「圆点 + 文字」徽章，非纯色点（M4 示例库）**

✅ 正确：颜色 + 文字双编码——色觉障碍可辨、读屏可读（色彩不单独传达状态，见 `00-foundations/color.md`）。

```html
<td><span class="badge status-success">
  <span class="dot" aria-hidden="true"></span>已通过
</span></td>
```

❌ 错误：只留一个颜色通道，深色主题下深浅变化更不可辨。

```html
<!-- ❌ 纯色点，读屏读到空单元格 -->
<td><span class="dot" style="background:var(--status-success-graphic)"></span></td>
```

✅ 数字列右对齐 + `tabular-nums`；空态给「清除筛选」行动入口。
❌ 一页两套分页；行内 checkbox 点击冒泡到整行选中（应 stopPropagation）。

## 骨架支持矩阵（按骨架实际交付，2026-09-12 核对）

| 能力 | React | Alpine | Static |
|---|---|---|---|
| Core | ✅ `components/DataTable.tsx` | ✅ demo（排序·防抖搜索·状态筛选·分页·空态） | —（未提供；内容站形态无数据表） |
| Advanced（列宽拖动/批量/批量操作条） | ✅ | —（明确不支持，超出请升级 `skeleton-react`） | —（未提供） |
| 虚拟化 | Backlog（TanStack virtual） | — | — |

## 自动化验收 ID

| ID | 检查 |
|---|---|
| TABLE-SORT-001 | 表头按钮 + aria-sort |
| TABLE-HIT-001 | 排序/分页/复选框热区 ≥44px |
| TABLE-STATE-001 | 空/加载/错误态存在 |
| TABLE-OVF-001 | 表格横向滚动限制在容器内 |

## 业务站落地检查清单（改造已有系统时逐项勾选）

> 案例与教训：`docs/review/2026-09-16-8088-competitor-web-v6-整改案例.md`（F23–F25）。
> 交付口径（跨组件最低集 + 机器证据要求）：`docs/UI-CHECKLIST.md`——本清单是表格的细版，两者配合使用。

| # | 检查项 | 通过标准 |
|---|---|---|
| 1 | 真源 | 颜色/字号/间距来自 v6 tokens（生成 CSS 或等价映射），无第二套 hex |
| 2 | 品牌 | 官方 Logo（浅底彩标/深底反白），高 34px，无渐变底块仿制 |
| 3 | 工具栏 | 搜索（防抖 300ms + 清除）+ 筛选；**不要**与 h2 抢同一行导致折行 |
| 4 | 排序 | 表头内 `button` + `aria-sort` + 三态图标；非 `th onclick` |
| 5 | 列宽 | `role=separator` + `tabindex=0`；←/→ ±10、Shift ±1；F14 拖后精确像素 |
| 6 | 分页 | 「每页 10/20/50」+「第 x–y 条，共 z 条」+ «‹ 1 … n ›»；每页下拉 **紧凑**（约 32×高），禁止被全局 `select{width:100%}` 拉通栏 |
| 7 | 数字列 | 右对齐 + `tabular-nums`；千分位 |
| 8 | 状态 | 「圆点 + 文字」双编码徽章，禁止纯色点 |
| 9 | 空态 | 说明 + 「清除筛选」行动按钮 |
| 10 | 布局 | `table-layout:fixed` + 显式列宽；容器内横向滚动（TABLE-OVF-001） |
| 11 | 主题 | 若支持暗色，对齐 `:root.dark` 语义令牌 |
| 12 | 部署 | 资源文件名与 HTML 引用一致；静态 `?v=`；curl 校验关键资源 200 |
| 13 | 对照旧 UI | 独立 `legacy.html` 整页（HTML+CSS+JS 成对），禁止同页只切 CSS |

## 规则 ID 注册表（本文件 Must 条款）

<!-- BEGIN:must-registry -->
| ID | 条款（摘录） |
|---|---|
| CMP-TABLE-001 | ## 交互行为（必须） |
| CMP-TABLE-002 | - 列宽：手柄 `role="separator"` + `tabindex=0` + 方向键 ±10（Shift ±1）；控件必须 `position:relative`（F13 铁律）； |
| CMP-TABLE-003 | \| 6 \| 分页 \| 「每页 10/20/50」+「第 x–y 条，共 z 条」+ «‹ 1 … n ›»；每页下拉 **紧凑**（约 32×高），禁止被全局 `select{width:100%}` 拉通栏 \| |
| CMP-TABLE-004 | \| 8 \| 状态 \| 「圆点 + 文字」双编码徽章，禁止纯色点 \| |
| CMP-TABLE-005 | \| 13 \| 对照旧 UI \| 独立 `legacy.html` 整页（HTML+CSS+JS 成对），禁止同页只切 CSS \| |
<!-- END:must-registry -->
