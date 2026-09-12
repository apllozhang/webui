---
title: ALE WebUI 使用指南（给开发者）
id-prefix: GOV-USG
---
# ALE WebUI 使用指南（给开发者）

> 回答一个问题：「我拿到这套规范，具体怎么用？」
> 规范文档（docs/v6/）是"怎么写"的依据；本文件是"怎么用"的操作手册。

## 一图看懂：规范 ≠ 文档 + 样式

```
你拿到的不止是文档：
├─ docs/v6/            规范 = 规则 + 依据（写代码前查，验收时对照）
├─ kit/tokens/*.json   令牌真源 = 所有颜色/字号/间距的唯一值（改设计只改这里）
├─ kit/shared/         生成产物 = tokens.css / preset / 组件样式（禁止手改）
├─ kit/skeleton-*/     骨架 = 可拷贝的项目起点（含组件代码，不是空目录）
└─ kit/tools/          门禁 = design:check / tokens:contrast（发布前必须跑）
```

**关键认知**：程序员不需要读完规范。骨架里的组件已经按规范实现了——你主要在"用代码"，规范是遇到争议时查的依据，门禁是防止写错的保险。

## 场景 1：新项目启动（15 分钟）

```
第 1 步  回答三问（docs/v6/index.md 决策树）
         ├─ 业务是什么？→ 内容网站型 / 工具应用型
         ├─ 页面怎么交互？→ 门户 / 工作台 / 轻量单任务 / 多步向导
         └─ 用什么技术？→ Static / Alpine / React（决策树直接给答案）

第 2 步  拷骨架（复制整个目录作为项目起点）
         ├─ 工具应用、有表格和登录 → kit/skeleton-react/
         ├─ 内网小工具、轻量表单   → kit/skeleton-alpine/
         └─ 知识库、内容门户       → kit/skeleton-static/

第 3 步  跑起来确认（每个骨架 README 有命令）
         React: npm install && npm run dev   其他: python -m http.server

第 4 步  改品牌位（可选）
         项目名、页面标题、业务数据接口对接。
         ✗ 不要改颜色/字号/间距 —— 那是令牌的事（场景 3）。
```

此时你拥有的：符合规范的顶栏/按钮/卡片/表格（含排序·列宽·分页·搜索·批量）/表单/模态/Toast/亮暗主题/中英文，全部开箱即用。

## 场景 2：日常开发（写页面时）

| 你要做的事 | 怎么做 |
|---|---|
| 写一个列表页 | 直接改骨架里的 DataTable 示例：换数据源、改列定义 |
| 加一个弹窗确认 | 用现成 Dialog 组件（焦点圈闭/Esc/焦点归还是现成的） |
| 拿不准颜色/间距 | 查 `docs/v6/00-foundations/`，**只能引用 `--color-*`/`--space-*` 令牌，禁止写裸值** |
| 拿不准交互行为 | 查 `docs/v6/20-components/` 对应组件页（六态/键盘/读屏行为都有定义） |
| 状态怎么表达 | 查 `docs/v6/10-patterns/system-states.md`（空/错/加载/成功各有定义） |
| 想偏离规范 | 不允许默默偏离——登记例外（`docs/v6/30-governance/exceptions.md`，含复审日期） |

## 场景 3：改设计（换色/调字/全局修改）

```bash
cd kit/tools
# 1. 只改令牌真源（JSON），例如把主紫换成新值：
#    tokens/primitives.json → ale-purple-600.value
# 2. 一条命令同步一切（tokens.css ×2 + preset + 文档表格 + 对比度输入）：
npm run tokens:build
# 3. 自动验证新值合规（对比度不足会被拦截，附具体数值）：
npm run tokens:contrast
# 4. 确认无漂移（生成产物与 JSON 一致）：
npm run tokens:check
```

这就是"三骨架自动同步"：改一处 JSON，React/Alpine/Static 和规范文档同时更新，手工差异为零。

## 场景 4：发布前（必跑）

```bash
npm run design:check        # 12 项门禁：版本/资产/五档溢出/热区/控制台/…
# 任一 FAIL → 修复后重跑；门禁会拦截：字体 404、320px 溢出、热区不足、版本漂移等
# 部署：deploy 脚本自带资产 200 + 版本 + 文案门禁
```

## 场景 5：发现规范本身的问题

和本项目所有缺陷一样：问题会登记进 `docs/v6/30-governance/lessons.md`（踩坑登记簿），
规则修订进对应文件并打规则 ID（如 `CMP-TABLE-003`）。你不需要"理解全部规范"才能开始。

## 当前成熟度（如实）

| 能力 | 状态 |
|---|---|
| 令牌/主题/多语言/基础组件/14A 表格/门禁 | ✅ 可直接用（三个线上站点验证过） |
| App Shell / Form / Feedback 四链路 | ✅ React 全量（M4 交付）；Alpine 顶栏+表格 Core+表单模式+Alert/Toast；Static 仅内容站外壳——覆盖面详见 20-components 各文件"骨架支持矩阵" |
| Date Picker / Tree / Combobox 等复杂组件 | 📋 v6.1 backlog |
| 设计稿（Figma）侧的令牌同步 | 📋 未开始 |

**结论**：「markdown + 样式文件」确实不够——所以这套体系是"令牌真源 + 骨架代码 + 门禁"三位一体。
程序员的使用方式是：**拷骨架、用组件、查文档、跑门禁**，四步之外不需要理解规范全文。


## 规则 ID 注册表（本文件 Must 条款）

<!-- BEGIN:must-registry -->
| ID | 条款（摘录） |
|---|---|
| GOV-USG-001 | ├─ kit/shared/         生成产物 = tokens.css / preset / 组件样式（禁止手改） |
| GOV-USG-002 | └─ kit/tools/          门禁 = design:check / tokens:contrast（发布前必须跑） |
| GOV-USG-003 | \| 拿不准颜色/间距 \| 查 `docs/v6/00-foundations/`，**只能引用 `--color-*`/`--space-*` 令牌，禁止写裸值** \| |
<!-- END:must-registry -->
