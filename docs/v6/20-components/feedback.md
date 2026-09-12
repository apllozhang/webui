---
title: Component — Feedback（反馈链路）
id-prefix: CMP-FB
source: M4 链路建设（v6.0）；前身 = v5.4 第 15/16/17/24 章
status: M4 第一批（React 全组件 + 载体选择矩阵已交付）
---
# Feedback（反馈链路）

## 载体选择矩阵（必须先选对载体）

| 场景 | 载体 | 理由 |
|---|---|---|
| 操作结果的即时确认（已保存/已删除） | **Toast**（右下，role=status） | 不打断，自动消失 |
| 页面级状态提示（维护中/配额告警） | **Alert**（内联区块） | 常驻可见 |
| 字段/表单错误 | **Inline Error + ErrorSummary** | 落到字段，Toast 不可替代 |
| 危险操作确认 | **Dialog** | 强制决策，焦点圈闭 |
| 辅助详情/长表单 | **Drawer** | 保留上下文 |
| 后台进行中 | **Progress/Spinner** | 可感知进度 |
| 内容未到/为空 | **Skeleton / EmptyState** | 结构占位/引导下一步 |
| 整页不可用 | **错误页**（公式：发生了什么+影响+怎么办） | — |

## 组件要点

- **Alert**：tone=info/success/warning/danger；`role="alert"`（warning/danger）或 `status`；含关闭按钮（可关闭时）。
- **Toast**：`role=status`（成功/信息）/`alert`（错误）；≤3 条堆叠；关键结果不自动消失或延时 ≥6s；错误必须同时有字段级反馈。
- **Dialog**：`role="dialog"` + `aria-modal` + 焦点圈闭 + Esc + 焦点归还（骨架现成实现）。
- **Drawer**：右侧滑出 420px；焦点圈闭同 Dialog；Esc 关闭。
- **Skeleton**：`aria-hidden="true"` + 更新区 `aria-busy`；形状接近最终内容。
- **EmptyState**：图标+标题+说明+行动按钮；回答"什么/为什么/下一步"。
- **Progress**：`role="progressbar"` + `aria-valuenow`；不确定时长用 spinner。

## 令牌

状态色五档（text 深色派生 + graphic 亮色 + bg 浅底，见 FND-COLOR）；Toast 左边 4px 状态色条；Dialog/Drawer 用 `--shadow-md`。

## 动效

出现 240ms（opacity+translateY）；不阻塞交互；`prefers-reduced-motion` 下全部瞬时。

## 正确 / 错误示例

✅ 删除成功：Toast「已删除 3 条」+ 列表刷新。
❌ 表单错误只 Toast；用 alert() 阻塞式弹窗；Skeleton 转圈当内容。

## 骨架支持矩阵

| 组件 | React | Alpine | Static |
|---|---|---|---|
| Toast / Dialog | ✅ | ✅ | 模式级 |
| Alert / Skeleton / EmptyState / Drawer / Progress | ✅ `components/feedback/` | Alert/Toast ✅ | — |

## 自动化验收 ID

| ID | 检查 |
|---|---|
| FB-ROLE-001 | Toast/Alert/Dialog 的 role 正确 |
| FB-FOCUS-001 | Dialog/Drawer 焦点圈闭+归还 |
| FB-SKELETON-001 | skeleton aria-hidden |
