# ALE WebUI Kit

按《ALE-WEBUI-设计规范 v5.4.1》划分的三个项目骨架 + 一个共享层。所有骨架开箱即符合规范（品牌令牌 / 状态 / 动效 / 无障碍 / 14A 表格功能包）。

## 选型线

| 你的系统 | 用哪个骨架 |
|---|---|
| 登录 + 权限 + 复杂表格 + 导入导出（如 ale-dan-cpl-system） | `skeleton-react`（复杂档） |
| 单机/内网小工具，交互 ≤3 个视图（如 nvci-lite） | `skeleton-alpine`（轻量档） |
| 内容门户 / 知识库 / 产品站（如 TSSKB） | `skeleton-static`（静态档） |

> 升级阈值：轻量档一旦需要**完整 14A 表格功能包**或**登录态/权限**，直接迁移到复杂档——不要在 vanilla 里手搓第二套表格。

## 目录

```text
shared/                     ★ 共享层（唯一品牌值来源）
  css/tokens.css              规范 v5.4.1 第 6 章令牌 + 暗色映射（改品牌值只改这里）
  css/base.css                排版 / 焦点 / 减少动效
  css/layout.css              顶栏(3px 紫底条) / 容器 / 页脚 / 响应式
  css/components.css          按钮 / 卡片 / 徽章 / 表单 / 表格 / 分页 / 模态 / Toast / 步骤条
  js/theme.js                 亮暗主题（14A.7）
  js/i18n.js                  轻量多语言（14A.8 轻量模式）
  tailwind.preset.js          复杂档 Tailwind 预设（tokens → tailwind 映射）
tools/sync-shared.mjs       把 shared/ 同步到三个骨架
skeleton-react/             复杂档：Vite + TS + Tailwind + TanStack Table（14A 全功能封装）
skeleton-alpine/            轻量档：vanilla + Alpine.js（本地化 vendor，无 CDN 依赖）
skeleton-static/            静态档：Jinja2 + build.py + Pagefind 接入
```

## 铁律（规范 25/27 章）

1. **品牌值只存在于 `shared/css/tokens.css`**。任何骨架/项目不得另配色值；改完跑 `node tools/sync-shared.mjs`。
2. 组件 API 暴露语义不暴露视觉：`variant=primary|secondary|tertiary|danger`、`tone=neutral|info|success|warning|danger`。
3. 框架默认主题不是 ALE 品牌：复杂档初始化第一件事是把 preset 接好，再写业务组件。

## 快速开始

```bash
# 复杂档
cd skeleton-react && npm install && npm run dev

# 轻量档
cd skeleton-alpine && python -m http.server 8080

# 静态档
cd skeleton-static && pip install jinja2 && python build.py && python -m http.server -d dist 8081
```
