---
title: 工程实现与部署基线
id-prefix: GOV-ENG
source: ALE-WEBUI-设计规范-v5.4.md
status: v6.0.0 正式基线（治理版；实现与试点证据见 docs/release/v6-readiness.md）
---
# 工程实现与部署基线


---

## 25. 样式架构

```text
styles/
├─ tokens.css       # 基础/语义/组件令牌（含 motion、elevation）
├─ reset.css        ├─ base.css       ├─ layout.css
├─ components.css   ├─ content.css    └─ utilities.css
```

- 三种参照实现均可复用：TSSKB（Jinja2 + 自研 CSS，静态门户）、dan-cpl-system（Vite + TS + shadcn/ui 主题化）、nvci-lite（原生 HTML/JS + Express）。框架选择是工程决策，不属于品牌要求。
- 组件 API 暴露语义不暴露视觉：`Button: variant=primary|secondary|tertiary|danger|ghost-on-brand, size, loading`；`Badge: tone=neutral|info|success|warning|danger`。禁止 `purple=true, rounded=12` 式拼装参数。

### 25.1 工程骨架与共享层（ale-webui-kit，必须）

三档产品形态各配一个可直接拷贝的工程骨架，共享层为唯一品牌值来源：

```text
ale-webui-kit/
├─ shared/                  ★ 唯一品牌值来源
│  ├─ css/tokens.css          第 6 章令牌 + 暗色映射（改色只改这里）
│  ├─ css/{base,layout,components}.css
│  ├─ js/{theme,i18n}.js
│  └─ tailwind.preset.js      tokens → Tailwind 映射（复杂档）
├─ tools/sync-shared.mjs    同步 shared/ → 三骨架（改令牌后必须执行）
├─ skeleton-react/          复杂档：Vite+TS+Tailwind+TanStack Table（14A 全功能封装）
├─ skeleton-alpine/         轻量档：vanilla + Alpine.js（本地 vendored，无 CDN 依赖）
└─ skeleton-static/         静态档：Jinja2 + build.py + Pagefind
```

- 复杂档表格推荐 TanStack Table（无头库）：排序/列宽拖动/分页/过滤均为成熟实现，样式用规范类包装；
- 轻量档升级阈值：需要完整 14A 功能包或登录态/权限时，直接迁移复杂档，不在 vanilla 中手搓第二套表格；
- 组件 API 暴露语义：`variant/tone/size`；禁止视觉拼装参数。
- **Ant Design 5 接入（可选加速路径）**：当业务速度优先时，React 骨架可引入 Ant Design，但映射关系必须使用附录 H，且 `shared/css/tokens.css` 仍是唯一真相源——Ant 主题是其下游翻译。禁止同一产品混用两套组件库；Ant Table/Form 可替换自写实现，14A 无障碍要求（aria-sort、键盘列宽）不因换库豁免。

### 25.2 部署与交付基线（必须）

- 静态产物可部署性：构建引用**相对路径**（React 用 `base:'./'`），保证可挂载任意子路径；
- 缓存策略：带哈希的图片资产可强缓存（≥7d）；**CSS/JS 用协商缓存（`Cache-Control: no-cache` + etag）**，禁止无哈希文件的长期强缓存（曾导致用户 1 天内拿到过期脚本）；
- 交付物包含 Dockerfile（nginx:alpine）与健康检查端点；容器 `--restart unless-stopped`；
- 官方法律声明随站点页脚交付。

---

## 27. 性能与稳定性

- 首屏只加载必要资源；图片声明宽高并按展示尺寸压缩；字体失败有回退不阻塞。
- 大列表分页/增量/虚拟化并保留键盘与读屏可用；大文件导入必须显示进度与结果摘要（成功 N 条、失败 M 条及原因）。
- 组件在慢请求、空数据、超长文字、多语言、错误响应下结构稳定。
- 全局 `mousemove/mouseup` 监听（列宽拖动）必须在拖动结束后移除；悬停浮起动画只动 `transform`，不触发重排。

---

# 第七部分：验收与治理

## 规则 ID 注册表（本文件 Must 条款）

<!-- BEGIN:must-registry -->
| ID | 条款（摘录） |
|---|---|
| GOV-ENG-001 | - 组件 API 暴露语义不暴露视觉：`Button: variant=primary\|secondary\|tertiary\|danger\|ghost-on-brand, size, loading`；`Badge: tone=neutral\|info\|success\|warning\|danger`。禁止 `purple=true, rounded=12` 式拼装参数。 |
| GOV-ENG-002 | ### 25.1 工程骨架与共享层（ale-webui-kit，必须） |
| GOV-ENG-003 | ├─ tools/sync-shared.mjs    同步 shared/ → 三骨架（改令牌后必须执行） |
| GOV-ENG-004 | - 组件 API 暴露语义：`variant/tone/size`；禁止视觉拼装参数。 |
| GOV-ENG-005 | - **Ant Design 5 接入（可选加速路径）**：当业务速度优先时，React 骨架可引入 Ant Design，但映射关系必须使用附录 H，且 `shared/css/tokens.css` 仍是唯一真相源——Ant 主题是其下游翻译。禁止同一产品混用两套组件库；Ant Table/Form 可替换自写实现，14A 无障碍要求（aria-sort、键盘列宽）不因换库豁免。 |
| GOV-ENG-006 | ### 25.2 部署与交付基线（必须） |
| GOV-ENG-007 | - 缓存策略：带哈希的图片资产可强缓存（≥7d）；**CSS/JS 用协商缓存（`Cache-Control: no-cache` + etag）**，禁止无哈希文件的长期强缓存（曾导致用户 1 天内拿到过期脚本）； |
| GOV-ENG-008 | - 大列表分页/增量/虚拟化并保留键盘与读屏可用；大文件导入必须显示进度与结果摘要（成功 N 条、失败 M 条及原因）。 |
| GOV-ENG-009 | - 全局 `mousemove/mouseup` 监听（列宽拖动）必须在拖动结束后移除；悬停浮起动画只动 `transform`，不触发重排。 |
| GOV-ENG-010 | 存量项目接入 v6 的标准模式:①vendored kit 生成 tokens.css 为唯一色彩真源(先于项目样式加载);②项目级 bridge 层只做别名映射(旧变量 → v6 令牌),禁止定义新色值(R4-03 扫描强制);③页面层硬编码收敛以 pilot:tokens-check 把关,RC 阈值:颜色零未授权裸值、间距/圆角/阴影命中率 ≥95%;④字体链随迁移包一并交付(fonts/noto.css + woff2 + FontFaceSet 验证,R4-02 教训);⑤业务逻辑、API 合同、路由零改动。 |
<!-- END:must-registry -->


<!-- M6-R1 试点回流增补(2026-09-14,来源:M5 三项目试点实践;台账:docs/release/v6-readiness.md) -->
## GOV-MIG-BRIDGE:vendored 令牌 + 项目桥接层迁移模式(试点回流,M5 三仓库实证)

存量项目接入 v6 的标准模式:①vendored kit 生成 tokens.css 为唯一色彩真源(先于项目样式加载);②项目级 bridge 层只做别名映射(旧变量 → v6 令牌),禁止定义新色值(R4-03 扫描强制);③页面层硬编码收敛以 pilot:tokens-check 把关,RC 阈值:颜色零未授权裸值、间距/圆角/阴影命中率 ≥95%;④字体链随迁移包一并交付(fonts/noto.css + woff2 + FontFaceSet 验证,R4-02 教训);⑤业务逻辑、API 合同、路由零改动。
