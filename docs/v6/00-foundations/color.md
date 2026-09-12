---
title: 色彩系统
id-prefix: FND-COLOR
source: ALE-WEBUI-设计规范-v5.4.md
status: M2 迁移（内容 = v5.4.1 基线，未新增规则）
---
# 色彩系统
官方品牌色 + Web 语义色 + 前景色角色（on-*）+ 状态色。配对对比度见 30-governance/testing.md 附录 G。


---

## 3. 色彩系统

### 3.1 官方品牌色（品牌资产）

| 官方基础色 | 色值 | 用途 |
|---|---:|---|
| ALE Purple（Pantone 267C） | `#6B489D` | 品牌识别、主按钮、重点链接、选中态 |
| Black | `#000000` | 品牌资产、特殊高对比场景 |
| White | `#FFFFFF` | 主背景、反白内容 |

官方色板九个色相各提供 **100/80/60/40/20% 五档**；Web 派生变体只从五档取值，不发明新色。

### 3.2 品牌紫档位（命名规范，必须）

v5.0 的 `--ale-purple-800` 与 TSSKB 的 `--ale-purple-700` 同值异名，本版统一档位命名并固化（令牌名称本身属于规范）：

| 令牌 | 值 | 档位 | 用途 |
|---|---:|---|---|
| `--ale-purple-600` | `#6B489D` | 100% 主紫 | 主按钮、链接、当前态标记 |
| `--ale-purple-700` | `#4F3478` | 80% 深紫 | 悬停/按下、**标题强调色**、反白底上的按钮文字 |
| `--ale-purple-500` | `#7E5CB4` | 60% 浅紫 | 图表序列、hover 边框、大面积填充 |
| `--ale-purple-40` | `#E4D9F3` | 40% | 深色底上的浅紫文字/装饰 |
| `--ale-purple-100` | `#F1ECF7` | 20% 极浅紫 | 导航/搜索结果 hover 浅底、步骤序号圆底、选中行底 |

### 3.3 Web 语义色（派生，必须与品牌色分开命名）

| 语义令牌 | 值 | 用途 |
|---|---:|---|
| `color-action-primary` | `#6B489D` | 主动作背景、选中态 |
| `color-action-primary-hover` | `#4F3478` | 悬停/按下 |
| `color-link` | `#006AA2` | 白底小号正文链接 |
| `color-success` | `#007A73` | 成功 |
| `color-warning` | `#9A4707` | 警告 |
| `color-danger` | `#A50034` | 错误、危险操作 |
| `color-info` | `#006AA2` | 信息提示 |
| `color-text-primary` | `#1A1A1A` | 主正文 |
| `color-text-secondary` | `#4B4D50` | 次级信息 |
| `color-text-muted` | `#616467` | 辅助信息（v5.2 修正：原 `#75787B` 白底 4.44:1 不达 AA） |
| `color-border` | `#D9D9D6` | 主边框、控件描边 |
| `color-border-soft` | `#E9E8E4` | 次级分隔线、列表虚线 |
| `color-surface` | `#FFFFFF` | 卡片、弹层、控件背景 |
| `color-on-action` | `#FFFFFF` | 压在主紫/深紫上的前景（按钮文字/图标，6.91–10.02:1） |
| `color-on-tint` | 亮 `#4F3478` / 暗 `#E4D9F3` | 压在浅紫 tint 上的前景（当前项、批操作条文字） |
| `color-on-surface` / `color-on-surface-variant` | = `color-text-primary` / `-secondary` | 语义别名（M3 命名互认，见 3.3A） |
| `color-canvas` | `#F7F7F5` | 画布背景 |
| `color-purple-tint` | `#F1ECF7` | 品牌浅底（= `--ale-purple-100`） |

官方亮色（`#0085CA`、`#00B2A9`、`#FF4500` 等）白底对比度不足 4.5:1，只用于大图形、装饰块、状态圆点/图标/边框；白底小字号文字一律用深色派生值。

### 3.3A 前景色角色（on-\* roles，v5.3，必须）

吸收 M3 的角色化颜色：每个可叠加背景的色板都必须声明其上的前景色，且配对组合需通过附录 G 对比度验证。禁止在组件中散落硬编码 `#fff`。

| 背景角色 | 前景角色 | 值 | 实测对比度 |
|---|---|---|---|
| `color-action`（主紫 `#6B489D`） | `color-on-action` | `#FFFFFF` | 6.91:1 |
| `color-action-hover`（深紫 `#4F3478`） | `color-on-action-hover` | `#FFFFFF` | 10.02:1 |
| `color-purple-tint`（浅紫底） | `color-on-tint` | 亮 `#4F3478` / 暗 `#E4D9F3` | ≥4.8:1 |
| `color-surface` / `color-canvas` | `color-on-surface`(=`color-text-primary`) | 亮 `#1A1A1A` / 暗 `#EFEDF4` | 15.6–16.2:1 |
| `color-surface`（次级） | `color-on-surface-variant`(=`color-text-secondary`) | 亮 `#4B4D50` / 暗 `#C6C2D1` | ≥8.4:1 |
| `status-*-bg` | `status-*-text`（即 on-status-\*） | 见 15 章 | 5.2–8.8:1 |

状态层（11.1）使用 on-\* 前景色作叠加基色——这是角色体系存在的核心目的。

---

### 3.4 色彩比例

中性色与白 75–85%；ALE Purple 10–15%；状态/辅助色 ≤10%。颜色不得单独传达状态，必须伴随文字、图标、形状或位置线索。

## 规则 ID 注册表（本文件 Must 条款）

<!-- BEGIN:must-registry -->
| ID | 条款（摘录） |
|---|---|
| FND-COLOR-001 | ### 3.2 品牌紫档位（命名规范，必须） |
| FND-COLOR-002 | ### 3.3 Web 语义色（派生，必须与品牌色分开命名） |
| FND-COLOR-003 | ### 3.3A 前景色角色（on-\* roles，v5.3，必须） |
| FND-COLOR-004 | 吸收 M3 的角色化颜色：每个可叠加背景的色板都必须声明其上的前景色，且配对组合需通过附录 G 对比度验证。禁止在组件中散落硬编码 `#fff`。 |
| FND-COLOR-005 | 中性色与白 75–85%；ALE Purple 10–15%；状态/辅助色 ≤10%。颜色不得单独传达状态，必须伴随文字、图标、形状或位置线索。 |
<!-- END:must-registry -->
