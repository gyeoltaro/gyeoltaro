"""대시보드(dashboard/index.html)에 저장소 데이터를 넣는 스크립트.

  python -m studio.dashboard              # 에피소드/테마/스냅샷을 반영해 index.html 갱신
  python -m studio.dashboard --refresh    # (yt-dlp 설치 시) 채널 공개 데이터 스냅샷도 새로 받기

브라우저에서 index.html 을 열면 바로 동작하고, '채널 연결 설정'에 YouTube Data API 키를 넣으면
구독자·조회수·좋아요·업로드 날짜를 실시간으로 가져옵니다.
"""
from __future__ import annotations

import argparse
import datetime as dt
import glob
import json
import os
import re
import shutil
import subprocess

from .core import DEFAULT_THEME, THEMES

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DASH = os.path.join(ROOT, "dashboard")
CHANNEL_ID = "UCm879ZUxkV6mqZFqNVUcwZg"
REPO = "https://github.com/gyeoltaro/gyeoltaro/blob/main/youtube"

REGIONS = {
    "frontal": {"lobe": "전두엽", "name": "기획·아이디어", "color": "#FFD43B", "c": [320, 260], "r": [130, 95], "label_at": [300, 330]},
    "parietal": {"lobe": "두정엽", "name": "학습한 개념", "color": "#3BE07A", "c": [640, 210], "r": [110, 70], "label_at": [650, 280]},
    "occipital": {"lobe": "후두엽", "name": "연출·썸네일", "color": "#B58CFF", "c": [790, 340], "r": [50, 60], "label_at": [800, 270]},
    "temporal": {"lobe": "측두엽", "name": "영상 시리즈", "color": "#5AA9FF", "c": [480, 450], "r": [150, 35], "label_at": [470, 400]},
    "cerebellum": {"lobe": "소뇌", "name": "루틴·습관", "color": "#FF8F8F", "c": [752, 515], "r": [70, 30], "label_at": [752, 568]},
}

BRAIN_NODES = [
    # 전두엽: 기획·아이디어
    ("n_ep02", "EP.02 금리의 모든 것", "frontal", 3, "doing", 330, 190),
    ("n_comp", "몰아보기 1시간 30분", "frontal", 3, "idea", 285, 255),
    ("n_biz", "보험사·카드사 돈 버는 법", "frontal", 2, "idea", 300, 318),
    ("n_shorts2long", "쇼츠 → 롱폼 확장", "frontal", 1, "idea", 250, 375),
    # 두정엽: 학습한 개념
    ("n_infl", "인플레이션", "parietal", 3, "done", 575, 140),
    ("n_real", "실질금리", "parietal", 2, "done", 712, 168),
    ("n_72", "72의 법칙", "parietal", 2, "done", 560, 205),
    ("n_cant", "칸티용 효과", "parietal", 1, "done", 690, 222),
    ("n_defl", "디플레이션", "parietal", 1, "done", 565, 262),
    ("n_stag", "스태그플레이션", "parietal", 1, "done", 690, 275),
    # 후두엽: 연출·썸네일
    ("n_theme", "새 배경: 웜 차콜", "occipital", 2, "done", 790, 330),
    ("n_thumb", "썸네일 A/B/C 테스트", "occipital", 2, "idea", 780, 385),
    # 측두엽: 영상 시리즈
    ("n_ep01", "EP.01 인플레이션", "temporal", 3, "done", 360, 432),
    ("n_ep03", "EP.03 환율", "temporal", 2, "idea", 565, 418),
    ("n_ep04", "EP.04 경기침체", "temporal", 2, "idea", 640, 452),
    ("n_ep05", "EP.05 주식 기초", "temporal", 2, "idea", 470, 478),
    # 소뇌: 루틴·습관
    ("n_weekly", "주 2회 롱폼", "cerebellum", 1, "idea", 712, 497),
    ("n_short3", "쇼츠 주 3개", "cerebellum", 1, "idea", 805, 520),
    ("n_voice", "내 목소리 녹음", "cerebellum", 1, "idea", 735, 545),
]
BRAIN_LINKS = [
    ["n_infl", "n_ep01"], ["n_infl", "n_real"], ["n_real", "n_ep02"], ["n_ep01", "n_ep02"],
    ["n_ep01", "n_comp"], ["n_ep05", "n_comp"], ["n_stag", "n_ep04"], ["n_defl", "n_ep04"],
    ["n_72", "n_real"], ["n_theme", "n_ep02"], ["n_thumb", "n_ep01"], ["n_voice", "n_ep02"],
    ["n_cant", "n_infl"], ["n_ep03", "n_comp"],
]

ROADMAP = [
    {"id": "ep02_interest", "title": "EP.02 금리의 모든 것", "note": "다음 편 · 웜 차콜", "steps": {}},
    {"id": "ep03_fx", "title": "EP.03 환율의 모든 것", "note": "예정", "steps": {}},
    {"id": "ep04_recession", "title": "EP.04 경기침체·스태그플레이션", "note": "예정", "steps": {}},
    {"id": "ep05_stocks", "title": "EP.05 주식 기초의 모든 것", "note": "예정", "steps": {}},
    {"id": "comp01", "title": "몰아보기: 기초 경제지식의 모든 것", "note": "EP.01~05 묶음", "steps": {}},
]

TODOS = [
    "EP.01 업로드: 썸네일 A/B/C 테스트 등록",
    "EP.01 내레이션 직접 녹음 버전 검토",
    "EP.02 금리의 모든 것 기획서 작성",
    "EP.01 하이라이트로 쇼츠 3개 만들기",
    "YouTube Data API 키 발급 → 대시보드 연결",
]

CHECKLIST = [
    "제목·썸네일의 약속(분량, 숫자, '모든 것')이 영상과 일치",
    "모든 수치에 출처와 날짜가 있음",
    "특정 종목·상품 추천, 수익 보장 표현 없음",
    "캐릭터가 사람 전문가인 척하지 않음",
    "실존 인물 사진·타사 로고·보도사진 없음",
    "이전 영상과 구성·대본이 충분히 다름",
    "'변경되거나 합성된 콘텐츠' 질문에 올바르게 답함",
    "설명란: 챕터(0:00 시작)·출처·고지문",
    "자막 SRT 업로드 + 썸네일 A/B/C 테스트 등록",
    "최종 화면(20초)·카드·재생목록 설정",
]


def _episodes():
    eps = []
    for sj in sorted(glob.glob(os.path.join(ROOT, "episodes", "*", "02_script.json"))):
        ep_dir = os.path.dirname(sj)
        eid = os.path.basename(ep_dir)
        if eid.startswith("_"):
            continue
        meta = json.load(open(sj, encoding="utf-8")).get("meta", {})
        out = os.path.join(ep_dir, "out")
        dur = ""
        md = os.path.join(ep_dir, "02_script.md")
        if os.path.exists(md):
            m = re.search(r"총 길이: \*\*([\d:]+)\*\*", open(md, encoding="utf-8").read())
            dur = m.group(1) if m else ""
        title = meta.get("title", eid)
        short = re.sub(r"^[“\"].*?[”\"]\s*", "", title)
        eps.append({
            "id": eid, "title": f"{meta.get('episode', '')} {short}".strip(), "duration": dur,
            "theme": meta.get("theme", DEFAULT_THEME),
            "steps": {
                "plan": os.path.exists(os.path.join(ep_dir, "01_plan.md")),
                "script": True,
                "tts": os.path.exists(md),
                "video": os.path.exists(os.path.join(out, "video.mp4")) or bool(dur),
                "subs": os.path.exists(os.path.join(out, "subtitles.srt")),
                "thumb": os.path.exists(os.path.join(out, "thumbnail_A.png")),
                "upload": False,
            },
        })
    return eps


def refresh_snapshot(path):
    """yt-dlp로 공개 데이터(영상 목록·조회수) 갱신. 실패하면 기존 스냅샷 유지."""
    if not shutil.which("yt-dlp"):
        print("  yt-dlp가 없어 스냅샷 갱신을 건너뜁니다 (pip install yt-dlp)")
        return
    vids = []
    for tab, kind in (("videos", "long"), ("shorts", "short")):
        try:
            out = subprocess.run(["yt-dlp", "--flat-playlist", "--dump-json",
                                  f"https://www.youtube.com/channel/{CHANNEL_ID}/{tab}"],
                                 capture_output=True, text=True, timeout=180).stdout
        except Exception as e:  # 네트워크 문제 등
            print("  스냅샷 갱신 실패:", e)
            return
        for line in out.splitlines():
            r = json.loads(line)
            vids.append({"id": r["id"], "title": r.get("title"), "views": r.get("view_count"),
                         "type": kind, "duration": r.get("duration")})
    if not vids:
        print("  스냅샷 갱신 실패: 영상 목록이 비어 있음")
        return
    snap = json.load(open(path, encoding="utf-8")) if os.path.exists(path) else {}
    snap.update({"date": dt.date.today().isoformat(), "video_count": len(vids), "videos": vids,
                 "longform_views": sum(v["views"] or 0 for v in vids if v["type"] == "long")})
    json.dump(snap, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"  스냅샷 갱신: 영상 {len(vids)}개")


def build_seed():
    snap_path = os.path.join(DASH, "channel_snapshot.json")
    snap = json.load(open(snap_path, encoding="utf-8")) if os.path.exists(snap_path) else {}
    eps = _episodes()
    have = {e["id"] for e in eps}
    nodes = [{"id": i, "label": l, "region": r, "weight": w, "status": s, "x": x, "y": y, "memo": ""}
             for i, l, r, w, s, x, y in BRAIN_NODES]
    return {
        "generated": dt.date.today().isoformat(),
        "channel": {"id": CHANNEL_ID, "name": "부의비상사태 911"},
        "snapshot": snap,
        "episodes": eps,
        "roadmap": [r for r in ROADMAP if r["id"] not in have],
        "checklist": CHECKLIST,
        "todos": TODOS,
        "themes": [{"name": k, "label": v["label"], "base": list(v["base"])} for k, v in THEMES.items()],
        "default_theme": DEFAULT_THEME,
        "regions": REGIONS,
        "brain": {"nodes": nodes, "links": BRAIN_LINKS},
        "links": [
            {"label": "YouTube 스튜디오", "url": f"https://studio.youtube.com/channel/{CHANNEL_ID}"},
            {"label": "내 채널", "url": f"https://www.youtube.com/channel/{CHANNEL_ID}"},
            {"label": "벤치마크: 유치한경제학", "url": "https://www.youtube.com/@%EC%9C%A0%EC%B9%98%ED%95%9C%EA%B2%BD%EC%A0%9C%ED%95%99/videos"},
            {"label": "채널 분석 문서", "url": f"{REPO}/docs/01_channel_analysis.md"},
            {"label": "유튜브 규정 정리", "url": f"{REPO}/docs/02_youtube_policy_2026.md"},
            {"label": "제작 파이프라인 사용법", "url": f"{REPO}/README.md"},
        ],
    }


def write(seed, out_path=None):
    path = os.path.join(DASH, "index.html")
    html = open(path, encoding="utf-8").read()
    payload = json.dumps(seed, ensure_ascii=False).replace("</", "<\\/")
    block = f'<!--SEED:BEGIN--><script id="seed" type="application/json">{payload}</script><!--SEED:END-->'
    html, n = re.subn(r"<!--SEED:BEGIN-->.*?<!--SEED:END-->", lambda m: block, html, flags=re.S)
    if n != 1:
        raise RuntimeError("index.html 에서 SEED 표식을 찾지 못했습니다")
    out_path = out_path or path
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    open(out_path, "w", encoding="utf-8").write(html)
    return out_path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--refresh", action="store_true", help="채널 공개 데이터 스냅샷 갱신(yt-dlp)")
    ap.add_argument("--desktop", metavar="PATH", nargs="?", const=os.path.join(DASH, "dist", "부의비상사태911_대시보드.html"),
                    help="API 키가 미리 들어간 개인용 파일 생성 (저장소에는 올라가지 않음)")
    args = ap.parse_args()
    if args.refresh:
        refresh_snapshot(os.path.join(DASH, "channel_snapshot.json"))
    seed = build_seed()
    p = write(seed)
    print(f"대시보드 갱신: {p}")
    if args.desktop:
        key = os.environ.get("B911_YT_API_KEY", "").strip()
        if not key:
            raise SystemExit("B911_YT_API_KEY 환경변수에 API 키를 넣고 실행하세요")
        seed["default_settings"] = {"apiKey": key, "channelId": CHANNEL_ID, "interval": 300}
        d = write(seed, args.desktop)
        print(f"개인용(바탕화면) 대시보드: {d}")


if __name__ == "__main__":
    main()
