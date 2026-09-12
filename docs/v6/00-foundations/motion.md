---
title: 动效与微交互
id-prefix: FND-MOTION
source: ALE-WEBUI-设计规范-v5.4.md
status: M2 迁移（内容 = v5.4.1 基线，未新增规则）
---
# 动效与微交互


---

## 23. 动效与微交互（v5.1 重点扩充）

**四档时长令牌**（见第 6 章）：微交互 160ms · 面板 240ms · 入场 560ms（一次性）· 主题切换 ≤300ms。

**标准过渡属性**：只动画 `transform`、`opacity`、`box-shadow`、`border-color`、`background-color`；全站统一 `ease` 或 `--ease-standard` 缓动。

**全站统一的三个动效语言：**

| 场景 | 动效 | 幅度 |
|---|---|---|
| 按钮浮起-按压 | hover `translateY(-2px)`+`--shadow-hover`；active 归零 | -2px |
| 可交互卡片浮起 | hover `translateY(-2~-3px)`+边框变紫+`--shadow-md`；active 归零 | -2~-3px |
| 页面/首屏入场 | `opacity 0→1` + `translateY(12px)→0`，一次性 | 12px |

**限制（必须）：**

- 浮动效果只给可交互元素；同屏同时浮起的元素不超过悬停的那个。
- 入场动画仅用于首屏 hero/页面级容器一次，列表不做逐项延迟入场（防炫技）。
- 下拉/菜单/模态用 180–260ms 的透明度+位移组合，不用弹跳。
- 必须尊重减少动态效果：

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

减少动效后，浮起改用边框变紫 + 背景加深表达，状态变化仍清楚。

## 规则 ID 注册表（本文件 Must 条款）

<!-- BEGIN:must-registry -->
| ID | 条款（摘录） |
|---|---|
| FND-MOTION-001 | **限制（必须）：** |
| FND-MOTION-002 | - 必须尊重减少动态效果： |
<!-- END:must-registry -->
