---
title: 层级（z-index）与投影
id-prefix: FND-ELEV
source: ALE-WEBUI-设计规范-v5.4.md
status: M2 迁移（内容 = v5.4.1 基线，未新增规则）
---
# 层级（z-index）与投影


---

## 26. z-index 层级

| 层级 | 值 |
|---|---:|
| 页面内容 | 0 |
| Sticky 顶栏/工具栏 | 100 |
| 搜索结果、下拉、Popover | 300 |
| 抽屉、模态遮罩 | 500 |
| 模态内容 | 510 |
| Toast | 700 |
| 全局阻断 | 900 |

弹层经 portal/统一浮层根节点管理，避免父级 `transform/overflow` 层叠问题。

## 规则 ID 注册表（本文件 Must 条款）

| ID | 条款（摘录） |
|---|---|
| — | 本文件当前无「必须」级条款（全部为建议/参考） |