---
title: 偏离登记（design-exceptions.yml）
id-prefix: GOV-EXC
---
# 偏离登记（design-exceptions.yml）

对任何「必须」条款的偏离必须登记；**无复审日期或无负责人的例外不得合并**。

## Schema

```yaml
- id: EXC-2026-0001            # 唯一
  rule: A11Y-TARGET-001        # 偏离的规则 ID
  project: ale-dan-cpl-system  # 项目
  reason: |                    # 为什么无法遵守
    顶栏工具区垂直空间受限……
  owner: name                  # 负责人
  impact: desktop-only         # 影响面
  mitigation: 触控环境经 pointer:coarse 扩展至 44px
  created: 2026-09-12
  review-by: 2026-12-31        # 必填；过期例外自动失效
```

## 流程

1. 提交例外 PR：改 `design-exceptions.yml` + 在规则文件对应条款标注「存在例外 EXC-xxx」。
2. 审批：规则所属层负责人批准（见 30-governance/versioning.md 分工）。
3. 复审：到期自动失效，需重新登记；重复出现 ≥2 次的例外应升级为正式模式提案。


## 规则 ID 注册表（本文件 Must 条款）

<!-- BEGIN:must-registry -->
| ID | 条款（摘录） |
|---|---|
| GOV-EXC-001 | 对任何「必须」条款的偏离必须登记；**无复审日期或无负责人的例外不得合并**。 |
<!-- END:must-registry -->
