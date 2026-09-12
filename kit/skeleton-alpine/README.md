# skeleton-alpine — 轻量档骨架

vanilla HTML/JS + Alpine.js（已本地化到 `assets/vendor/alpine.min.js`，内网无 CDN 依赖）。
适用：单机/内网小工具、向导流程、轻量列表。样式 100% 来自 `assets/css/`（规范令牌）。

## 内含演示

- **14A 轻量表格**：排序（aria-sort）· 防抖搜索 300ms · 状态筛选 · 分页 · 空态。
  超出此复杂度（列宽拖动/批量/虚拟滚动）请升级 `skeleton-react`。
- **三步向导**（规范 8.3）：当前步高亮、已完成可回退、未到步禁用、跨步数据保持。
- **亮/暗主题**（`shared/js/theme.js`）与 **轻量 i18n**（`shared/js/i18n.js`）。

## 使用

```bash
python -m http.server 8080     # 或任意静态服务器
```

## 嵌入自己的页面

1. 拷贝 `assets/` 与 `index.html` 的顶栏/页脚结构；
2. 页面逻辑写在 `assets/js/demo.js` 同级的你自己的文件里，按 Alpine 组件函数组织；
3. 令牌改色：改 `shared/css/tokens.css` 后跑 `node ../tools/sync-shared.mjs`。

## 复制清单（脱离 kit 独立使用）

`index.html` + `assets/`（css 4 件、js 3 件、vendor/alpine.min.js、logo 两张）≈ 120KB 未压缩。
