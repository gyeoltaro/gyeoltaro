// Firestore 보안 규칙 파일 만들기: node tools/rules.mjs 관장@이메일 [사범@이메일 ...]
// 만들어진 firestore.rules 를 Firebase 콘솔 → Firestore → 규칙 탭에 붙여 넣거나 `firebase deploy --only firestore:rules` 로 올립니다.
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { rulesFor } = createRequire(import.meta.url)(join(root, 'www/js/cloud-rules.js'));
const emails = process.argv.slice(2);
writeFileSync(join(root, 'firestore.rules'), rulesFor(emails));
console.log('firestore.rules 를 만들었어요. 관리자: ' + (emails.join(', ') || 'admin@example.com (예시)'));
