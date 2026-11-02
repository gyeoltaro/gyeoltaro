"""영상 제작실 서버 — 내 컴퓨터에서 실행해 대시보드 안에서 영상을 만든다.

  python -m studio.server            # http://localhost:8911 (브라우저 자동 열기: --open)

대시보드(dashboard/index.html)를 최신 데이터로 보여주고, 아래 기능을 제공합니다.
  - 에피소드 목록/새로 만들기(템플릿 복사), 대본(02_script.json) 읽기·저장
  - 빌드 실행: 장면 미리보기(stills) / 앞 60초(preview) / 전체 영상(full) — 진행률 표시
  - 매일 학습 실행(studio.learn), API 키 저장(.secrets, 저장소에 올라가지 않음)
  - 결과 파일(영상·썸네일·장면 이미지) 제공 (영상 탐색을 위한 Range 지원)
보안: 127.0.0.1 에서만 열리며, youtube 폴더 밖이나 .secrets 파일은 제공하지 않습니다.
"""
from __future__ import annotations

import argparse
import json
import mimetypes
import os
import re
import shutil
import subprocess
import sys
import threading
import time
import uuid
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlparse

from . import dashboard as D
from . import simple as SIMPLE

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EPI = os.path.join(ROOT, "episodes")
SECRETS = os.path.join(ROOT, ".secrets")
ID_RE = re.compile(r"^[a-z0-9][a-z0-9_]{1,40}$")
JOBS: dict[str, dict] = {}
BUILD_LOCK = threading.Lock()


# ---------------------------------------------------------------- jobs

def _run_job(job, cmd):
    job["log"].append("$ " + " ".join(cmd[2:]))
    try:
        p = subprocess.Popen(cmd, cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                             text=True, encoding="utf-8", errors="replace", bufsize=1,
                             env=dict(os.environ, PYTHONUNBUFFERED="1", PYTHONUTF8="1", PYTHONIOENCODING="utf-8"))
        job["pid"] = p.pid
        buf = ""
        while True:
            ch = p.stdout.read(1)
            if not ch:
                break
            if ch in "\r\n":
                line = buf.strip()
                buf = ""
                if not line:
                    continue
                m = re.search(r"(\d+)/(\d+) 프레임", line)
                st = re.match(r"\[(\d)/6\]", line)
                if m:
                    job["progress"] = 35 + 63 * int(m.group(1)) / max(1, int(m.group(2)))
                    if job["log"] and "프레임" in job["log"][-1]:
                        job["log"][-1] = line
                        continue
                elif st:
                    job["progress"] = max(job["progress"], int(st.group(1)) * (35 / 6) if job["kind"] != "stills" else int(st.group(1)) * 16)
                job["log"].append(line)
                job["log"] = job["log"][-300:]
            else:
                buf += ch
        rc = p.wait()
        job["status"] = "done" if rc == 0 else "error"
        if rc != 0:
            job["log"].append(f"실패 (종료 코드 {rc})")
    except Exception as e:  # 실행 자체 실패
        job["status"] = "error"
        job["log"].append(f"실패: {e}")
    job["progress"] = 100 if job["status"] == "done" else job["progress"]
    job["ended"] = time.time()


def start_job(kind, title, cmd, lock=None):
    jid = uuid.uuid4().hex[:10]
    job = {"id": jid, "kind": kind, "title": title, "status": "running", "progress": 2, "log": [],
           "started": time.time(), "ended": None}
    JOBS[jid] = job

    def runner():
        if lock:
            with lock:
                _run_job(job, cmd)
        else:
            _run_job(job, cmd)

    threading.Thread(target=runner, daemon=True).start()
    return job


# ---------------------------------------------------------------- episodes

def _url(path):
    return "/files/" + os.path.relpath(path, ROOT).replace(os.sep, "/")


def episode_info(eid):
    d = os.path.join(EPI, eid)
    out = os.path.join(d, "out")
    meta = json.load(open(os.path.join(d, "02_script.json"), encoding="utf-8")).get("meta", {})
    files = {"thumbs": [], "stills": [], "mtime": 0}
    for name, key in (("video.mp4", "video"), ("preview.mp4", "preview")):
        f = os.path.join(out, name)
        if os.path.exists(f):
            files[key] = _url(f)
            files["mtime"] = max(files["mtime"], int(os.path.getmtime(f)))
    for k in ("A", "B", "C"):
        f = os.path.join(out, f"thumbnail_{k}.png")
        if os.path.exists(f):
            files["thumbs"].append(_url(f))
    sd = os.path.join(out, "stills")
    if os.path.isdir(sd):
        for f in sorted(os.listdir(sd)):
            if f.endswith(".png"):
                files["stills"].append(_url(os.path.join(sd, f)))
                files["mtime"] = max(files["mtime"], int(os.path.getmtime(os.path.join(sd, f))))
    dur = ""
    md = os.path.join(d, "02_script.md")
    if os.path.exists(md):
        m = re.search(r"총 길이: \*\*([\d:]+)\*\*", open(md, encoding="utf-8").read())
        dur = m.group(1) if m else ""
    return {"id": eid, "title": f"{meta.get('episode', '')} {meta.get('title', eid)}".strip(),
            "theme": meta.get("theme"), "duration": dur, "files": files}


def list_episodes():
    out = []
    for name in sorted(os.listdir(EPI)):
        if name.startswith("_") or not os.path.exists(os.path.join(EPI, name, "02_script.json")):
            continue
        out.append(episode_info(name))
    return out


def create_episode(title, slug, theme, brief=""):
    existing = [n for n in os.listdir(EPI) if re.match(r"ep\d+", n)]
    num = max([int(re.match(r"ep(\d+)", n).group(1)) for n in existing] + [0]) + 1
    slug = re.sub(r"[^a-z0-9_]", "", (slug or "").lower().replace("-", "_").replace(" ", "_")) or "new"
    eid = f"ep{num:02d}_{slug}"
    if not ID_RE.match(eid) or os.path.exists(os.path.join(EPI, eid)):
        raise ValueError("폴더 이름을 만들 수 없습니다")
    tpl = os.path.join(EPI, "_template")
    dst = os.path.join(EPI, eid)
    shutil.copytree(tpl, dst)
    sj = os.path.join(dst, "02_script.json")
    data = json.load(open(sj, encoding="utf-8"))
    data["meta"].update({"episode": f"EP.{num:02d}", "title": title, "theme": theme or D.DEFAULT_THEME})
    for sc in data["scenes"]:
        v = sc.get("visual", {})
        if v.get("type") == "title":
            v["main"] = re.sub(r"^[“\"].*?[”\"]\s*", "", title)[:24] or v.get("main", "")
    try:   # 기획 시점의 예측을 박제해 두면, 업로드 후 실제 성적과 비교해 규칙이 보정된다
        from . import plan as PL
        pr = PL.predict_episode(title, None)
        if pr:
            data["meta"]["plan"] = pr
    except Exception:
        pass
    json.dump(data, open(sj, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    if os.path.exists(os.path.join(dst, "01_script.txt")):
        SIMPLE.convert_episode(dst)   # 시작용 쉬운 대본 → 장면 자동 구성
    plan = os.path.join(dst, "01_plan.md")
    if os.path.exists(plan):
        txt = open(plan, encoding="utf-8").read().replace("{{TITLE}}", title).replace("{{EP}}", f"EP.{num:02d}")
        if brief.strip():
            txt = txt.replace("## 2. 왜 이 주제인가 (매일 학습 백로그 근거)", "## 2. 왜 이 주제인가 (매일 학습 백로그 근거)\n```\n" + brief.strip() + "\n```")
        open(plan, "w", encoding="utf-8").write(txt)
    os.makedirs(os.path.join(dst, "out"), exist_ok=True)
    return eid


def validate_script(data):
    if not isinstance(data, dict) or not isinstance(data.get("scenes"), list) or not data["scenes"]:
        raise ValueError("scenes 배열이 필요합니다")
    data.setdefault("meta", {})
    types = set(D.build_seed()["visual_types"])
    seen = set()
    for i, sc in enumerate(data["scenes"]):
        sid = sc.get("id")
        if not sid or sid in seen:
            raise ValueError(f"{i + 1}번째 장면 id가 없거나 중복입니다")
        seen.add(sid)
        if (sc.get("visual") or {}).get("type") not in types:
            raise ValueError(f"{sid}: 알 수 없는 화면 종류")
        for ln in sc.get("lines", []):
            t = ln if isinstance(ln, str) else (ln or {}).get("text")
            if not t:
                raise ValueError(f"{sid}: 빈 문장")
    return data


def page_html():
    seed = D.build_seed()
    seed["server"] = True
    path = os.path.join(D.DASH, "index.html")
    html = open(path, encoding="utf-8").read()
    payload = json.dumps(seed, ensure_ascii=False).replace("</", "<\\/")
    block = f'<!--SEED:BEGIN--><script id="seed" type="application/json">{payload}</script><!--SEED:END-->'
    return re.sub(r"<!--SEED:BEGIN-->.*?<!--SEED:END-->", lambda m: block, html, flags=re.S)


# ---------------------------------------------------------------- http

class Handler(BaseHTTPRequestHandler):
    server_version = "B911Studio/1.0"

    def log_message(self, fmt, *args):
        if os.environ.get("B911_VERBOSE"):
            super().log_message(fmt, *args)

    def _send(self, code, body, ctype="application/json; charset=utf-8", extra=None):
        data = body if isinstance(body, bytes) else (json.dumps(body, ensure_ascii=False).encode() if not isinstance(body, str) else body.encode())
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        for k, v in (extra or {}).items():
            self.send_header(k, v)
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(data)

    def _json_body(self):
        n = int(self.headers.get("Content-Length") or 0)
        if n > 5_000_000:
            raise ValueError("요청이 너무 큽니다")
        return json.loads(self.rfile.read(n) or b"{}")

    def _err(self, code, msg):
        self._send(code, {"error": msg})

    def _ep(self, eid):
        if not ID_RE.match(eid or "") or not os.path.exists(os.path.join(EPI, eid, "02_script.json")):
            raise FileNotFoundError("에피소드를 찾을 수 없습니다")
        return os.path.join(EPI, eid)

    # ---- GET
    def do_GET(self):
        path = unquote(urlparse(self.path).path)
        try:
            if path in ("/", "/index.html"):
                return self._send(200, page_html(), "text/html; charset=utf-8")
            if path == "/api/ping":
                return self._send(200, {"ok": True, "api_key": bool(_api_key()), "ytdlp": bool(shutil.which("yt-dlp"))})
            if path == "/api/learning":
                f = os.path.join(ROOT, "learning", "latest.json")
                return self._send(200, open(f, encoding="utf-8").read() if os.path.exists(f) else "{}")
            if path == "/api/episodes":
                return self._send(200, list_episodes())
            m = re.match(r"^/api/episodes/([^/]+)/script$", path)
            if m:
                return self._send(200, open(os.path.join(self._ep(m.group(1)), "02_script.json"), encoding="utf-8").read())
            m = re.match(r"^/api/yt/(channels|playlistItems|videos)$", path)
            if m:
                return self._yt(m.group(1), urlparse(self.path).query)
            m = re.match(r"^/api/episodes/([^/]+)/plan$", path)
            if m:
                f = os.path.join(self._ep(m.group(1)), "01_plan.md")
                return self._send(200, {"text": open(f, encoding="utf-8").read() if os.path.exists(f) else ""})
            m = re.match(r"^/api/episodes/([^/]+)/simple$", path)
            if m:
                f = os.path.join(self._ep(m.group(1)), "01_script.txt")
                ok = os.path.exists(f)
                return self._send(200, {"exists": ok, "text": open(f, encoding="utf-8").read() if ok else ""})
            m = re.match(r"^/api/jobs/([a-f0-9]+)$", path)
            if m:
                j = JOBS.get(m.group(1))
                return self._send(200, j) if j else self._err(404, "작업을 찾을 수 없습니다")
            if path.startswith("/files/"):
                return self._file(path[len("/files/"):])
            return self._err(404, "없는 주소입니다")
        except FileNotFoundError as e:
            return self._err(404, str(e))
        except Exception as e:
            return self._err(500, f"서버 오류: {e}")

    do_HEAD = do_GET

    def _yt(self, name, query):
        """YouTube Data API 를 서버가 대신 호출한다 (저장된 키 사용, 키는 응답에 포함되지 않음)."""
        import urllib.error
        import urllib.parse
        import urllib.request
        key = _api_key()
        if not key:
            return self._send(400, {"error": {"errors": [{"reason": "keyInvalid"}], "message": "서버에 저장된 API 키가 없습니다"}})
        params = [(k, v) for k, v in urllib.parse.parse_qsl(query) if k != "key"]
        url = f"https://www.googleapis.com/youtube/v3/{name}?" + urllib.parse.urlencode(params + [("key", key)])
        try:
            with urllib.request.urlopen(url, timeout=30) as r:
                return self._send(200, r.read())
        except urllib.error.HTTPError as e:
            return self._send(e.code, e.read() or b"{}")
        except Exception as e:
            return self._send(502, {"error": {"errors": [{"reason": "network"}], "message": str(e)[:120]}})

    def _file(self, rel):
        full = os.path.realpath(os.path.join(ROOT, rel))
        if not full.startswith(os.path.realpath(ROOT) + os.sep) or os.sep + ".secrets" in full or not os.path.isfile(full):
            return self._err(404, "파일이 없습니다")
        size = os.path.getsize(full)
        ctype = mimetypes.guess_type(full)[0] or "application/octet-stream"
        if ctype.startswith("text/") or full.endswith((".md", ".srt", ".json")):
            ctype = (ctype if ctype.startswith("text/") else "text/plain") + "; charset=utf-8"
        rng = self.headers.get("Range")
        start, end, code = 0, size - 1, 200
        if rng:
            m = re.match(r"bytes=(\d*)-(\d*)", rng)
            if m:
                if m.group(1):
                    start = int(m.group(1))
                    end = int(m.group(2)) if m.group(2) else size - 1
                else:
                    start = max(0, size - int(m.group(2)))
                end = min(end, size - 1)
                code = 206
        length = end - start + 1
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Length", str(length))
        if code == 206:
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.end_headers()
        if self.command == "HEAD":
            return
        with open(full, "rb") as f:
            f.seek(start)
            left = length
            while left > 0:
                chunk = f.read(min(1 << 20, left))
                if not chunk:
                    break
                try:
                    self.wfile.write(chunk)
                except (BrokenPipeError, ConnectionResetError):
                    return
                left -= len(chunk)

    # ---- POST / PUT
    def do_POST(self):
        path = urlparse(self.path).path
        try:
            if path == "/api/update":
                if any(j["kind"] == "update" and j["status"] == "running" for j in JOBS.values()):
                    return self._err(409, "이미 업데이트 중입니다")
                job = start_job("update", "제작실 업데이트", [sys.executable, "-m", "studio.update"])
                return self._send(200, {"job": job["id"]})
            if path == "/api/learn":
                job = start_job("learn", "매일 학습", [sys.executable, "-m", "studio.learn", "--daily"])
                return self._send(200, {"job": job["id"]})
            if path == "/api/settings/apikey":
                key = str(self._json_body().get("key", "")).strip()
                if not re.match(r"^[A-Za-z0-9_\-]{20,80}$", key):
                    return self._err(400, "API 키 형식이 올바르지 않습니다")
                os.makedirs(SECRETS, exist_ok=True)
                p = os.path.join(SECRETS, "youtube_api_key.txt")
                with open(p, "w", encoding="utf-8") as f:
                    f.write(key)
                try:
                    os.chmod(p, 0o600)
                except OSError:
                    pass
                return self._send(200, {"ok": True})
            if path == "/api/episodes":
                b = self._json_body()
                title = str(b.get("title", "")).strip()
                if not title:
                    return self._err(400, "제목이 필요합니다")
                eid = create_episode(title, str(b.get("slug", "")), str(b.get("theme", "")), str(b.get("brief", "")))
                return self._send(200, {"id": eid})
            m = re.match(r"^/api/episodes/([^/]+)/build$", path)
            if m:
                ep = self._ep(m.group(1))
                mode = self._json_body().get("mode", "stills")
                flags = {"stills": ["--stills"], "preview": ["--range", "0", "60"], "full": []}.get(mode)
                if flags is None:
                    return self._err(400, "mode는 stills/preview/full 중 하나")
                if BUILD_LOCK.locked():
                    return self._err(409, "다른 제작 작업이 진행 중입니다")
                title = {"stills": "장면 미리보기", "preview": "앞 60초 영상", "full": "전체 영상"}[mode]
                job = start_job(mode, title, [sys.executable, "-m", "studio.build", ep] + flags, BUILD_LOCK)
                return self._send(200, {"job": job["id"]})
            return self._err(404, "없는 주소입니다")
        except FileNotFoundError as e:
            return self._err(404, str(e))
        except ValueError as e:
            return self._err(400, str(e))
        except Exception as e:
            return self._err(500, f"서버 오류: {e}")

    def do_PUT(self):
        path = urlparse(self.path).path
        try:
            ms = re.match(r"^/api/episodes/([^/]+)/simple$", path)
            if ms:
                ep = self._ep(ms.group(1))
                text = str(self._json_body().get("text", ""))
                script, info = SIMPLE.convert_episode(ep, text)
                validate_script(script)
                return self._send(200, {"script": script, "info": info})
            m = re.match(r"^/api/episodes/([^/]+)/script$", path)
            if not m:
                return self._err(404, "없는 주소입니다")
            ep = self._ep(m.group(1))
            data = validate_script(self._json_body())
            p = os.path.join(ep, "02_script.json")
            shutil.copyfile(p, p + ".bak")
            with open(p, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            return self._send(200, {"ok": True})
        except FileNotFoundError as e:
            return self._err(404, str(e))
        except ValueError as e:
            return self._err(400, str(e))
        except Exception as e:
            return self._err(500, f"서버 오류: {e}")


def _api_key():
    from .learn import api_key
    return api_key()


def daily_learning_loop():
    """서버가 켜져 있는 동안, 오늘 학습 기록이 없으면 하루 한 번 자동 학습"""
    from .learn import today
    while True:
        try:
            latest = os.path.join(ROOT, "learning", "latest.json")
            last = json.load(open(latest, encoding="utf-8")).get("date") if os.path.exists(latest) else None
            running = any(j["kind"] == "learn" and j["status"] == "running" for j in JOBS.values())
            if last != today() and not running and (_api_key() or shutil.which("yt-dlp")):
                start_job("learn", "매일 학습(자동)", [sys.executable, "-m", "studio.learn", "--daily"])
        except Exception:
            pass
        time.sleep(1800)


def main():
    ap = argparse.ArgumentParser(description="부의비상사태 911 영상 제작실")
    ap.add_argument("--port", type=int, default=8911)
    ap.add_argument("--open", action="store_true", help="브라우저 자동 열기")
    ap.add_argument("--no-auto-learn", action="store_true", help="하루 한 번 자동 학습 끄기")
    args = ap.parse_args()
    srv = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
    url = f"http://localhost:{args.port}"
    print(f"영상 제작실이 열렸습니다 → {url}  (끄려면 이 창에서 Ctrl+C)")
    if not args.no_auto_learn:
        threading.Thread(target=daily_learning_loop, daemon=True).start()
    if args.open:
        threading.Timer(1.0, lambda: webbrowser.open(url)).start()
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\n제작실을 닫습니다.")


if __name__ == "__main__":
    main()
