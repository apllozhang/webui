---
title: 无障碍基线（WCAG 2.2 AA）
id-prefix: GOV-A11Y
source: ALE-WEBUI-设计规范-v5.4.md
status: v6.0.0-rc 基线（治理版；实现与试点证据见 docs/release/v6-readiness.md）
---
# 无障碍基线（WCAG 2.2 AA）


---

## 22. 无障碍基线（必须，WCAG 2.2 AA）

- 普通文字对比 ≥4.5:1，大文字 ≥3:1；键盘可完成全部操作，焦点顺序符合视觉顺序且不被遮挡。
- 唯一明确 `h1`；表单控件有程序化名称；跳转链接直达主内容；`<html lang="zh-CN">`（随语言切换同步）。
- 状态更新走 live region；触控目标 ≥44×44px；支持 `prefers-reduced-motion`。

## 规则 ID 注册表（本文件 Must 条款）

<!-- BEGIN:must-registry -->
| ID | 条款（摘录） |
|---|---|
| GOV-A11Y-001 | ## 22. 无障碍基线（必须，WCAG 2.2 AA） |
<!-- END:must-registry -->
