# ALE WebUI 设计规范 v5.1 — 演示站点

本站点按《ALE-WEBUI-设计规范-v5.1》自举实现（网站本身即规范的活样例）：
品牌紫渐变 Hero、3px 品牌紫顶栏底条、当前导航双线索、按钮浮起-按压动画、
卡片浮动、状态徽章（圆点+文字）、14A 数据表格功能包（排序 / 列宽拖动(键盘可操作) /
换行 / 分页 / 防抖搜索 / 批量 / 亮暗主题 / 中英双语）、模态与 Toast、验收清单。

## 目录

```text
index.html          单页站点
css/tokens.css      规范第 6 章令牌（含暗色主题映射）
css/base.css        排版 / 焦点 / reduced-motion
css/layout.css      顶栏 / Hero / 响应式
css/components.css  按钮 / 卡片 / 表格 / 模态 / Toast / 分页
css/content.css     长文与展示
js/i18n.js          中英字典（14A.8 模式）
js/app.js           主题 / 导航 / 模态 / Toast
js/table.js         14A 功能包参考实现
assets/             官方 Logo（彩色版 + 反白版）
Dockerfile          nginx:alpine 静态站点
docker-compose.yml  一键部署（端口 8080）
```

## 本地运行

```bash
cd ale-webui-site
python -m http.server 8765        # 或任意静态服务器
# 打开 http://127.0.0.1:8765
```

## Docker 部署（目标机 10.20.30.203）

```bash
# 在目标机（需已装 docker）
mkdir -p ~/ale-webui-spec && cd ~/ale-webui-spec
# 把本目录上传后：
docker compose up -d --build
# 打开 http://10.20.30.203:8080
```

或用随附脚本（在开发机执行，需到目标机 22 端口可达）：

```bash
cd _deploy && node deploy.js        # 打包 + scp + docker build + run
```

## 品牌与法律

- Logo 与名称：Alcatel-Lucent Enterprise（官方资产，规范 2.1/2.2）
- 页脚法律声明为官方原文，发布前需法务复核版本有效。
