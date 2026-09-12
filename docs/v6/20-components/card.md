---
title: Component：卡片与浮动效果
id-prefix: CMP-CARD
source: ALE-WEBUI-设计规范-v5.4.md
status: M2 迁移（内容 = v5.4.1 基线，未新增规则）
---
# Component：卡片与浮动效果


---

## 12. 卡片与浮动效果

- 卡片组织同一主题信息，不给每段内容加框。
- **可交互卡片浮起（建议，统一曲线）**：

```css
.card--interactive {
  transition: transform var(--motion-fast) ease,
              box-shadow var(--motion-fast) ease,
              border-color var(--motion-fast) ease;
}
.card--interactive:hover  { transform: translateY(-2px);   /* 任务卡可 -3px */
                            border-color: var(--ale-purple-500);
                            box-shadow: var(--shadow-md); }
.card--interactive:active { transform: translateY(0); box-shadow: var(--shadow-sm); }
```

- 非交互卡片**禁止**浮动、抬升、手形光标（对应验收条款"虚假悬停反馈"）。
- 整卡可点时提供 hover + focus 状态并处理内部独立操作（内部按钮 `stopPropagation`）。
- 计划中/未发布的卡片可用虚线边框 + 无阴影弱化表达。

## 规则 ID 注册表（本文件 Must 条款）

| ID | 条款（摘录） |
|---|---|
| CMP-CARD-001 | - 非交互卡片**禁止**浮动、抬升、手形光标（对应验收条款"虚假悬停反馈"）。 |