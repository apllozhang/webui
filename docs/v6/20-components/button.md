---
title: Component：按钮与状态层
id-prefix: CMP-BTN
source: ALE-WEBUI-设计规范-v5.4.md
status: M2 迁移（内容 = v5.4.1 基线，未新增规则）
---
# Component：按钮与状态层


---

## 11. 按钮与链接（含按键动画）

| 类型 | 用途 | 视觉 |
|---|---|---|
| Primary | 页面唯一主下一步 | ALE Purple 实心、白字 |
| Secondary | 次要操作 | 白底、紫或中性边框 |
| Tertiary | 低强调 | 文字按钮或轻背景 |
| Ghost-on-brand | 品牌色底上的幽灵按钮 | 白色 60% 边框、hover 白 12% 底 |
| Danger | 删除等高风险 | 红色，仅危险语义 |

同一可视区通常只有一个 Primary；文案"动词+对象"（创建课程/保存更改/导出记录），不写"确定"。

**标准按键动画（必须，TSSKB 实测规范化）：**

```css
.button {
  min-height: 44px;
  transition: transform var(--motion-fast) ease,
              box-shadow var(--motion-fast) ease,
              background-color var(--motion-fast) ease,
              border-color var(--motion-fast) ease;
}
.button:hover  { transform: translateY(-2px); box-shadow: var(--shadow-hover); }
.button:active { transform: translateY(0);    box-shadow: none; }
```

- 浮起幅度统一 **-2px**（卡片可至 -3px），按下回落归零——"浮起-按压"是全站统一的按钮语言。
- 必须覆盖六态：默认、悬停、键盘焦点、按下、禁用、加载中（加载保留原宽度，图标用旋转指示）。
- 键盘焦点（必须）与鼠标焦点分离：`:focus-visible { outline: 2px solid #6b489d; outline-offset: 2px; }`；输入框鼠标焦点用柔和环 `box-shadow: var(--ring-soft)` + 边框变紫。
- 导航用 `<a>`，操作用 `<button>`；不用可点击 `<div>`。

### 11.1 状态层（State Layer，v5.3，必须）

吸收 M3 state layer 机制：**所有实底交互控件的状态反馈，统一用 on-\* 前景色 × 固定透明度叠加表达**，与变色、阴影、浮起叠加使用。透明度全局只有三档，禁止各组件自行调色：

| 状态 | 透明度 | 令牌 |
|---|---|---|
| 悬停 | 8% | `--state-layer-hover` |
| 键盘焦点 | 10% | `--state-layer-focus` |
| 按下 | 12% | `--state-layer-pressed` |
| 禁用 | 0（不叠加） | — |

参考实现（currentColor 即自动取 on-\* 前景，暗色主题零成本适配）：

```css
.button, .pg-btn { position: relative; }
.button::after, .pg-btn::after {
  content: ""; position: absolute; inset: 0;
  background: currentColor;              /* on-* 前景色 */
  border-radius: inherit;
  opacity: 0; pointer-events: none;
  transition: opacity var(--motion-fast) ease;
}
.button:hover::after,           .pg-btn:hover::after           { opacity: var(--state-layer-hover); }
.button:focus-visible::after,   .pg-btn:focus-visible::after   { opacity: var(--state-layer-focus); }
.button:active::after,          .pg-btn:active::after          { opacity: var(--state-layer-pressed); }
.button:disabled::after,        .pg-btn:disabled::after        { opacity: 0; }
```

适用范围：`.button` 全部变体、`.pg-btn` 分页按钮；卡片/导航沿用浮起与 tint 底表达，不叠加（避免与 border 变色双重反馈）。

**前置条件（必须）**：使用 `::before/::after` 做热区扩展或状态层的控件必须显式 `position: relative`，否则伪元素将相对更外层定位祖先（如 sticky topbar）铺满，造成全区域点击串扰（见附录 F13）。发布前以 `elementFromPoint` 对导航/控件中心做 hit-test 抽查。`--ease-standard` 正名：该曲线即 M3 emphasized 曲线（cubic-bezier(0.2,0,0,1)），令牌别名 `--ease-emphasized` 同值并存的语义名。

## 规则 ID 注册表（本文件 Must 条款）

| ID | 条款（摘录） |
|---|---|
| CMP-BTN-001 | **标准按键动画（必须，TSSKB 实测规范化）：** |
| CMP-BTN-002 | - 必须覆盖六态：默认、悬停、键盘焦点、按下、禁用、加载中（加载保留原宽度，图标用旋转指示）。 |
| CMP-BTN-003 | - 键盘焦点（必须）与鼠标焦点分离：`:focus-visible { outline: 2px solid #6b489d; outline-offset: 2px; }`；输入框鼠标焦点用柔和环  |
| CMP-BTN-004 | ### 11.1 状态层（State Layer，v5.3，必须） |
| CMP-BTN-005 | 吸收 M3 state layer 机制：**所有实底交互控件的状态反馈，统一用 on-\* 前景色 × 固定透明度叠加表达**，与变色、阴影、浮起叠加使用。透明度全局只有三档，禁止各组件自行调色： |
| CMP-BTN-006 | **前置条件（必须）**：使用 `::before/::after` 做热区扩展或状态层的控件必须显式 `position: relative`，否则伪元素将相对更外层定位祖先（如 sticky to |