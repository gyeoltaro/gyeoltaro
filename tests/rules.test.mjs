// Firestore 보안 규칙 테스트 (Firebase 에뮬레이터에서 실행)
//   npx firebase emulators:exec --only firestore "node tests/rules.test.mjs"
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';

const require = createRequire(import.meta.url);
const { rulesFor } = require('../www/js/cloud-rules.js');

const testEnv = await initializeTestEnvironment({
  projectId: 'demo-tkd-rules',
  firestore: { rules: rulesFor(['owner@test.com', 'coach@test.com']), host: '127.0.0.1', port: 8080 }
});

const FUTURE = Date.now() + 7 * 86400000;
await testEnv.withSecurityRulesDisabled(async (ctx) => {
  const db = ctx.firestore();
  await setDoc(doc(db, 'config/public'), { dojangName: '테스트 도장' });
  await setDoc(doc(db, 'config/admin'), { adminPin: '123456' });
  await setDoc(doc(db, 'config/fitstats'), { all: {} });
  await setDoc(doc(db, 'students/s1'), { name: '김하나', className: '1부', photo: 'data:x', consent: null });
  await setDoc(doc(db, 'students/s2'), { name: '이두리', className: '2부', photo: null });
  await setDoc(doc(db, 'payments/p1'), { studentId: 's1', amount: 150000 });
  await setDoc(doc(db, 'payments/p2'), { studentId: 's2', amount: 150000 });
  await setDoc(doc(db, 'att/s1_2026-10'), { sid: 's1', ym: '2026-10', days: { '01': { t: '15:00' } } });
  await setDoc(doc(db, 'att/s2_2026-10'), { sid: 's2', ym: '2026-10', days: {} });
  await setDoc(doc(db, 'notices/nAll'), { title: '전체', target: { type: 'all' } });
  await setDoc(doc(db, 'notices/nInd'), { title: '개별', target: { type: 'students', studentIds: ['s2'] } });
  await setDoc(doc(db, 'nview/nInd_s2'), { nid: 'nInd', sid: 's2', title: '개별' });
  await setDoc(doc(db, 'nview/nX_s1'), { nid: 'nX', sid: 's1', title: '하나에게' });
  await setDoc(doc(db, 'events/e1'), { title: '대회' });
  await setDoc(doc(db, 'applications/a2'), { studentId: 's2', status: '접수', by: 'parent', paymentId: null });
  await setDoc(doc(db, 'invites/GOODCODE'), { studentIds: ['s1'], phone: '01011112222', expiresAt: FUTURE, usedBy: null, usedAt: null });
  await setDoc(doc(db, 'invites/OLDCODE1'), { studentIds: ['s2'], phone: '01033334444', expiresAt: Date.now() - 1000, usedBy: null, usedAt: null });
});

const admin = testEnv.authenticatedContext('adminUid', { email: 'owner@test.com', email_verified: true }).firestore();
const unverified = testEnv.authenticatedContext('u2', { email: 'owner@test.com', email_verified: false }).firestore();
const stranger = testEnv.authenticatedContext('u3', { email: 'someone@test.com', email_verified: true }).firestore();
const parent = testEnv.authenticatedContext('parentUid', { firebase: { sign_in_provider: 'anonymous' } }).firestore();
const other = testEnv.authenticatedContext('otherUid', { firebase: { sign_in_provider: 'anonymous' } }).firestore();
const nobody = testEnv.unauthenticatedContext().firestore();

let pass = 0, fail = 0;
async function t(name, p) {
  try { await p; pass++; console.log('  ok  ' + name); }
  catch (e) { fail++; console.log('  FAIL ' + name + ' → ' + (e && e.message)); }
}
const q = (db, coll, field, val) => getDocs(query(collection(db, coll), where(field, '==', val)));

console.log('관리자');
await t('관리자는 비밀번호 설정을 읽는다', assertSucceeds(getDoc(doc(admin, 'config/admin'))));
await t('이메일 인증 전에는 관리자가 아니다', assertFails(getDoc(doc(unverified, 'config/admin'))));
await t('목록에 없는 이메일은 관리자가 아니다', assertFails(getDoc(doc(stranger, 'students/s1'))));
await t('로그인 안 하면 아무것도 못 읽는다', assertFails(getDoc(doc(nobody, 'config/public'))));
await t('관리자는 초대 코드 목록을 본다', assertSucceeds(getDocs(collection(admin, 'invites'))));
await t('관리자는 기한 지난 초대 코드도 한 장씩 본다', assertSucceeds(getDoc(doc(admin, 'invites/OLDCODE1'))));
await t('관리자는 없는 초대 코드를 조회해도 오류가 나지 않는다', assertSucceeds(getDoc(doc(admin, 'invites/NOPE0000'))));
await t('관리자는 원생을 고친다', assertSucceeds(updateDoc(doc(admin, 'students/s2'), { className: '3부' })));

console.log('초대 코드');
await t('연결 전에는 아이 정보를 못 읽는다', assertFails(getDoc(doc(parent, 'students/s1'))));
await t('코드를 알면 초대장 한 장은 읽는다', assertSucceeds(getDoc(doc(parent, 'invites/GOODCODE'))));
await t('초대 코드 목록은 못 본다', assertFails(getDocs(collection(parent, 'invites'))));
await t('기한 지난 코드는 못 읽는다', assertFails(getDoc(doc(parent, 'invites/OLDCODE1'))));
await t('코드에 없는 아이까지 끼워 넣으면 거절', assertFails((() => {
  const b = writeBatch(parent);
  b.set(doc(parent, 'parents/parentUid'), { studentIds: ['s1', 's2'], code: 'GOODCODE', phone: '', createdAt: 1 });
  b.update(doc(parent, 'invites/GOODCODE'), { usedBy: 'parentUid', usedAt: 1 });
  return b.commit();
})()));
await t('초대 코드 사용 처리 없이 연결하면 거절', assertFails(setDoc(doc(parent, 'parents/parentUid'), { studentIds: ['s1'], code: 'GOODCODE', phone: '', createdAt: 1 })));
await t('올바른 코드로 기기를 연결한다', assertSucceeds((() => {
  const b = writeBatch(parent);
  b.set(doc(parent, 'parents/parentUid'), { studentIds: ['s1'], code: 'GOODCODE', phone: '01011112222', createdAt: 1 });
  b.update(doc(parent, 'invites/GOODCODE'), { usedBy: 'parentUid', usedAt: 1 });
  return b.commit();
})()));
await t('이미 쓴 코드는 다른 사람이 못 쓴다', assertFails((() => {
  const b = writeBatch(other);
  b.set(doc(other, 'parents/otherUid'), { studentIds: ['s1'], code: 'GOODCODE', phone: '', createdAt: 1 });
  b.update(doc(other, 'invites/GOODCODE'), { usedBy: 'otherUid', usedAt: 1 });
  return b.commit();
})()));

console.log('학부모 읽기');
await t('자기 아이 정보는 읽는다', assertSucceeds(getDoc(doc(parent, 'students/s1'))));
await t('다른 아이 정보는 못 읽는다', assertFails(getDoc(doc(parent, 'students/s2'))));
await t('자기 아이 회비는 조회한다', assertSucceeds(q(parent, 'payments', 'studentId', 's1')));
await t('다른 아이 회비는 조회 못 한다', assertFails(q(parent, 'payments', 'studentId', 's2')));
await t('조건 없이 회비 전체 조회는 못 한다', assertFails(getDocs(collection(parent, 'payments'))));
await t('자기 아이 출석은 조회한다', assertSucceeds(q(parent, 'att', 'sid', 's1')));
await t('다른 아이 출석은 조회 못 한다', assertFails(q(parent, 'att', 'sid', 's2')));
await t('전체 알림장은 읽는다', assertSucceeds(q(parent, 'notices', 'target.type', 'all')));
await t('개별 알림장 원본은 못 읽는다', assertFails(q(parent, 'notices', 'target.type', 'students')));
await t('자기 아이 개별 알림장 사본은 읽는다', assertSucceeds(q(parent, 'nview', 'sid', 's1')));
await t('다른 아이 개별 알림장은 못 읽는다', assertFails(q(parent, 'nview', 'sid', 's2')));
await t('행사 안내는 읽는다', assertSucceeds(getDoc(doc(parent, 'events/e1'))));
await t('연결 안 된 익명 사용자는 행사도 못 본다', assertFails(getDoc(doc(other, 'events/e1'))));
await t('도장 공개 설정은 읽는다', assertSucceeds(getDoc(doc(parent, 'config/public'))));
await t('체력 통계(이름 없음)는 읽는다', assertSucceeds(getDoc(doc(parent, 'config/fitstats'))));
await t('관리자 비밀번호 설정은 못 읽는다', assertFails(getDoc(doc(parent, 'config/admin'))));
await t('다른 아이 신청서는 못 읽는다', assertFails(getDoc(doc(parent, 'applications/a2'))));

console.log('학부모 쓰기');
const consent = { v: 1, at: 1, by: 'app', guardianName: '엄마', relation: '어머니', phone: '01011112222', required: true, photo: false, health: false, self: null, signature: 'data:sig', smsSentAt: null };
await t('자기 아이 동의서를 낸다 (사진 미동의 → 사진 삭제)', assertSucceeds(updateDoc(doc(parent, 'students/s1'), { consent, photo: null })));
await t('동의서 확인 문자 시각을 스스로 바꾸지 못한다', assertFails(updateDoc(doc(parent, 'students/s1'), { consent: { ...consent, smsSentAt: 5 } })));
await t('아이 이름 등 다른 정보는 못 고친다', assertFails(updateDoc(doc(parent, 'students/s1'), { name: '바꿈' })));
await t('사진을 새로 올리지는 못한다', assertFails(updateDoc(doc(parent, 'students/s1'), { photo: 'data:new' })));
await t('다른 아이 동의서는 못 낸다', assertFails(updateDoc(doc(parent, 'students/s2'), { consent })));
const app = { eventId: 'e1', studentId: 's1', status: '접수', by: 'parent', paymentId: null, seen: false };
await t('자기 아이 참가신청서를 낸다', assertSucceeds(setDoc(doc(parent, 'applications/a1'), app)));
await t('다른 아이 이름으로는 못 낸다', assertFails(setDoc(doc(parent, 'applications/a9'), { ...app, studentId: 's2' })));
await t('참가비 납부 표시는 스스로 못 한다', assertFails(setDoc(doc(parent, 'applications/a8'), { ...app, paymentId: 'p1' })));
await t('신청을 취소한다', assertSucceeds(updateDoc(doc(parent, 'applications/a1'), { status: '취소', seen: false })));
await t('참가 확정은 스스로 못 한다', assertFails(updateDoc(doc(parent, 'applications/a1'), { status: '확정' })));
await t('알림장 읽음 표시를 남긴다', assertSucceeds(setDoc(doc(parent, 'nreads/nAll_s1'), { nid: 'nAll', sid: 's1', at: 1 })));
await t('다른 아이 이름으로 읽음 표시 못 한다', assertFails(setDoc(doc(parent, 'nreads/nAll_s2'), { nid: 'nAll', sid: 's2', at: 1 })));
await t('답글을 남긴다', assertSucceeds(setDoc(doc(parent, 'nreplies/r1'), { nid: 'nAll', sid: 's1', body: '확인했습니다', at: 1, seen: false })));
await t('관리자 확인 표시는 못 한다', assertFails(setDoc(doc(parent, 'nreplies/r2'), { nid: 'nAll', sid: 's1', body: 'x', at: 1, seen: true })));
await t('알림장을 쓰지 못한다', assertFails(setDoc(doc(parent, 'notices/n9'), { title: 'x', target: { type: 'all' } })));
await t('회비 기록을 못 고친다', assertFails(updateDoc(doc(parent, 'payments/p1'), { amount: 0 })));
await t('출석을 못 넣는다', assertFails(setDoc(doc(parent, 'att/s1_2026-11'), { sid: 's1', ym: '2026-11', days: {} })));
await t('자기 기기 연결을 끊는다', assertSucceeds(getDoc(doc(parent, 'parents/parentUid'))));

await testEnv.cleanup();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
