"""에피소드 빌드: 기획 → 대본 → TTS → 영상 → 자막 → 업로드 정보 → 썸네일

사용법:
  python -m studio.build episodes/ep01_inflation              # 전체 빌드
  python -m studio.build episodes/ep01_inflation --stills     # 장면별 미리보기 이미지만
  python -m studio.build episodes/ep01_inflation --range 0 60 # 0~60초 구간만 렌더(검수용)
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import time

from . import audio as A
from .core import FPS, strip_marks
from .render import mux, render_video, still
from .thumbnail import auto_variants, make_thumbnail
from .timeline import build, fmt_ts, write_srt

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def write_script_md(script, tl, path):
    out = [f"# {script['meta'].get('episode', '')} 대본 — {strip_marks(script['meta'].get('title', ''))}", "",
           f"- 총 길이: **{fmt_ts(tl['total'])}** ({tl['total'] / 60:.1f}분)",
           f"- 음성: {script['meta'].get('voice')} / 속도 {script['meta'].get('rate')}",
           f"- 장면 {len(tl['scenes'])}개 · 문장 {sum(len(s['lines']) for s in tl['scenes'])}개", ""]
    for s in tl["scenes"]:
        if s.get("chapter"):
            out += [f"## [{fmt_ts(s['start'])}] {s['chapter']}", ""]
        v = s["visual"]
        m = s.get("mascot", {})
        out.append(f"**{s['id']}** `{fmt_ts(s['start'])}` · 화면: `{v['type']}` · 캐릭터: "
                   f"{m.get('layout', 'left')}/{m.get('emotion', 'neutral')}")
        out.append("")
        for ln in s["lines"]:
            out.append(f"> {ln['text']}")
            out.append("")
    open(path, "w", encoding="utf-8").write("\n".join(out))


def write_upload(script, tl, path, json_path):
    meta = script["meta"]
    chapters = tl["chapters"]
    ok = chapters and chapters[0]["t"] < 0.5 and len(chapters) >= 3
    gaps_ok = all(chapters[i + 1]["t"] - chapters[i]["t"] >= 10 for i in range(len(chapters) - 1))
    ch_lines = [f"{fmt_ts(0 if i == 0 else c['t'])} {c['title']}" for i, c in enumerate(chapters)]
    title = strip_marks(meta.get("title", ""))
    up = meta.get("upload", {})
    mins = round(tl["total"] / 60)
    core = re.sub(r"^[“\"].*?[”\"]\s*", "", title).strip() or title
    intro = up.get("intro") or f"{core}, 처음 듣는 분도 이해할 수 있게 {mins}분 만에 핵심만 정리했습니다."
    sources = up.get("sources") or ["(출처를 01_plan.md 사실 확인표에서 옮겨 적으세요)"]
    tags = up.get("tags") or [w for w in re.findall(r"[가-힣A-Za-z0-9]{2,}", core) if len(w) <= 12][:8] + [
        "경제공부", "기초경제", "경제상식", "부의비상사태911"]
    hashtags = up.get("hashtags") or ["경제공부"] + tags[:2]
    pinned = up.get("pinned") or "오늘 영상에서 가장 도움이 된 부분은 무엇인가요? 다음에 다뤘으면 하는 주제도 댓글로 알려주세요!"
    alt_titles = up.get("alt_titles") or [f"“{core}..” 초보자도 이해하는 {core} {mins}분 총정리"]
    desc = f"""{intro}

📌 목차
{chr(10).join(ch_lines)}

📚 참고 자료
{chr(10).join("- " + x for x in sources)}

⚠️ 안내
- 이 영상은 경제 원리를 설명하는 교육 콘텐츠이며, 특정 금융상품·자산에 대한 투자 권유가 아닙니다.
  투자 결정은 본인의 상황에 맞게 신중히 내려주세요.
- 기획·대본·자료 검수는 채널 운영자가 직접 했으며, 내레이션은 AI 음성(TTS)으로 제작했습니다.
  영상 속 캐릭터는 실존 인물이 아닌 채널 마스코트입니다.

{" ".join("#" + h for h in hashtags)}
"""
    md = f"""# 업로드 정보 — {meta.get('episode', '')}

## 제목 (추천)
{title}

### 제목 후보 (A/B 테스트용)
1. {title}
{chr(10).join(f"{i + 2}. {t}" for i, t in enumerate(alt_titles))}

## 설명란
```
{desc}```

## 태그
{", ".join(tags)}

## 고정 댓글
```
{pinned}
```

## 챕터 점검
- 첫 챕터 0:00 시작: {"✅" if ok else "❌"}
- 챕터 3개 이상 / 각 10초 이상: {"✅" if ok and gaps_ok else "❌"}

## YouTube 스튜디오 설정 체크리스트
- [ ] **변경되거나 합성된 콘텐츠**: "아니요" (만화 캐릭터·애니메이션이며 실존 인물/실제 사건을 사실처럼 합성하지 않음)
- [ ] **자막**: `subtitles.srt` 업로드 (한국어) — 영상에 자막이 이미 들어가 있으므로 '기본 표시'는 끔
- [ ] **썸네일 테스트 및 비교**: `thumbnail_A.png`, `thumbnail_B.png`, `thumbnail_C.png` 3개 등록
- [ ] **최종 화면**: 마지막 20초 — 왼쪽 '다음 편 보기'(재생목록/최신 영상), 오른쪽 '추천 영상', 가운데 구독
- [ ] **카드**: 중반 챕터 시작 지점({fmt_ts(chapters[len(chapters) // 2]['t']) if chapters else '-'})에 관련 쇼츠/영상 카드
- [ ] **재생목록**: '기초 경제 시리즈'에 추가 (나중에 몰아보기 영상의 재료)
- [ ] **시청자층**: 아동용 아님 / **카테고리**: 교육
- [ ] **유료 광고 포함**: 아니요
"""
    open(path, "w", encoding="utf-8").write(md)
    json.dump({"title": title, "description": desc, "tags": tags, "chapters": ch_lines,
               "pinned_comment": pinned, "category": "Education", "made_for_kids": False,
               "altered_or_synthetic": False}, open(json_path, "w", encoding="utf-8"),
              ensure_ascii=False, indent=2)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("episode")
    ap.add_argument("--stills", action="store_true", help="장면별 미리보기 PNG만 생성")
    ap.add_argument("--range", nargs=2, type=float, help="렌더 구간(초)")
    ap.add_argument("--workers", type=int, default=None)
    ap.add_argument("--no-bgm", action="store_true")
    ap.add_argument("--crf", type=int, default=20)
    args = ap.parse_args()

    ep = os.path.abspath(args.episode)
    out = os.path.join(ep, "out")
    os.makedirs(out, exist_ok=True)
    cache = os.path.join(ROOT, "cache")
    script = json.load(open(os.path.join(ep, "02_script.json"), encoding="utf-8"))

    t0 = time.time()
    print("[1/6] 대본 → TTS → 타임라인")
    tl = build(script, ep, cache)
    print(f"  총 길이 {fmt_ts(tl['total'])} ({tl['total'] / 60:.1f}분), 프레임 {tl['n_frames']}")
    write_script_md(script, tl, os.path.join(ep, "02_script.md"))

    print("[2/6] 자막(SRT)")
    write_srt(tl["captions"], os.path.join(out, "subtitles.srt"))

    print("[3/6] 썸네일")
    variants = script["meta"].get("thumbnails") or auto_variants(script["meta"].get("title", ""), round(tl["total"] / 60))
    for k, v in variants.items():
        make_thumbnail(os.path.join(out, f"thumbnail_{k}.png"), overrides=v)

    print("[4/6] 업로드 정보")
    write_upload(script, tl, os.path.join(ep, "03_upload.md"), os.path.join(out, "upload.json"))

    if args.stills:
        sd = os.path.join(out, "stills")
        os.makedirs(sd, exist_ok=True)
        voice = tl.pop("voice_track")
        for s in tl["scenes"]:
            fi = s["f0"] + int(s["nf"] * 0.8)
            still(tl, fi, os.path.join(sd, f"{s['id']}.png"))
        print(f"  미리보기 {len(tl['scenes'])}장 → {sd}")
        return

    print("[5/6] 오디오 믹싱")
    voice = tl.pop("voice_track")
    events = tl["events"]
    mixed = A.mix(voice, events, tl["total"], use_bgm=not args.no_bgm)
    wav = os.path.join(cache, "mix.wav")
    os.makedirs(cache, exist_ok=True)
    fr = None
    if args.range:
        a, b = args.range
        fr = (int(a * FPS), min(tl["n_frames"], int(b * FPS)))
        mixed = mixed[int(a * A.SR):int(b * A.SR)]
    A.write_wav(wav, mixed)

    print("[6/6] 영상 렌더링 + 합치기")
    vid = os.path.join(cache, "video_only.mp4")
    render_video(tl, vid, os.path.join(cache, "chunks"), workers=args.workers, crf=args.crf,
                 frame_range=fr)
    final = os.path.join(out, "preview.mp4" if args.range else "video.mp4")
    mux(vid, wav, final)
    size = os.path.getsize(final) / 1e6
    print(f"완료: {final} ({size:.0f} MB, {(time.time() - t0) / 60:.1f}분 소요)")


if __name__ == "__main__":
    main()
