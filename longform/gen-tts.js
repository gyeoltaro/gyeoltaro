// 사용법: GOOGLE_TTS_API_KEY=… node longform/gen-tts.js longform/파일.html [--dry]
// 파일 안 대본(#cuesData) → SSML 묶음(4,700바이트 이하) → Google TTS(Neural2-C, 1.16, −1, 문장·강조 마크) → 같은 파일 #bundledTTS 에 내장
// 키는 환경변수로만 받는다. 파일·저장소에 쓰지 않는다. --dry 는 요청 없이 묶음 크기만 보여 준다.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const FILE = path.resolve(process.argv[2] || 'longform/ep01-startup-payback.html'), DRY = process.argv.includes('--dry');
const html = fs.readFileSync(FILE, 'utf8');
const m = html.match(/<script type="application\/json" id="cuesData">([\s\S]*?)<\/script>/);
if (!m) { console.log('대본(#cuesData)이 없습니다'); process.exit(1); }
const CUES = JSON.parse(m[1].replace(/<\\\//g, '</'));
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// 문장 하나 → SSML. ^단어 앞에 c{i}k{j} 마크 (첫 단어는 문장 마크와 붙어 하나만 돌아오므로 넣지 않는다)
function cueSSML(c, i) {
  let k = 0; const out = [];
  c.text.split(/\s+/).forEach((t, j) => {
    let w = t;
    if (w.includes('^')) { w = w.replace('^', ''); if (j > 0) out.push(`<mark name="c${i}k${k}"/>`); k++; }
    out.push(esc(w.replace(/[\[\]{}<>]/g, '')));
  });
  return (c.pre ? `<break time="${c.pre}ms"/>` : '') + `<mark name="c${i}"/>` + out.join(' ') + `<break time="${c.pause}ms"/>`;
}
const chunks = []; let cur = { cues: [], body: '' };
CUES.forEach((c, i) => {
  const piece = cueSSML(c, i);
  if (cur.cues.length && Buffer.byteLength('<speak>' + cur.body + piece + '</speak>') > 4700) { chunks.push(cur); cur = { cues: [], body: '' }; }
  cur.cues.push(i); cur.body += piece;
});
chunks.push(cur);
console.log('문장', CUES.length, '묶음', chunks.length, chunks.map(c => Buffer.byteLength(c.body)));
if (DRY) process.exit(0);
const KEY = process.env.GOOGLE_TTS_API_KEY || process.env.TTS_KEY;
if (!KEY) { console.log('환경변수 GOOGLE_TTS_API_KEY 가 없습니다'); process.exit(1); }
(async () => {
  const browser = await chromium.launch(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {});
  const page = await browser.newPage(); await page.goto('about:blank');
  const out = { voice: 'ko-KR-Neural2-C', rate: 1.16, pitch: -1, chunks: [] };
  for (const [n, ch] of chunks.entries()) {
    const res = await page.evaluate(async ({ ssml, key }) => {
      const r = await fetch('https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=' + key, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: { ssml }, voice: { languageCode: 'ko-KR', name: 'ko-KR-Neural2-C' },
          audioConfig: { audioEncoding: 'MP3', speakingRate: 1.16, pitch: -1 }, enableTimePointing: ['SSML_MARK'] })
      });
      return { status: r.status, body: await r.json() };
    }, { ssml: '<speak>' + ch.body + '</speak>', key: KEY });
    if (res.status !== 200) { console.log('오류: 묶음', n, res.status, JSON.stringify(res.body).slice(0, 300)); process.exit(1); }
    const marks = {}; (res.body.timepoints || []).forEach(p => marks[p.markName] = +p.timeSeconds.toFixed(3));
    const missing = ch.cues.filter(i => marks['c' + i] == null);
    out.chunks.push({ cues: ch.cues, marks, audio: res.body.audioContent });
    console.log(`묶음 ${n}: 문장 ${ch.cues[0]}~${ch.cues[ch.cues.length - 1]}, 마크 ${Object.keys(marks).length}개` + (missing.length ? `, 문장 마크 빠짐 ${missing}` : ''));
  }
  await browser.close();
  const next = html.replace(/(<script type="application\/json" id="bundledTTS">)[\s\S]*?(<\/script>)/, (_, a, b) => a + JSON.stringify(out) + b);
  fs.writeFileSync(FILE, next);
  console.log('내장 완료', FILE, (next.length / 1048576).toFixed(1), 'MB');
})();
