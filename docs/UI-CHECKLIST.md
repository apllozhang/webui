# UI-CHECKLIST — UI 调整验收矩阵(AI 开发者交付自查表)

> **为什么有这个文件**:按本仓库做 UI 调整时,最容易漏的不是样式,而是**运行时才可见的交互行为**——表格的列宽拖拽/分页/查询/排序、暗亮切换+刷新持久化、Esc 关弹层这类"看代码静态扫不出来的东西"。
> **用法**:动手前通读一遍本表;交付前把文末「交付自查表」复制进交付说明逐项勾选,并附 `design:check` ALL PASS 输出。
> **出处约定**:每项都给参考实现位置与对应门禁——给出处,不给感觉。

## 怎么自证(机器证据,先读这段)

```bash
cd kit/tools
npm run tokens:check      # 令牌零漂移(生成物禁手改)
npm run tokens:contrast   # 对比度三分类断言
npm run design:check      # 规范站 + Kit 四入口 25 项(交互断言都在这里)
npm run rules:check       # 规则注册表零漂移
```

- 任一 FAIL 会给出失败项 ID(如 `IX-KBD-SORT`),按 ID 在本表查含义,修复后重跑。
- CI 对 push 自动跑同一套门禁,失败自诊断写入 `.github/ci-state.json`(含失败步骤/日志尾部/环境)。
- **禁止三种绕过**:提高阈值、删除断言、skip 掉失败项——都视同未完成(教训 F21/F22)。

## 一、数据表格(凡出现 table/数据列表的页面,全部必做)

> 改造已有业务站时,另有 **13 项细版清单**:docs/v6/20-components/data-table.md「业务站落地检查清单」(防抖搜索/千分位/紧凑分页/`?v=` 防缓存等实战项);过程案例见 docs/review/2026-09-16-8088-competitor-web-v6-整改案例.md(F23-F25)。

| # | 必做项 | 要求 | 参考出处 | 门禁 ID |
|---|--------|------|----------|---------|
| T1 | 列宽拖拽 | 表头拖拽手柄调整列宽;"拖过即切精确像素模式"(fixed 表格+min-width:100% 会全表联动,坑 F14) | spec-site `#table` 演示;docs/v6/20-components `data-table` | `IX-KBD-COLW` |
| T2 | 分页 | 页容量/页码/总条数齐全,键盘可达 | 同上 | `IX-KBD-PAGE` |
| T3 | 排序 | 表头点击升/降序切换,`aria-sort` 标注当前状态 | 同上 | `IX-KBD-SORT` |
| T4 | 查询/筛选 | 关键字过滤;必须有**空态文案**(不是白屏/不是"无") | spec-site `#table` 演示 | 人工自查 |
| T5 | 表内选择器键盘可达 | 行选择/下拉控件 Tab+方向键可用 | docs/v6/30-governance `accessibility.md` | `IX-KBD-SELECT` |
| T6 | 窄屏不破版 | 320/768 无横向溢出(横向滚动或降级布局) | — | `OVF320` `OVF768` |

## 二、主题外观(暗色/亮色切换)

| # | 必做项 | 要求 | 参考出处 | 门禁 ID |
|---|--------|------|----------|---------|
| M1 | 切换入口 | 顶栏明示切换按钮(图标按钮必须 `aria-label`) | spec-site 顶栏;kit app-shell | `IX-THEME` |
| M2 | 刷新持久化 | 用户选择存 localStorage,刷新后保持;跟随系统仅作首次默认 | 同上 | `THEME-PERSIST` |
| M3 | 全量跟随 | 图表/图片/阴影/边框在双主题下都不破(禁止硬编码色值,一律 CSS 变量) | kit/tokens 真源 | 人工自查 |
| M4 | 对比度 | 双主题下正文 ≥4.5:1 | tokens 生成链自带 | `tokens:contrast` |

## 三、导航与布局

| # | 必做项 | 要求 | 门禁 ID |
|---|--------|------|---------|
| N1 | 移动端抽屉 | 折叠按钮 `aria-expanded` 同步、遮罩可关 | `IX-DRAWER` |
| N2 | 面包屑 | 层级页有面包屑,当前页 `aria-current` | `IX-CRUMB` |
| N3 | skip-link | 第一个可聚焦元素,跳过导航直达主内容 | `RENDER` 相关 |
| N4 | 当前页高亮 | 导航项 `aria-current="page"` | 人工自查 |
| N5 | 版本标识 | 顶栏 ver-badge,运行时读 `design-system.version.json`(迭代只改 JSON) | `VER` `VER-BADGE` |

## 四、弹层与反馈

| # | 必做项 | 要求 | 门禁 ID |
|---|--------|------|---------|
| D1 | Esc 关闭 | 弹层/抽屉/菜单 Esc 可关 | `IX-DRAWER` 同源规则 |
| D2 | 焦点回归 | 关闭后焦点回到触发元素 | 人工自查 |
| D3 | 遮罩点击 | 点击遮罩关闭 | 人工自查 |
| D4 | toast 反馈 | 成功/失败用四态 toast,禁止 `alert()` | spec-site `#components` |
| D5 | 动效降级 | `prefers-reduced-motion: reduce` 时动画压到 0.01ms | `REDUCED-MOTION` |

## 五、表单

| # | 必做项 | 要求 | 门禁 ID |
|---|--------|------|---------|
| F1 | label 绑定 | 每个输入有显式 label(或 sr-only) | 人工自查 |
| F2 | 错误状态一致 | 出错时 `aria-invalid` 与可见提示同时出现且一致 | `IX-AGREE` |
| F3 | 必填标识 | 必填项有视觉+语义标注 | 人工自查 |
| F4 | 焦点可见 | 所有交互元素 `:focus-visible` 可见(不要 `outline:none` 裸删) | `IX-FOCUS-VISIBLE` |

## 六、品牌与版本

| # | 必做项 | 要求 | 出处 | 门禁 ID |
|---|--------|------|------|---------|
| B1 | 官方 Logo | 用 `spec-site/assets/ale-logo(-white).png`,亮暗跟随(浅底彩标/深底反白);高度按场景分档:文档顶栏 30px、业务站侧栏 34px,同一页面内保持一致;**禁止 CSS 渐变+文字仿制**(商标,brand.md §2.1/§2.4) | docs/v6/00-foundations `brand.md` | `ASSET` |
| B2 | 商标行 | 页脚:The Alcatel-Lucent name and logo are trademarks of Nokia used under license by ALE. | 同上 | 人工自查 |
| B3 | 版本徽章 | 与 `design-system.version.json` 真源一致,迭代同步更新 | spec-site 实现 | `VER` |
| B4 | 字体合规 | 中文自托管 Noto Sans SC(SIL OFL),禁三方 CDN;总量守字体双门禁 | FND-TYPE-001 | `FONT-BUDGET` |

## 交付自查表(复制进交付说明,逐项勾选)

```text
【UI 调整交付自查】
- 页面/模块:【】
- 适用组:表格 T1-T6 □ / 主题 M1-M4 □ / 导航 N1-N5 □ / 弹层 D1-D5 □ / 表单 F1-F4 □ / 品牌 B1-B4 □
- 已逐项核对并实现:【是 / 缺项说明】
- design:check 输出:【粘贴 ALL PASS;如有 FAIL 项,写失败 ID + 修复说明】
- 实测:320 / 768 / 1440 无横向溢出;暗/亮双主题截图已附
- 我未修改任何门禁阈值或断言:是
```

## 原则(冲突时按此排序)

1. **真源唯一**:改设计=改 `kit/tokens/*.json` → `npm run tokens:build`;生成物(tokens.css/preset)禁手改。
2. **证据优先**:声明"已完成"必须以门禁输出和推送后仓库状态为证(教训 F20:本地绿 ≠ 仓库绿)。
3. **禁止绕过**:让门禁变绿只有一条正路——把实现做对。
