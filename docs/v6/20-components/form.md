---
title: Component — Form（表单链路）
id-prefix: CMP-FORM
source: M4 链路建设（v6.0）；前身 = v5.4 第 13/18 章
status: M4 第一批（React 组件集 + Alpine 模式已交付）
---
# Form（表单链路）

## 何时使用 / 何时不用

**使用**：任何用户输入——创建/编辑实体、筛选、设置、登录。
**不用**：只读展示（用文本，不用禁用输入框伪装）；超复杂配置考虑分步向导。

## Anatomy

```
Field（字段容器）
├─ Label（必填标记 * + 含义说明）
├─ Control（Input/Textarea/Select/Checkbox/Radio/Switch）
├─ Help（格式或后果说明，aria-describedby）
└─ Error（紧邻控件，role=alert，说明"问题+修复方法"）
ErrorSummary（提交失败时置顶：role=alert + 锚点跳各字段）
```

## 令牌与尺寸

| 项 | 值 |
|---|---|
| 控件高度 | `--control-height-default` 44px / compact 36px |
| 热区 | `--hit-target-min` 44px（复选框等小图形用伪元素扩展） |
| 字段间距 | `--space-4`（16px）；标签与控件 6px |
| 焦点 | 边框 `--color-action` + `--ring-soft` |
| 错误 | `--status-danger-text` + `aria-invalid` |

## 六态（每个输入控件必须齐全）

默认 / 悬停（边框加深）/ 键盘焦点（outline）/ 聚焦（ring）/ 禁用（opacity .55 + cursor）/ 只读（readonly，非禁用样式）/ 错误（红边+错误文本）。加载态用于提交按钮（保留宽度 spinner）。

## 键盘与读屏

- Label 显式关联（`for`/`id`）；错误与帮助经 `aria-describedby` 关联；
- 错误摘要 `role="alert"`，提交失败焦点移至摘要，条目为锚点可跳转字段；
- 必填：`*` + 文字说明；`aria-required`；
- 未保存离开：`beforeunload` + 页内提示；不要把每次导航都变成确认弹窗。

## 校验时机

失焦校验（不逐字符报错）；提交时全量校验并聚焦错误摘要；服务端错误保留已输入数据。

## 正确 / 错误示例

✅ 错误写「请输入 8–20 位密码（当前 5 位）」；只读用文本展示。
❌ 只用红框不说明原因；placeholder 当标签；错误只 Toast 不落字段。

## 骨架支持矩阵

| 能力 | React | Alpine | Static |
|---|---|---|---|
| Field/输入族/错误摘要 | ✅ `components/form/` | ✅ demo 区块 | 模板级 |
| 未保存离开提示 | ✅ demo | ✅ demo | — |
| Switch/Radio | ✅ | ✅ | — |

## 自动化验收 ID

| ID | 检查 |
|---|---|
| FORM-ERR-001 | 错误紧邻控件且 aria 关联 |
| FORM-KEY-001 | 键盘可完成全部输入与提交 |
| FORM-SUM-001 | 错误摘要存在且锚点可跳转 |
