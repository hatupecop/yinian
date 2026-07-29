# -*- coding: utf-8 -*-
import urllib.request, urllib.parse, re, base64, sys

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"

# (显示名, family 查询串, 该字体实际用到的样本文字)
fonts = [
    ("Great Vibes", "Great+Vibes", "K's Room Bonsoir Lettie"),
    ("Alex Brush", "Alex+Brush", "K's Room Bonsoir Lettie"),
    ("Parisienne", "Parisienne", "K's Room Bonsoir Lettie"),
    ("Dancing Script", "Dancing+Script:wght@400;700", "K's Room Bonsoir Lettie"),
    ("Satisfy", "Satisfy", "K's Room Bonsoir Lettie"),
    ("Pinyon Script", "Pinyon+Script", "K's Room Bonsoir Lettie"),
    ("Playfair Display", "Playfair+Display:ital,wght@0,400;0,700;1,400;1,700", "59 DAYS JULY 2026 XI XV July Eleven Fifteen 7.25 · 11:15"),
    ("Cinzel", "Cinzel:wght@400;600", "59 DAYS JULY 2026 XI XV 7.25"),
    ("Cormorant Garamond", "Cormorant+Garamond:ital,wght@0,400;0,600;1,400", "59 Days July Eleven Fifteen 7.25"),
    ("Poppins", "Poppins:wght@400;600", "MOOD SPACE SWEET"),
    ("Montserrat", "Montserrat:wght@500;700", "MOOD OUR STORY TODAY HELLO SWEET"),
    ("Ma Shan Zheng", "Ma+Shan+Zheng", "余年我们的故事晚安在一起的第天余生请多指教念念不忘必有回响温柔慢慢来想你"),
    ("Zhi Mang Xing", "Zhi+Mang+Xing", "余年在一起的第天余生请多指教"),
    ("Long Cang", "Long+Cang", "余年余生请多指教"),
    ("Liu Jian Mao Cao", "Liu+Jian+Mao+Cao", "余年念念不忘必有回响"),
    ("ZCOOL XiaoWei", "ZCOOL+XiaoWei", "余年温柔慢慢来想你"),
    ("Noto Serif SC", "Noto+Serif+SC:wght@400;600", "愿余年有你岁岁皆欢喜把每一个平凡的日子过成值得收藏的纪念"),
    ("Noto Sans SC", "Noto+Sans+SC:wght@400;500", "愿余年有你岁岁皆欢喜把每一个平凡的日子过成值得收藏的纪念"),
]

def fetch(url, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read() if binary else r.read().decode("utf-8")

faces = []
for name, q, text in fonts:
    try:
        css = fetch("https://fonts.googleapis.com/css2?family=" + q + "&text=" + urllib.parse.quote(text, safe=""))
    except Exception as e:
        print("ERR css", name, e, file=sys.stderr); continue
    blocks = re.findall(r'@font-face\s*\{[^}]*\}', css, re.S)
    if not blocks:
        print("WARN no @font-face for", name, file=sys.stderr); continue
    for b in blocks:
        fm = re.search(r"font-family:\s*'([^']+)'", b)
        st = re.search(r"font-style:\s*(\w+)", b)
        wt = re.search(r"font-weight:\s*(\d+)", b)
        um = re.search(r"src:\s*url\((https://fonts\.gstatic\.com[^)]+)\)", b)
        ur = re.search(r"unicode-range:\s*([^;]+);", b)
        if not (fm and um): continue
        try:
            data = fetch(um.group(1), binary=True)
        except Exception as e:
            print("ERR dl", name, e, file=sys.stderr); continue
        b64 = base64.b64encode(data).decode()
        faces.append((fm.group(1), st.group(1) if st else "normal", wt.group(1) if wt else "400", b64, ur.group(1).strip() if ur else ""))
        print("OK", name, st.group(1) if st else "normal", wt.group(1) if wt else "400", len(data), file=sys.stderr)

css_lines = []
for fam, style, weight, b64, ur in faces:
    urcss = ("unicode-range:%s;" % ur) if ur else ""
    css_lines.append(
        "@font-face{font-family:'%s';font-style:%s;font-weight:%s;src:url(data:font/woff2;base64,%s) format('woff2');%sfont-display:swap;}"
        % (fam, style, weight, b64, urcss)
    )
css_block = "\n".join(css_lines)
print("TOTAL_FACES=%d TOTAL_BYTES=%d" % (len(faces), len(css_block)), file=sys.stderr)

src_path = r"C:\ProgramData\WorkBuddy\chromium-env\1fqs7q8\WorkBuddy\2026-07-28-08-10-00\yinian\font-preview.html"
src = open(src_path, encoding="utf-8").read()
new_head = "<style>\n/* ===== 离线内嵌字体（base64 woff2，无需联网，必显示） ===== */\n" + css_block + "\n</style>"
pat = re.compile(r'<link rel="preconnect" href="https://fonts\.googleapis\.cn" />.*?rel="stylesheet"\s*/>', re.S)
src2, n = pat.subn(new_head, src)
if n == 0:
    # 链接块已不存在（被上一次空运行删掉），改为插入到 </title> 之后
    print("link block gone, inserting before <style>...", file=sys.stderr)
    src2 = src.replace("<style>\n  :root {", new_head + "\n\n<style>\n  :root {", 1)
    if src2 == src:
        # 兜底：插到 </title> 后
        src2 = src.replace("</title>", "</title>\n" + new_head, 1)
# 更新提示文案
src2 = src2.replace(
    "⚠️ 字体已改用 Google Fonts 国内镜像（fonts.googleapis.cn / fonts.gstatic.cn），国内直连可加载。若某块仍显示成普通字体，多半是浏览器缓存——请强制刷新（Ctrl+F5）或重开本文件。无网络时可用离线版 font-compare.html（6 款拉丁手写体内嵌）。",
    "✅ 字体已 100% 内嵌进本文件（base64 woff2），完全离线、不需要联网，打开即显示。请强制刷新（Ctrl+F5）清掉旧缓存再看。"
)
open(src_path, "w", encoding="utf-8").write(src2)
print("WROTE", src_path, "replaced_link_blocks=", n, file=sys.stderr)
