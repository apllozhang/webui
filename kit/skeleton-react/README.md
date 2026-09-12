# skeleton-react — 复杂档骨架

Vite + React 18 + TypeScript + Tailwind（ALE 预设）+ TanStack Table。
适用：登录/权限、复杂数据表格、导入导出的业务系统（ale-dan-cpl-system 同类）。

## 内含

- **DataTable**（`src/components/DataTable.tsx`）：14A 功能包完整封装
  排序（`aria-sort`）· 列宽拖动（`role=separator` + ←/→ 方向键，Shift 微调）· 单元格换行
  分页（10/20/50 + 首末/前后/省略号页码）· 300ms 防抖搜索 · 状态筛选 · 批量选择 + 危险确认 · 空态
- **Dialog**（规范 17 章）：`role=dialog` / `aria-modal` / Tab 焦点圈闭 / Esc / 焦点归还
- **Badge**：`tone=neutral|info|success|warning|danger`（圆点+文字）
- **ThemeToggle / LangToggle**（规范 14A.7/14A.8）
- **i18next** 中英双语，`<html lang>` 同步
- Tailwind 预设（`tailwind.preset.js`）：颜色/圆角/阴影/时长全部映射规范令牌，**文件内禁止出现具体色值**

## 使用

```bash
npm install
npm run dev        # 开发
npm run build      # 构建到 dist/
npm run typecheck  # tsc --noEmit
```

## 接业务

1. `src/pages/DemoPage.tsx` 是页面样板：复制改名，替换 `seedData()` 为你的接口数据；
2. 推荐服务端状态用 TanStack Query（`npm i @tanstack/react-query`），数据变换后的过滤仍交给 DataTable；
3. 路由按需加 `react-router`；DataTable/Dialog/Badge 与路由无关；
4. 主题色变更：改 `shared/css/tokens.css`（仓库根）→ `npm run sync-shared`。

## 与 shadcn/ui 的关系

本骨架的组件是按 shadcn 风格手写的最小集（无 CLI 依赖）。如果你要引入完整 shadcn/ui：
`npx shadcn@latest init` 后，把它的 CSS 变量层（`--background/--primary/--destructive`…）在
`src/index.css` 里映射到本骨架令牌即可，两者兼容。
