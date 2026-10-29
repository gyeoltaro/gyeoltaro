// 실제 Google TTS 호출 테스트: 페이지의 '음성 생성' 버튼을 그대로 사용 (키는 환경변수로만 전달)
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const errs=[]; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file:///home/user/gyeoltaro/shorts/'+process.argv[2]+'.html');
  await page.waitForTimeout(800);
  await page.fill('#apiKey', process.env.TTS_KEY || '');
  await page.click('#btnGen');
  await page.waitForFunction(() => !/생성 중/.test(document.getElementById('ttsStatus').textContent), null, { timeout: 60000 });
  console.log('status:', await page.$eval('#ttsStatus', e => e.textContent));
  const cache = await page.evaluate(() => localStorage.getItem('calc-tts-cache'));
  if (cache) {
    const { data } = JSON.parse(cache);
    fs.writeFileSync(process.argv[2].replace(/-/g,'_')+'_tts.json', JSON.stringify(data));
    console.log('timepoints:', data.timepoints.length, 'audio b64 KB:', Math.round(data.audioContent.length/1024));
    console.log('first marks:', JSON.stringify(data.timepoints.slice(0,6)));
  }
  console.log('cues:', (await page.$$eval('#cueList time', t => t.map(x => x.textContent))).join(' '));
  console.log('errors', errs);
  await browser.close();
})();
