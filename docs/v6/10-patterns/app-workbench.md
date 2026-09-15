---
title: Pattern：数据工作台
id-prefix: PAT-AW
source: ALE-WEBUI-设计规范-v5.4.md
status: v6.0.0 正式基线（治理版；实现与试点证据见 docs/release/v6-readiness.md）
---
# Pattern：数据工作台
参照：ale-dan-cpl-system。工程档：React。数据表格功能包（20-components/data-table.md）为本模式标配。


---

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

## 规则 ID 注册表（本文件 Must 条款）

| ID | 条款（摘录） |
|---|---|
| — | 本文件当前无「必须」级条款（全部为建议/参考） |