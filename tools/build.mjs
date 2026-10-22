// www/ 폴더의 화면을 CSS·JS까지 한 파일로 묶습니다 (미리보기·공유용).
//   node tools/build.mjs              → dist/taekwondo.html
//   node tools/build.mjs --out <파일>  → 원하는 위치에 저장
//   --artifact                         → <html>/<head>/<body> 껍데기를 뺀 본문만 저장
//   --cloud                            → 서버(Firebase) 설정을 넣은 채로 묶기 (기본은 기기 저장 모드)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const www = join(root, 'www');
const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const out = outIdx >= 0 ? resolve(args[outIdx + 1]) : join(root, 'dist', 'taekwondo.html');

let html = readFileSync(join(www, 'index.html'), 'utf8');
html = html.replace(/<link rel="stylesheet" href="(css\/[^"]+)">/g, (_, p) => `<style>\n${readFileSync(join(www, p), 'utf8')}</style>`);
// 한 파일 미리보기는 서버에 연결할 수 없으므로 1단계(기기 저장) 모드로 묶습니다. --cloud 를 주면 서버 설정을 그대로 둡니다.
const cloud = args.includes('--cloud');
html = html.replace(/<script src="((?:js\/)?[^":]+\.js)"><\/script>/g, (_, p) => {
  if (p === 'firebase-config.js' && !cloud) return '<script>window.FIREBASE_CONFIG = false;</script>';
  const js = readFileSync(join(www, p), 'utf8');
  if (js.includes('</script')) throw new Error(`${p}에 </script 문자열이 있어 한 파일로 묶을 수 없습니다`);
  return `<script>\n${js}</script>`;
});

if (args.includes('--artifact')) {
  const head = html.match(/<head>([\s\S]*?)<\/head>/)[1]
    .replace(/<meta charset[^>]*>\n?/, '')
    .replace(/<meta name="viewport"[^>]*>\n?/, '');
  const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
  html = head.trim() + '\n' + body.trim() + '\n';
}

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);
console.log(`${out} (${(Buffer.byteLength(html) / 1024).toFixed(0)}KB)`);
