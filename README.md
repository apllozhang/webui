# ALE WebUI 设计体系

ALE 品牌下 B/S 系统的 WebUI 设计规范、演示站点与工程骨架。本仓库提交 **UI 设计专家评审**，入口材料：[`docs/UI专家评审汇报.md`](docs/UI专家评审汇报.md)。

## 仓库结构

```text
docs/
├─ UI专家评审汇报.md            ★ 评审入口：理念 / 方法论 / 业界对标 / 开放问题
├─ ALE-WEBUI-设计规范-v5.2.md   ★ 评审主文档（38 章 + 附录 A–G）
├─ ALE-WEBUI-设计规范-v5.1.md   上一版（对照 v5.2 变更）
├─ ALE-WEBUI-设计规范-v5.0.md   v5 系列（三形态锚定）
├─ ALE-WEBUI-设计规范-v4.1.md   上游通用版（历史）
└─ images/                      线上站点截图
spec-site/                      规范演示站（v5.2 的自举实现，纯 HTML/CSS/JS）
kit/                            ale-webui-kit 工程骨架
├─ shared/                      ★ 令牌唯一来源（tokens/base/layout/components + theme/i18n + tailwind preset）
├─ tools/sync-shared.mjs        共享层 → 三骨架同步脚本
├─ skeleton-react/              复杂档：Vite+TS+Tailwind+TanStack Table（14A 全功能）
├─ skeleton-alpine/             轻量档：vanilla + Alpine.js（本地 vendored）
└─ skeleton-static/             静态档：Jinja2 + build.py + Pagefind
deploy/                         两套站点的 Docker 部署脚本
references/                     证据链：TSSKB CSS 原件、dan-cpl-system 关键源码摘录
_contrast.py                    WCAG 对比度复算脚本（规范附录 G 数据来源）
```

## 在线演示（内网）

| 地址 | 内容 |
|---|---|
| http://10.10.10.218:8091 | 规范演示站：全部组件/14A 表格功能可交互，亮暗主题、中英切换 |
| http://10.10.10.218:8095 | Kit 导航 + React / Alpine / 静态三骨架活演示 |

## 本地运行

```bash
# 规范演示站
cd spec-site && python -m http.server 8765

# React 骨架
cd kit/skeleton-react && npm install && npm run dev

# Alpine 骨架
cd kit/skeleton-alpine && python -m http.server 8080

# 静态骨架
cd kit/skeleton-static && pip install jinja2 && python build.py
```

## 给评审人的三条快速通道

1. **只看文档**：`docs/UI专家评审汇报.md` → 规范 v5.2 第 1–3 章 → 附录 F（踩坑）→ 附录 G（对比度实测）；
2. **看实现**：`spec-site/index.html` 直接浏览器打开（或上面命令本地起服务），重点操作数据表格功能包；
3. **提意见**：GitHub Issues 或对 v5.2 逐条 comment，按"章节-条款"编号。所有意见将在 v5.3 逐条回应。

## 品牌与法律

- 品牌依据：Alcatel-Lucent Enterprise Corporate Brand Guidelines（September 2025）
- Logo 资产来自官方 Marketing Resources，仅用于内部演示
- 页脚法律声明为官方原文：The Alcatel-Lucent name and logo are trademarks of Nokia used under license by ALE.
