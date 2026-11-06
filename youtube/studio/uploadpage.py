"""업로드용 HTML 페이지 생성 (복사 버튼 포함).

    python -m studio.uploadpage episodes/ep06_bond

`out/upload_<에피소드>.html` 을 만듭니다. 제목은 meta.title(A안)과 meta.upload.alt_titles(B·C안),
짝 썸네일 설명은 meta.thumbnails 의 문구에서 가져옵니다. 기획서(01_plan.md)의 ⚠️ 줄은 '올리기 전 확인'으로 보여 줍니다.
"""
from __future__ import annotations

import html
import json
import os
import re
import sys

e = html.escape


def _warnings(ep_dir: str) -> list[str]:
    f = os.path.join(ep_dir, "01_plan.md")
    out = []
    if os.path.exists(f):
        for line in open(f, encoding="utf-8").read().splitlines():
            if "⚠️" in line and not line.lstrip().startswith(">"):
                t = re.sub(r"\s*\|\s*", " · ", line.strip().strip("|")).replace("**", "").replace("- [ ] ", "").strip(" ·")
                out.append(t[:240])
    return out[:8]


def build(ep_dir: str) -> str:
    ep_dir = ep_dir.rstrip("/")
    meta = json.load(open(os.path.join(ep_dir, "02_script.json"), encoding="utf-8"))["meta"]
    up = json.load(open(os.path.join(ep_dir, "out", "upload.json"), encoding="utf-8"))
    ep = meta.get("episode", os.path.basename(ep_dir))
    titles = [meta["title"]] + list(meta.get("upload", {}).get("alt_titles", []))
    thumbs = meta.get("thumbnails", {})
    ab = ""
    for i, k in enumerate("ABC"):
        if i >= len(titles):
            break
        t = thumbs.get(k, {})
        desc = f"{t.get('layout', 'classic')}형 · {t.get('palette', '')} · \"{(t.get('note') or '').replace(chr(10), ' ')}\" / {t.get('main', '')}"
        ab += (f'<div class="ab"><b>{k}안</b><br><span class="dim">짝 썸네일 → 썸네일 {k}: {e(desc)}</span>'
               f'<textarea readonly rows="2">{e(titles[i])}</textarea><button onclick="cp2(this)">복사</button></div>')

    def box(name, text, rows):
        return (f'<h3>{name} <button onclick="cp(this)">복사</button></h3>'
                f'<textarea readonly rows="{rows}">{e(text)}</textarea>')

    warn = "".join(f"<br>⚠️ {e(w.replace('⚠️', '').strip())}" for w in _warnings(ep_dir))
    page = f"""<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(ep)} 업로드 문구</title><style>
body{{font:15px/1.6 system-ui,sans-serif;max-width:820px;margin:0 auto;padding:16px;background:#fff;color:#222}}
@media(prefers-color-scheme:dark){{body{{background:#161a19;color:#e8eeec}}textarea{{background:#1d2422;color:#e8eeec;border-color:#3a4a45}}.ab{{border-color:#3a4a45}}}}
textarea{{width:100%;box-sizing:border-box;font:inherit;padding:8px;border:1px solid #ccc;border-radius:8px}}
button{{font:inherit;padding:4px 12px;border-radius:8px;border:1px solid #888;background:#ffd84a;cursor:pointer}}
h3{{margin:18px 0 6px}}.w{{background:#fff3cd;color:#5a4500;padding:10px;border-radius:8px;margin:8px 0}}.ab{{border:1px solid #ccc;border-radius:10px;padding:10px;margin:8px 0}}.dim{{opacity:.7;font-size:13px}}</style></head><body>
<h2>{e(ep)} 업로드 문구</h2>
<div class="w"><b>올리기 전 확인</b>{warn or '<br>(기획서에 남은 확인 항목이 없습니다)'}<br>시장 숫자는 영상에 적힌 기준일 기준입니다. 올리는 시점에 달라졌다면 설명란 첫 줄에 기준일을 한 줄 더 적으세요.</div>
<h3>A/B 테스트 세트 (제목 3안 + 짝 썸네일)</h3>
<div class="dim">제목과 썸네일을 동시에 바꾸면 어느 쪽 효과인지 알 수 없으니 한 번에 하나씩 테스트하세요. 제목 테스트 메뉴가 스튜디오에 있는지는 확인하지 못했습니다.</div>
{ab}
{box('설명 (챕터 포함)', up['description'], 18)}{box('태그 (쉼표로 구분)', ','.join(up['tags']), 4)}{box('고정 댓글 (게시 후 달기)', up.get('pinned_comment', ''), 4)}
<h3>스튜디오 설정</h3><ul><li>변경되거나 합성된 콘텐츠: 아니요 · 시청자층: 아동용 아님 · 카테고리: 교육</li><li>자막은 subtitles.srt 업로드</li></ul>
<script>function cp(b){{var t=b.parentNode.nextElementSibling;t.select();navigator.clipboard.writeText(t.value).then(function(){{b.textContent='복사됨'}},function(){{document.execCommand('copy');b.textContent='복사됨'}});setTimeout(function(){{b.textContent='복사'}},1500)}}
function cp2(b){{var t=b.previousElementSibling;t.select();navigator.clipboard.writeText(t.value).then(function(){{b.textContent='복사됨'}},function(){{document.execCommand('copy');b.textContent='복사됨'}});setTimeout(function(){{b.textContent='복사'}},1500)}}</script></body></html>"""
    name = "upload_" + ep.replace(".", "").lower() + ".html"
    path = os.path.join(ep_dir, "out", name)
    open(path, "w", encoding="utf-8").write(page)
    return path


if __name__ == "__main__":
    for d in sys.argv[1:]:
        print(build(d))
