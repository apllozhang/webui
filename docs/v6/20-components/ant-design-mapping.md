---
title: Ant Design 5 主题映射（下游翻译）
id-prefix: CMP-ANT
source: ALE-WEBUI-设计规范-v5.4.md
status: v6.0.0 正式基线（治理版；实现与试点证据见 docs/release/v6-readiness.md）
---
# Ant Design 5 主题映射（下游翻译）


---

## 附录 H：Ant Design 5 主题映射表（v5.3，下游翻译）

接入方式：`ConfigProvider theme={{ token: {...}, algorithm: theme.defaultAlgorithm | theme.darkAlgorithm }}`。值全部来自 `shared/css/tokens.css`，此处仅为翻译，不得反向修改。

| Ant Design Token | 值 | 对应规范令牌 |
|---|---|---|
| `colorPrimary` | `#6B489D` | `--ale-purple-600` |
| `colorPrimaryHover` | `#4F3478` | `--ale-purple-700` |
| `colorPrimaryActive` | `#4F3478` | `--ale-purple-700` |
| `colorLink` | `#006AA2` | `--color-link` |
| `colorSuccess` | `#007A73` | `--status-success-text` |
| `colorWarning` | `#9A4707` | `--status-warning-text` |
| `colorError` | `#A50034` | `--ale-red` |
| `colorInfo` | `#006AA2` | `--color-info` |
| `colorTextBase` | 亮 `#1A1A1A` / 暗 `#EFEDF4` | `--color-text-primary` |
| `colorTextSecondary` | 亮 `#4B4D50` / 暗 `#C6C2D1` | `--color-text-secondary` |
| `colorTextTertiary` / `colorTextQuaternary` | 亮 `#616467` / 暗 `#9B96AB` | `--color-text-muted` |
| `colorBgBase` | 亮 `#FFFFFF` / 暗 `#211D2C` | `--color-surface` |
| `colorBgLayout` | 亮 `#F7F7F5` / 暗 `#171420` | `--color-canvas` |
| `colorBorder` | 亮 `#D9D9D6` / 暗 `#3D3750` | `--color-border` |
| `colorBorderSecondary` | 亮 `#E9E8E4` / 暗 `#2E2939` | `--color-border-soft` |
| `borderRadius` | `8` | `--radius-sm` |
| `borderRadiusLG` | `12` | `--radius-md` |
| `borderRadiusSM` | `6` |（小控件半档） |
| `fontFamily` | Trebuchet 栈（同 4 章） | `--font-sans` |
| `controlHeight` | `36`（密集表格默认）；主按钮用 `size="large"`(40px) 或覆盖至 44px | 触控目标条款 |
| `boxShadow` / `boxShadowSecondary` | `var(--shadow-sm)` / `var(--shadow-md)` 值 | Elevation 三档 |

**核对基线**：映射后必须重跑附录 G 对比度断言（Ant 派生的 hover/active/bg 变体以 `colorPrimary` 为基，自动生成值需抽查 ≥4.5:1）。

---

## 规则 ID 注册表（本文件 Must 条款）

<!-- BEGIN:must-registry -->
| ID | 条款（摘录） |
|---|---|
| CMP-ANT-001 | **核对基线**：映射后必须重跑附录 G 对比度断言（Ant 派生的 hover/active/bg 变体以 `colorPrimary` 为基，自动生成值需抽查 ≥4.5:1）。 |
<!-- END:must-registry -->
