"""ALE WebUI Kit — 静态档构建脚本（Jinja2 → dist/）

用法：
    pip install jinja2
    python build.py            # 渲染 templates/*.html → dist/
    pagefind --site dist       # （可选）构建静态搜索索引
"""
from __future__ import annotations

import json
import shutil
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape

ROOT = Path(__file__).parent
TEMPLATES = ROOT / "templates"
STATIC = ROOT / "static"
DIST = ROOT / "dist"
CONTENT = ROOT / "content.json"

NAV = [
    {"label": "首页", "href": "/", "current": True},
    {"label": "文档", "href": "/article.html", "current": False},
]


def render() -> None:
    env = Environment(
        loader=FileSystemLoader(TEMPLATES),
        autoescape=select_autoescape(["html"]),
    )
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir(parents=True)

    data = json.loads(CONTENT.read_text(encoding="utf-8-sig"))
    common = {
        "site_name": data["site_name"],
        "nav": NAV,
        "pagefind": False,  # Pagefind 构建后改为 True（或用两遍构建）
    }

    (DIST / "index.html").write_text(
        env.get_template("index.html").render(**common, **data["home"]),
        encoding="utf-8",
    )
    (DIST / "article.html").write_text(
        env.get_template("article.html").render(**common, **data["article"]),
        encoding="utf-8",
    )
    shutil.copytree(STATIC, DIST / "static", dirs_exist_ok=True)
    # /assets 与 /css、/js 顶层路径（与 base.html 引用一致）
    shutil.copytree(STATIC / "assets", DIST / "assets", dirs_exist_ok=True)
    shutil.copytree(STATIC / "css", DIST / "css", dirs_exist_ok=True)
    shutil.copytree(STATIC / "js", DIST / "js", dirs_exist_ok=True)
    shutil.copytree(STATIC / "fonts", DIST / "fonts", dirs_exist_ok=True)

    print(f"OK → {DIST}（{len(list(DIST.rglob('*')))} files）")


if __name__ == "__main__":
    render()
