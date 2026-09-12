---
title: Component：数据表格链路（14A 功能包）
id-prefix: CMP-TABLE
source: ALE-WEBUI-设计规范-v5.4.md
status: M2 迁移（内容 = v5.4.1 基线，未新增规则）
---
# Component：数据表格链路（14A 功能包）


---

## 14. 表格与数据列表

- 语义化 `table/thead/tbody/th`；数字右对齐（金额用 `tabular-nums`）、文本左对齐；排序表头为按钮并设 `aria-sort`。
- 空态/加载态/错误态必备；行操作靠近行末，低频动作收进菜单；批量操作仅选中行后出现并显示数量。
- 响应式策略：横向滚动 / 优先级隐藏 / 卡片化。
- **对比矩阵（形态 C，参照 nvci-lite）**：分组行 × 产品列；三态判定用"圆点+文字"而非纯颜色；人工核对用模态框并保留判定依据；支持导出。

### 14A. 数据表格交互功能包（形态 B 标配，必须）

源自 ale-dan-cpl-system 实测实现（`useTableFeatures.tsx` / `TablePagination.tsx` / `QuotationList.tsx` / `ThemeContext.tsx` / `i18n/`），采纳时按本节无障碍要求强化：

**14A.1 排序**：表头内放 `<button>`，三态图标——未排序灰色双三角、正序紫色上三角、倒序紫色下三角；当前列设 `aria-sort="ascending|descending"`；再次点击切换方向；数值列按数值比较、文本按 `localeCompare`。

**14A.2 列宽拖动**：表头右缘 1.5px 手柄，hover 显紫色；拖动最小列宽 50px；表格 `table-layout: fixed` + 像素宽度。复杂档推荐用 TanStack Table 实现（`header.getResizeHandler()` + `setColumnSizing`，注意 v8 API 在 header 而非 column 上），手写实现仅限轻量档。**无障碍强化**：手柄加 `role="separator"` + `aria-valuenow`（当前宽）+ `tabindex="0"`，左右方向键 ±10px（Shift+方向键 ±1px 精调）。

**14A.3 文字换行**：单元格内容容器 `overflow-wrap: break-word; white-space: normal;`，长单号/URL/名称不断表。

**14A.4 分页**：页大小 Select（10/20/50，切换回第 1 页）+ "第 x–y 条，共 N 条"（数字千分位）+ 首页/上一页/页码组/下一页/末页；页码 >7 自动折叠为省略号；首末页按钮禁用态清晰。

**14A.5 搜索**：输入防抖 ≤300ms；有内容时显示清除按钮；搜索/筛选变化自动重置页码与勾选；搜索中可显示加载指示。

**14A.6 批量操作**：表头全选 + 行复选（行内点击需 `stopPropagation` 避免触发行跳转）；选中 ≥1 出现批量动作，≥2 可出现对比；批量删除必须走危险确认弹窗，写明数量与后果。

**14A.7 亮/暗主题**：`ThemeProvider` + 根节点 `.dark` class + localStorage 持久化 + ≤300ms 过渡；暗色只在语义令牌映射层实现（第 6 章），暗色值仍从官方色板五档取值，ALE Purple 在暗底上用作按钮底色时验证对比度 ≥4.5:1；支持 `switchable=false` 锁定（对外品牌站可禁用暗色）。

**14A.8 多语言**：i18next 模式，语言选择持久化 localStorage；切换时同步 `<html lang>`；键名用"模块.键"（如 `quotation.status`）；缺失键回退默认语言（zh）；六语言基线 zh/zh-TW/en/ja/es/fr；语言切换器用地球图标 + `aria-label`。

## 规则 ID 注册表（本文件 Must 条款）

| ID | 条款（摘录） |
|---|---|
| CMP-TABLE-001 | ### 14A. 数据表格交互功能包（形态 B 标配，必须） |
| CMP-TABLE-002 | **14A.6 批量操作**：表头全选 + 行复选（行内点击需 `stopPropagation` 避免触发行跳转）；选中 ≥1 出现批量动作，≥2 可出现对比；批量删除必须走危险确认弹窗，写明数量与 |