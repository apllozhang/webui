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


## 规则 ID 注册表（本文件 Must 条款）

<!-- BEGIN:must-registry -->
| ID | 条款（摘录） |
|---|---|
| CMP-TABLE-001 | ## 交互行为（必须） |
| CMP-TABLE-002 | - 列宽：手柄 `role="separator"` + `tabindex=0` + 方向键 ±10（Shift ±1）；控件必须 `position:relative`（F13 铁律）； |
<!-- END:must-registry -->
