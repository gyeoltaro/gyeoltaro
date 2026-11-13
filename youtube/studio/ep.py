"""에피소드 제작 단계별 명령 — 어떤 작업자(모델·사람)든 같은 순서로 만들기 위한 한 줄 명령 모음.

  python -m studio.ep new 14 stagflation          # 새 편 폴더 만들기 (script.py · 01_plan.md 틀 복사)
  python -m studio.ep script  episodes/ep14_...   # script.py → 02_script.json, 음성 합성, 제목의 {MIN} 을 실제 길이로
  python -m studio.ep check   episodes/ep14_...   # 자동 품질 점검 (오류 0개가 될 때까지 고치기)
  python -m studio.ep stills  episodes/ep14_...   # 장면 미리보기 + 모아보기(out/sheets/*.jpg) → 눈으로 검수
  python -m studio.ep render  episodes/ep14_...   # 전체 영상 렌더링 (15~25분, 백그라운드로 실행 권장)
  python -m studio.ep verify  episodes/ep14_...   # 완성본 검사(길이·음량·검은 화면) + 400MB 넘으면 전송용 파일
  python -m studio.ep package episodes/ep14_...   # 업로드 페이지 + 업로드 센터 갱신
  python -m studio.ep status  [episodes/ep14_...] # 어디까지 했는지 (폴더를 안 주면 전체 편 목록)
  python -m studio.ep example timeline            # 그 그림 종류를 실제로 쓴 장면 예시 (종류를 안 주면 전체 목록)
  python -m studio.ep gallery                     # 그림 종류 모아보기 그림(docs/visuals/*.jpg) 다시 만들기
  python -m studio.ep precommit                   # 커밋 직전: 올리려는 변경에 API 키·큰 파일이 없는지 검사

전체 절차와 판단 기준은 docs/PLAYBOOK.md, 그림 종류는 docs/VISUALS.md 에 있습니다.
"""
from __future__ import annotations

import argparse
import copy
import glob
import json
import os
import re
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEND_LIMIT_MB = 380      # 이보다 크면 전송용(video_send.mp4)을 따로 만든다 (보내기 한도 400MB)


def _ep(path):
    p = os.path.abspath(path)
    if not os.path.isdir(p):
        raise SystemExit(f"폴더가 없습니다: {path}")
    return p


def _run(cmd, **kw):
    env = dict(os.environ, PYTHONPATH=ROOT + os.pathsep + os.environ.get("PYTHONPATH", ""))
    return subprocess.run(cmd, cwd=ROOT, env=env, **kw)


def _load(ep):
    return json.load(open(os.path.join(ep, "02_script.json"), encoding="utf-8"))


def _timeline(ep):
    from .timeline import build
    return build(copy.deepcopy(_load(ep)), ep, os.path.join(ROOT, "cache"))


def _sheets(files, out_dir, name, cols=3, rows=4, size=(640, 360)):
    from PIL import Image
    os.makedirs(out_dir, exist_ok=True)
    for old in glob.glob(os.path.join(out_dir, f"{name}_*.jpg")):
        os.remove(old)
    paths = []
    per = cols * rows
    for k in range(0, len(files), per):
        part = files[k:k + per]
        im = Image.new("RGB", (cols * size[0], ((len(part) + cols - 1) // cols) * size[1]))
        for j, f in enumerate(part):
            im.paste(Image.open(f).convert("RGB").resize(size), ((j % cols) * size[0], (j // cols) * size[1]))
        p = os.path.join(out_dir, f"{name}_{k // per}.jpg")
        im.save(p, quality=85)
        paths.append(p)
    return paths


# ---------------------------------------------------------------- 명령

def cmd_new(a):
    num = int(a.number)
    slug = re.sub(r"[^a-z0-9_]", "", a.slug.lower().replace("-", "_"))
    if not slug:
        raise SystemExit("폴더 이름(slug)은 영어 소문자·숫자·밑줄로 쓰세요. 예: stagflation")
    d = os.path.join(ROOT, "episodes", f"ep{num:02d}_{slug}")
    if os.path.exists(d) or glob.glob(os.path.join(ROOT, "episodes", f"ep{num:02d}_*")):
        raise SystemExit(f"EP.{num:02d} 폴더가 이미 있습니다: " + ", ".join(glob.glob(os.path.join(ROOT, "episodes", f"ep{num:02d}_*"))))
    os.makedirs(os.path.join(d, "out"))
    tdir = os.path.join(ROOT, "episodes", "_starter")
    for f in ("script.py", "01_plan.md"):
        txt = open(os.path.join(tdir, f), encoding="utf-8").read().replace("EP.00", f"EP.{num:02d}").replace("ep00_starter", f"ep{num:02d}_{slug}")
        open(os.path.join(d, f), "w", encoding="utf-8").write(txt)
    print(f"만들었습니다: {os.path.relpath(d, ROOT)}")
    print("  1) 01_plan.md — 주제 근거·제목 A/B/C·구성표·사실 확인표를 먼저 채웁니다 (docs/PLAYBOOK.md 1~3단계)")
    print("  2) script.py  — ○○ 로 표시된 곳을 모두 실제 내용으로 바꾸고 파트를 늘립니다 (표준 예시: episodes/ep13_qe_qt/script.py)")
    print("  3) python -m studio.ep script " + os.path.relpath(d, ROOT))


def cmd_script(a):
    ep = _ep(a.episode)
    sp = os.path.join(ep, "script.py")
    if os.path.exists(sp):
        r = _run([sys.executable, sp])
        if r.returncode:
            raise SystemExit("script.py 실행 실패 — 위 메시지를 보고 고치세요.")
    elif not os.path.exists(os.path.join(ep, "02_script.json")):
        raise SystemExit("script.py 도 02_script.json 도 없습니다.")
    path = os.path.join(ep, "02_script.json")
    raw = open(path, encoding="utf-8").read()
    tl = _timeline(ep)            # 음성 합성(처음엔 몇 분 걸림, 이후엔 캐시)
    mins = round(tl["total"] / 60)
    if "{MIN}" in raw:
        open(path, "w", encoding="utf-8").write(raw.replace("{MIN}", str(mins)))
    s = _load(ep)
    print(f"길이 {int(tl['total'] // 60)}분 {int(tl['total'] % 60):02d}초 → 제목의 분 표기 = {mins}분")
    for i, t in enumerate([s["meta"]["title"]] + list(s["meta"].get("upload", {}).get("alt_titles", []))):
        print(f"  제목 {'ABC'[i]}: {t}")
    print("다음: python -m studio.ep check " + os.path.relpath(ep, ROOT))


def cmd_check(a):
    from . import check
    ep = _ep(a.episode)
    R, _ = check.run(ep, quick=a.quick)
    check.print_report(R, ep)
    os.makedirs(os.path.join(ep, "out"), exist_ok=True)
    json.dump([{"level": lv, "code": c, "msg": m, "where": w} for lv, c, m, w in R.items],
              open(os.path.join(ep, "out", "check.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    sys.exit(1 if R.n_err else 0)


def cmd_stills(a):
    ep = _ep(a.episode)
    sd = os.path.join(ep, "out", "stills")
    shutil.rmtree(sd, ignore_errors=True)
    r = _run([sys.executable, "-m", "studio.build", ep, "--stills"])
    if r.returncode:
        raise SystemExit("미리보기 생성 실패")
    files = sorted(glob.glob(os.path.join(sd, "s*.png")))
    sheets = _sheets(files, os.path.join(ep, "out", "sheets"), "sheet")
    th = [os.path.join(ep, "out", f"thumbnail_{k}.png") for k in "ABC"]
    th = [t for t in th if os.path.exists(t)]
    if th:
        sheets += _sheets(th, os.path.join(ep, "out", "sheets"), "thumbs", cols=3, rows=1)
    print(f"\n미리보기 {len(files)}장. 아래 모아보기를 하나씩 열어(Read) 눈으로 검수하세요 — 글자 겹침·잘림·빈 화면·틀린 숫자:")
    for p in sheets:
        print("  " + p)
    print("각 장면은 길이의 80% 시점 화면입니다. 고칠 곳이 있으면 script.py 를 고치고 script → check → stills 를 다시.")


def cmd_render(a):
    ep = _ep(a.episode)
    r = _run([sys.executable, "-m", "studio.build", ep] + (["--crf", str(a.crf)] if a.crf else []))
    if r.returncode:
        raise SystemExit("렌더링 실패")
    print("다음: python -m studio.ep verify " + os.path.relpath(ep, ROOT))


def _probe(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate:format=duration",
                          "-of", "json", path], capture_output=True, text=True).stdout
    j = json.loads(out)
    st = j["streams"][0]
    num, den = st["r_frame_rate"].split("/")
    return float(j["format"]["duration"]), st["width"], st["height"], float(num) / float(den)


def cmd_verify(a):
    from PIL import Image
    import numpy as np
    ep = _ep(a.episode)
    vid = os.path.join(ep, "out", "video.mp4")
    if not os.path.exists(vid):
        raise SystemExit("out/video.mp4 가 없습니다 → 먼저 render")
    ok = True
    dur, w, h, fps = _probe(vid)
    tl = _timeline(ep)
    size_mb = os.path.getsize(vid) / 1048576
    print(f"영상: {int(dur // 60)}분 {int(dur % 60):02d}초 · {w}x{h} · {fps:.0f}fps · {size_mb:.0f}MB")
    if abs(dur - tl["total"]) > 2:
        ok = False
        print(f"  ✖ 길이가 대본({tl['total']:.0f}초)과 {abs(dur - tl['total']):.0f}초 다릅니다 → 대본을 고친 뒤 다시 렌더링했는지 확인")
    if (w, h) != (1920, 1080) or round(fps) != 30:
        ok = False
        print("  ✖ 해상도·프레임이 1920x1080 30fps 가 아닙니다")
    lo = subprocess.run(["ffmpeg", "-nostats", "-i", vid, "-map", "0:a", "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    m = re.findall(r"I:\s+(-?\d+\.\d+) LUFS", lo)
    if m:
        lufs = float(m[-1])
        print(f"음량: {lufs} LUFS (기준 -14 ± 1)")
        if abs(lufs + 14) > 1.0:
            ok = False
            print("  ✖ 음량이 기준을 벗어났습니다")
    else:
        ok = False
        print("  ✖ 소리를 읽지 못했습니다 (오디오 없음?)")
    sd = os.path.join(ep, "out", "sheets")
    os.makedirs(sd, exist_ok=True)
    frames = []
    for i in range(12):
        t = dur * (i + 0.5) / 12
        f = os.path.join(sd, f"_v{i:02d}.png")
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{t:.1f}", "-i", vid, "-frames:v", "1", "-vf", "scale=640:-1", f])
        if os.path.exists(f):
            frames.append(f)
            if np.asarray(Image.open(f).convert("L")).mean() < 8:
                ok = False
                print(f"  ✖ {int(t // 60)}:{int(t % 60):02d} 화면이 거의 검정입니다")
    sheet = _sheets(frames, sd, "verify")
    for f in frames:
        os.remove(f)
    print("완성본 화면 12장: " + (sheet[0] if sheet else "(없음)") + "  ← 열어서 확인")
    send = vid
    if size_mb > SEND_LIMIT_MB:
        send = os.path.join(ep, "out", "video_send.mp4")
        kbps = max(500, int(350 * 8192 / dur - 140))
        scale = ["-vf", "scale=1280:720"] if kbps < 900 else []
        print(f"파일이 {size_mb:.0f}MB 라서 전송용을 만듭니다 ({kbps}kbps{' · 720p' if scale else ''}) …")
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", vid, "-c:v", "libx264", "-preset", "veryfast", "-b:v", f"{kbps}k",
                        "-maxrate", f"{int(kbps * 1.2)}k", "-bufsize", f"{kbps * 2}k"] + scale + ["-c:a", "copy", "-movflags", "+faststart", send])
        print(f"  전송용: {send} ({os.path.getsize(send) / 1048576:.0f}MB)")
    print(("검사 통과. " if ok else "검사에서 문제가 나왔습니다 — 고친 뒤 다시. ") + f"사용자에게 보낼 영상 파일: {send}")
    sys.exit(0 if ok else 1)


def cmd_package(a):
    ep = _ep(a.episode)
    _run([sys.executable, "-m", "studio.uploadpage", ep])
    from . import hub
    eps, new_thumbs = hub.build()
    key = os.path.basename(ep)
    print(f"업로드 센터 갱신: {hub.OUT} ({len(eps)}편)")
    files = {rel: path for rel, path in new_thumbs} or {f"th/{key}_{k}.jpg": os.path.join(hub.TH, f"{key}_{k}.jpg") for k in "ABC"}
    print("아티팩트 게시(Artifact 도구): url=" + hub.HUB_URL)
    print("  file_path=" + hub.OUT)
    print("  files=" + json.dumps(files, ensure_ascii=False))
    print("  (다른 대화에서 처음 게시할 때는 먼저 action: read 로 위 주소를 읽어야 합니다)")
    out = os.path.join(ep, "out")
    send = os.path.join(out, "video_send.mp4") if os.path.exists(os.path.join(out, "video_send.mp4")) else os.path.join(out, "video.mp4")
    print("사용자에게 보낼 파일(SendUserFile): " + ", ".join([send, os.path.join(out, "subtitles.srt")] + [os.path.join(out, f"thumbnail_{k}.png") for k in "ABC"]))


def _status_rows(ep):
    out = os.path.join(ep, "out")

    def has(*p):
        return os.path.exists(os.path.join(ep, *p))
    rows = [("01_plan.md (기획서·사실 확인표)", has("01_plan.md")), ("script.py (대본 소스)", has("script.py")),
            ("02_script.json (대본)", has("02_script.json"))]
    if has("02_script.json"):
        rows.append(("  제목의 {MIN} 채움", "{MIN}" not in open(os.path.join(ep, "02_script.json"), encoding="utf-8").read()))
    if has("out", "check.json"):
        items = json.load(open(os.path.join(out, "check.json"), encoding="utf-8"))
        ne = sum(1 for i in items if i["level"] == "E")
        rows.append((f"점검 (오류 {ne}개, 경고 {sum(1 for i in items if i['level'] == 'W')}개)", ne == 0))
    else:
        rows.append(("점검(check) 실행", False))
    rows += [(f"미리보기 {len(glob.glob(os.path.join(out, 'stills', '*.png')))}장", bool(glob.glob(os.path.join(out, "stills", "*.png")))),
             ("영상 out/video.mp4", has("out", "video.mp4")), ("자막 out/subtitles.srt", has("out", "subtitles.srt")),
             ("썸네일 A/B/C", all(has("out", f"thumbnail_{k}.png") for k in "ABC")),
             ("업로드 페이지", bool(glob.glob(os.path.join(out, "upload_ep*.html"))))]
    return rows


def cmd_status(a):
    if a.episode:
        ep = _ep(a.episode)
        print(f"[상태] {os.path.relpath(ep, ROOT)}")
        for lab, ok in _status_rows(ep):
            print(f"  {'✓' if ok else '·'} {lab}")
        return
    # 전체 목록: 편마다 한 줄. (영상 파일은 저장소에 올리지 않으므로 새 작업 공간에서는 '영상 ·' 로 보이는 것이 정상)
    eps = sorted(glob.glob(os.path.join(ROOT, "episodes", "ep[0-9]*")))
    print("[전체 편] 대본 / 썸네일 / 업로드 페이지 / 영상 파일(이 작업 공간에 있을 때만 ✓)")
    last = 0
    for ep in eps:
        try:
            m = _load(ep)["meta"]
        except (OSError, ValueError):
            m = {}
        num = re.match(r"ep(\d+)", os.path.basename(ep))
        last = max(last, int(num.group(1)) if num else 0)

        def has(*p, ep=ep):
            return os.path.exists(os.path.join(ep, *p))
        marks = "".join("✓" if x else "·" for x in (has("02_script.json"), all(has("out", f"thumbnail_{k}.png") for k in "ABC"),
                                                    bool(glob.glob(os.path.join(ep, "out", "upload_ep*.html"))), has("out", "video.mp4")))
        print(f"  {marks}  {os.path.basename(ep):28s} {m.get('title', '')[:60]}")
    print(f"다음 편 번호: EP.{last + 1:02d}  →  python -m studio.ep new {last + 1} <영어이름>   (주제는 docs/STATUS.md 와 docs/03_roadmap_100.md 참고)")


def _examples(ty):
    """그 그림 종류를 쓴 장면을 최근 편부터 찾는다."""
    found = []
    for ep in sorted(glob.glob(os.path.join(ROOT, "episodes", "ep[0-9]*")), reverse=True):
        try:
            sc = _load(ep)
        except (OSError, ValueError):
            continue
        for s in sc["scenes"]:
            if s["visual"].get("type") == ty:
                found.append((ep, s))
    return found


def cmd_example(a):
    from .visuals import VISUALS
    if not a.type:
        counts = {}
        for ep in glob.glob(os.path.join(ROOT, "episodes", "ep[0-9]*")):
            try:
                for s in _load(ep)["scenes"]:
                    counts[s["visual"].get("type")] = counts.get(s["visual"].get("type"), 0) + 1
            except (OSError, ValueError):
                pass
        print("그림 종류 (지금까지 쓴 횟수) — 자세한 설명은 docs/VISUALS.md, 생김새는 docs/visuals/*.jpg")
        for ty in sorted(VISUALS, key=lambda t: -counts.get(t, 0)):
            print(f"  {ty:12s} {counts.get(ty, 0)}")
        return
    if a.type not in VISUALS:
        raise SystemExit(f"없는 그림 종류: {a.type}  (목록: python -m studio.ep example)")
    found = _examples(a.type)
    if not found:
        raise SystemExit("아직 이 종류를 쓴 장면이 없습니다. docs/VISUALS.md 의 예시를 보세요.")
    for ep, s in found[:a.n]:
        print(f"# {os.path.basename(ep)} · {s['id']}   (미리보기: {os.path.relpath(ep, ROOT)}/out/stills/{s['id']}.png — stills 를 만든 뒤)")
        print(json.dumps({k: s[k] for k in ("mascot", "visual", "lines") if k in s}, ensure_ascii=False, indent=1))
        print()
    print(f"({len(found)}개 중 {min(a.n, len(found))}개. 등장 시점(at)의 숫자는 '@줄:키워드' 가 풀린 값입니다 — 새로 쓸 때는 '@줄:키워드' 로 쓰세요.)")


def cmd_gallery(a):
    """그림 종류마다 실제 장면 한 장씩 뽑아 이름표를 붙인 모아보기 그림을 만든다 (docs/visuals/gallery_N.jpg)."""
    from PIL import Image, ImageDraw, ImageFont
    from .render import still
    from .visuals import VISUALS
    out_dir = os.path.join(ROOT, "docs", "visuals")
    tmp = os.path.join(ROOT, "cache", "gallery")
    os.makedirs(out_dir, exist_ok=True)
    os.makedirs(tmp, exist_ok=True)
    pick = {}
    for ty in VISUALS:
        ex = _examples(ty)
        if ex:
            # 요소가 가장 많은(가장 풍부한) 예시를 고른다
            pick[ty] = max(ex[:12], key=lambda e: len(json.dumps(e[1]["visual"], ensure_ascii=False)))
    by_ep = {}
    for ty, (ep, s) in pick.items():
        by_ep.setdefault(ep, []).append((ty, s["id"]))
    shots = {}
    for ep, items in sorted(by_ep.items()):
        tl = _timeline(ep)
        tl.pop("voice_track", None)
        for ty, sid in items:
            s = next(x for x in tl["scenes"] if x["id"] == sid)
            f = os.path.join(tmp, f"{ty}.png")
            still(tl, s["f0"] + int(s["nf"] * 0.9), f)
            shots[ty] = (f, os.path.basename(ep), sid)
        print(f"  {os.path.basename(ep)}: {len(items)}장")
    font = ImageFont.truetype(os.path.join(ROOT, "assets", "fonts", "GothicA1-Bold.ttf"), 26)
    order = [t for t in VISUALS if t in shots]
    cols, rows, size = 3, 4, (640, 360)
    for old in glob.glob(os.path.join(out_dir, "gallery_*.jpg")):
        os.remove(old)
    for k in range(0, len(order), cols * rows):
        part = order[k:k + cols * rows]
        im = Image.new("RGB", (cols * size[0], ((len(part) + cols - 1) // cols) * size[1]), "#111")
        dr = ImageDraw.Draw(im)
        for j, ty in enumerate(part):
            f, epn, sid = shots[ty]
            x, y = (j % cols) * size[0], (j // cols) * size[1]
            im.paste(Image.open(f).convert("RGB").resize(size), (x, y))
            lab = f"{ty}  ({epn[:4]} {sid})"
            w = dr.textlength(lab, font=font)
            dr.rectangle([x, y, x + w + 20, y + 40], fill="#FFE81A")
            dr.text((x + 10, y + 5), lab, font=font, fill="#111")
        p = os.path.join(out_dir, f"gallery_{k // (cols * rows) + 1}.jpg")
        im.save(p, quality=82)
        print("저장: " + os.path.relpath(p, ROOT))
    missing = [t for t in VISUALS if t not in shots]
    if missing:
        print("아직 쓴 적이 없어 빠진 종류: " + ", ".join(missing))


def cmd_precommit(a):
    """커밋 직전 검사: 올리려는 변경(git add 한 것) 안에 API 키·큰 파일이 없는지 본다."""
    repo = os.path.dirname(ROOT)

    def git(*args):
        return subprocess.run(["git", "-C", repo] + list(args), capture_output=True, text=True).stdout
    diff = git("diff", "--cached", "--unified=0")
    names = [n for n in git("diff", "--cached", "--name-only").splitlines() if n]
    if not names:
        raise SystemExit("올릴 변경이 없습니다 (먼저 git add).")
    bad = []
    added = "\n".join(ln[1:] for ln in diff.splitlines() if ln.startswith("+") and not ln.startswith("+++"))
    if re.search(r"AIza[0-9A-Za-z_\-]{30,}", added):
        bad.append("API 키로 보이는 문자열이 들어 있습니다 (AIza…)")
    secrets = [os.environ.get("B911_YT_API_KEY", "").strip()]
    sf = os.path.join(ROOT, ".secrets", "youtube_api_key.txt")
    if os.path.exists(sf):
        secrets.append(open(sf, encoding="utf-8").read().strip())
    if any(len(k) > 12 and k in added for k in secrets):
        bad.append("저장된 API 키 값이 변경 내용에 들어 있습니다")
    for n in names:
        f = os.path.join(repo, n)
        if os.path.exists(f) and os.path.getsize(f) > 20 * 1048576:
            bad.append(f"20MB 넘는 파일: {n} (영상은 저장소에 올리지 않습니다)")
        if n.endswith((".mp4", ".wav")) or "/.secrets/" in n or "/dashboard/dist/" in n:
            bad.append(f"올리면 안 되는 파일: {n}")
    print(f"[커밋 전 검사] 파일 {len(names)}개")
    for b in bad:
        print("  ✖ " + b)
    if bad:
        raise SystemExit("문제를 고친 뒤(git restore --staged <파일>) 다시 검사하세요. 커밋하지 마세요.")
    print("  통과 — 이제 git commit, git push 를 해도 됩니다.")


def main(argv=None):
    ap = argparse.ArgumentParser(description="에피소드 제작 단계별 명령")
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("new"); p.add_argument("number"); p.add_argument("slug"); p.set_defaults(fn=cmd_new)
    for name, fn in (("script", cmd_script), ("stills", cmd_stills), ("verify", cmd_verify), ("package", cmd_package)):
        p = sub.add_parser(name); p.add_argument("episode"); p.set_defaults(fn=fn)
    p = sub.add_parser("status"); p.add_argument("episode", nargs="?"); p.set_defaults(fn=cmd_status)
    p = sub.add_parser("check"); p.add_argument("episode"); p.add_argument("--quick", action="store_true"); p.set_defaults(fn=cmd_check)
    p = sub.add_parser("render"); p.add_argument("episode"); p.add_argument("--crf", type=int, default=None); p.set_defaults(fn=cmd_render)
    p = sub.add_parser("example"); p.add_argument("type", nargs="?"); p.add_argument("--n", type=int, default=2); p.set_defaults(fn=cmd_example)
    p = sub.add_parser("gallery"); p.set_defaults(fn=cmd_gallery)
    p = sub.add_parser("precommit"); p.set_defaults(fn=cmd_precommit)
    a = ap.parse_args(argv)
    a.fn(a)


if __name__ == "__main__":
    main()
