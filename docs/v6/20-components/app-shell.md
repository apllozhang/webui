---
title: Component：App Shell（顶部栏 / 导航 / 容器）
id-prefix: CMP-SHELL
source: ALE-WEBUI-设计规范-v5.4.md
status: M2 迁移（内容 = v5.4.1 基线，未新增规则）
---
# Component：App Shell（顶部栏 / 导航 / 容器）


---

## 10. 顶部栏与导航

**顶栏（必须吸收 TSSKB 模式）：**

```css
.topbar {
  position: sticky; top: 0; z-index: 100; min-height: 64px;
  background: rgb(255 255 255 / 96%);
  backdrop-filter: blur(10px);
  border-bottom: 3px solid var(--ale-purple-600);   /* 品牌紫底边条：ALE 门户识别元素 */
}
```

- 内容型页面顶栏必须带 3px 品牌紫底边条；应用型页面可用 1px 中性边线替代（工具型界面避免上下双向紫色压迫）。
- **当前导航项双线索**：`--ale-purple-100` 浅紫底 + 3px 紫色底边条 + 深紫文字；仅变色不算当前态。
- 键盘焦点可见；折叠菜单设 `aria-expanded`；移动端菜单 Esc 可退、焦点不落遮罩后；Logo 链接可访问名称表达首页。

## 规则 ID 注册表（本文件 Must 条款）

| ID | 条款（摘录） |
|---|---|
| CMP-SHELL-001 | **顶栏（必须吸收 TSSKB 模式）：** |
| CMP-SHELL-002 | - 内容型页面顶栏必须带 3px 品牌紫底边条；应用型页面可用 1px 中性边线替代（工具型界面避免上下双向紫色压迫）。 |