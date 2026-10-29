// 사용: node shootany.js 파일명(확장자 없이) 출력폴더 시각...  → 커버 + 시점별 캔버스 캡처
const { chromium } = require('playwright');const fs=require('fs');
(async () => {
  const [name,out,...times]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const page = await browser.newPage();
  const errs=[]; page.on('pageerror', e => errs.push(e.message));
  await page.goto(`file:///home/user/gyeoltaro/shorts/${name}.html?export`);
  await page.waitForFunction(() => window.__exp && window.__exp.ready(), null, { timeout: 20000 });
  await page.waitForTimeout(600);
  const shots=[await page.evaluate(()=>window.__exp.cover(.85))];
  for(const t of times) shots.push(await page.evaluate(t=>window.__exp.frame(t,.85),+t));
  shots.forEach((u,i)=>fs.writeFileSync(`${out}/${String(i).padStart(2,'0')}.jpg`,Buffer.from(u.split(',')[1],'base64')));
  console.log(name,'status:',await page.evaluate(()=>document.getElementById('ttsStatus').textContent),'errors',errs);
  await browser.close();
})();
