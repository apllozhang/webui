---
title: 版本与发布治理
id-prefix: GOV-VER
source: ALE-WEBUI-设计规范-v5.4.md
status: v6.0.0-rc 基线（治理版；实现与试点证据见 docs/release/v6-readiness.md）
---
# 版本与发布治理


---

## 30. 版本治理

- 主版本 = 不兼容变化；次版本 = 新增规则；修订号 = 勘误。项目级偏离记录原因、负责人、影响与复审日期（偏离登记表 `design-exceptions.yml` 于 v6.0 引入）。
- **单一版本真源（v5.4，必须）**：`design-system.version.json` 是唯一版本定义（spec-site 与 kit/shared 各存一份，内容一致）；HTML `<title>`/description、页脚版本、README、部署健康检查全部以其为准。发布前执行一致性检查：文档版本 = 页面 title = 页脚 = version.json，不一致禁止发布。
- 每次重大版本抽查一个内容型页 + 一个应用型页 + 一个向导型页。

---

# 附录

---

## C. 资料依据

- ALE Corporate Brand Guidelines（September 2025）：`X:\BP 目录\Marketing Resources\ALE Brand\Brand Guidelines\alcatel-lucent-enterprise-brand-guidelines-en.pdf`
- Logo 与模板资产：`X:\BP 目录\Marketing Resources\ALE Brand\`（logos / PPT-templates / Document-templates）
- 上游规范：《ALE-WebUI-设计与实现指导规范 v4.1》；v5.0《ALE-WEBUI-设计规范》
- 实现参照（源码实测）：TSSKB `static/css/{tokens,layout,components,content}.css`（动效与配色归纳来源）· apllozhang/ale-dan-cpl-system（14A 功能包来源）· apllozhang/nvci-lite（形态 C）
- 无障碍基线：WCAG 2.2 AA

---

## E. 后续阶段衔接（Doc / PPT）

- **Doc（第二阶段）**：复用本文档第 2–4 章（Logo、色彩、字体）与 Document-templates 官方模板；文档正文排版沿用第 4 章字号行高表。
- **PPT（第三阶段）**：以 `PBG-2026-library-powerpoint-template.pptx` 与 `PPT-templates` 官方模板为底，色彩令牌沿用第 3 章；深色模板仅用反白 Logo；TSSKB 的品牌紫渐变（`118deg, #4F3478→#6B489D→#7E5CB4`）可用于封面/章节页背景。

## 规则 ID 注册表（本文件 Must 条款）

<!-- BEGIN:must-registry -->
| ID | 条款（摘录） |
|---|---|
| GOV-VER-001 | - **单一版本真源（v5.4，必须）**：`design-system.version.json` 是唯一版本定义（spec-site 与 kit/shared 各存一份，内容一致）；HTML `<title>`/description、页脚版本、README、部署健康检查全部以其为准。发布前执行一致性检查：文档版本 = 页面 title = 页脚 = version.json，不一致禁止发布。 |
<!-- END:must-registry -->
