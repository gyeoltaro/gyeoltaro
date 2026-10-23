// 사용설명서(www/manual.html)를 PDF로 만듭니다 → www/manual.pdf
// 설명서 화면의 "PDF로 받기"가 이 파일을 내려받아요. 설명서를 고치면 다시 만들어 주세요.
//   node tools/manual-pdf.mjs            (playwright 필요: npm install)
import { readFile } from 'node:fs/promises';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const www = join(root, 'www');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg' };
// 설명서와 화면 사진은 웹 서버 없이 브라우저에 바로 건네요(가짜 주소 manual.local)
const ORIGIN = 'https://manual.local/';

// 한글 글꼴(Noto Sans/Serif KR)은 Google Fonts에서 받아요. 프록시 환경이면 그 프록시를 거쳐요
const proxyUrl = process.env.HTTPS_PROXY || process.env.https_proxy;
const browser = await chromium.launch(proxyUrl ? { proxy: { server: proxyUrl } } : {});
const page = await browser.newPage();
await page.route(ORIGIN + '**', async (route) => {
  const path = normalize(decodeURIComponent(new URL(route.request().url()).pathname)).replace(/^([/\\])+/, '');
  try { await route.fulfill({ body: await readFile(join(www, path)), contentType: TYPES[extname(path)] || 'application/octet-stream' }); }
  catch (e) { await route.fulfill({ status: 404, body: '' }); }
});
await page.emulateMedia({ media: 'print', colorScheme: 'light' });
await page.goto(ORIGIN + 'manual.html', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
// 화면 사진은 스크롤해야 불러오게(lazy) 되어 있어서, 인쇄 전에 모두 불러와요
await page.evaluate(() => Promise.all([...document.images].map((img) => {
  img.loading = 'eager';
  return img.complete && img.naturalWidth ? null : new Promise((r) => { img.onload = img.onerror = r; });
})));
// 본문(Sans 400)과 제목(Serif 700)이 실제로 한글 글꼴로 그려지는지 확인해요
const fonts = await page.evaluate(() => [document.fonts.check('400 16px "Noto Sans KR"', '사용설명서'), document.fonts.check('700 16px "Noto Serif KR"', '사용설명서')]);
if (fonts.includes(false)) throw new Error('한글 글꼴을 불러오지 못했어요 (인터넷 연결을 확인해 주세요)');
const out = join(www, 'manual.pdf');
await page.pdf({
  path: out, format: 'A4', printBackground: true,
  margin: { top: '16mm', bottom: '18mm', left: '15mm', right: '15mm' },
  displayHeaderFooter: true,
  headerTemplate: '<span></span>',
  footerTemplate: '<div style="width:100%;font-size:8px;color:#8b8477;text-align:center;font-family:sans-serif"><span class="pageNumber"></span> / <span class="totalPages"></span></div>'
});
await browser.close();
console.log(out + ' (' + Math.round((await readFile(out)).length / 1024) + 'KB)');
