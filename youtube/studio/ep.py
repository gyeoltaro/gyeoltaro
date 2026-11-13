"""에피소드 제작 단계별 명령 — 어떤 작업자(모델·사람)든 같은 순서로 만들기 위한 한 줄 명령 모음.

  python -m studio.ep new 14 stagflation          # 새 편 폴더 만들기 (script.py · 01_plan.md 틀 복사)
  python -m studio.ep script  episodes/ep14_...   # script.py → 02_script.json, 음성 합성, 제목의 {MIN} 을 실제 길이로
  python -m studio.ep check   episodes/ep14_...   # 자동 품질 점검 (오류 0개가 될 때까지 고치기)
  python -m studio.ep stills  episodes/ep14_...   # 장면 미리보기 + 모아보기(out/sheets/*.jpg) → 눈으로 검수
  python -m studio.ep render  episodes/ep14_...   # 전체 영상 렌더링 (15~25분, 백그라운드로 실행 권장)
  python -m studio.ep verify  episodes/ep14_...   # 완성본 검사(길이·음량·검은 화면) + 400MB 넘으면 전송용 파일
  python -m studio.ep package episodes/ep14_...   # 업로드 페이지 + 업로드 센터 갱신
  python -m studio.ep status  episodes/ep14_...   # 어디까지 했는지 (중간에 끊겼을 때)

전체 절차와 판단 기준은 docs/PLAYBOOK.md 에 있습니다.
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
    d = os.path.join(ROOT, "episodes", f"ep{num:02d}_{a.slug}")
    if os.path.exists(d):
        raise SystemExit(f"이미 있습니다: {d}")
    os.makedirs(os.path.join(d, "out"))
    tdir = os.path.join(ROOT, "episodes", "_template")
    for f in ("script.py", "01_plan.md"):
        txt = open(os.path.join(tdir, f), encoding="utf-8").read().replace("EP.00", f"EP.{num:02d}").replace("ep00_template", f"ep{num:02d}_{a.slug}")
        open(os.path.join(d, f), "w", encoding="utf-8").write(txt)
    print(f"만들었습니다: {os.path.relpath(d, ROOT)}  (script.py 와 01_plan.md 를 채우세요 — docs/PLAYBOOK.md 2~4단계)")


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


def cmd_status(a):
    ep = _ep(a.episode)
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
    print(f"[상태] {os.path.relpath(ep, ROOT)}")
    for lab, ok in rows:
        print(f"  {'✓' if ok else '·'} {lab}")


def main(argv=None):
    ap = argparse.ArgumentParser(description="에피소드 제작 단계별 명령")
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("new"); p.add_argument("number"); p.add_argument("slug"); p.set_defaults(fn=cmd_new)
    for name, fn in (("script", cmd_script), ("stills", cmd_stills), ("verify", cmd_verify), ("package", cmd_package), ("status", cmd_status)):
        p = sub.add_parser(name); p.add_argument("episode"); p.set_defaults(fn=fn)
    p = sub.add_parser("check"); p.add_argument("episode"); p.add_argument("--quick", action="store_true"); p.set_defaults(fn=cmd_check)
    p = sub.add_parser("render"); p.add_argument("episode"); p.add_argument("--crf", type=int, default=None); p.set_defaults(fn=cmd_render)
    a = ap.parse_args(argv)
    a.fn(a)


if __name__ == "__main__":
    main()
