---
title: 三层设计令牌
id-prefix: FND-TOKEN
source: ALE-WEBUI-设计规范-v5.4.md
status: M2 迁移（内容 = v5.4.1 基线，未新增规则）
---
# 三层设计令牌
v6.0 计划：本文件将由 tokens/*.json 生成（M3 阶段）；当前为手工源。


---

## 6. 三层设计令牌（必须）

```css
:root {
  /* ── Primitive：品牌紫档位（命名见 3.2，名称属于规范） ── */
  --ale-purple-700: #4f3478;   /* 80% 深紫 */
  --ale-purple-600: #6b489d;   /* 100% 主紫 */
  --ale-purple-500: #7e5cb4;   /* 60% 浅紫 */
  --ale-purple-100: #f1ecf7;   /* 20% 极浅紫 */
  --ale-blue: #0085ca; --ale-teal: #00b2a9; --ale-orange: #ff4500; --ale-red: #a50034;

  /* Neutral */
  --neutral-0: #ffffff;
  --neutral-50: #f7f7f5;
  --neutral-200: #d9d9d6;
  --neutral-150: #e9e8e4;
  --neutral-500: #616467;   /* v5.2：辅助文字对比度修正（原 #75787b 为 4.44:1） */
  --neutral-700: #4b4d50;
  --neutral-950: #1a1a1a;

  /* Semantic */
  --color-canvas: var(--neutral-50);
  --color-surface: var(--neutral-0);
  --color-text-primary: var(--neutral-950);
  --color-text-secondary: var(--neutral-700);
  --color-text-muted: var(--neutral-500);
  --color-border: var(--neutral-200);
  --color-border-soft: var(--neutral-150);
  --color-action: var(--ale-purple-600);
  --color-action-hover: var(--ale-purple-700);
  --color-purple-tint: var(--ale-purple-100);

  /* Elevation（紫灰色调，不用纯黑） */
  --shadow-sm: 0 1px 3px rgb(32 25 46 / 8%);
  --shadow-md: 0 10px 30px rgb(50 36 76 / 14%);
  --shadow-hover: 0 10px 22px rgb(32 25 46 / 20%);   /* 悬停浮起专用 */
  --ring-soft: 0 0 0 3px rgb(107 72 157 / 15%);      /* 输入框鼠标焦点环 */

  /* Motion */
  --motion-fast: 160ms;    /* 按钮/卡片/链接过渡 */
  --motion-panel: 240ms;   /* 菜单/抽屉/模态 */
  --motion-enter: 560ms;   /* 页面/首屏一次性入场，≤600ms */
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);

  /* Component */
  --button-primary-bg: var(--color-action);
  --button-primary-bg-hover: var(--color-action-hover);
  --input-border: var(--color-border);
  --card-bg: var(--color-surface);

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;

  /* 控件尺寸（v5.4 P0-3） */
  --control-height-compact: 36px;
  --control-height-default: 44px;
  --hit-target-min: 44px;
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-5: 24px; --space-6: 32px; --space-7: 48px;
  --content-max: 1180px;
}
```

> **v5.1 核对修正**：①圆角三档统一为 8/12/16px（v5.0 令牌 6/10/16 与第 7 章文字 6/8–10/12–16 自相矛盾）；②`--ale-purple-800` 更名 `--ale-purple-700`（值不变，与 TSSKB 及官方 80% 档对应）；③阴影由纯黑改为紫灰 `rgb(32 25 46 / …)`；④补 `--color-border-soft`、`--ale-purple-100` 与动效令牌。

项目可扩展语义令牌，但不得改变官方品牌色含义。使用 Tailwind/shadcn 等体系时，先把令牌映射到主题配置（`--background/--card/--muted/--destructive` ↔ 上表语义令牌），再构建组件；亮/暗主题切换即在此映射层完成（见 14A.7）。

## 规则 ID 注册表（本文件 Must 条款）

| ID | 条款（摘录） |
|---|---|
| FND-TOKEN-001 | ## 6. 三层设计令牌（必须） |