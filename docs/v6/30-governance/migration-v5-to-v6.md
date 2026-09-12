# v5.4 → v6 迁移映射

## 章节映射（41 块 → v6 文件）

| v5.4 章节 | v6 位置 |
|---|---|
| 0. 文档定位与冲突处理（含 0.1 二维模型） | index.md（术语表/决策树）+ 本文件 |
| 1. 设计气质 / 2. Logo 名称 / 5. 图像图标 / 附录 D 硬规则 | 00-foundations/brand.md |
| 3. 色彩系统（含 3.3A on-* 角色） | 00-foundations/color.md |
| 4. 字体与排版（含角色表/Noto 规则） | 00-foundations/typography.md |
| 5. 图像与图标 | 00-foundations/brand.md |
| 6. 三层设计令牌 | 00-foundations/design-tokens.md |
| 7. 间距圆角阴影 / 9. 响应式 | 00-foundations/spacing-layout.md |
| 8. 页面布局（8.1–8.5 三形态/登录） | 10-patterns/overview.md + authentication.md |
| 10. 顶部栏导航 | 20-components/app-shell.md |
| 11. 按钮（含 11.1 状态层） | 20-components/button.md |
| 12. 卡片 | 20-components/card.md |
| 13. 输入搜索 / 18. 表单 | 20-components/form.md |
| 14. 表格 / 14A 功能包 | 20-components/data-table.md |
| 15. 状态标签 / 17. 模态抽屉 | 20-components/feedback.md |
| 16. 空态加载 / 24. 系统状态错误 / 附录 B | 10-patterns/system-states.md |
| 19. 关键数据 / 21. 日期数字 | 10-patterns/content-site.md + 20-components/data-display.md |
| 20. 图表 | 10-patterns/app-workbench.md + 20-components/data-display.md |
| 22. 无障碍基线 | 30-governance/accessibility.md |
| 23. 动效 | 00-foundations/motion.md |
| 25. 工程实现 / 27. 性能 / 附录 H Ant 映射 | 30-governance/engineering.md + 20-components/ant-design-mapping.md |
| 26. z-index | 00-foundations/elevation-radius.md |
| 28. 验收清单 / 29. 流程 / 附录 G 量化 | 30-governance/testing.md |
| 30. 版本治理 / 附录 C 依据 / E 阶段衔接 | 30-governance/versioning.md |
| 附录 F 踩坑 | 30-governance/lessons.md |
| 版本沿革 | 单体版 v5.4 保留（历史） |

## 令牌命名映射（v6.0 将以此为准做 Schema，代码暂不变更）

| v5.4 语义名（文档表） | v6 CSS 变量（现状） | 备注 |
|---|---|---|
| color-action-primary | --color-action | 文档表名与 CSS 名在本版已声明互认 |
| color-text-primary/secondary/muted | --color-text-* | 一致 |
| color-on-action / on-tint | --color-on-action / --color-on-tint | M3 角色互认 |
| status-*-text | （即 on-status-* 角色） | 15 章 |
| --ale-purple-700（80% 档） | 同名 | v6 Schema 改 HCT tone 数值命名（提案） |

## 已知待办（v6.0 后续阶段）

- Token JSON Schema 与生成链（M3）；
- 规则 ID 全面覆盖（M4 收尾完成：kit/tools/scan-rules.mjs 扫描全部条款行（含标题/列表/表格行））；
- 阅读宽度令牌 --reading-max、数据密度令牌（评审 §6.2）。
