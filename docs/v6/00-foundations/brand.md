---
title: 品牌基础：气质、Logo、名称与法律
id-prefix: FND-BRAND
source: ALE-WEBUI-设计规范-v5.4.md
status: v6.0.0 正式基线（治理版；实现与试点证据见 docs/release/v6-readiness.md）
---
# 品牌基础：气质、Logo、名称与法律
品牌层唯一真相：ALE Corporate Brand Guidelines（September 2025）。本文件含官方硬规则全文（附录 D）。


---

## 1. 设计气质

- **清晰**：层级明确，一眼看到页面目标与下一步动作。
- **可信**：色彩克制、排版稳定、反馈准确，不用夸张装饰制造科技感。
- **开放**：留白充足、结构轻盈，避免封闭拥挤与过度面板化。
- **高效**：常用操作靠近内容，复杂任务分步完成，错误可恢复。
- **有辨识度**：以 ALE Purple、正确 Logo、左对齐排版和少量品牌色建立识别。

品牌感优先级：Logo 与命名正确 > 信息结构清晰 > 紫色用于关键动作 > 细节装饰。

**清爽感的四个来源（实测 TSSKB 归纳，建议默认遵循）：**

1. 大面积中性底（`#F7F7F5` 画布 + 白色表面），品牌紫只出现在关键动作与强调位。
2. 标题使用深紫 `#4F3478` 而非纯黑，正文使用近黑 `#1A1A1A` —— 品牌感来自文字色，而非色块。
3. 两档浅色分隔：主边框 `#D9D9D6` 与次级柔和线 `#E9E8E4`（虚线、内部分隔），避免满屏等重边框。
4. 阴影带紫灰色调（非纯黑），浮起效果轻（-2px 级），克制而可感知。

---

## 2. Logo、名称与资产

### 2.1 Logo 资产来源（必须）

只从官方资产目录取用，禁止截图、重绘、重导出：

```text
X:\BP 目录\Marketing Resources\ALE Brand\ALE-logos\
├─ ale-primary-logo-horizontal.png        # 浅色背景主用
├─ ale-primary-logo-white-200x141.png     # 深色/品牌色背景反白版
├─ al-enterprise-secondary-vertical-white-logo.png
├─ al-enterprise-secondary-vertical-rgb-logo.png
├─ al-enterprise-v-mono-logo.png / al-enterprise-v-rev-logo.png
└─ Alcatel-Lucent Enterprise_main logo_all formats.zip   # PDF/EPS/AI/PNG 原件
```

- 浅色背景用彩色版；深色或品牌色背景只用白色反白版。
- 不拉伸、不倾斜、不裁切、不改色、不加描边/阴影/发光/渐变/动画。
- 最小净空 = Logo 圆形符号半径的一半；符号中字母 "A" 保持透明，不得填充。
- 产品命名组合**品牌在前**：brandmark 在前，产品名置末尾。
- 页面首次出现公司名写作 **Alcatel-Lucent Enterprise**，后续可用 **ALE**。
- 顶栏 Logo 高度建议 34–44px；页脚 26px（TSSKB 实测值，不侵入安全空间）。

### 2.2 法律与商标

对外/正式站点页脚使用官方原文（不改写、不节选，发布前经法务确认）：

> The Alcatel-Lucent name and logo are trademarks of Nokia used under license by ALE. www.al-enterprise.com

版权行：`© Copyright ALE International 2026`。不从旧项目复制声明。

---

## 5. 图像与图标

- 一套线性图标家族（推荐 Lucide），尺寸 16/18/20/24px；不混用多套图标。
- 图标按钮必须有 `aria-label`；品牌 Logo 与功能图标是两类资产，不得混用。
- 图片清晰真实，重要文字不放图片内；内容图片有 `alt`，装饰图片 `alt=""`。

---

# 第二部分：设计令牌与页面结构

---

## D. 官方品牌硬规则

1. 主紫 Pantone 267C = `#6B489D`（C70 M85 Y0 K0 / R107 G72 B157）。
2. 色板九色 × 五档色调（100/80/60/40/20%）；派生变体只从五档取值。
3. Logo 最小净空 = 圆形符号半径一半；"A" 保持透明；禁止重绘/改色/特效/3D；彩色版浅底、白色反白版深底。
4. 命名"品牌在前"；公司名首现写全称。
5. 页脚法律声明用官方原文整体引用；西文主字体 Trebuchet（品牌指定），中文主字体 Noto Sans SC（思源黑体，**SIL OFL 1.1**：免费商用/嵌入/修改/再分发，与品牌指南辅助字体 Noto Sans 同源）。
7. **字体加载预算（v5.4）**：当前为单文件全量方案（400/500/700 三字重各 ≈1.1MB，`font-display: swap` 不阻塞首屏；页面未使用 500 时浏览器不下载，实际首载 ≈2.2MB）。**已列路线图**：v6.0 切换 `unicode-range` 分片（Google Fonts 同款机制，首屏降至数百 KB），并做中文正文/西文数字的真实平台回归；等宽栈已含 `"Noto Sans SC"` 回退，杜绝代码块中文回退宋体。
6. **字体版权红线（v5.3）**：微软雅黑（Microsoft YaHei，方正版权）、黑体（SimHei，中易版权）等商业字体的系统内置授权**不覆盖 Web 嵌入与再分发场景**，字体栈禁止声明；替代方案即自托管 OFL 字体。品牌指南"不引入远程字体文件"条款的准确含义：不引用第三方 CDN，自托管资产不受限。

## 规则 ID 注册表（本文件 Must 条款）

<!-- BEGIN:must-registry -->
| ID | 条款（摘录） |
|---|---|
| FND-BRAND-001 | ### 2.1 Logo 资产来源（必须） |
| FND-BRAND-002 | 只从官方资产目录取用，禁止截图、重绘、重导出： |
| FND-BRAND-003 | - 图标按钮必须有 `aria-label`；品牌 Logo 与功能图标是两类资产，不得混用。 |
| FND-BRAND-004 | 3. Logo 最小净空 = 圆形符号半径一半；"A" 保持透明；禁止重绘/改色/特效/3D；彩色版浅底、白色反白版深底。 |
| FND-BRAND-005 | 6. **字体版权红线（v5.3）**：微软雅黑（Microsoft YaHei，方正版权）、黑体（SimHei，中易版权）等商业字体的系统内置授权**不覆盖 Web 嵌入与再分发场景**，字体栈禁止声明；替代方案即自托管 OFL 字体。品牌指南"不引入远程字体文件"条款的准确含义：不引用第三方 CDN，自托管资产不受限。 |
<!-- END:must-registry -->
