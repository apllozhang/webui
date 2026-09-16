# 案例：ale-competitor-web（8088）按 v6 改造 — 过程、失误与可复用清单

> 日期：2026-09-16  
> 对象：内网 `http://10.20.30.203:8088/`（FastAPI + 静态前端，非本仓库骨架）  
> 性质：**业务站落地案例**，供使用本设计体系的 AI / 工程师参考；**不修改 v6.0.0 正式基线**  
> 关联教训：F23–F25（见 `30-governance/lessons.md`）

---

## 1. 背景与目标

| 项 | 内容 |
|---|---|
| 系统 | 网络产品竞品分析（采集 / 归档 / 台账） |
| 原 UI | 深色侧栏 + 自定义色板，与 ALE v6 令牌不一致 |
| 目标 | 对齐 **ALE WebUI v6**：品牌 Logo、设计令牌、14A 数据表、亮暗主题；并可与旧 UI 对照验收 |

**约束**：不改 GitHub 正式 tag / 8091·8095 基线；业务 API 零改动。

---

## 2. 做了什么（终态）

1. **品牌**：侧栏官方彩标（浅）/ 反白标（暗），高 34px，禁止渐变底块（`brand.md` / 品牌素材使用说明）。  
2. **令牌**：`styles.css` 语义色/间距/圆角/字号对齐 `spec-site/css/tokens.css`；`:root.dark` 与规范站暗色一致。  
3. **14A 数据表**：动态表头排序（`aria-sort` + 三态图标）、列宽手柄（拖动 + ←/→ ±10 / Shift ±1）、分页 10/20/50 +「第 x–y 共 z」、防抖搜索与清除、数字 `tabular-nums`、状态「圆点+文字」。  
4. **主题**：顶栏 🌙/☀️ 切换亮暗，`localStorage` 记忆。  
5. **对照**：`/static/legacy.html` = 改造前整页（原 HTML+CSS+JS）；v6 首页按钮跳转。  
6. **部署**：容器重建于 8088；静态资源 `?v=` 防缓存。

---

## 3. 过程失误（必须写入教训）

### 3.1 未先读真源，凭印象调色（→ F23）

第一版手写「接近紫」的 CSS，未打开 `kit/tokens` 生成物与 `data-table.md`。  
用户对照规范站后指出：不是 v6。  
**结论**：改业务 UI 的第一步是读令牌真源与目标链路组件规范，不是改颜色。

### 3.2 14A「看起来像」≠ 实现了（→ data-table 落地清单）

仅换表头底色与边框，未做排序按钮、列宽、分页文案与每页 10/20/50。  
**结论**：列表页按能力表逐项勾选交付，禁止只交视觉壳。

### 3.3 旧 UI 对照不能只切 CSS（→ F24）

`link.disabled` 切换样式，HTML 已是 v6 结构 → 放大镜 SVG 失控、分页类名无样式，整页「变丑」。  
**结论**：对照验收必须 **成对整页**（旧 HTML + 旧 CSS + 旧 JS），不要同页只换 stylesheet。

### 3.4 引用路径与上传文件名不一致（→ F25）

`legacy.html` 引 `app.legacy.js`，上传为 `legacy-app.js` → 侧栏导航全部失效。  
**结论**：部署清单与 HTML `src` 同源；发版后 curl 关键资源做门禁。

### 3.5 全局选择器误伤分页（→ F25）

`select:not(#vendor-filter) { width:100% }` 把「每页」下拉拉成通栏大框。  
**结论**：`width:100%` 限定在 `dialog`/表单容器内；分页、工具栏控件单独紧凑尺寸（规范站 32px 档）。

### 3.6 品牌硬规则被忽略

渐变紫方块包 Logo、浅色底用反白标——违反 `brand.md` §2.1 与品牌素材说明。  
**结论**：浅底 `ale-logo.png`、深底 `ale-logo-white.png`；禁止 CSS 仿制。

### 3.7 缓存导致「改了像没改」

用户浏览器长期缓存旧 HTML。  
**结论**：静态引用加版本参；关键交付说明 Ctrl+F5；容器内资源列表纳入部署自检。

---

## 4. 推荐落地顺序（给后续 AI / 工程师）

```text
1. 读 brand.md、tokens.css、目标组件规范（如 data-table.md）
2. 改 HTML 结构对齐参考实现（toolbar / table-wrap / pagination）
3. 样式只引用 v6 令牌，禁止第二套 hex / 第二套字体栈
4. 按能力表实现交互与 a11y，再刷视觉
5. 亮暗：与规范站 :root.dark 语义对齐
6. 旧 UI 对照：独立 legacy 页（整页成对），禁止同页只切 CSS
7. 部署：资源清单与 HTML 一致；curl 校验 200 + 关键字
```

---

## 5. 对本仓库的文档落点

| 文件 | 变更 |
|---|---|
| `docs/v6/30-governance/lessons.md` | 新增 F23–F25 |
| `docs/v6/20-components/data-table.md` | 「业务站落地检查清单」 |
| `docs/HANDOVER.md` | §8 补 F23–F25 索引 |
| `docs/START-HERE.md` | 教训计数 F1–F25 |
| 本文 | 完整过程与证据索引 |

---

## 6. 证据索引（建设方工作区，非仓库内）

- 部署主机：10.20.30.203:8088（容器 `ale-competitor-web`）  
- 本地源码副本：`F:\AIwork\Xiaomi\Vibe Coding\competitor-web-static\`  
- 旧 UI 资源：`styles.legacy.css` / `app.legacy.js` / `legacy.html`（改造前 docker 拷贝）  
- 品牌资产：`F:\AIwork\Xiaomi\文档处理\ALE-品牌素材\`（与仓库 `spec-site/assets` 哈希一致）

---

## 7. 规则 ID 注册表（本文件 Must 条款）

<!-- BEGIN:must-registry -->
| ID | 条款（摘录） |
|---|---|
| — | 本文件为案例说明，Must 条款落在 lessons.md（F23–F25）与 data-table.md 落地清单 |
<!-- END:must-registry -->
