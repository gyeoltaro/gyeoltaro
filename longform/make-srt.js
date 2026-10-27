// 사용법: node longform/make-srt.js longform/파일.html 결과.ko.srt
// 문장 시각으로 한국어 자막(SRT) 만들기. 긴 문장은 쉼표·마침표에서 나눠 글자 수 비율로 시간 배분
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const browser = await chromium.launch(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {});
  const page = await browser.newPage();
  await page.goto('file://' + require('path').resolve(process.argv[2]) + '?export');
  await page.waitForFunction(() => window.__exp && window.__exp.ready(), null, { timeout: 60000 });
  const rows = await page.evaluate(() => CUES.map((c, i) => ({ t0: TL.cue[i], t1: nextStart(i) - (c.pause || 0) / 1000 * .5, text: c.text.replace(/[\^\[\]{}<>]/g, '') })));
  await browser.close();
  const ts = t => { const ms = Math.round(t * 1000), h = ms / 3600000 | 0, m = ms / 60000 % 60 | 0, s = ms / 1000 % 60 | 0; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
  const out = []; let n = 1;
  for (const r of rows) {
    let parts = [r.text];
    if (r.text.length > 42) {           // 문장부호 뒤에서 나누고, 짧은 조각은 붙인다
      const bits = r.text.split(/(?<=[,.?!])\s+/); parts = [];
      for (const b of bits) { if (parts.length && (parts[parts.length - 1] + ' ' + b).length <= 42) parts[parts.length - 1] += ' ' + b; else parts.push(b); }
    }
    const tot = parts.reduce((a, p) => a + p.length, 0); let t = r.t0;
    for (const p of parts) { const d = (r.t1 - r.t0) * p.length / tot; out.push(`${n++}\n${ts(t)} --> ${ts(t + d)}\n${p}\n`); t += d; }
  }
  fs.writeFileSync(process.argv[3], out.join('\n'));
  console.log('entries', n - 1, 'last', ts(rows[rows.length - 1].t1));
})();
