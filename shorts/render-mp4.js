// 사용법: node shorts/render-mp4.js shorts/muin-cafe.html 결과.mp4   (필요: Node, Playwright, ffmpeg)
// 1080x1920 30fps 프레임을 ffmpeg로 바로 흘려보내고(디스크 미사용), 오프라인 믹스 오디오를 합쳐 MP4 생성
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {});
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + require('path').resolve(process.argv[2] || 'shorts/muin-cafe.html') + '?export');
  await page.waitForFunction(() => window.__exp && window.__exp.ready(), null, { timeout: 20000 });
  await page.waitForTimeout(800);
  const info = await page.evaluate(() => window.__exp.info());
  console.log('timeline', info);
  const wav = await page.evaluate(() => window.__exp.audio());
  fs.writeFileSync(require('path').join(require('os').tmpdir(), 'mix.wav'), Buffer.from(wav, 'base64'));
  console.log('audio mixed', fs.statSync(require('path').join(require('os').tmpdir(), 'mix.wav')).size, 'bytes');
  const FPS = 30, N = Math.ceil(info.end * FPS), COVER = Math.round(0.3 * FPS);   // 맨 앞 0.3초 = 썸네일 커버
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-i', require('path').join(require('os').tmpdir(), 'mix.wav'), '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-af', 'adelay=300:all=1,loudnorm=I=-14:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', '-shortest',
    (process.argv[3] || 'out.mp4')]);
  ff.stderr.on('data', d => process.stderr.write(d));
  const t0 = Date.now();
  const cover = await page.evaluate(() => window.__exp.cover());
  const coverBuf = Buffer.from(cover.slice(cover.indexOf(',') + 1), 'base64');
  require('fs').writeFileSync((process.argv[3] || 'out.mp4').replace(/\.mp4$/, '') + '_thumbnail.jpg', coverBuf);
  for (let i = 0; i < COVER; i++) if (!ff.stdin.write(coverBuf)) await new Promise(r => ff.stdin.once('drain', r));
  for (let i = 0; i < N; i++) {
    const url = await page.evaluate(t => window.__exp.frame(t), i / FPS);
    const buf = Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log(`frame ${i}/${N}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log('done in', ((Date.now() - t0) / 1000).toFixed(0), 's; errors', errs);
  await browser.close();
})();
