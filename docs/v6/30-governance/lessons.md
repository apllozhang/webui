---
title: 踩坑登记簿（附录 F 全文）
id-prefix: GOV-LESSON
source: ALE-WEBUI-设计规范-v5.4.md
status: v6.0.0-rc 基线（治理版；实现与试点证据见 docs/release/v6-readiness.md）
---
# 踩坑登记簿（附录 F 全文）


---

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
| F9 | 顶栏图标按钮 40px 与触控目标 44px 冲突 | 外部评审实测（42–43 个元素 <44px） | v5.4 统一口径：可见高度可 32/36/40px（compact 令牌），**命中热区一律 ≥44px**（伪元素扩展：排序 -11px、分页 -6px、图标 -2px、复选框 -14px）；例外不再藏附录，正文 9 章为准 |
| F10 | 320px 视口页面级溢出 10px（根节点 330px） | 令牌区网格 `minmax(320px,1fr)` 强制最小列宽 > 可视宽 | 网格列一律 `minmax(min(Npx,100%),1fr)` 钳制；表格外层 `min-width:0; max-width:100%`；320px 纳入发布检查 |
| F11 | 页面元素字体命中 Times New Roman / Arial（评审实测） | BUTTON 等替换元素不继承字体，`.icon-btn` 未写 `font:inherit` | 所有按钮类必须 `font:inherit`；等宽栈补 `"Noto Sans SC"` 中文回退；纳入抽查 |
| F12 | 演示站 title 为 v5.1、README 称 v5.2，文档已 v5.3 | 版本号手工散布多处，无单一真源 | P0-1：`design-system.version.json` + 发布一致性检查（治理章） |
| F13 | **点击导航链接实际触发主题/语言切换（上线后用户发现）** | 热区扩展 `.icon-btn::before { position:absolute; inset:0 }` 时控件缺 `position:relative`，伪元素相对定位祖先 `.topbar` 铺满整个顶栏，形成全栏透明热区层 | **铁律：任何用伪元素做热区/状态层的控件，必须同时显式声明 `position:relative`**（已补入 9 章/11.1 实现代码）；发布前 hit-test 抽查：`elementFromPoint(链接中心)` 必须命中链接自身 |
| F16 | 文本门禁在 Windows autocrlf 检出上假报漂移（`rules:check` 报 23 文件 DRIFT，同一命令在 CI 为绿；M5-0.1） | scan-rules.mjs 读文件未做 EOL 规范化：autocrlf 检出为 CRLF，重建的 LF 注册区段与 CRLF 原文逐字节比对必不一致 | 文本门禁读文件一律先做 EOL 规范化（`\r\n`→`\n`）再比对/写回；仓库以 `.gitattributes` 锁 `*.md eol=lf` 根治 |
| F17 | 生成链产物未被下游真实消费验证过：preset 字体栈生成为非法 JS（裸 `sans-serif`/`Consolas` 标识符），M4-6 sync-shared 用生成版覆盖手写版后 skeleton-react 构建才暴露 | build-tokens.mjs 的 fontFamily 生成用恒等 map（本意是加引号），M3 起即坏；生成链从未跑过一次真实下游构建 | 生成物要有至少一次下游真实消费验证（构建/渲染）；fontFamily 改为字符串形式（JSON.stringify），泛型名保持非引号的 CSS 语义 |

## 规则 ID 注册表（本文件 Must 条款）

<!-- BEGIN:must-registry -->
| ID | 条款（摘录） |
|---|---|
| GOV-LESSON-001 | \| F1 \| 动态渲染表格列宽失效、单元格文字逐字竖排 \| `table-layout: fixed` 与 `width: max-content` 组合在动态 DOM 下不稳定 \| 固定布局表格必须**显式计算表格总宽**（Σ列宽 + 固定列），并为 `th`/`td` 同步显式像素宽度；复杂档用 TanStack Table \| |
| GOV-LESSON-002 | \| F2 \| i18n 文案显示原始键名（如 `table.range`） \| 插值函数 `args[i++]` 在条件判断与取值处双重自增 \| i18n 插值实现必须有单测覆盖多参数替换；缺键回退链 = 当前语言 → 默认语言 → 键名 \| |
| GOV-LESSON-003 | \| F3 \| 分页页码按钮空白 \| 图标分支未渲染数字回退 \| 分支渲染必须有 else 分支兜底 \| |
| GOV-LESSON-004 | \| F7 \| 辅助文字对比度 4.44:1（本规范自身缺陷） \| v5.x 统一 TSSKB 灰阶时把 muted 从 `#616467` 浅化为 `#75787B` \| v5.2 修正为 `#616467`；任何文字令牌变更必须重跑附录 G 量化自查 \| |
| GOV-LESSON-005 | \| F11 \| 页面元素字体命中 Times New Roman / Arial（评审实测） \| BUTTON 等替换元素不继承字体，`.icon-btn` 未写 `font:inherit` \| 所有按钮类必须 `font:inherit`；等宽栈补 `"Noto Sans SC"` 中文回退；纳入抽查 \| |
| GOV-LESSON-006 | \| F13 \| **点击导航链接实际触发主题/语言切换（上线后用户发现）** \| 热区扩展 `.icon-btn::before { position:absolute; inset:0 }` 时控件缺 `position:relative`，伪元素相对定位祖先 `.topbar` 铺满整个顶栏，形成全栏透明热区层 \| **铁律：任何用伪元素做热区/状态层的控件，必须同时显式声明 `position:relative`**（已补入 9 章/11.1 实现代码）；发布前 hit-test 抽查：`elementFromPoint(链接中心)` 必须命中链接自身 \| |
<!-- END:must-registry -->
