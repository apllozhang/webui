---
title: Pattern：多步向导
id-prefix: PAT-WF
source: ALE-WEBUI-设计规范-v5.4.md
status: v6.0.0 正式基线（治理版；实现与试点证据见 docs/release/v6-readiness.md）
---
# Pattern：多步向导
参照：nvci-lite（四步向导）。工程档：React 或 Alpine（按复杂度）。工具应用型家族的交互模式之一，不是独立产品家族。


## 规则 ID 注册表（本文件 Must 条款）

<!-- BEGIN:must-registry -->
| ID | 条款（摘录） |
|---|---|
| PAT-WF-001 | 两栏工作区(侧栏树 + 主列)与向导栅格在 ≤760px 必须纵向堆叠,侧栏转入内部自滚(max-height ≤42vh);断点必须覆盖 768 平板档( NVCI R4-01 教训:唯一断点 760px 致 768 溢出)。工具条(搜索+批量+主操作)必须 flex-wrap。验收:320/768/1440 三档根级零横向溢出。 |
<!-- END:must-registry -->

<!-- M6-R1 试点回流增补(2026-09-14,来源:M5 三项目试点实践;台账:docs/release/v6-readiness.md) -->
## PAT-WIZ-320:向导/两栏工作区窄屏堆叠(试点回流,nvci/dan-cpl 实证)

两栏工作区(侧栏树 + 主列)与向导栅格在 ≤760px 必须纵向堆叠,侧栏转入内部自滚(max-height ≤42vh);断点必须覆盖 768 平板档( NVCI R4-01 教训:唯一断点 760px 致 768 溢出)。工具条(搜索+批量+主操作)必须 flex-wrap。验收:320/768/1440 三档根级零横向溢出。
