# skeleton-static — 静态档骨架

Jinja2 模板 + ALE WebUI 令牌，构建产物为纯静态文件（适配 Nginx / 对象存储）。
适用：知识库、帮助中心、产品/内容门户（TSSKB 同类）。

## 使用

```bash
pip install -r requirements.txt
python build.py                 # templates/ + content.json → dist/
python -m http.server -d dist 8081
```

## 添加内容

编辑 `content.json`（home/article 两节），支持的块类型：

| 类型 | 字段 |
|---|---|
| `p` | text |
| `h2` | text |
| `ul` | items[] |
| `code` | text |
| `note` | text（警告条） |

标题层级必须连续（h1 → h2 → …），正文区限宽，正文 ≥16px。

## 站内搜索（Pagefind）

```bash
npm i -g pagefind          # 或 pip install pagefind
python build.py
pagefind --site dist
# 把 build.py 里 pagefind 开关改为 True，再 python build.py 一次
```

顶栏即出现搜索框（PagefindUI，中英文分词、无后端）。

## 结构

```text
templates/base.html      顶栏(3px 紫底条)+页脚(官方法律声明)+主题按钮
templates/index.html     渐变 Hero + 卡片入口（可交互卡片浮起）
templates/article.html   长文阅读（面包屑 + prose 限宽）
static/                  css(令牌四件套) + js(theme/static) + assets(官方 Logo)
content.json             演示内容（替换为你的）
build.py                 Jinja2 渲染 + 静态拷贝
```
