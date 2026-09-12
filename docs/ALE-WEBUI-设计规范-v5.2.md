# ALE WebUI 设计规范

**版本：v5.2（ALE-WEBUI 标准版）**
**适用对象：** ALE 品牌下 B/S 架构的门户、知识库、业务系统、工作台、管理后台与数据应用
**上游依据：** ALE Corporate Brand Guidelines（September 2025）· 《ALE-WebUI-设计与实现指导规范 v4.1》
**实现参照：** TSSKB（内容门户）· ale-dan-cpl-system（登录 + 数据管理应用）· nvci-lite（向导式工作台）
**后续关联：** 本规范为第一阶段（Web）；第二阶段 Doc、第三阶段 PPT 复用本文档的品牌基础与色彩令牌。

---

## 0. 文档定位与冲突处理

本规范不预设业务模型，定义一套可跨 ALE Web 项目复用的界面语言。冲突时按以下优先级处理：

1. **官方品牌规则**：Logo、名称、官方色、字体、法律声明（附录 D）。
2. **本规范 Web 规则**：设计令牌、无障碍、组件状态、动效、响应式与工程约束。
3. **项目级主题**：在不破坏前两层的前提下增加少量业务语义与组件。
4. **参考实现**：三个参照仓库用于理解落地方式，均不等同于品牌规范。

规则强度分三档：**必须**（品牌正确性、无障碍、高风险误操作）、**建议**（默认采用，偏离需评审说明）、**可选**（按场景决定）。

### 0.1 三种产品形态与参照系统

| 形态 | 典型页面 | 参照系统 |
|---|---|---|
| A. 内容/门户型 | 知识库、培训、产品信息浏览 | TSSKB：静态门户、顶部栏 + 可选侧栏、搜索、长文阅读 |
| B. 应用/工作台型 | 登录、数据管理、筛选、报表、导入 | ale-dan-cpl-system：登录认证、数据表格功能包、文件导入 |
| C. 向导/流程型 | 多步采集、对比、报告生成、批量校验 | nvci-lite：四步向导、对比矩阵、核对弹窗、探测校验 |

一个系统可同时包含多种形态；同一系统内相同组件必须使用相同样式。

---

# 第一部分：品牌基础

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

## 3. 色彩系统

### 3.1 官方品牌色（品牌资产）

| 官方基础色 | 色值 | 用途 |
|---|---:|---|
| ALE Purple（Pantone 267C） | `#6B489D` | 品牌识别、主按钮、重点链接、选中态 |
| Black | `#000000` | 品牌资产、特殊高对比场景 |
| White | `#FFFFFF` | 主背景、反白内容 |

官方色板九个色相各提供 **100/80/60/40/20% 五档**；Web 派生变体只从五档取值，不发明新色。

### 3.2 品牌紫档位（命名规范，必须）

v5.0 的 `--ale-purple-800` 与 TSSKB 的 `--ale-purple-700` 同值异名，本版统一档位命名并固化（令牌名称本身属于规范）：

| 令牌 | 值 | 档位 | 用途 |
|---|---:|---|---|
| `--ale-purple-600` | `#6B489D` | 100% 主紫 | 主按钮、链接、当前态标记 |
| `--ale-purple-700` | `#4F3478` | 80% 深紫 | 悬停/按下、**标题强调色**、反白底上的按钮文字 |
| `--ale-purple-500` | `#7E5CB4` | 60% 浅紫 | 图表序列、hover 边框、大面积填充 |
| `--ale-purple-40` | `#E4D9F3` | 40% | 深色底上的浅紫文字/装饰 |
| `--ale-purple-100` | `#F1ECF7` | 20% 极浅紫 | 导航/搜索结果 hover 浅底、步骤序号圆底、选中行底 |

### 3.3 Web 语义色（派生，必须与品牌色分开命名）

| 语义令牌 | 值 | 用途 |
|---|---:|---|
| `color-action-primary` | `#6B489D` | 主动作背景、选中态 |
| `color-action-primary-hover` | `#4F3478` | 悬停/按下 |
| `color-link` | `#006AA2` | 白底小号正文链接 |
| `color-success` | `#007A73` | 成功 |
| `color-warning` | `#9A4707` | 警告 |
| `color-danger` | `#A50034` | 错误、危险操作 |
| `color-info` | `#006AA2` | 信息提示 |
| `color-text-primary` | `#1A1A1A` | 主正文 |
| `color-text-secondary` | `#4B4D50` | 次级信息 |
| `color-text-muted` | `#616467` | 辅助信息（v5.2 修正：原 `#75787B` 白底 4.44:1 不达 AA） |
| `color-border` | `#D9D9D6` | 主边框、控件描边 |
| `color-border-soft` | `#E9E8E4` | 次级分隔线、列表虚线 |
| `color-surface` | `#FFFFFF` | 卡片、弹层、控件背景 |
| `color-canvas` | `#F7F7F5` | 画布背景 |
| `color-purple-tint` | `#F1ECF7` | 品牌浅底（= `--ale-purple-100`） |

官方亮色（`#0085CA`、`#00B2A9`、`#FF4500` 等）白底对比度不足 4.5:1，只用于大图形、装饰块、状态圆点/图标/边框；白底小字号文字一律用深色派生值。

### 3.4 色彩比例

中性色与白 75–85%；ALE Purple 10–15%；状态/辅助色 ≤10%。颜色不得单独传达状态，必须伴随文字、图标、形状或位置线索。

## 4. 字体与排版

```css
font-family: "Trebuchet MS", "Noto Sans SC", "Microsoft YaHei UI",
  "PingFang SC", "Segoe UI", Arial, sans-serif;          /* 正文 */
font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;  /* 代码 */
```

- Trebuchet 为主字体，Noto Sans 为辅助回退；Web 字体栈不引入远程字体文件。
- 正文字号 ≥16px；仅表格、标签、元数据、高密度控件可用 14px；≤13px 不得承载核心任务信息。

| 角色 | 桌面 | 小屏 | 行高 |
|---|---:|---:|---:|
| 页面标题 h1 | 32px | 26px | 1.2 |
| 区块标题 h2 | 24px | 21px | 1.25 |
| 三级标题 h3 | 19px | 18px | 1.35 |
| 正文 | 16px | 16px | 1.65 |
| 紧凑控件 | 14px | 14px | 1.45 |
| 辅助文字 | 13px | 13px | 1.45 |

- 全部左对齐；标题层级连续不跳级；段落间距大于行间距。
- 每行正文 60–80 个中文字符或 65–85 个拉丁字符。
- **标题强调色**：标题可用 `--ale-purple-700`（深紫）替代近黑，是 TSSKB 清爽风格的关键（建议）；正文与辅助文字保持中性色（必须）。
- **链接下划线**（建议）：`text-decoration-thickness: .08em; text-underline-offset: .18em;`，悬停加深为 purple-700。
- **Eyebrow 引导词**（可选，内容型页面）：紫色小号大写 + 字间距 `.15em`，用于区块标题上方。

## 5. 图像与图标

- 一套线性图标家族（推荐 Lucide），尺寸 16/18/20/24px；不混用多套图标。
- 图标按钮必须有 `aria-label`；品牌 Logo 与功能图标是两类资产，不得混用。
- 图片清晰真实，重要文字不放图片内；内容图片有 `alt`，装饰图片 `alt=""`。

---

# 第二部分：设计令牌与页面结构

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
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-5: 24px; --space-6: 32px; --space-7: 48px;
  --content-max: 1180px;
}
```

> **v5.1 核对修正**：①圆角三档统一为 8/12/16px（v5.0 令牌 6/10/16 与第 7 章文字 6/8–10/12–16 自相矛盾）；②`--ale-purple-800` 更名 `--ale-purple-700`（值不变，与 TSSKB 及官方 80% 档对应）；③阴影由纯黑改为紫灰 `rgb(32 25 46 / …)`；④补 `--color-border-soft`、`--ale-purple-100` 与动效令牌。

项目可扩展语义令牌，但不得改变官方品牌色含义。使用 Tailwind/shadcn 等体系时，先把令牌映射到主题配置（`--background/--card/--muted/--destructive` ↔ 上表语义令牌），再构建组件；亮/暗主题切换即在此映射层完成（见 14A.7）。

## 7. 间距、圆角、阴影

4px 基准网格：图标↔文字 8px；同组控件 12–16px；卡片内边距 16–24px；页面区块 32–48px。圆角三档：小控件 8px（含按钮、输入框）、常规卡片 12px、大型内容卡片/hero 区 16px。阴影三档：常规卡片 `--shadow-sm`；下拉/悬浮面板/搜索结果 `--shadow-md`；悬停浮起 `--shadow-hover`。模态框靠遮罩表达层级。同页最多 2–3 档阴影。

## 8. 页面布局（三形态骨架）

### 8.1 形态 A：内容/门户型（参照 TSSKB）

```text
顶部栏(64px, sticky)：Logo | 主导航 | 用户区          ← 底部 3px 品牌紫边条 + 半透明模糊
内容区(≤1180px)：可选侧栏(300px, sticky) | 页面标题、正文、相关内容、下一步
```

### 8.2 形态 B：应用/工作台型（参照 dan-cpl-system）

```text
顶部栏(60–64px)：Logo | 页面标题 | 全局工具(语言/主题/全屏) | 用户区
主体：主导航 | 页面标题 + 记录数徽标 | 搜索 + 筛选 + 主动作 | 数据表格 | 分页栏
```

### 8.3 形态 C：向导/流程型（参照 nvci-lite）

```text
顶部栏(60–64px)：Logo | 产品名称 | 全局操作
步骤条：步骤 1 选型号 → 2 采集 → 3 对比 → 4 报告（当前步紫色高亮，已完成可点回退，未到步禁用）
工作区：每步一个主任务 + 主按钮位于步骤条右端；跨步数据在切步时保持
```

### 8.4 独立登录页（参照 dan-cpl-system）

- 左右分栏或居中卡片：左侧品牌区（反白 Logo 于品牌紫渐变底 `linear-gradient(118deg, #4F3478, #6B489D 55%, #7E5CB4)` + 一句产品定位），右侧登录表单。
- 表单仅保留必要字段，标签在控件上方，错误紧邻控件。
- 登录按钮 Primary 紫色实心、占满表单宽度、含加载态。
- 页脚放法律声明；登录失败提示不泄露内部细节，保留已输入账号。

### 8.5 通用布局约束

- 内容最大宽度 1180–1280px，高密度应用可放宽；文字阅读区不无限拉宽。
- 面包屑只表示层级，不作步骤进度；步骤进度必须用步骤条组件。
- 主按钮放标题区右侧，小屏移到标题下方。

## 9. 响应式断点

| 断点 | 调整 |
|---:|---|
| ≤1100px | 收紧容器与多列间距；顶栏品牌文字可隐藏 |
| ≤980px | 侧栏转抽屉；步骤条改紧凑横排（仅序号+短名）；三列网格转两列 |
| ≤860px | 顶栏汉堡菜单展开为面板；侧栏并入顶部；两列网格转单列 |
| ≤640px | 列表单列；表格横向滚动或卡片化；hero 图可隐藏 |
| ≤560px | 标题、按钮组、表单纵向布局 |

必须：320px 宽无页面级横向滚动；触控目标 ≥44×44px（TSSKB 按钮 `min-height:44px`）；200% 缩放不重叠不截断。

---

# 第三部分：核心组件与微交互

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

## 14. 表格与数据列表

- 语义化 `table/thead/tbody/th`；数字右对齐（金额用 `tabular-nums`）、文本左对齐；排序表头为按钮并设 `aria-sort`。
- 空态/加载态/错误态必备；行操作靠近行末，低频动作收进菜单；批量操作仅选中行后出现并显示数量。
- 响应式策略：横向滚动 / 优先级隐藏 / 卡片化。
- **对比矩阵（形态 C，参照 nvci-lite）**：分组行 × 产品列；三态判定用"圆点+文字"而非纯颜色；人工核对用模态框并保留判定依据；支持导出。

### 14A. 数据表格交互功能包（形态 B 标配，必须）

源自 ale-dan-cpl-system 实测实现（`useTableFeatures.tsx` / `TablePagination.tsx` / `QuotationList.tsx` / `ThemeContext.tsx` / `i18n/`），采纳时按本节无障碍要求强化：

**14A.1 排序**：表头内放 `<button>`，三态图标——未排序灰色双三角、正序紫色上三角、倒序紫色下三角；当前列设 `aria-sort="ascending|descending"`；再次点击切换方向；数值列按数值比较、文本按 `localeCompare`。

**14A.2 列宽拖动**：表头右缘 1.5px 手柄，hover 显紫色；拖动最小列宽 50px；表格 `table-layout: fixed` + 像素宽度。复杂档推荐用 TanStack Table 实现（`header.getResizeHandler()` + `setColumnSizing`，注意 v8 API 在 header 而非 column 上），手写实现仅限轻量档。**无障碍强化**：手柄加 `role="separator"` + `aria-valuenow`（当前宽）+ `tabindex="0"`，左右方向键 ±10px（Shift+方向键 ±1px 精调）。

**14A.3 文字换行**：单元格内容容器 `overflow-wrap: break-word; white-space: normal;`，长单号/URL/名称不断表。

**14A.4 分页**：页大小 Select（10/20/50，切换回第 1 页）+ "第 x–y 条，共 N 条"（数字千分位）+ 首页/上一页/页码组/下一页/末页；页码 >7 自动折叠为省略号；首末页按钮禁用态清晰。

**14A.5 搜索**：输入防抖 ≤300ms；有内容时显示清除按钮；搜索/筛选变化自动重置页码与勾选；搜索中可显示加载指示。

**14A.6 批量操作**：表头全选 + 行复选（行内点击需 `stopPropagation` 避免触发行跳转）；选中 ≥1 出现批量动作，≥2 可出现对比；批量删除必须走危险确认弹窗，写明数量与后果。

**14A.7 亮/暗主题**：`ThemeProvider` + 根节点 `.dark` class + localStorage 持久化 + ≤300ms 过渡；暗色只在语义令牌映射层实现（第 6 章），暗色值仍从官方色板五档取值，ALE Purple 在暗底上用作按钮底色时验证对比度 ≥4.5:1；支持 `switchable=false` 锁定（对外品牌站可禁用暗色）。

**14A.8 多语言**：i18next 模式，语言选择持久化 localStorage；切换时同步 `<html lang>`；键名用"模块.键"（如 `quotation.status`）；缺失键回退默认语言（zh）；六语言基线 zh/zh-TW/en/ja/es/fr；语言切换器用地球图标 + `aria-label`。

## 15. 状态标签

| 语义 | 文案示例 | 图形色（圆点/图标/边框） | 文字与浅底 |
|---|---|---|---|
| Neutral | 草稿、未开始 | `#B9B8B4` | `#616467` 文字、浅灰底 |
| Info | 进行中、待处理 | `#0085CA` | `#006AA2` 文字、浅蓝底 |
| Success | 已完成、已发布 | `#00B2A9` | `#007A73` 文字、浅青底 |
| Warning | 需关注、即将到期 | `#F59E0B` | `#9A4707` 文字、浅橙底 |
| Danger | 失败、已拒绝 | `#FF4500` | `#A50034` 文字、浅红底 |

官方亮色只用于图形元素；文字一律深色派生值。"圆点+文字"是最稳形态；同一状态跨页面同文案同颜色。

## 16. 空状态、加载与反馈

- 空状态回答：发生了什么、为什么、下一步（首用→"创建第一项"；筛选无果→"清除筛选"；搜索无果→"修改关键词"；任务完成→"返回全部"）。
- 加载：<300ms 不显示动画；局部更新用局部进度；不确定时长用骨架屏（`aria-hidden="true"`），更新区设 `aria-busy`；表格加载行用旋转图标 + "加载中"。
- Toast：成功简短，错误说明影响与动作；普通通知 `role="status"`，紧急错误 `role="alert"`；Toast 不是唯一错误位置。

## 17. 模态框、抽屉与确认

- 简短确认/少量字段→模态框；辅助详情/较长表单→抽屉；复杂/需分享/可返回→独立页面。
- 模态框必须：`role="dialog"` + `aria-modal="true"` + `aria-labelledby`；焦点入内、Tab 圈闭、Esc 可关非强制流程；关闭后焦点返回触发按钮。
- 危险确认写明对象与影响：> 删除"课程草稿"后将无法恢复。已发布内容不受影响。按钮写"取消/删除草稿"，不写"否/是"。
- 批量操作确认写明数量：> 确认删除已选中的 3 条报价？此操作不可恢复。

## 18. 表单

- 默认单列、标签在上；长表单按主题分组；主按钮靠表单末尾；失焦校验而非逐字符报错。
- 提交失败焦点移到错误摘要或首个错误字段；服务端错误保留已输入数据；未保存离开需提示。

---

# 第四部分：数据展示

## 19. 关键数据卡片

指标名 + 当前值与单位 + 对比周期/数据范围；趋势必须说明基线，不只写"上升 12%"。

## 20. 图表

| 任务 | 图表 |
|---|---|
| 随时间变化 | 折线、面积 |
| 类别比较 | 条形、柱状 |
| 构成关系 | 堆叠条形（类别极少可用环形） |
| 分布 | 直方图、箱线 |
| 目标进度 | 进度条、子弹图 |

序列色（与状态语义色彻底分离，白底图形对比 ≥3:1）：

```css
--chart-1: #6b489d;  --chart-2: #0085ca;  --chart-3: #7e5cb4;
--chart-4: #d0006f;  --chart-5: #75787b;
--chart-grid: #d9d9d6;  --chart-axis: #616467;
```

图表有标题与一句话摘要；关键结论不只存在于图形中；复杂图表提供数据表；提示不依赖悬停。同类别跨页面同色。

## 21. 日期、数字与单位

- 产品内日期格式统一；相对时间用于近期，精确时间放详情/tooltip。
- 数值千位分隔、一致小数位；表格金额用 `tabular-nums`；百分比明确口径；时长按尺度取秒/分/时/天；金额显币种。
- 单位与数值之间不换行；单位换算等价关系一致（如 1.28Tbit/s ≡ 1280Gbit/s）。

---

# 第五部分：无障碍、动效与系统状态

## 22. 无障碍基线（必须，WCAG 2.2 AA）

- 普通文字对比 ≥4.5:1，大文字 ≥3:1；键盘可完成全部操作，焦点顺序符合视觉顺序且不被遮挡。
- 唯一明确 `h1`；表单控件有程序化名称；跳转链接直达主内容；`<html lang="zh-CN">`（随语言切换同步）。
- 状态更新走 live region；触控目标 ≥44×44px；支持 `prefers-reduced-motion`。

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

## 24. 系统状态与错误页

覆盖：无权限、内容不存在、连接中断（保留输入可重试）、服务暂不可用（不暴露技术栈）、会话过期（可恢复上下文）。
错误公式：**发生了什么 + 影响 + 现在能做什么**。诊断编号次要位置且可复制。

---

# 第六部分：工程实现

## 25. 样式架构

```text
styles/
├─ tokens.css       # 基础/语义/组件令牌（含 motion、elevation）
├─ reset.css        ├─ base.css       ├─ layout.css
├─ components.css   ├─ content.css    └─ utilities.css
```

- 三种参照实现均可复用：TSSKB（Jinja2 + 自研 CSS，静态门户）、dan-cpl-system（Vite + TS + shadcn/ui 主题化）、nvci-lite（原生 HTML/JS + Express）。框架选择是工程决策，不属于品牌要求。
- 组件 API 暴露语义不暴露视觉：`Button: variant=primary|secondary|tertiary|danger|ghost-on-brand, size, loading`；`Badge: tone=neutral|info|success|warning|danger`。禁止 `purple=true, rounded=12` 式拼装参数。

### 25.1 工程骨架与共享层（ale-webui-kit，必须）

三档产品形态各配一个可直接拷贝的工程骨架，共享层为唯一品牌值来源：

```text
ale-webui-kit/
├─ shared/                  ★ 唯一品牌值来源
│  ├─ css/tokens.css          第 6 章令牌 + 暗色映射（改色只改这里）
│  ├─ css/{base,layout,components}.css
│  ├─ js/{theme,i18n}.js
│  └─ tailwind.preset.js      tokens → Tailwind 映射（复杂档）
├─ tools/sync-shared.mjs    同步 shared/ → 三骨架（改令牌后必须执行）
├─ skeleton-react/          复杂档：Vite+TS+Tailwind+TanStack Table（14A 全功能封装）
├─ skeleton-alpine/         轻量档：vanilla + Alpine.js（本地 vendored，无 CDN 依赖）
└─ skeleton-static/         静态档：Jinja2 + build.py + Pagefind
```

- 复杂档表格推荐 TanStack Table（无头库）：排序/列宽拖动/分页/过滤均为成熟实现，样式用规范类包装；
- 轻量档升级阈值：需要完整 14A 功能包或登录态/权限时，直接迁移复杂档，不在 vanilla 中手搓第二套表格；
- 组件 API 暴露语义：`variant/tone/size`；禁止视觉拼装参数。

### 25.2 部署与交付基线（必须）

- 静态产物可部署性：构建引用**相对路径**（React 用 `base:'./'`），保证可挂载任意子路径；
- 缓存策略：带哈希的图片资产可强缓存（≥7d）；**CSS/JS 用协商缓存（`Cache-Control: no-cache` + etag）**，禁止无哈希文件的长期强缓存（曾导致用户 1 天内拿到过期脚本）；
- 交付物包含 Dockerfile（nginx:alpine）与健康检查端点；容器 `--restart unless-stopped`；
- 官方法律声明随站点页脚交付。

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

## 27. 性能与稳定性

- 首屏只加载必要资源；图片声明宽高并按展示尺寸压缩；字体失败有回退不阻塞。
- 大列表分页/增量/虚拟化并保留键盘与读屏可用；大文件导入必须显示进度与结果摘要（成功 N 条、失败 M 条及原因）。
- 组件在慢请求、空数据、超长文字、多语言、错误响应下结构稳定。
- 全局 `mousemove/mouseup` 监听（列宽拖动）必须在拖动结束后移除；悬停浮起动画只动 `transform`，不触发重排。

---

# 第七部分：验收与治理

## 28. 页面验收清单

**品牌**
- [ ] 官方 Logo 资产、比例、颜色、安全空间正确；命名"品牌在前"
- [ ] 首次公司名写全称 Alcatel-Lucent Enterprise
- [ ] ALE Purple 未大面积滥用（底条/按钮/标题色除外）；页脚法律声明来自官方原文

**结构与视觉**
- [ ] 单页一个主目标一个主动作；标题层级连续；正文 ≥16px
- [ ] 间距/颜色/圆角/阴影/时长全部来自令牌；紫灰阴影非纯黑
- [ ] 非交互元素无浮动/虚假悬停；状态不只靠颜色
- [ ] 内容型顶栏有 3px 紫色底条；当前导航项双线索表达

**交互与动效**
- [ ] 控件覆盖六态；按钮/卡片浮动动画符合 11/12 章标准曲线
- [ ] 14A 功能包齐备：排序(aria-sort)/列宽拖动(键盘可操作)/换行/分页/搜索防抖/批量/主题/多语言
- [ ] 表单错误指出原因与修复；危险操作说明对象、数量、影响、可恢复性

**响应式与无障碍**
- [ ] 320px 与 200% 缩放可完成任务；键盘全操作、焦点可见
- [ ] 对比度 4.5:1（暗色主题同样验证）；图标按钮有 aria-label；模态焦点管理正确；支持 reduced-motion

**内容与数据**
- [ ] 日期/数值/单位/状态文案统一；图表有标题摘要与非颜色区分
- [ ] 表格排序设 aria-sort；导入/导出有结果反馈；示例不含真实凭据

## 29. 验收流程

品牌检查 → 令牌检查 → 组件状态检查 → **动效检查（浮动曲线、时长令牌、reduced-motion）** → 响应式（320/768/1024/1440px + 200%）→ 无障碍（自动化 + 键盘/读屏人工）→ 内容压力测试 → 跨浏览器矩阵。

## 30. 版本治理

- 主版本 = 不兼容变化；次版本 = 新增规则；修订号 = 勘误。项目级偏离记录原因、负责人、影响与复审日期。
- 每次重大版本抽查一个内容型页 + 一个应用型页 + 一个向导型页。

---

# 附录

## A. 最小页面骨架（形态 A，TSSKB 风格）

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>页面标题 | 产品名称 | ALE</title>
  </head>
  <body>
    <a class="skip-link" href="#main">跳到主要内容</a>
    <header class="topbar">
      <a href="/" class="brand" aria-label="产品名称首页">
        <img src="/assets/ale-primary-logo-horizontal.png" alt="Alcatel-Lucent Enterprise" />
      </a>
      <nav class="primary-nav" aria-label="主导航">
        <a href="/" aria-current="page">首页</a>
      </nav>
    </header>
    <main id="main" tabindex="-1">
      <header class="page-header">
        <h1>页面标题</h1>
        <button type="button" class="button button--primary">创建内容</button>
      </header>
    </main>
  </body>
</html>
```

## B. 状态矩阵

| 维度 | 必查 |
|---|---|
| 交互 | 默认、悬停、焦点、按下、禁用、加载 |
| 动效 | 浮起曲线、入场一次性、reduced-motion 降级 |
| 内容 | 空、短文本、长文本、缺失值、多语言 |
| 反馈 | 成功、警告、失败、重试 |
| 输入 | 鼠标、键盘、触摸、辅助技术 |
| 环境 | 小屏、大屏、200% 缩放、减少动效、亮/暗主题 |
| 权限 | 可查看、可编辑、只读、无权限 |

## C. 资料依据

- ALE Corporate Brand Guidelines（September 2025）：`X:\BP 目录\Marketing Resources\ALE Brand\Brand Guidelines\alcatel-lucent-enterprise-brand-guidelines-en.pdf`
- Logo 与模板资产：`X:\BP 目录\Marketing Resources\ALE Brand\`（logos / PPT-templates / Document-templates）
- 上游规范：《ALE-WebUI-设计与实现指导规范 v4.1》；v5.0《ALE-WEBUI-设计规范》
- 实现参照（源码实测）：TSSKB `static/css/{tokens,layout,components,content}.css`（动效与配色归纳来源）· apllozhang/ale-dan-cpl-system（14A 功能包来源）· apllozhang/nvci-lite（形态 C）
- 无障碍基线：WCAG 2.2 AA

## D. 官方品牌硬规则

1. 主紫 Pantone 267C = `#6B489D`（C70 M85 Y0 K0 / R107 G72 B157）。
2. 色板九色 × 五档色调（100/80/60/40/20%）；派生变体只从五档取值。
3. Logo 最小净空 = 圆形符号半径一半；"A" 保持透明；禁止重绘/改色/特效/3D；彩色版浅底、白色反白版深底。
4. 命名"品牌在前"；公司名首现写全称。
5. 页脚法律声明用官方原文整体引用；主字体 Trebuchet，辅助 Noto Sans，Web 不引入远程字体文件。

## E. 后续阶段衔接（Doc / PPT）

- **Doc（第二阶段）**：复用本文档第 2–4 章（Logo、色彩、字体）与 Document-templates 官方模板；文档正文排版沿用第 4 章字号行高表。
- **PPT（第三阶段）**：以 `PBG-2026-library-powerpoint-template.pptx` 与 `PPT-templates` 官方模板为底，色彩令牌沿用第 3 章；深色模板仅用反白 Logo；TSSKB 的品牌紫渐变（`118deg, #4F3478→#6B489D→#7E5CB4`）可用于封面/章节页背景。

## 附录 F：实现验证与踩坑记录（v5.1 → v5.2 落地验证）

以下问题在规范演示站与 ale-webui-kit 的实现、部署、验收过程中实际发生，收录为规范的可执行注意事项：

| # | 问题 | 根因 | 规范化结论 |
|---|---|---|---|
| F1 | 动态渲染表格列宽失效、单元格文字逐字竖排 | `table-layout: fixed` 与 `width: max-content` 组合在动态 DOM 下不稳定 | 固定布局表格必须**显式计算表格总宽**（Σ列宽 + 固定列），并为 `th`/`td` 同步显式像素宽度；复杂档用 TanStack Table |
| F2 | i18n 文案显示原始键名（如 `table.range`） | 插值函数 `args[i++]` 在条件判断与取值处双重自增 | i18n 插值实现必须有单测覆盖多参数替换；缺键回退链 = 当前语言 → 默认语言 → 键名 |
| F3 | 分页页码按钮空白 | 图标分支未渲染数字回退 | 分支渲染必须有 else 分支兜底 |
| F4 | 用户浏览器 1 天内拿不到更新的 JS | 无哈希文件配 `expires 1d` 强缓存 | 见 25.2：无哈希 CSS/JS 一律协商缓存 |
| F5 | 搜索框出现两个清除按钮 | `input[type=search]` 浏览器内置清除 + 自定义清除并存 | 自定义清除按钮时用 `type="text"` |
| F6 | Jinja2 模板渲染报 `'builtin_function_or_method' object is not iterable` | 数据键名 `list`/`items` 与 Python 内建方法冲突 | 模板访问数据统一用下标语法 `data["list"]["items"]`；数据键名避开内建名 |
| F7 | 辅助文字对比度 4.44:1（本规范自身缺陷） | v5.x 统一 TSSKB 灰阶时把 muted 从 `#616467` 浅化为 `#75787B` | v5.2 修正为 `#616467`；任何文字令牌变更必须重跑附录 G 量化自查 |
| F8 | Logo 在子路径部署下 404 | 构建产物内引用绝对路径 `/assets/...` | 25.2 相对路径规则；SPA 用 `base:'./'` |
| F9 | 顶栏图标按钮 40px 与触控目标 44px 冲突 | 自查发现 | 9 章补充例外：桌面指针输入 ≥40px，触控 44px |

## 附录 G：量化自查数据（WCAG 对比度实测，白底/亮色主题）

| 组合 | 对比度 | AA 正文(4.5) | AA 大字(3.0) |
|---|---|---|---|
| 白字 / 主紫按钮 `#FFF`/`#6B489D` | **6.91:1** | PASS | PASS |
| 白字 / 深紫 hover `#FFF`/`#4F3478` | **10.02:1** | PASS | PASS |
| 正文 / 画布 `#1A1A1A`/`#F7F7F5` | **16.23:1** | PASS | PASS |
| 次级文字 / 白面 `#4B4D50`/`#FFF` | **8.48:1** | PASS | PASS |
| 辅助文字 / 白面 `#616467`/`#FFF` | **5.95:1** | PASS | PASS |
| 链接 / 白底 `#006AA2`/`#FFF` | **5.86:1** | PASS | PASS |
| 成功 / 白底 `#007A73`/`#FFF` | **5.21:1** | PASS | PASS |
| 警告 / 白底 `#9A4707`/`#FFF` | **6.41:1** | PASS | PASS |
| 危险 / 白底 `#A50034`/`#FFF` | **7.93:1** | PASS | PASS |
| 主紫作文字 / 白底 `#6B489D`/`#FFF` | **6.91:1** | PASS | PASS |
| 深紫标题 / 白面 `#4F3478`/`#FFF` | **10.02:1** | PASS | PASS |
| 图表浅紫序列 / 白底 `#7E5CB4`/`#FFF` | **5.15:1** | — | PASS(图形) |
| 图表中灰序列 / 白底 `#75787B`/`#FFF` | **4.44:1** | — | PASS(图形) |
| 官方亮蓝图形 / 白底 `#0085CA`/`#FFF` | **4.03:1** | — | PASS(图形) |
| 暗色正文 / 暗画布 `#EFEDF4`/`#171420` | **15.63:1** | PASS | PASS |
| 暗色辅助 / 暗画布 `#9B96AB`/`#171420` | **6.35:1** | PASS | PASS |
| 暗色状态文字（成功/警告/危险/info） | 6.6–8.8:1 | PASS | PASS |

> 说明：非文本图形（状态圆点、图标、边框）按 WCAG 1.4.11 要求 ≥3:1；状态圆点恒与文字并存（规范 15 章），属于冗余表达。中性圆点 `#B9B8B4`（1.99:1）仅作为“冗余图形”使用，信息由同现文字承载。

---

## 版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0–v4.1 | 2026-08-30/31 | 见《v4.1》版本沿革。 |
| v5.0 | 2026-09-11 | 三形态锚定三仓库；新增登录页、向导步骤条、对比矩阵、本地资产路径、附录 E 三阶段衔接。 |
| **v5.1** | 2026-09-12 | **TSSKB 深度学习 + 整体核对优化**：①新增 3.2 品牌紫五档命名规范（修复 v5.0 `purple-800` 与 TSSKB `purple-700` 同值异名）；②新增 `--ale-purple-100` 浅紫 tint、`--color-border-soft` 双档边框、紫灰色调阴影三档与 `--shadow-hover`/`--ring-soft`（清爽感核心来源）；③新增 11/12 章标准按键动画与卡片浮动效果（160ms 浮起 -2px/按压归零曲线全站统一）；④新增 10 章顶栏 3px 品牌紫底条 + 当前导航双线索；⑤23 章动效扩充为四档时长令牌 + 三个统一动效语言 + 浮动只给可交互元素等限制；⑥圆角三档统一 8/12/16（修复 v5.0 令牌与文字矛盾）；⑦标题深紫强调色、链接下划线细节、eyebrow、输入框柔和焦点环；⑧正式收录 14A 数据表格交互功能包（排序/列宽/换行/分页/搜索/批量/亮暗主题/多语言，含无障碍强化）。 |
| **v5.2** | 2026-09-12 | **工程化落地 + 量化自查**：①修正辅助文字对比度缺陷（muted `#75787B` 白底实测 4.44:1 不达 AA，回归 v4.1 值 `#616467`＝5.95:1；`#75787B` 降级为图表序列色专用于图形）；②新增 25.1 工程骨架与共享层（ale-webui-kit 三档骨架 + sync-shared 机制 + TanStack Table 推荐）；③新增 25.2 部署与交付基线（相对路径可移植性、协商缓存策略、Docker 交付）；④新增附录 F 实现验证与踩坑记录、附录 G 量化自查数据（全部令牌对比度实测）；⑤触控目标补充桌面图标按钮 40px 例外；⑥14A.2 补 TanStack v8 实现注。 |

---

*v5.2 · 2026-09-12 · 依据 ALE Corporate Brand Guidelines（September 2025）、v4.1–v5.1 演进、三个实现参照仓库源码实测与 ale-webui-kit 工程落地验证整理*
