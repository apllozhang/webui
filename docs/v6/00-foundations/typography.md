---
title: 字体与排版
id-prefix: FND-TYPE
source: ALE-WEBUI-设计规范-v5.4.md
status: v6.0.0-rc 基线（治理版；实现与试点证据见 docs/release/v6-readiness.md）
---
# 字体与排版
含排版角色 × HTML 语义分层（v5.4）与 Noto Sans SC 自托管规则（附录 D.5/7）。


---

## 4. 字体与排版

```css
/* v5.3：中文主字体 = 自托管 Noto Sans SC（OFL 免费商用，fonts/noto.css）；
   移除 Microsoft YaHei UI 声明（商业版权合规）。西文/数字保持品牌字体 Trebuchet MS。 */
font-family: "Trebuchet MS", "Noto Sans SC", "PingFang SC", sans-serif;
font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;  /* 代码 */
```

**中文自托管规则（必须）**：`fonts/noto.css` 提供 `@font-face`（Noto Sans SC，chinese-simplified 400/500/700，woff2 单文件全量约 1.1MB/字重，`font-display: swap`），随站点自托管（`/fonts/noto/*.woff2`），不引用任何公共 CDN。西文/数字由 Trebuchet MS 承担（品牌字体，Windows/macOS 系统内置）；中文渲染跨平台统一为 Noto Sans SC；PingFang SC 仅作 macOS 加载完成前的回退。禁止在字体栈中声明 Microsoft YaHei / SimHei 等商业授权字体（版权归属方正/中易系，系统内置授权不覆盖嵌入与再分发场景）。

- Trebuchet 为西文/数字主字体（品牌指定，系统内置）；Noto Sans SC 为中文主字体（**自托管 woff2**，随仓库/服务器分发，OFL 协议允许）；`font-display: swap` 保证首屏无阻塞。字体资产更新走 `shared/fonts` + sync 脚本。
- 正文字号 ≥16px；仅表格、标签、元数据、高密度控件可用 14px；≤13px 不得承载核心任务信息。

| 角色 | 桌面 | 小屏 | 行高 |
|---|---:|---:|---:|
| 页面标题 h1 | 32px | 26px | 1.2 |
| 区块标题 h2 | 24px | 21px | 1.25 |
| 三级标题 h3 | 19px | 18px | 1.35 |
| 正文 | 16px | 16px | 1.65 |
| 紧凑控件 | 14px | 14px | 1.45 |
| 辅助文字 | 13px | 13px | 1.45 |

**排版角色与 HTML 语义分层（v5.4，必须）**：视觉尺寸由"角色"决定，HTML 标签只保证语义层级（h1→h2→h3 连续，不得跳级）。同一 HTML 标签可承载不同视觉角色：

| 视觉角色 | 桌面 / 移动 | 用途 | 典型标签 |
|---|---|---|---|
| Display | 44 / 32 | 品牌 Hero 主标题 | h1（配 `.display` 类） |
| Page title | 32 / 26 | 应用页标题 | h1 |
| Section title | 24 / 21 | 一级内容区 | h2 |
| Subsection title | 19 / 18 | 二级内容区 | h3 |
| Card title | 16 / 16 | 卡片内部标题 | h3/h4/strong 均可 |

- 全部左对齐；**HTML 标题层级连续不跳级**；纯导航/装饰分组无可见标题时使用 `sr-only` h2 占位；段落间距大于行间距。
- 每行正文 60–80 个中文字符或 65–85 个拉丁字符。
- **标题强调色**：标题可用 `--ale-purple-700`（深紫）替代近黑，是 TSSKB 清爽风格的关键（建议）；正文与辅助文字保持中性色（必须）。
- **链接下划线**（建议）：`text-decoration-thickness: .08em; text-underline-offset: .18em;`，悬停加深为 purple-700。
- **Eyebrow 引导词**（可选，内容型页面）：紫色小号大写 + 字间距 `.15em`，用于区块标题上方。

## 规则 ID 注册表（本文件 Must 条款）

<!-- BEGIN:must-registry -->
| ID | 条款（摘录） |
|---|---|
| FND-TYPE-001 | **中文自托管规则（必须）**：`fonts/noto.css` 提供 `@font-face`（Noto Sans SC，chinese-simplified 400/500/700，woff2 单文件全量约 1.1MB/字重，`font-display: swap`），随站点自托管（`/fonts/noto/*.woff2`），不引用任何公共 CDN。西文/数字由 Trebuchet MS 承担（品牌字体，Windows/macOS 系统内置）；中文渲染跨平台统一为 Noto Sans SC；PingFang SC 仅作 macOS 加载完成前的回退。禁止在字体栈中声明 Microsoft YaHei / SimHei 等商业授权字体（版权归属方正/中易系，系统内置授权不覆盖嵌入与再分发场景）。 |
| FND-TYPE-002 | **排版角色与 HTML 语义分层（v5.4，必须）**：视觉尺寸由"角色"决定，HTML 标签只保证语义层级（h1→h2→h3 连续，不得跳级）。同一 HTML 标签可承载不同视觉角色： |
| FND-TYPE-003 | - **标题强调色**：标题可用 `--ale-purple-700`（深紫）替代近黑，是 TSSKB 清爽风格的关键（建议）；正文与辅助文字保持中性色（必须）。 |
<!-- END:must-registry -->


<!-- M6-RC/终审裁决增补(2026-09-15):字体方案定版政策 -->

## FND-TYPE-PLAN:字体分发方案定版(A/C 双轨)

- **动态业务系统默认方案 A**(unicode-range 分片,400/700):内容不可穷举,新文字自动覆盖,不依赖构建期字库;当前 Kit 四入口与规范站采用。
- **方案 C**(按文本子集,`build_fonts_text.py` + `fonts-text-corpus.txt`)仅用于**文本可穷举的静态页面**;启用 C 的页面必须通过 `npm run font:cov` 字符覆盖门禁——构建产物出现子集未包含字符即 FAIL(禁止上线后回落系统字体造成混排)。
- 对比与切换入口:规范站 `/fonts-compare.html`(A/C 同屏 + 实时传输量)。
- **不允许为追求 ≤350KB 传输指标牺牲中文字体一致性**(终审明示);350KB 作为长期优化目标而非发布门槛。
