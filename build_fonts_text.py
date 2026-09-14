# C 方案(按文本子集):收割 spec-site 全部 HTML 用字 → pyftsubset → noto-text.css
# 用法:python build_fonts_text.py  (在仓库根运行;A/C 共存,互不影响)
import re
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parent
SPEC = ROOT / "spec-site"
SRC = ROOT / "kit" / "tools" / "node_modules" / "@fontsource" / "noto-sans-sc" / "files"
OUT = SPEC / "fonts" / "noto-text"
OUT.mkdir(parents=True, exist_ok=True)

# 1) 收割全部用字(HTML 文本 + 属性文案),含 ASCII 可打印与 CJK
chars = set()
for html in SPEC.rglob("*.html"):
    if "fonts-compare" in html.name:
        continue
    text = html.read_text(encoding="utf8")
    text = re.sub(r"<script[\s\S]*?</script>|<style[\s\S]*?</style>", "", text)
    for ch in text:
        if ch.isprintable() and not ch.isspace():
            chars.add(ch)
corpus = "".join(sorted(chars))
(ROOT / "fonts-text-corpus.txt").write_text(corpus, encoding="utf8")
print(f"corpus: {len(corpus)} unique chars")

# 2) 子集化 400/700(fontsource chinese-simplified 整块为源)
css_blocks = []
for weight in (400, 700):
    src = SRC / f"noto-sans-sc-chinese-simplified-{weight}-normal.woff2"
    out = OUT / f"noto-text-{weight}.woff2"
    subprocess.run([
        "pyftsubset", str(src),
        f"--text-file={ROOT / 'fonts-text-corpus.txt'}",
        f"--output-file={out}",
        "--flavor=woff2", "--layout-features=*",
    ], check=True)
    kb = out.stat().st_size // 1024
    print(f"noto-text-{weight}.woff2: {kb}KB")
    css_blocks.append(
        f"@font-face {{\n  font-family: 'Noto Sans SC';\n  font-style: normal;\n  font-display: swap;\n"
        f"  font-weight: {weight};\n  src: url(./noto-text/noto-text-{weight}.woff2) format('woff2');\n}}"
    )

# 3) noto-text.css(C 方案入口;与 A 方案 noto.css 共存,链接哪个用哪个)
(OUT.parent / "noto-text.css").write_text(
    "/* C 方案:按文本子集(由 build_fonts_text.py 生成,勿手改;字库来源 fonts-text-corpus.txt) */\n"
    + "\n".join(css_blocks) + "\n",
    encoding="utf8",
)
print("noto-text.css written")
