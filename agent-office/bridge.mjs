#!/usr/bin/env node
// 에이전트 오피스 로컬 브리지
// - 이 컴퓨터의 Claude Code 대화 기록(~/.claude/projects/**/*.jsonl)을 따라 읽어 사무실 화면으로 실시간 전달해요.
// - 다른 에이전트는 POST /events 로 작업 로그를 보내면 사무실에 나타나요.
// - http://localhost:4545 에서 사무실 화면을 열어 줘요.
// 의존성 없음 (Node 18 이상). 기본으로 127.0.0.1에만 열려서 같은 컴퓨터에서만 접속할 수 있어요.
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { StringDecoder } from 'node:string_decoder';

const PORT = Number(process.env.PORT) || 4545;
const HOST = process.env.HOST || '127.0.0.1';
const ROOT = process.env.CLAUDE_PROJECTS_DIR || path.join(os.homedir(), '.claude', 'projects');
const PAGE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'index.html');
const RECENT_MS = 30 * 60 * 1000; // 시작할 때 최근 30분 안에 바뀐 기록만 거슬러 읽어요
const TAIL_BYTES = 256 * 1024;
const BACKLOG = 800;
const MAX_BODY = 1024 * 1024;

let seq = 0;
const clients = new Set();
const backlog = [];
function send(msg) {
  msg.id = ++seq;
  backlog.push(msg);
  if (backlog.length > BACKLOG) backlog.shift();
  const data = `data: ${JSON.stringify(msg)}\n\n`;
  for (const res of clients) res.write(data);
}

// 화면에 필요한 것만 남겨요. 도구 결과 본문처럼 큰 내용은 보내지 않아요.
const KEEP_INPUT = ['file_path', 'path', 'notebook_path', 'command', 'description', 'pattern', 'query', 'url', 'skill', 'subagent_type'];
function slimInput(input) {
  if (!input || typeof input !== 'object') return undefined;
  const out = {};
  for (const k of KEEP_INPUT) if (input[k] != null) out[k] = String(input[k]).slice(0, 300);
  return out;
}
function slimBlock(b) {
  if (!b || typeof b !== 'object') return b;
  if (b.type === 'text') return { type: 'text', text: String(b.text || '').slice(0, 2000) };
  if (b.type === 'tool_use') return { type: 'tool_use', id: b.id, name: b.name, input: slimInput(b.input) };
  if (b.type === 'tool_result') return { type: 'tool_result', tool_use_id: b.tool_use_id, is_error: !!b.is_error };
  return { type: b.type };
}
function slimLine(o) {
  const out = {
    type: o.type, uuid: o.uuid, timestamp: o.timestamp, sessionId: o.sessionId,
    isSidechain: o.isSidechain, agentId: o.agentId, isMeta: o.isMeta, cwd: o.cwd,
  };
  const m = o.message;
  if (m && typeof m === 'object') {
    out.message = {
      id: m.id, role: m.role, stop_reason: m.stop_reason,
      usage: m.usage ? { output_tokens: m.usage.output_tokens } : undefined,
      content: typeof m.content === 'string' ? m.content.slice(0, 2000) : Array.isArray(m.content) ? m.content.map(slimBlock) : undefined,
    };
  }
  return out;
}

const files = new Map(); // 파일 경로 → { pos, rest, dec, skipFirst }
function listJsonl(dir, out = [], depth = 0) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && depth < 4) listJsonl(p, out, depth + 1);
    else if (e.isFile() && e.name.endsWith('.jsonl')) out.push(p);
  }
  return out;
}
function readNew(file, st) {
  let f = files.get(file);
  if (!f) {
    const fresh = Date.now() - st.mtimeMs < RECENT_MS;
    const start = fresh ? Math.max(0, st.size - TAIL_BYTES) : st.size;
    f = { pos: start, rest: '', dec: new StringDecoder('utf8'), skipFirst: start > 0 && fresh };
    files.set(file, f);
  }
  if (st.size < f.pos) { f.pos = 0; f.rest = ''; f.dec = new StringDecoder('utf8'); }
  if (st.size === f.pos) return;
  const len = Math.min(st.size - f.pos, 8 * 1024 * 1024);
  const buf = Buffer.alloc(len);
  const fd = fs.openSync(file, 'r');
  try { fs.readSync(fd, buf, 0, len, f.pos); } finally { fs.closeSync(fd); }
  f.pos += len;
  const lines = (f.rest + f.dec.write(buf)).split('\n');
  f.rest = lines.pop();
  if (f.skipFirst) { lines.shift(); f.skipFirst = false; } // 중간부터 읽었으면 잘린 첫 줄은 버려요
  const rel = path.relative(ROOT, file);
  for (const ln of lines) {
    if (!ln.trim()) continue;
    let obj;
    try { obj = JSON.parse(ln); } catch { continue; }
    if (obj.type === 'last-prompt' && obj.lastPrompt) {
      send({ src: 'cli', file: rel, line: { type: 'last-prompt', sessionId: obj.sessionId, lastPrompt: String(obj.lastPrompt).slice(0, 300) } });
      continue;
    }
    if (obj.type !== 'user' && obj.type !== 'assistant') continue;
    send({ src: 'cli', file: rel, line: slimLine(obj) });
  }
}
function scan() {
  for (const file of listJsonl(ROOT)) {
    let st;
    try { st = fs.statSync(file); } catch { continue; }
    try { readNew(file, st); } catch (err) { console.warn(`읽기 실패: ${file} (${err.message})`); }
  }
}

function json(res, code, body) {
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' });
  res.end(JSON.stringify(body));
}
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET, POST, OPTIONS', 'access-control-allow-headers': 'content-type' });
    res.end();
    return;
  }
  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
    fs.createReadStream(PAGE).on('error', () => res.end('index.html을 찾지 못했어요.')).pipe(res);
    return;
  }
  if (req.method === 'GET' && url.pathname === '/api/hello') {
    json(res, 200, { agentOffice: true, watching: ROOT, files: files.size, clients: clients.size });
    return;
  }
  if (req.method === 'GET' && url.pathname === '/events') {
    res.writeHead(200, { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-store', connection: 'keep-alive' });
    for (const msg of backlog) res.write(`data: ${JSON.stringify({ ...msg, backlog: true })}\n\n`);
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }
  if (req.method === 'POST' && url.pathname === '/events') {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) { json(res, 413, { ok: false, error: '본문은 1MB까지 보낼 수 있어요.' }); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      if (res.writableEnded) return;
      let body;
      try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { json(res, 400, { ok: false, error: 'JSON 형식이 아니에요.' }); return; }
      const list = Array.isArray(body) ? body : [body];
      let n = 0;
      for (const ev of list) {
        if (!ev || typeof ev !== 'object' || !(ev.agent || ev.name)) continue;
        send({ src: 'custom', event: ev });
        n++;
      }
      json(res, n ? 200 : 400, n ? { ok: true, received: n } : { ok: false, error: '"agent"가 들어 있는 이벤트가 없어요.' });
    });
    return;
  }
  json(res, 404, { ok: false, error: '없는 경로예요.' });
});

setInterval(scan, 1000);
setInterval(() => { for (const res of clients) res.write(': ping\n\n'); }, 15000);
scan();
server.listen(PORT, HOST, () => {
  console.log(`에이전트 오피스: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
  console.log(`Claude Code 기록 감시: ${ROOT}${fs.existsSync(ROOT) ? '' : ' (아직 없음, 생기면 자동으로 읽어요)'}`);
  console.log(`다른 에이전트 로그: POST http://localhost:${PORT}/events`);
});
