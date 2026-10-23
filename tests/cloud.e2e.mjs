// 서버 모드 통합 테스트: 관장님 PC · 도장 태블릿 · 학부모 휴대폰 세 브라우저를 Firebase 에뮬레이터에 붙여 실제로 주고받는지 확인합니다.
// 실행: npm run test:e2e   (firebase emulators:exec --project demo-tkd --only auth,firestore,functions "node tests/cloud.e2e.mjs")
// 앱 푸시 서버 프로그램(functions/)도 에뮬레이터에서 돌려요. 처음 한 번 npm --prefix functions install
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 8766, BASE = `http://127.0.0.1:${PORT}/index.html`;
// 도장이 보내는 연결 링크의 서버 값 (프로젝트ID.API키.앱ID). 에뮬레이터는 키를 확인하지 않아요
const LINK = 'demo-tkd.AIzaE2eTestKeyForTheFirebaseEmulator000.1:123456789:web:abc123';
const CONFIG = { apiKey: 'AIzaE2eTestKeyForTheFirebaseEmulator000', authDomain: 'demo-tkd.firebaseapp.com', projectId: 'demo-tkd', appId: '1:123456789:web:abc123' };
const EMAIL = 'owner@test.com', PW = 'secret123';

// 에뮬레이터를 깨끗하게 비우고, 테스트용 관리자(owner@test.com) 규칙을 넣습니다
const { rulesFor } = require('../www/js/cloud-rules.js');
await fetch('http://127.0.0.1:8080/emulator/v1/projects/demo-tkd/databases/(default)/documents', { method: 'DELETE' });
await fetch('http://127.0.0.1:9099/emulator/v1/projects/demo-tkd/accounts', { method: 'DELETE' });
const put = await fetch('http://127.0.0.1:8080/emulator/v1/projects/demo-tkd:securityRules', {
  method: 'PUT', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ rules: { files: [{ name: 'firestore.rules', content: rulesFor([EMAIL]) }] } })
});
if (!put.ok) throw new Error('rules load failed ' + put.status);

const server = spawn('npx', ['http-server', join(root, 'www'), '-p', String(PORT), '-s', '-c-1'], { stdio: 'ignore' });
for (let i = 0; i < 50; i++) { try { if ((await fetch(BASE)).ok) break; } catch (e) {} await new Promise(r => setTimeout(r, 200)); }

// 알림 허용(grantPermissions)이 먹히는 전체 Chromium을 화면 없이 띄워요 (헤드리스 셸은 알림이 늘 '차단')
const browser = await chromium.launch({ channel: 'chromium' });
const errors = [];
let pass = 0, fail = 0;
async function t(name, fn) {
  try { await fn(); pass++; console.log('  ok  ' + name); }
  catch (e) { fail++; console.log('  FAIL ' + name + ' → ' + e.message.split('\n')[0]); }
}
// url 을 주면 서버 설정 없이(새 휴대폰처럼) 그 주소로 엽니다
async function open(label, viewport, url) {
  const ctx = await browser.newContext({ viewport, locale: 'ko-KR', timezoneId: 'Asia/Seoul' });
  await ctx.addInitScript(cfg => { if (cfg) window.FIREBASE_CONFIG = cfg; window.FIREBASE_EMULATOR = true; }, url ? null : CONFIG);
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`[${label}] ${e.message}`));
  page.on('console', m => { if (process.env.E2E_DEBUG && (m.type() === 'warning' || m.type() === 'error')) console.log(`    [${label} ${m.type()}] ${m.text().slice(0, 300)}`); });
  await page.goto(url || BASE);
  await page.waitForSelector('.start-card');
  return { ctx, page };
}
async function login(page) {
  await page.waitForSelector('#clEmail');
  await page.fill('#clEmail', EMAIL);
  await page.fill('#clPw', PW);
  await page.click('.modal [data-mact="1"]');
}
async function verifyEmail(uid) {
  const r = await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/projects/demo-tkd/accounts:update', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer owner' },
    body: JSON.stringify({ localId: uid, emailVerified: true })
  });
  if (!r.ok) throw new Error('verify failed ' + r.status);
}
async function sign(page) {
  await page.check('#cReq');
  if (await page.$('#cSelf')) await page.check('#cSelf');
  await page.check('#cGuardian');
  await page.$eval('#cSig', el => el.scrollIntoView({ block: 'center' }));
  const box = await (await page.$('#cSig canvas')).boundingBox();
  await page.mouse.move(box.x + 30, box.y + 40); await page.mouse.down();
  await page.mouse.move(box.x + 160, box.y + 90, { steps: 6 }); await page.mouse.up();
}
const until = (page, fn, arg, ms = 15000) => page.waitForFunction(fn, arg, { timeout: ms, polling: 200 });

// 앱 푸시: 에뮬레이터의 서버 프로그램(functions)은 실제로 보내지 않고 _pushlog 에 남겨요
async function pushLog() {
  const r = await fetch('http://127.0.0.1:8080/v1/projects/demo-tkd/databases/(default)/documents/_pushlog?pageSize=300', { headers: { Authorization: 'Bearer owner' } });
  const j = await r.json();
  return (j.documents || []).map(d => ({ tag: d.fields.tag.stringValue, body: d.fields.body.stringValue, uids: ((d.fields.uids.arrayValue || {}).values || []).map(v => v.stringValue) }));
}
async function waitPush(pred, ms = 30000) {
  const end = Date.now() + ms;
  while (Date.now() < end) { const hit = (await pushLog()).find(pred); if (hit) return hit; await new Promise(r => setTimeout(r, 500)); }
  throw new Error('push not sent: ' + JSON.stringify(await pushLog()));
}
const uidOf = page => page.evaluate(() => firebase.auth().currentUser.uid);
const SHOTS = process.env.E2E_SHOTS;
const shot = async (page, name) => { if (SHOTS) { await page.waitForTimeout(350); await page.screenshot({ path: `${SHOTS}/${name}.png` }); } };

// ---------- 관장님 PC: 계정 만들기 → 이메일 인증 → 처음 설정 ----------
const A = (await open('admin', { width: 1280, height: 860 })).page;
await t('관리자 계정을 만들고 이메일 인증 화면이 나온다', async () => {
  await shot(A, 'c01-start');
  await A.click('[data-act="admin"]');
  await A.waitForSelector('#clEmail');
  await shot(A, 'c02-login');
  await A.click('.modal [data-mode]');
  await A.fill('#clEmail', EMAIL); await A.fill('#clPw', PW); await A.fill('#clPw2', PW);
  await A.click('.modal [data-mact="1"]');
  await A.waitForSelector('text=이메일 인증');
  await shot(A, 'c03-verify');
});
await t('인증 후 서버 처음 설정에서 샘플로 시작한다', async () => {
  await verifyEmail(await A.evaluate(() => firebase.auth().currentUser.uid));
  await A.click('.modal [data-mact="2"]');
  await A.waitForSelector('input[name="setupChoice"][value="demo"]');
  await shot(A, 'c04-first-setup');
  await A.check('input[name="setupChoice"][value="demo"]');
  await A.click('.modal [data-mact="1"]');
  await A.waitForSelector('.shell', { timeout: 90000 });
  const n = await A.evaluate(() => DB.state.students.length);
  if (n !== 100) throw new Error('students ' + n);
  const pill = await A.textContent('[data-cloud]');
  if (!/서버|저장/.test(pill)) throw new Error('status pill: ' + pill);
  await shot(A, 'c05-admin-home');
});

await t('목록에 없는 이메일로 로그인하면 보안 규칙 안내가 나온다', async () => {
  const X = (await open('stranger', { width: 1100, height: 860 })).page;
  await X.click('[data-act="admin"]');
  await X.click('.modal [data-mode]');
  await X.fill('#clEmail', 'coach@test.com'); await X.fill('#clPw', PW); await X.fill('#clPw2', PW);
  await X.click('.modal [data-mact="1"]');
  await X.waitForSelector('text=이메일 인증');
  await verifyEmail(await X.evaluate(() => firebase.auth().currentUser.uid));
  await X.click('.modal [data-mact="2"]');
  await X.waitForSelector('#rulesOut');
  const rules = await X.inputValue('#rulesOut');
  if (rules.indexOf("'coach@test.com'") < 0) throw new Error('rules without email');
  await shot(X, 'c06-rules');
  const peek = await X.evaluate(() => firebase.firestore().collection('students').limit(1).get().then(() => 'read', e => e.code));
  if (peek !== 'permission-denied') throw new Error('non-admin could read: ' + peek);
  await X.context().close();
});

// ---------- 도장 태블릿: 같은 계정으로 로그인 → 출석 화면 ----------
const K = (await open('kiosk', { width: 1024, height: 768 })).page;
let kidA;
await t('태블릿에서 로그인해 출석 화면을 연다', async () => {
  await K.click('[data-act="kiosk"]');
  await login(K);
  try { await K.waitForSelector('.kiosk', { timeout: 60000 }); }
  catch (e) {
    const d = await K.evaluate(() => ({ role: Cloud.role, hasData: Cloud.hasData, started: Cloud.started, session: App.session, modal: (document.querySelector('.modal') || {}).innerText, students: DB.state.students.length }));
    throw new Error('상태: ' + JSON.stringify(d).slice(0, 400));
  }
  kidA = await K.evaluate(() => { const s = DB.active().filter(x => !DB.day(U.today())[x.id])[0]; return { id: s.id, pin: s.pin }; });
});
await t('태블릿 출석이 관장님 화면에 실시간으로 들어온다', async () => {
  for (const d of kidA.pin) await K.click(`[data-k="${d}"]`);
  await K.waitForSelector('.k-result.ok');
  await until(A, id => !!DB.day(U.today())[id], kidA.id);
});
await t('인터넷이 끊겨도 출석하고, 연결되면 올라간다', async () => {
  const kid = await K.evaluate(() => { const s = DB.active().filter(x => !DB.day(U.today())[x.id])[1]; return { id: s.id, pin: s.pin }; });
  await K.context().setOffline(true);
  await K.waitForTimeout(400);
  await K.keyboard.type(kid.pin);
  await K.waitForSelector('.k-result.ok');
  await K.waitForTimeout(800);
  const seenWhileOffline = await A.evaluate(id => !!DB.day(U.today())[id], kid.id);
  if (seenWhileOffline) throw new Error('should not sync while offline');
  await K.context().setOffline(false);
  await until(A, id => !!DB.day(U.today())[id], kid.id, 30000);
});

// ---------- 학부모 초대 ----------
let code, kids, other;
await t('관리자가 형제 초대 코드를 만들면 서버에 저장된다', async () => {
  ({ code, kids, other } = await A.evaluate(() => {
    // 동의 전이면서 보호자 번호가 같은 형제 (샘플의 첫 두 원생)
    const pending = DB.state.students.filter(s => s.status === 'active' && !DB.hasConsent(s));
    const s0 = pending.find(s => pending.some(x => x.id !== s.id && x.guardians[0] && s.guardians[0] && x.guardians[0].phone === s.guardians[0].phone));
    const sibs = DB.studentsByPhone(s0.guardians[0].phone).map(s => s.id);
    const other = DB.state.students.find(s => sibs.indexOf(s.id) < 0).id;
    return { code: Cloud.createInvite(sibs, s0.guardians[0].phone), kids: sibs, other };
  }));
  await until(A, c => firebase.firestore().doc('invites/' + c).get({ source: 'server' }).then(d => d.exists), code);
});

const P = (await open('parent', { width: 390, height: 844 })).page;
await t('학부모가 초대 코드로 연결하면 동의서가 먼저 나온다', async () => {
  await P.click('[data-act="parent"]');
  await shot(P, 'c08-invite');
  await P.fill('#ivCode', code.slice(0, 4) + '-' + code.slice(4).toLowerCase());
  await P.click('.modal [data-mact="1"]');
  try { await P.waitForSelector('#cSubmit', { timeout: 30000 }); }
  catch (e) {
    const d = await P.evaluate(() => ({ err: (document.querySelector('.modal [data-err]') || {}).textContent, role: Cloud.role, started: Cloud.started, session: App.session, students: DB.state.students.map(x => x.id), text: document.getElementById('app').innerText.slice(0, 120) }));
    throw new Error('상태: ' + JSON.stringify(d));
  }
});
await t('동의하면 학부모 홈이 열리고 관리자에게 동의가 기록된다', async () => {
  await shot(P, 'c09-consent');
  await sign(P);
  await P.click('#cSubmit');
  await P.waitForSelector('[data-tab="home"].on');
  await shot(P, 'c10-parent-home');
  await until(A, id => { const s = DB.student(id); return s && s.consent && s.consent.by === 'app' && !!s.consent.signature; }, kids[0]);
  const sms = await A.evaluate(id => DB.smsPending().some(s => s.id === id), kids[0]);
  if (!sms) throw new Error('confirmation SMS not pending');
});
await t('학부모 기기에는 자기 아이 자료만 있다', async () => {
  const r = await P.evaluate(ids => ({
    students: DB.state.students.map(s => s.id).sort(),
    pays: DB.state.payments.every(p => ids.includes(p.studentId)),
    att: Object.keys(DB.state.attendance).every(d => Object.keys(DB.state.attendance[d]).every(id => ids.includes(id))),
    pin: DB.settings().adminPin === '123456' && !DB.settings().adminEmails
  }), kids);
  if (r.students.join() !== kids.slice().sort().join()) throw new Error('students ' + r.students);
  if (!r.pays || !r.att) throw new Error('foreign data present');
});
await t('다른 아이 정보는 서버가 직접 막는다', async () => {
  const code1 = await P.evaluate(id => firebase.firestore().doc('students/' + id).get({ source: 'server' }).then(() => 'read', e => e.code), other);
  const code2 = await P.evaluate(id => firebase.firestore().doc('payments/hack').set({ studentId: id, amount: 0 }).then(() => 'wrote', e => e.code), kids[0]);
  const code3 = await P.evaluate(() => firebase.firestore().doc('config/admin').get({ source: 'server' }).then(() => 'read', e => e.code));
  if (code1 !== 'permission-denied' || code2 !== 'permission-denied' || code3 !== 'permission-denied') throw new Error([code1, code2, code3].join(','));
});
await t('이미 쓴 초대 코드는 링크로 열어도 다시 쓸 수 없다', async () => {
  const P2 = (await open('parent2', { width: 390, height: 844 }, `${BASE}?s=${LINK}&c=${code}`)).page;
  await P2.waitForSelector('#ivCode');
  await P2.click('.modal [data-mact="1"]');
  await P2.waitForSelector('text=이미 썼거나');
  await P2.context().close();
});

// ---------- 새 휴대폰: 도장이 보낸 초대 링크만으로 서버 연결 ----------
let L, otherKids;
await t('초대 링크로 열면 도장 서버가 연결되고 코드가 채워진다', async () => {
  let code2;
  ({ code2, otherKids } = await A.evaluate(id => {
    const s = DB.student(id), sibs = DB.studentsByPhone(s.guardians[0].phone).map(x => x.id);
    return { code2: Cloud.createInvite(sibs, s.guardians[0].phone), otherKids: sibs };
  }, other));
  await until(A, c => firebase.firestore().doc('invites/' + c).get({ source: 'server' }).then(d => d.exists), code2);
  L = (await open('link-parent', { width: 390, height: 844 }, `${BASE}?s=${LINK}&c=${code2}`)).page;
  await L.waitForSelector('#ivCode');
  const st = await L.evaluate(() => ({ code: document.querySelector('#ivCode').value, saved: localStorage.getItem('tkd-server-v1'), project: Cloud.projectId(), enabled: Cloud.enabled }));
  if (st.code !== code2.slice(0, 4) + '-' + code2.slice(4) || st.saved !== LINK || st.project !== 'demo-tkd' || !st.enabled) throw new Error(JSON.stringify(st));
  await L.click('.modal [data-mact="1"]');
  await L.waitForSelector('#cSubmit, [data-tab="home"].on', { timeout: 30000 });
  const q = await L.evaluate(() => location.search);
  if (/[?&]c=/.test(q) || q.indexOf('s=') < 0) throw new Error('url after redeem: ' + q);
  await until(A, ids => ids.every(id => Cloud.parentsOf(id).length > 0), otherKids);
});
await t('관리자가 보내는 초대 문자에 도장 서버 링크가 들어간다', async () => {
  const link = await A.evaluate(() => Cloud.link('ABCDEFGH'));
  if (link !== `http://127.0.0.1:${PORT}/?s=${LINK}&c=ABCDEFGH`) throw new Error(link);
});
await t('이 기기 서버 연결 해제를 하면 체험 모드로 돌아가고 학부모 연결도 풀린다', async () => {
  await Promise.all([L.waitForNavigation(), L.evaluate(() => Cloud.disconnect())]);
  await L.waitForSelector('.start-card');
  const st = await L.evaluate(() => ({ enabled: Cloud.enabled, saved: localStorage.getItem('tkd-server-v1'), search: location.search }));
  if (st.enabled || st.saved || st.search) throw new Error(JSON.stringify(st));
  await until(A, ids => ids.every(id => Cloud.parentsOf(id).length === 0), otherKids);
  await L.context().close();
});

// ---------- 앱 푸시 켜기 ----------
let pUid, aUid;
await t('관장님이 앱 푸시를 켜면 학부모 화면에 알림 켜기가 보이고, 알림 주소를 저장한다', async () => {
  // 학부모가 알림 허용을 누른 상태 (헤드리스 브라우저는 기본이 '차단')
  await P.context().grantPermissions(['notifications']);
  await A.evaluate(() => { DB.settings().push = true; DB.save(); });
  try { await P.waitForSelector('[data-act="push-on"]', { timeout: 20000 }); }
  catch (e) {
    const d = await P.evaluate(() => ({ enabled: Cloud.pushEnabled(), state: Cloud.pushState(), push: DB.settings().push, perm: window.Notification && Notification.permission, view: App.view, gate: document.getElementById('app').className }));
    const cfg = await (await fetch('http://127.0.0.1:8080/v1/projects/demo-tkd/databases/(default)/documents/config/public', { headers: { Authorization: 'Bearer owner' } })).json();
    throw new Error('상태: ' + JSON.stringify(d) + ' 서버 push=' + JSON.stringify(cfg.fields && cfg.fields.push));
  }
  pUid = await uidOf(P); aUid = await uidOf(A);
  // 실제 알림 주소는 휴대폰 브라우저에서만 받을 수 있어서, 테스트는 주소를 직접 넣어요(보안 규칙은 그대로 적용)
  await P.evaluate(() => firebase.firestore().doc('push/' + firebase.auth().currentUser.uid).set({ token: 'test-token-parent', role: 'parent', at: Date.now() }));
  await A.evaluate(() => firebase.firestore().doc('push/' + firebase.auth().currentUser.uid).set({ token: 'test-token-admin', role: 'admin', at: Date.now() }));
  const policy = await A.evaluate(() => Parts.privacyPolicy());
  if (!/Firebase Cloud Messaging/.test(policy) || !/기기 토큰/.test(policy)) throw new Error('privacy policy missing push');
});

// ---------- 알림장·신청서 주고받기 ----------
await t('개별 알림장은 받는 아이 보호자에게만 간다', async () => {
  await A.evaluate(([mine, theirs]) => {
    DB.upsert('notices', { id: 'nMine', title: '우리 아이 소식', body: '오늘 잘했어요', image: null, pinned: false, target: { type: 'students', studentIds: [mine] }, createdAt: Date.now(), reads: {}, replies: [] });
    DB.upsert('notices', { id: 'nTheirs', title: '다른 아이 소식', body: '비밀', image: null, pinned: false, target: { type: 'students', studentIds: [theirs] }, createdAt: Date.now(), reads: {}, replies: [] });
  }, [kids[0], other]);
  await until(P, () => DB.state.notices.some(n => n.id === 'nMine'));
  await P.waitForTimeout(800);
  const leaked = await P.evaluate(() => DB.state.notices.some(n => n.id === 'nTheirs'));
  if (leaked) throw new Error('other child notice leaked');
});
await t('새 개별 알림장 푸시는 그 아이 학부모에게만, 아이 이름 없이 간다', async () => {
  const hit = await waitPush(l => l.tag === 'notice-nMine');
  if (!hit.uids.includes(pUid) || hit.uids.includes(aUid)) throw new Error(JSON.stringify(hit));
  if (hit.body !== '우리 아이 소식이 왔어요') throw new Error('body: ' + hit.body);
  await new Promise(r => setTimeout(r, 1500));
  const theirs = (await pushLog()).filter(l => l.tag === 'notice-nTheirs' && l.uids.includes(pUid));
  if (theirs.length) throw new Error('pushed to wrong parent');
});
await t('오늘 출석하면 그 아이 학부모에게 출석 푸시가 간다', async () => {
  const sid = await A.evaluate(ids => { const id = ids.find(x => !DB.day(U.today())[x]); if (id) DB.checkIn(id, null, null, 'admin'); return id; }, kids);
  if (!sid) throw new Error('all siblings already checked in');
  const hit = await waitPush(l => l.tag === 'att-' + sid);
  if (!hit.uids.includes(pUid) || !/^출석했어요 · 오[전후] \d+:\d\d$/.test(hit.body)) throw new Error(JSON.stringify(hit));
});
await t('학부모가 읽고 답글을 쓰면 관리자에게 보인다', async () => {
  await P.evaluate(() => App.go('notices', { id: 'nMine' }));
  await P.click('[data-act="quick"] >> nth=0');
  await until(A, id => { const n = DB.byId('notices', 'nMine'); return n && n.reads[id] && n.replies.length === 1 && n.replies[0].seen === false; }, kids[0]);
  const badge = await A.evaluate(() => DB.unseenReplies());
  if (badge < 1) throw new Error('reply badge ' + badge);
  const hit = await waitPush(l => l.tag === 'reply');
  if (!hit.uids.includes(aUid) || hit.uids.includes(pUid)) throw new Error(JSON.stringify(hit));
});
await t('학부모 참가신청서가 관리자에게 실시간으로 들어온다', async () => {
  const ev = await A.evaluate(() => DB.state.events.find(e => DB.eventOpen(e) && e.date >= U.today() && e.kind === '캠프' || (DB.eventOpen(e) && e.date >= U.today() && !e.thirdParty)).id);
  await P.evaluate(id => App.go('events', { id }), ev);
  await P.waitForSelector('#evSig');
  const radio = await P.$('input[name="evChoice"]');
  if (radio) await radio.check();
  await P.check('#evAgreePriv');
  if (await P.$('#evAgree3')) await P.check('#evAgree3');
  await P.check('#evAgree');
  await P.$eval('#evSig', el => el.scrollIntoView({ block: 'center' }));
  const box = await (await P.$('#evSig canvas')).boundingBox();
  await P.mouse.move(box.x + 30, box.y + 40); await P.mouse.down(); await P.mouse.move(box.x + 150, box.y + 80, { steps: 5 }); await P.mouse.up();
  await P.click('[data-act="submit"]');
  await until(A, ([id, sid]) => DB.state.applications.some(a => a.eventId === id && a.studentId === sid && a.seen === false && a.consents && a.signature), [ev, kids[0]]);
  const hit = await waitPush(l => l.tag === 'application');
  if (!hit.uids.includes(aUid) || hit.uids.includes(pUid)) throw new Error(JSON.stringify(hit));
});
await t('알림 점검 화면이 단계별 상태를 보여 주고, 관리자 서버 시험 알림이 관리자에게 간다', async () => {
  await A.evaluate(() => App.nav('settings'));
  await A.click('[data-act="push-check"]');
  await A.waitForSelector('.pcheck [data-k="token"] .pill:is(.good, .bad, .warn)');
  const txt = await A.textContent('.pcheck');
  if (!/켜짐/.test(txt) || !/새 참가신청/.test(txt)) throw new Error(txt);
  await shot(A, 'c13-push-check');
  const before = (await pushLog()).filter(l => l.tag === 'reply').length;
  await A.click('.modal button:has-text("서버에서 시험 알림")');
  const end = Date.now() + 30000;
  let logs;
  while (Date.now() < end && (logs = (await pushLog()).filter(l => l.tag === 'reply')).length <= before) await new Promise(r => setTimeout(r, 500));
  const last = logs[logs.length - 1];
  if (logs.length <= before || !last.uids.includes(aUid) || last.uids.includes(pUid)) throw new Error('test push: ' + JSON.stringify(logs));
  await A.keyboard.press('Escape');
  // 학부모 메뉴에서도 점검을 연다
  await P.evaluate(() => App.nav('home'));
  await P.click('[data-act="p-menu"]');
  await P.click('.modal [data-pushcheck]');
  await P.waitForSelector('.pcheck [data-k="token"] .pill:is(.good, .bad, .warn)');
  if (!/새 알림장/.test(await P.textContent('.pcheck'))) throw new Error('parent check');
  await shot(P, 'c14-push-check-parent');
  await P.keyboard.press('Escape');
});
await t('원생 정보에 연결된 학부모 기기가 보인다', async () => {
  await A.evaluate(id => App.go('students', { id }), kids[0]);
  await A.waitForSelector('text=기기 1대 연결');
  await shot(A, 'c11-student-parent-app');
  await A.evaluate(() => App.nav('settings'));
  await A.waitForSelector('text=서버 · 관리자 계정');
  await shot(A, 'c12-settings-cloud');
});
await t('관리자가 연결을 끊으면 학부모 기기는 처음 화면으로 돌아간다', async () => {
  await A.evaluate(id => { Cloud.parentsOf(id).forEach(p => Cloud.unlinkParent(p.id)); }, kids[0]);
  await P.waitForSelector('.start-card', { timeout: 20000 });
  const left = await fetch(`http://127.0.0.1:8080/v1/projects/demo-tkd/databases/(default)/documents/push/${pUid}`, { headers: { Authorization: 'Bearer owner' } });
  if (left.status !== 404) throw new Error('push token left behind: ' + left.status);
});

await t('관리자 비밀번호를 잊으면 계정 비밀번호로 다시 정하고 태블릿에도 반영된다', async () => {
  await A.evaluate(() => App.logout());
  await A.click('[data-act="admin"]');
  await A.click('.modal [data-extra]');
  await A.waitForSelector('#rpPw');
  await A.fill('#rpPw', 'wrong-password'); await A.fill('#rpNew', '483920'); await A.fill('#rpNew2', '483920');
  await A.click('.modal [data-mact="1"]');
  await A.waitForSelector('.modal [data-err]:has-text("맞지 않아요")');
  await A.fill('#rpPw', PW);
  await A.click('.modal [data-mact="1"]');
  await A.waitForSelector('.shell');
  if (await A.evaluate(() => DB.settings().adminPin) !== '483920') throw new Error('pin not changed');
  await until(K, () => DB.settings().adminPin === '483920');
});

await browser.close();
server.kill();
if (errors.length) { console.log('\n페이지 오류:\n' + errors.join('\n')); fail += errors.length; }
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
