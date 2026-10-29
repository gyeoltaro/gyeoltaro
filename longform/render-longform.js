// 사용법: node longform/render-longform.js longform/ep01-startup-payback.html 결과.mp4 [병렬 수=3]   (필요: Node, Playwright, ffmpeg)
// 1920x1080 30fps. 페이지 여러 개가 구간을 나눠 그리고(구간마다 ffmpeg), 이어 붙인 뒤 오프라인 믹스 오디오를 -14 LUFS로 합친다.
// 썸네일 3안(1280x720 PNG)도 결과 파일 옆에 저장한다.
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');
const SRC = path.resolve(process.argv[2] || 'longform/ep01-startup-payback.html');
const OUT = path.resolve(process.argv[3] || 'longform.mp4');
const JOBS = +(process.argv[4] || 3), FPS = 30;
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'longform-'));
const launch = () => chromium.launch(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {});
async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.on('pageerror', e => console.log('pageerror', e.message));
  await page.goto('file://' + SRC + '?export');
  await page.waitForFunction(() => window.__exp && window.__exp.ready(), null, { timeout: 120000 });
  await page.waitForTimeout(500);
  return page;
}
function run(args) { return new Promise((res, rej) => { const p = spawn('ffmpeg', args, { stdio: ['ignore', 'inherit', 'inherit'] }); p.on('close', c => c ? rej(new Error('ffmpeg ' + c)) : res()); }); }
(async () => {
  const t0 = Date.now();
  const browser = await launch();
  const main = await openPage(browser);
  const info = await main.evaluate(() => window.__exp.info());
  const N = Math.ceil((+process.env.LIMIT || info.end) * FPS);   // LIMIT=초 → 앞부분만 시험 렌더
  console.log(`길이 ${info.end.toFixed(2)}초, ${N}프레임, 병렬 ${JOBS}`);
  // 썸네일
  for (const v of [0, 1, 2]) { const u = await main.evaluate(v => window.__exp.thumb(v), v); fs.writeFileSync(OUT.replace(/\.mp4$/, `_thumb${'ABC'[v]}.png`), Buffer.from(u.split(',')[1], 'base64')); }
  // 오디오: 오프라인 믹스 → 16비트 PCM
  const len = await main.evaluate(() => window.__exp.audioPrepare());
  const raw = path.join(TMP, 'mix.s16'), fd = fs.openSync(raw, 'w'), CH = 1 << 20;
  for (let i = 0; i * CH < len; i++) fs.writeSync(fd, Buffer.from(await main.evaluate(([i, n]) => window.__exp.audioChunk(i, n), [i, CH]), 'base64'));
  fs.closeSync(fd); await main.close();
  console.log('오디오 믹스', (len / 44100).toFixed(1), '초', ((Date.now() - t0) / 1000).toFixed(0), 's');
  // 영상: 구간 나눠 병렬로
  const per = Math.ceil(N / JOBS), segs = [];
  let done = 0, last = Date.now();
  await Promise.all([...Array(JOBS).keys()].map(async j => {
    const a = j * per, b = Math.min(N, a + per); if (a >= b) return;
    const seg = path.join(TMP, `seg${j}.mp4`); segs[j] = seg;
    const page = await openPage(browser);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-g', '60', seg], { stdio: ['pipe', 'inherit', 'inherit'] });
    const closed = new Promise(r => ff.on('close', r));
    for (let i = a; i < b; i++) {
      const url = await page.evaluate(t => window.__exp.frame(t, .92), i / FPS);
      if (!ff.stdin.write(Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
      done++;
      if (Date.now() - last > 30000) { last = Date.now(); const el = (last - t0) / 1000; console.log(`frame ${done}/${N}  ${el.toFixed(0)}s  ${(done / el).toFixed(1)} fps`); }
    }
    ff.stdin.end(); await closed; await page.close();
  }));
  await browser.close();
  const list = path.join(TMP, 'list.txt'); fs.writeFileSync(list, segs.filter(Boolean).map(s => `file '${s}'`).join('\n'));
  // 음량: 한 번에 거는 loudnorm 은 긴 영상에서 −15.3 LUFS 로 모자랐다 → 먼저 재고(1차) 그 값으로 맞춘다(2차, linear)
  const meas = require('child_process').spawnSync('ffmpeg', ['-nostats', '-f', 's16le', '-ar', '44100', '-ac', '1', '-i', raw,
    '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const L = JSON.parse(meas.slice(meas.lastIndexOf('{'), meas.lastIndexOf('}') + 1));
  const ln = `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${L.input_i}:measured_TP=${L.input_tp}:measured_LRA=${L.input_lra}:measured_thresh=${L.input_thresh}:offset=${L.target_offset}:linear=true`;
  console.log('음량 측정', L.input_i, 'LUFS → −14');
  const mux = (af, out) => run(['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-f', 's16le', '-ar', '44100', '-ac', '1', '-i', raw,
    '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-af', af + ',aresample=48000', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2',
    '-movflags', '+faststart', '-shortest', out]);
  await mux(ln, OUT);
  // 2차를 걸어도 어긋날 때가 있다(LF.02: 입력 −20.6 → −15.0). 결과를 다시 재서 0.3 LU 넘게 벗어나면 그만큼 더한다
  const lufs = f => { const e = require('child_process').spawnSync('ffmpeg', ['-nostats', '-i', f, '-af', 'ebur128', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
    const m = [...e.matchAll(/I:\s+(-?[\d.]+) LUFS/g)]; return parseFloat(m[m.length - 1][1]); };
  let I = lufs(OUT);
  if (Math.abs(I + 14) > 0.3) {
    const fix = (-14 - I).toFixed(2), tmpOut = path.join(TMP, 'fix.mp4');
    console.log('음량', I, 'LUFS → 보정', fix, 'dB');
    await mux(ln + `,volume=${fix}dB`, tmpOut); fs.copyFileSync(tmpOut, OUT); I = lufs(OUT);
  }
  console.log('최종 음량', I, 'LUFS');
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log('완료', OUT, ((Date.now() - t0) / 60000).toFixed(1), '분');
  console.log(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_name,width,height,r_frame_rate', '-of', 'compact', OUT]).toString());
})();
