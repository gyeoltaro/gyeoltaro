"""TTS(음성 합성) 단계.

기본 엔진은 edge-tts(Microsoft Edge 읽어주기 음성)입니다. 무료이지만 공식 상용 라이선스가
아니므로, 수익화 채널은 아래 중 하나로 바꾸는 것을 권장합니다.
  1) 본인 목소리 녹음: episodes/<ep>/voice/<line_id>.wav 를 넣으면 TTS 대신 사용 (가장 안전)
  2) 상용 라이선스 TTS(타입캐스트, 일레븐랩스, 클로바 더빙 등)로 만든 파일을 같은 규칙으로 배치

음성 파일은 cache/tts/ 아래에 문장 해시로 캐시되므로, 대본 일부만 고쳐도 바뀐 문장만
다시 합성합니다.
"""
from __future__ import annotations

import asyncio
import hashlib
import json
import os
import ssl


def _ssl_ctx():
    ca = os.environ.get("EDGE_TTS_CA_BUNDLE") or os.environ.get("SSL_CERT_FILE")
    if not ca and os.path.exists("/root/.ccr/ca-bundle.crt"):
        ca = "/root/.ccr/ca-bundle.crt"
    return ssl.create_default_context(cafile=ca) if ca else None


async def _synth_one(text, voice, rate, pitch, mp3_path, meta_path, sem):
    import edge_tts
    import edge_tts.communicate as comm_mod

    ctx = _ssl_ctx()
    if ctx is not None:
        comm_mod._SSL_CTX = ctx
    proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
    async with sem:
        for attempt in range(4):
            try:
                comm = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, proxy=proxy,
                                            boundary="WordBoundary")
                words = []
                with open(mp3_path + ".part", "wb") as f:
                    async for ch in comm.stream():
                        if ch["type"] == "audio":
                            f.write(ch["data"])
                        elif ch["type"] == "WordBoundary":
                            words.append({"offset": ch["offset"] / 1e7,
                                          "duration": ch["duration"] / 1e7,
                                          "text": ch["text"]})
                os.replace(mp3_path + ".part", mp3_path)
                with open(meta_path, "w", encoding="utf-8") as f:
                    json.dump({"text": text, "voice": voice, "rate": rate, "words": words}, f,
                              ensure_ascii=False)
                return
            except Exception as e:  # 네트워크 일시 오류 재시도
                if attempt == 3:
                    raise RuntimeError(f"TTS 실패: {text[:30]}… ({e})")
                await asyncio.sleep(2 ** attempt)


def synthesize(lines, cache_dir, voice="ko-KR-InJoonNeural", rate="+8%", pitch="+0Hz",
               concurrency=4):
    """lines: [(line_id, say_text)] → {line_id: (mp3_path, meta_path)}"""
    os.makedirs(cache_dir, exist_ok=True)
    jobs, result = [], {}
    for lid, say in lines:
        h = hashlib.sha1(f"{voice}|{rate}|{pitch}|{say}".encode()).hexdigest()[:16]
        mp3 = os.path.join(cache_dir, f"{h}.mp3")
        meta = os.path.join(cache_dir, f"{h}.json")
        result[lid] = (mp3, meta)
        if not (os.path.exists(mp3) and os.path.exists(meta)):
            jobs.append((say, mp3, meta))

    async def run():
        sem = asyncio.Semaphore(concurrency)
        await asyncio.gather(*[_synth_one(s, voice, rate, pitch, m, j, sem) for s, m, j in jobs])

    if jobs:
        print(f"  TTS 합성: {len(jobs)}문장 (캐시 {len(lines) - len(jobs)}문장)")
        asyncio.run(run())
    else:
        print(f"  TTS 캐시 사용: {len(lines)}문장")
    return result
