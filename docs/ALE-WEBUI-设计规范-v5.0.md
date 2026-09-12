# ALE WebUI 设计规范

**版本：v5.0（ALE-WEBUI 标准版）**
**适用对象：** ALE 品牌下 B/S 架构的门户、知识库、业务系统、工作台、管理后台与数据应用
**上游依据：** ALE Corporate Brand Guidelines（September 2025）· 《ALE-WebUI-设计与实现指导规范 v4.1》
**实现参照：** TSSKB（内容门户）· ale-dan-cpl-system（登录 + 数据管理应用）· nvci-lite（向导式工作台）
**后续关联：** 本规范为第一阶段（Web）；第二阶段 Doc、第三阶段 PPT 将复用本文档的品牌基础与色彩令牌。

---

## 0. 文档定位与冲突处理

本规范不预设业务模型，定义一套可跨 ALE Web 项目复用的界面语言。冲突时按以下优先级处理：

1. **官方品牌规则**：Logo、名称、官方色、字体、法律声明（附录 D）。
2. **本规范 Web 规则**：设计令牌、无障碍、组件状态、响应式与工程约束。
3. **项目级主题**：在不破坏前两层的前提下增加少量业务语义与组件。
4. **参考实现**：三个参照仓库用于理解落地方式，均不等同于品牌规范。

规则强度分三档：**必须**（品牌正确性、无障碍、高风险误操作）、**建议**（默认采用，偏离需评审说明）、**可选**（按场景决定）。

### 0.1 三种产品形态与参照系统

| 形态 | 典型页面 | 参照系统 |
|---|---|---|
| A. 内容/门户型 | 知识库、培训、产品信息浏览 | TSSKB：静态门户、顶部栏 + 可选侧栏、搜索、长文阅读 |
| B. 应用/工作台型 | 登录、数据管理、筛选、报表、导入 | ale-dan-cpl-system：登录认证、数据展示、筛选搜索、文件导入 |
| C. 向导/流程型 | 多步采集、对比、报告生成、批量校验 | nvci-lite：四步向导、对比矩阵、核对弹窗、探测校验 |

一个系统可同时包含多种形态（如 dan-cpl 系统含登录页 B + 向导页 C）；同一系统内相同组件必须使用相同样式。

---

# 第一部分：品牌基础

## 1. 设计气质

- **清晰**：层级明确，一眼看到页面目标与下一步动作。
- **可信**：色彩克制、排版稳定、反馈准确，不用夸张装饰制造科技感。
- **开放**：留白充足、结构轻盈，避免封闭拥挤与过度面板化。
- **高效**：常用操作靠近内容，复杂任务分步完成，错误可恢复。
- **有辨识度**：以 ALE Purple、正确 Logo、左对齐排版和少量品牌色建立识别，而不是把页面染成紫色。

品牌感优先级：Logo 与命名正确 > 信息结构清晰 > 紫色用于关键动作 > 细节装饰。

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

### 2.2 法律与商标

对外/正式站点页脚使用官方原文（不改写、不节选，发布前经法务确认）：

> The Alcatel-Lucent name and logo are trademarks of Nokia used under license by ALE. www.al-enterprise.com

版权行：`© Copyright ALE International 2026`（格式 `© Copyright [ALE 实体名] [年份]`）。不从旧项目复制声明。

## 3. 色彩系统

### 3.1 官方品牌色（品牌资产）

| 官方基础色 | 色值 | 用途 |
|---|---:|---|
| ALE Purple（Pantone 267C） | `#6B489D` | 品牌识别、主按钮、重点链接、选中态 |
| Black | `#000000` | 品牌资产、特殊高对比场景 |
| White | `#FFFFFF` | 主背景、反白内容 |

官方色板九个色相各提供 **100/80/60/40/20% 五档**；Web 派生变体只从五档取值，不发明新色。

### 3.2 Web 语义色（派生，必须与品牌色分开命名）

| 语义令牌 | 值 | 用途 |
|---|---:|---|
| `color-action-primary` | `#6B489D` | 主动作背景、选中态 |
| `color-action-primary-hover` | `#4F3478` | 悬停/按下 |
| `color-link` | `#006AA2` | 白底小号正文链接 |
| `color-success` | `#007A73` | 成功 |
| `color-warning` | `#9A4707` | 警告 |
| `color-danger` | `#A50034` | 错误、危险操作 |
| `color-info` | `#006AA2` | 信息提示 |
| `color-text-primary` | `#1A1A1A` | 主正文、标题 |
| `color-text-secondary` | `#4B4D50` | 次级信息 |
| `color-text-muted` | `#616467` | 辅助信息 |
| `color-border` | `#D9D9D6` | 边框、分隔线 |
| `color-surface` | `#FFFFFF` | 卡片、弹层、控件背景 |
| `color-canvas` | `#F6F6F4` | 画布背景 |

官方亮色（`#0085CA`、`#00B2A9`、`#FF4500` 等）白底对比度不足 4.5:1，只用于大图形、装饰块、状态圆点/图标/边框；白底小字号文字一律用上表深色派生值。

### 3.3 色彩比例

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
- 内容型页面可给 h2 加紫色左标；应用型页面不重复该装饰。

## 5. 图像与图标

- 一套线性图标家族（推荐 Lucide），尺寸 16/18/20/24px；不混用多套图标。
- 图标按钮必须有 `aria-label`；品牌 Logo 与功能图标是两类资产，不得混用。
- 图片清晰真实，重要文字不放图片内；内容图片有 `alt`，装饰图片 `alt=""`。

---

# 第二部分：设计令牌与页面结构

## 6. 三层设计令牌（必须）

```css
:root {
  /* Primitive */
  --ale-purple-600: #6b489d;
  --ale-purple-800: #4f3478;
  --neutral-0: #ffffff;
  --neutral-50: #f6f6f4;
  --neutral-200: #d9d9d6;
  --neutral-500: #616467;
  --neutral-700: #4b4d50;
  --neutral-950: #1a1a1a;

  /* Semantic */
  --color-canvas: var(--neutral-50);
  --color-surface: var(--neutral-0);
  --color-text-primary: var(--neutral-950);
  --color-text-secondary: var(--neutral-700);
  --color-text-muted: var(--neutral-500);
  --color-border: var(--neutral-200);
  --color-action: var(--ale-purple-600);
  --color-action-hover: var(--ale-purple-800);

  /* Component */
  --button-primary-bg: var(--color-action);
  --button-primary-bg-hover: var(--color-action-hover);
  --input-border: var(--color-border);
  --card-bg: var(--color-surface);

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --shadow-sm: 0 1px 3px rgb(0 0 0 / 8%);
  --shadow-md: 0 8px 24px rgb(0 0 0 / 12%);
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-5: 24px; --space-6: 32px; --space-7: 48px;
  --content-max: 1180px;
}
```

项目可扩展语义令牌，但不得改变官方品牌色含义（如不得把 ALE Purple 当错误色）。使用 Tailwind/shadcn 等体系时，先把令牌映射到主题配置（参考 dan-cpl 的 shadcn 集成方式），再构建组件。

## 7. 间距、圆角、阴影

4px 基准网格：图标↔文字 8px；同组控件 12–16px；卡片内边距 16–24px；页面区块 32–48px。圆角：小控件 6px；输入框/按钮/常规卡片 8–10px；大型内容卡片 12–16px。常规卡片用边框或极浅阴影；下拉/悬浮面板中等阴影；模态框靠遮罩表达层级。同页最多 2–3 档阴影。

## 8. 页面布局（三形态骨架）

### 8.1 形态 A：内容/门户型（参照 TSSKB）

```text
顶部栏(60–64px)：Logo | 主导航或搜索 | 用户区
内容区(≤1180px)：可选侧栏(240–300px，可收起) | 页面标题、正文、相关内容、下一步
```

### 8.2 形态 B：应用/工作台型（参照 dan-cpl-system）

```text
顶部栏(60–64px)：Logo | 产品名称 | 全局操作 | 用户区
主体：主导航 | 页面标题 + 主动作(标题右侧) | 筛选/搜索 | 工具栏 | 数据工作区
```

### 8.3 形态 C：向导/流程型（参照 nvci-lite）

```text
顶部栏(60–64px)：Logo | 产品名称 | 全局操作
步骤条：步骤 1 选型号 → 2 采集 → 3 对比 → 4 报告（当前步高亮紫色，已完成步可点回退，未到步禁用）
工作区：每步一个主任务 + 主按钮位于步骤条右端；跨步数据在切步时保持
```

### 8.4 独立登录页（参照 dan-cpl-system）

- 左右分栏或居中卡片：左侧品牌区（反白 Logo 于深色/品牌色底 + 一句产品定位），右侧登录表单。
- 表单仅保留必要字段（账号、密码、可选验证码），标签在控件上方，错误紧邻控件。
- 登录按钮使用 Primary 紫色实心，占满表单宽度，含加载态。
- 品牌区禁止使用非官方插画；页脚放法律声明。
- 登录失败提示不区分"账号不存在/密码错误"以外的内部细节，保留已输入账号。

### 8.5 通用布局约束

- 内容最大宽度 1180–1280px，高密度应用可放宽；文字阅读区不无限拉宽。
- 面包屑只表示层级，不作步骤进度；步骤进度必须用步骤条组件。
- 主按钮放标题区右侧，小屏移到标题下方。

## 9. 响应式断点

| 断点 | 调整 |
|---:|---|
| ≤1100px | 收紧容器与多列间距 |
| ≤980px | 侧栏转抽屉；步骤条改紧凑横排（仅序号+短名） |
| ≤860px | 双列改单列，工具栏允许换行 |
| ≤640px | 列表单列；表格横向滚动或卡片化 |
| ≤560px | 标题、按钮组、表单纵向布局 |

必须：320px 宽无页面级横向滚动；触控目标 ≥44×44px；200% 缩放不重叠不截断。

---

# 第三部分：核心组件

## 10. 顶部栏与导航

- 当前项同时用颜色 + 字重或标记表达；键盘焦点可见；折叠菜单设 `aria-expanded`；移动端菜单 Esc 可退、焦点不落遮罩后；Logo 链接可访问名称表达首页。

## 11. 按钮与链接

| 类型 | 用途 | 视觉 |
|---|---|---|
| Primary | 页面唯一主下一步 | ALE Purple 实心、白字 |
| Secondary | 次要操作 | 白底、紫或中性边框 |
| Tertiary | 低强调 | 文字按钮或轻背景 |
| Danger | 删除等高风险 | 红色，仅危险语义 |

- 同一可视区通常只有一个 Primary；文案"动词+对象"（创建课程/保存更改/导出记录），不写"确定"。
- 必须覆盖：默认、悬停、键盘焦点、按下、禁用、加载中（加载保留原宽度）。
- `:focus-visible { outline: 2px solid #6b489d; outline-offset: 2px; }`
- 导航用 `<a>`，操作用 `<button>`；不用可点击 `<div>`。

## 12. 卡片

- 卡片组织同一主题信息，不给每段内容加框；非交互卡片不抬升、不显手形光标。
- 整卡可点时提供悬停/焦点状态并处理内部独立操作。

## 13. 输入、搜索与筛选

- 可见标签在控件上方，placeholder 不替代标签；必填有标记并解释含义；错误紧邻控件并说明修复方法。

```html
<label for="title">标题</label>
<input id="title" aria-describedby="title-help title-error" aria-invalid="true" />
<p id="title-help">使用能准确描述内容的简短名称。</p>
<p id="title-error" role="alert">请输入标题。</p>
```

- 搜索用 `<form role="search">`；清除按钮仅有内容时出现（`aria-label="清除搜索"`）。
- 活跃筛选可见、可逐个移除；筛选是即时更新还是点"应用"更新必须明确；"重置"只清筛选不动用户数据。

## 14. 表格与数据列表

- 语义化 `table/thead/tbody/th`；数字右对齐、文本左对齐；排序表头为按钮并设 `aria-sort`。
- 空态/加载态/错误态必备；行操作靠近行末，低频动作收进菜单；批量操作仅选中行后出现并显示数量。
- 响应式策略：横向滚动 / 优先级隐藏 / 卡片化。
- **对比矩阵（形态 C，参照 nvci-lite）**：分组行 × 产品列；三态判定（通过/不通过/待核对）用"圆点+文字"而非纯颜色；人工核对用模态框并保留判定依据；支持导出（Excel/Word/Markdown）。

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
- 加载：<300ms 不显示动画；局部更新用局部进度；不确定时长用骨架屏（`aria-hidden="true"`），更新区设 `aria-busy`。
- Toast：成功简短（"更改已保存"），错误说明影响与动作（"导入失败，请检查文件格式后重试"）；普通通知 `role="status"`，紧急错误 `role="alert"`；Toast 不是唯一错误位置。

## 17. 模态框、抽屉与确认

- 简短确认/少量字段→模态框；辅助详情/较长表单→抽屉；复杂/需分享/可返回→独立页面。
- 模态框必须：`role="dialog"` + `aria-modal="true"` + `aria-labelledby`；打开后焦点入内、Tab 圈闭、Esc 可关非强制流程；关闭后焦点返回触发按钮。
- 危险确认写明对象与影响：> 删除"课程草稿"后将无法恢复。已发布内容不受影响。按钮写"取消/删除草稿"，不写"否/是"。

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
--chart-1: #6b489d;  /* 品牌紫：默认第一序列 */
--chart-2: #0085ca;  /* ALE 蓝 */
--chart-3: #7e5cb4;  /* 同族浅紫 */
--chart-4: #d0006f;  /* 品红 */
--chart-5: #75787b;  /* 中灰：次要系列与基准 */
--chart-grid: #d9d9d6; --chart-axis: #616467;
```

图表有标题与一句话摘要；关键结论不只存在于图形中；复杂图表提供数据表；提示不依赖悬停。同类别跨页面同色。

## 21. 日期、数字与单位

- 产品内日期格式统一；相对时间用于近期，精确时间放详情/tooltip。
- 数值千位分隔、一致小数位；百分比明确口径；时长按尺度取秒/分/时/天；金额显币种。
- 单位与数值之间不换行；单位换算等价关系要一致（如 1.28Tbit/s ≡ 1280Gbit/s）。

---

# 第五部分：无障碍、动效与系统状态

## 22. 无障碍基线（必须，WCAG 2.2 AA）

- 普通文字对比 ≥4.5:1，大文字 ≥3:1；键盘可完成全部操作，焦点顺序符合视觉顺序且不被遮挡。
- 唯一明确 `h1`；表单控件有程序化名称；跳转链接直达主内容；`<html lang="zh-CN">`。
- 状态更新走 live region；触控目标 ≥44×44px；支持 `prefers-reduced-motion`。

## 23. 动效

- 微交互 120–180ms；面板/菜单/模态 180–260ms；标准缓动；只动画 `transform` 与 `opacity`。

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

## 24. 系统状态与错误页

覆盖：无权限、内容不存在、连接中断（保留输入可重试）、服务暂不可用（不暴露技术栈）、会话过期（可恢复上下文）。
错误公式：**发生了什么 + 影响 + 现在能做什么**。诊断编号次要位置且可复制。

---

# 第六部分：工程实现

## 25. 样式架构

```text
styles/
├─ tokens.css       # 基础/语义/组件令牌
├─ reset.css        ├─ base.css       ├─ layout.css
├─ components.css   ├─ content.css    └─ utilities.css
```

- 三种参照实现均可复用：TSSKB（Jinja2 + 自研 CSS，静态门户）、dan-cpl-system（Vite + TS + shadcn/ui 主题化）、nvci-lite（原生 HTML/JS + Express）。框架选择是工程决策，不属于品牌要求。
- 组件 API 暴露语义不暴露视觉：`Button: variant=primary|secondary|tertiary|danger, size, loading`；`Badge: tone=neutral|info|success|warning|danger`。禁止 `purple=true, rounded=12` 式拼装参数。

## 26. z-index 层级

| 层级 | 值 |
|---|---:|
| 页面内容 | 0 |
| Sticky 顶栏/工具栏 | 100 |
| 下拉、Popover | 300 |
| 抽屉、模态遮罩 | 500 |
| 模态内容 | 510 |
| Toast | 700 |
| 全局阻断 | 900 |

弹层经 portal/统一浮层根节点管理，避免父级 `transform/overflow` 层叠问题。

## 27. 性能与稳定性

- 首屏只加载必要资源；图片声明宽高并按展示尺寸压缩；字体失败有回退不阻塞。
- 大列表分页/增量/虚拟化并保留键盘与读屏可用；大文件导入（形态 B/C）必须显示进度与结果摘要（成功 N 条、失败 M 条及原因）。
- 组件在慢请求、空数据、超长文字、多语言、错误响应下结构稳定。

---

# 第七部分：验收与治理

## 28. 页面验收清单

**品牌**
- [ ] 官方 Logo 资产、比例、颜色、安全空间正确；命名"品牌在前"
- [ ] 首次公司名写全称 Alcatel-Lucent Enterprise
- [ ] ALE Purple 未大面积滥用；页脚法律声明来自官方原文

**结构与视觉**
- [ ] 单页一个主目标一个主动作；标题层级连续；正文 ≥16px
- [ ] 间距/颜色来自令牌；非交互卡片无虚假悬停；状态不只靠颜色

**交互**
- [ ] 控件覆盖六态（默认/悬停/焦点/按下/禁用/加载）
- [ ] 表单错误指出原因与修复；危险操作说明对象、影响、可恢复性
- [ ] 空/加载/成功/失败/无权限均有设计；向导可回退且跨步数据保持

**响应式与无障碍**
- [ ] 320px 与 200% 缩放可完成任务；键盘全操作、焦点可见
- [ ] 对比度 4.5:1；图标按钮有 aria-label；模态焦点管理正确；支持 reduced-motion

**内容与数据**
- [ ] 日期/数值/单位/状态文案统一；图表有标题摘要与非颜色区分
- [ ] 表格排序设 aria-sort；导入/导出有结果反馈；示例不含真实凭据

## 29. 验收流程

品牌检查 → 令牌检查 → 组件状态检查 → 响应式（320/768/1024/1440px + 200%）→ 无障碍（自动化 + 键盘/读屏人工）→ 内容压力测试（空/长文/多语言/大数字/失败响应）→ 跨浏览器矩阵。

## 30. 版本治理

- 主版本 = 不兼容变化；次版本 = 新增规则；修订号 = 勘误。项目级偏离记录原因、负责人、影响与复审日期。
- 每次重大版本抽查一个内容型页 + 一个应用型页 + 一个向导型页，防止规范只适合单一形态。

---

# 附录

## A. 最小页面骨架（形态 B）

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
      <a href="/" aria-label="产品名称首页">
        <img src="/assets/ale-primary-logo-horizontal.png" alt="Alcatel-Lucent Enterprise" />
      </a>
      <nav aria-label="主导航"></nav>
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
| 内容 | 空、短文本、长文本、缺失值、多语言 |
| 反馈 | 成功、警告、失败、重试 |
| 输入 | 鼠标、键盘、触摸、辅助技术 |
| 环境 | 小屏、大屏、200% 缩放、减少动效 |
| 权限 | 可查看、可编辑、只读、无权限 |

## C. 资料依据

- ALE Corporate Brand Guidelines（September 2025）：`X:\BP 目录\Marketing Resources\ALE Brand\Brand Guidelines\alcatel-lucent-enterprise-brand-guidelines-en.pdf`
- Logo 与模板资产：`X:\BP 目录\Marketing Resources\ALE Brand\`（logos / PPT-templates / Document-templates）
- 上游规范：《ALE-WebUI-设计与实现指导规范 v4.1》
- 实现参照：github.com/apllozhang/TSSKB（形态 A）· apllozhang/ale-dan-cpl-system（形态 B + 登录页）· apllozhang/nvci-lite（形态 C）
- 无障碍基线：WCAG 2.2 AA

## D. 官方品牌硬规则

1. 主紫 Pantone 267C = `#6B489D`（C70 M85 Y0 K0 / R107 G72 B157）。
2. 色板九色 × 五档色调（100/80/60/40/20%）；派生变体只从五档取值。
3. Logo 最小净空 = 圆形符号半径一半；"A" 保持透明；禁止重绘/改色/特效/3D；彩色版浅底、白色反白版深底。
4. 命名"品牌在前"；公司名首现写全称。
5. 页脚法律声明用官方原文整体引用；主字体 Trebuchet，辅助 Noto Sans，Web 不引入远程字体文件。

## E. 后续阶段衔接（Doc / PPT）

- **Doc（第二阶段）**：复用本文档第 2–4 章（Logo、色彩、字体）与 Document-templates 官方模板；文档正文排版沿用第 4 章字号行高表。
- **PPT（第三阶段）**：以 `PBG-2026-library-powerpoint-template.pptx` 与 `PPT-templates` 官方模板为底，色彩令牌沿用第 3 章；深色模板仅用反白 Logo。

---

## 版本沿革

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0–v4.1 | 2026-08-30/31 | 见《v4.1》版本沿革：从 TSSKB 实测归纳 → 证据分层 → 品牌核实 → 通用化重构 → 勘误补全。 |
| **v5.0** | 2026-09-11 | 以 v4.1 为底，面向"WEB→Doc→PPT"三阶段交付重组：①新增三种产品形态（门户/应用/向导）分别锚定 TSSKB、dan-cpl-system、nvci-lite 参照边界；②新增独立登录页规范（8.4）与向导步骤条规范（8.3）；③新增对比矩阵组件（14 章）与批量导入进度/结果摘要要求（27 章）；④新增本地品牌资产路径清单（2.1），Logo 使用落到具体文件；⑤新增单位换算一致性要求（21 章）；⑥新增附录 E 三阶段衔接，为 Doc/PPT 复用预留接口。 |

---

*v5.0 · 2026-09-11 · 依据 ALE Corporate Brand Guidelines（September 2025）、v4.1 与三个实现参照仓库整理*
