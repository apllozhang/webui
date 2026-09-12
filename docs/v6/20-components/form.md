---
title: Component：表单链路
id-prefix: CMP-FORM
source: ALE-WEBUI-设计规范-v5.4.md
status: M2 迁移（内容 = v5.4.1 基线，未新增规则）
---
# Component：表单链路


---

## 13. 输入、搜索与筛选

- 可见标签在控件上方，placeholder 不替代标签；必填有标记并解释含义；错误紧邻控件并说明修复方法。

```html
<label for="title">标题</label>
<input id="title" aria-describedby="title-help title-error" aria-invalid="true" />
<p id="title-help">使用能准确描述内容的简短名称。</p>
<p id="title-error" role="alert">请输入标题。</p>
```

- 输入框高度 ≥44px；聚焦时边框变紫 + `--ring-soft` 柔和环（鼠标），键盘仍走 `:focus-visible` outline。
- 搜索用 `<form role="search">`；下拉结果容器 `--shadow-md` 浮层，结果项 hover 用 `--color-purple-tint` 浅紫底；清除按钮仅有内容时出现（`aria-label="清除搜索"`）。
- 活跃筛选可见、可逐个移除；筛选是即时更新还是点"应用"更新必须明确；"重置"只清筛选不动用户数据。

---

## 18. 表单

- 默认单列、标签在上；长表单按主题分组；主按钮靠表单末尾；失焦校验而非逐字符报错。
- 提交失败焦点移到错误摘要或首个错误字段；服务端错误保留已输入数据；未保存离开需提示。

---

# 第四部分：数据展示

## 规则 ID 注册表（本文件 Must 条款）

| ID | 条款（摘录） |
|---|---|
| CMP-FORM-001 | - 活跃筛选可见、可逐个移除；筛选是即时更新还是点"应用"更新必须明确；"重置"只清筛选不动用户数据。 |