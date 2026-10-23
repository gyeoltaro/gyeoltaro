/* 앱 푸시 보내기 (Firebase Cloud Functions, 서울 리전)
   - 새 알림장, 오늘 출석 → 그 아이 학부모님 기기
   - 학부모 참가신청, 학부모 답글 → 관장·사범님 기기
   도장 설정의 "앱 푸시 사용"이 켜져 있을 때만 보내요. 잠금 화면에도 보이는 글이라 아이 이름은 넣지 않아요.
   알림 받기를 켠 기기의 주소(토큰)는 push/{로그인ID} 문서에 있어요(보안 규칙: 자기 것만 쓰고 읽기). */
'use strict';
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');
const { getAuth } = require('firebase-admin/auth');
const { setGlobalOptions } = require('firebase-functions/v2');
const { onDocumentCreated, onDocumentWritten } = require('firebase-functions/v2/firestore');

initializeApp();
// 데이터베이스와 같은 서울에서 돌고, 원생 100명 규모라 작게 잡아요
setGlobalOptions({ region: 'asia-northeast3', memory: '256MiB', maxInstances: 2 });
const db = getFirestore();
const EMULATOR = process.env.FUNCTIONS_EMULATOR === 'true';
// 처음 설정·백업 불러오기처럼 예전 기록이 한꺼번에 올라올 때는 보내지 않아요
const FRESH_MS = 10 * 60 * 1000;
const fresh = (t) => typeof t === 'number' && Date.now() - t < FRESH_MS;

async function settings() {
  const d = await db.doc('config/public').get();
  return d.exists ? d.data() : {};
}

// 원생 → 연결된 학부모 기기
async function parentsOf(sids) {
  const list = [...new Set(sids)], uids = new Set();
  for (let i = 0; i < list.length; i += 30) {
    const q = await db.collection('parents').where('studentIds', 'array-contains-any', list.slice(i, i + 30)).get();
    q.forEach((d) => uids.add(d.id));
  }
  return [...uids];
}
async function allParents() {
  const q = await db.collection('parents').select().get();
  return q.docs.map((d) => d.id);
}
async function studentsInClasses(classes) {
  const q = await db.collection('students').where('className', 'in', classes.slice(0, 30)).get();
  return q.docs.filter((d) => d.get('status') !== 'left').map((d) => d.id);
}

async function tokensOf(uids, role) {
  if (!uids.length) return [];
  const docs = await db.getAll(...uids.map((u) => db.doc('push/' + u)));
  return docs.filter((d) => d.exists && d.get('role') === role && d.get('token')).map((d) => ({ uid: d.id, token: d.get('token') }));
}
// 관리자 기기: 이메일 인증을 마쳤고, 지금 관리자 이메일 목록에 있는 계정만
async function adminTokens() {
  const adm = await db.doc('config/admin').get();
  const emails = ((adm.exists && adm.get('adminEmails')) || []).map((e) => String(e).toLowerCase());
  const q = await db.collection('push').where('role', '==', 'admin').get();
  const out = [];
  for (const d of q.docs) {
    try {
      const u = await getAuth().getUser(d.id);
      if (u.emailVerified && emails.includes(String(u.email || '').toLowerCase())) out.push({ uid: d.id, token: d.get('token') });
    } catch (e) { /* 지워진 계정 */ }
  }
  return out;
}

async function send(targets, msg) {
  if (!targets.length) return;
  if (EMULATOR) {
    // 테스트(에뮬레이터)에서는 실제로 보내지 않고 기록만 남겨요
    await db.collection('_pushlog').add({ ...msg, uids: targets.map((t) => t.uid), at: Date.now() });
    return;
  }
  const res = await getMessaging().sendEach(targets.map((t) => ({
    token: t.token,
    data: msg,
    webpush: { headers: { Urgency: 'high', TTL: String(24 * 3600) } }
  })));
  // 알림을 끄거나 앱을 지운 기기의 주소는 정리해요
  const dead = [];
  res.responses.forEach((r, i) => {
    const code = r.error && r.error.code;
    if (code === 'messaging/registration-token-not-registered' || code === 'messaging/invalid-registration-token') dead.push(targets[i].uid);
  });
  await Promise.all(dead.map((u) => db.doc('push/' + u).delete().catch(() => {})));
}

function seoulToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}
function hm(t) {
  const [h, m] = String(t).split(':').map(Number);
  return (h < 12 ? '오전 ' : '오후 ') + (h % 12 || 12) + ':' + String(m).padStart(2, '0');
}
const title = (st) => String(st.dojangName || '태권도장');

exports.noticePush = onDocumentCreated('notices/{id}', async (event) => {
  const n = event.data && event.data.data();
  if (!n || !fresh(n.createdAt)) return;
  const st = await settings();
  if (!st.push) return;
  const t = n.target || {};
  let uids;
  if (t.type === 'students') uids = await parentsOf(t.studentIds || []);
  else if (t.type === 'class') uids = (t.classes || []).length ? await parentsOf(await studentsInClasses(t.classes)) : [];
  else uids = await allParents();
  // 개별 알림장은 제목에 아이 이름이 들어가는 일이 많아서 제목을 보여 주지 않아요
  const body = t.type === 'students' ? '우리 아이 소식이 왔어요' : '새 알림장 · ' + String(n.title || '').slice(0, 60);
  await send(await tokensOf(uids, 'parent'), { title: title(st), body, tag: 'notice-' + event.params.id });
});

exports.attendancePush = onDocumentWritten('att/{id}', async (event) => {
  const after = event.data.after.exists ? event.data.after.data() : null;
  if (!after || !after.sid) return;
  const today = seoulToday();
  if (after.ym !== today.slice(0, 7)) return;
  const dd = today.slice(8);
  const before = (event.data.before.exists && event.data.before.data().days) || {};
  const rec = (after.days || {})[dd];
  if (!rec || !rec.t || before[dd]) return;
  const st = await settings();
  if (!st.push) return;
  await send(await tokensOf(await parentsOf([after.sid]), 'parent'), { title: title(st), body: '출석했어요 · ' + hm(rec.t), tag: 'att-' + after.sid });
});

exports.applicationPush = onDocumentCreated('applications/{id}', async (event) => {
  const a = event.data && event.data.data();
  if (!a || a.seen !== false || !fresh(a.submittedAt)) return;
  const st = await settings();
  if (!st.push) return;
  await send(await adminTokens(), { title: title(st), body: '새 참가신청이 들어왔어요', tag: 'application' });
});

exports.replyPush = onDocumentCreated('nreplies/{id}', async (event) => {
  const r = event.data && event.data.data();
  if (!r || r.seen !== false || !fresh(r.at)) return;
  const st = await settings();
  if (!st.push) return;
  await send(await adminTokens(), { title: title(st), body: '학부모 답글이 왔어요', tag: 'reply' });
});
