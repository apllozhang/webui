# ALE WebUI 设计规范 v6（M2 骨架）
> 状态：**M2 信息架构与规范契约**。内容迁移自 v5.4.1 只读基线（未新增规则）；规则 ID 体系与术语表自本版生效。
> 单体完整版（历史）：`../ALE-WEBUI-设计规范-v5.4.md`；基线标签 `v5.4.1`。

## 术语表（四概念严格区分，禁止混用）

| 概念 | 取值 | 回答的问题 |
|---|---|---|
| **Product Family（产品家族）** | 内容网站型 / 工具应用型 | 我是什么业务？ |
| **Interaction Pattern（交互模式）** | 阅读门户 / 检索目录 / 长文详情 / 数据工作台 / 轻量单任务 / 多步向导 | 我的页面怎么交互？ |
| **Engineering Tier（工程档）** | React / Alpine / Static | 用哪套骨架实现？ |
| **Visual Role（视觉角色）** | Display / Page Title / Section Title / Subsection Title / Card Title | 这个元素该多大？ |

> 向导是工具应用型的一种交互模式，不是第三产品家族。React/Alpine/Static 是工程档，不是产品类型。

## 冲突处理优先级（宪法，源自 v5.4 第 0 章）

1. **官方品牌规则**（L1）：Logo、名称、官方色、字体、法律声明（00-foundations/brand.md 附录 D）——不可违背；
2. **本规范 Web 规则**（L2）：令牌、无障碍、组件状态、动效、响应式、工程约束（00-foundations + 20-components + 30-governance）；
3. **项目级主题**（L3）：不破坏前两层下的业务语义与组件扩展；
4. **参考实现**（L4）：TSSKB / dan-cpl / nvci 仅供理解落地方式，不是规范。

任何冲突按此顺序裁决；偏离 L2 必须登记（30-governance/exceptions.md）。

## 选型决策树（新项目三问，2 分钟）

1. **业务是什么？** → 内容网站型（选 Static）｜工具应用型（继续第 2 问）
2. **交互模式？** → 数据工作台（React）｜轻量单任务（Alpine）｜多步向导（复杂→React，简单→Alpine）
3. **要哪些核心组件？** → App Shell + Form + Table + Feedback 四链路（20-components/）

**桌面演练脚本（M2 退出门用）**：给演练者本页 + 一个真实需求描述，10 分钟内说出：家族、模式、工程档、四链路取舍。有争议即术语表需修订。

## 目录索引

| 层 | 文件 | ID 前缀 |
|---|---|---|
| 00-foundations | brand.md / color.md / typography.md / design-tokens.md / spacing-layout.md / elevation-radius.md / motion.md | FND-* |
| 10-patterns | overview.md / content-site.md / app-workbench.md / lightweight-task.md / wizard-flow.md / authentication.md / system-states.md | PAT-* |
| 20-components | app-shell.md / button.md / card.md / form.md / data-table.md / feedback.md / data-display.md / ant-design-mapping.md | CMP-* |
| 30-governance | accessibility.md / engineering.md / testing.md / versioning.md / lessons.md / exceptions.md / migration-v5-to-v6.md | GOV-* |

## 规则 ID 规范

- 格式：`<前缀>-<三位序号>`（如 `FND-COLOR-003`、`CMP-TABLE-002`）；每个文件尾部有自动生成的 Must 条款注册表。
- 引用规则一律用 ID（验收脚本、例外登记、缺陷单同源）；规则正文修改不改变 ID，删除需走弃用周期。
- 强度：**必须**（违反需登记例外）/ 建议 / 可选。
- v5.4 → v6 章节映射见 `30-governance/migration-v5-to-v6.md`。

## 内容完整性声明

v5.4 的全部 41 个章节块已映射至本目录（映射表见 migration-v5-to-v6.md）；`版本沿革` 保留在单体版，v6 各文件 frontmatter 标注来源与基线。
