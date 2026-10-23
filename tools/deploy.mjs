// www/ 폴더를 웹 주소(GitHub Pages)용 저장소에 올립니다. 그 저장소에는 화면 파일만 들어갑니다.
//   node tools/deploy.mjs                          → 아래 SITE 저장소에 올리기
//   node tools/deploy.mjs --repo <git 주소> --branch <브랜치>
//   --dry                                           → dist/site 에 만들기만 하고 올리지 않기
//   -m <문장>                                       → 커밋 메시지 뒤에 덧붙이기 (여러 번 가능)
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// 사용자·조직 사이트(이름.github.io 저장소)는 main 브랜치가 바로 https://이름.github.io 로 열립니다.
const SITE = { repo: 'https://github.com/awoolimtkd/awoolimtkd.github.io', branch: 'main' };

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const repo = opt('--repo', SITE.repo);
const branch = opt('--branch', SITE.branch);
const dry = args.includes('--dry');
const notes = args.flatMap((a, i) => (a === '-m' ? [args[i + 1]] : []));
const dir = join(root, 'dist', 'site');
const git = (a, o = {}) => execFileSync('git', a, { cwd: dir, encoding: 'utf8', stdio: o.quiet ? 'pipe' : 'inherit', ...o });

rmSync(dir, { recursive: true, force: true });
if (dry) {
  mkdirSync(dir, { recursive: true });
} else {
  const exists = execFileSync('git', ['ls-remote', '--heads', repo, branch], { encoding: 'utf8' }).trim();
  execFileSync('git', ['clone', '--depth', '1', ...(exists ? ['--branch', branch] : []), repo, dir], { stdio: 'inherit' });
  if (!exists) git(['checkout', '--orphan', branch]);
}

// 지난번 파일을 지우고(.git 은 남김) www/ 를 그대로 복사합니다.
for (const f of readdirSync(dir)) if (f !== '.git') rmSync(join(dir, f), { recursive: true, force: true });
cpSync(join(root, 'www'), dir, { recursive: true });
writeFileSync(join(dir, '.nojekyll'), '');
// 앱 푸시 서버 프로그램도 같이 올려서, 다른 도장도 이 저장소를 받아 자기 Firebase에 설치할 수 있게 해요
mkdirSync(join(dir, 'push-server', 'functions'), { recursive: true });
cpSync(join(root, 'firebase.json'), join(dir, 'push-server', 'firebase.json'));
for (const f of ['index.js', 'package.json', 'package-lock.json']) cpSync(join(root, 'functions', f), join(dir, 'push-server', 'functions', f));
const src = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const srcBranch = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
writeFileSync(join(dir, 'README.md'), `# 태권도 통합 관리 (배포용)

이 저장소는 앱 화면 파일을 올려 두는 곳입니다. 여기서 직접 고치지 마세요.
원본은 https://github.com/gyeoltaro/gyeoltaro 의 \`${srcBranch}\` 브랜치 \`www/\` 폴더이고, \`node tools/deploy.mjs\` 로 올립니다.

\`push-server/\` 는 앱 푸시를 보내는 서버 프로그램(Firebase Cloud Functions)이에요. 각 도장이 자기 Firebase 프로젝트에 설치합니다.

\`\`\`bash
cd push-server
npm --prefix functions install
npx firebase-tools login
npx firebase-tools deploy --only functions --project 프로젝트ID
\`\`\`

마지막 배포: ${src}
`);
if (dry) { console.log(`${dir} 에 만들었어요 (올리지 않음)`); process.exit(0); }

git(['add', '-A']);
if (!git(['status', '--porcelain'], { quiet: true }).trim()) { console.log('바뀐 파일이 없어서 올리지 않았어요'); process.exit(0); }
git(['commit', '-q', '-m', `Deploy ${src}`, '-m', `Source: gyeoltaro/gyeoltaro@${src} (${srcBranch}) www/`, ...notes.flatMap(n => ['-m', n])]);
git(['push', 'origin', `HEAD:${branch}`]);
console.log(`올렸어요 → ${repo} (${branch})`);
