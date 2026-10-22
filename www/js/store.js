/* 데이터 저장소
   1단계: 이 기기 안에만 저장합니다 (IndexedDB → 안 되면 localStorage → 안 되면 메모리).
   2단계: 서버(Firebase 등)로 옮길 때 이 파일의 load/persist 부분만 바꾸면 화면 코드는 그대로 씁니다. */
(function () {
  'use strict';

  var DATA_KEY = 'tkd-data-v1';
  var DEVICE_KEY = 'tkd-device-v1';
  var LEGACY_KEY = 'taekwondoStudentsV2'; // 기존 '승급심사 결과증' 페이지의 저장 키

  var GRADES = ['9급', '8급', '7급', '6급', '5급', '4급', '3급', '2급', '1급', '1품', '2품', '3품', '4품', '1단', '2단', '3단', '4단'];
  var BELT_BY_GRADE = {
    '9급': '흰띠', '8급': '노란띠', '7급': '초록띠', '6급': '파랑띠', '5급': '보라띠',
    '4급': '밤띠', '3급': '주황띠', '2급': '빨강띠', '1급': '빨강띠',
    '1품': '품띠', '2품': '검정띠', '3품': '검정띠', '4품': '검정띠',
    '1단': '검정띠', '2단': '검정띠', '3단': '검정띠', '4단': '검정띠'
  };
  var BELT_COLOR = {
    '흰띠': '#f4f1ea', '노란띠': '#e3b23c', '초록띠': '#3c8c4a', '파랑띠': '#3763a8',
    '보라띠': '#6d4d96', '밤띠': '#6b4226', '주황띠': '#d9722a', '빨강띠': '#b23a3a',
    '품띠': 'linear-gradient(135deg, #b23a3a 50%, #1c1c1c 50%)', '검정띠': '#1c1c1c'
  };
  // 승급심사 채점표 (기존 결과증 페이지와 동일)
  var EXAM_ITEMS = ['효도', '성실', '인성(감사노트)', '인성(리더십)', '체력(스쿼트)', '체력(점핑잭)', '기술(품새)', '기술(겨루기)', '기술(발차기)', '기술(격파)'];
  var HEX_LABELS = ['출석', '감사노트', '체력', '발차기', '겨루기', '품새'];
  var GRADE_BANDS = [
    { min: 95, label: 'A+' }, { min: 90, label: 'A' }, { min: 85, label: 'B+' }, { min: 80, label: 'B' },
    { min: 75, label: 'C+' }, { min: 70, label: 'C' }, { min: 65, label: 'D+' }, { min: 60, label: 'D' }, { min: 55, label: 'F' }
  ];
  var PASS_SCORE = 70;

  function defaultSettings() {
    return {
      dojangName: '우리 태권도장',
      adminPin: '123456',
      autoLockMin: 10,
      monthlyFee: 150000,
      account: '',
      kioskSound: true,
      // 개인정보 처리방침에 들어가는 보호책임자 정보. cloud는 2단계 서버 연결 후 true
      privacy: { officer: '', phone: '', email: '', since: '', cloud: false },
      classes: ['1부 14:00', '2부 15:00', '3부 16:00', '4부 17:00', '5부 18:00'],
      fitnessItems: [
        { key: 'jump', label: '제자리멀리뛰기', short: '멀리뛰기', unit: 'cm', better: 'high' },
        { key: 'situp', label: '윗몸일으키기 1분', short: '윗몸', unit: '회', better: 'high' },
        { key: 'rope', label: '줄넘기 1분', short: '줄넘기', unit: '회', better: 'high' },
        { key: 'flex', label: '앉아윗몸앞으로굽히기', short: '유연성', unit: 'cm', better: 'high' },
        { key: 'shuttle', label: '10m 왕복달리기', short: '민첩성', unit: '초', better: 'low' },
        { key: 'squat', label: '스쿼트 1분', short: '스쿼트', unit: '회', better: 'high' }
      ]
    };
  }
  function blank() {
    return {
      version: 1, demo: false, createdAt: Date.now(),
      settings: defaultSettings(),
      students: [], attendance: {}, payments: [], fitness: [],
      notices: [], events: [], applications: [], exams: [],
      parents: [], invites: [], fitnessStats: null
    };
  }

  var state = blank();
  var device = { session: null };
  var backend = 'memory';
  var idb = null;

  // ---------- 저장 ----------
  function openIDB() {
    return new Promise(function (resolve) {
      try {
        if (!window.indexedDB) { resolve(null); return; }
        var req = indexedDB.open('tkd', 1);
        req.onupgradeneeded = function () { req.result.createObjectStore('kv'); };
        req.onsuccess = function () { resolve(req.result); };
        req.onerror = function () { resolve(null); };
        req.onblocked = function () { resolve(null); };
      } catch (e) { resolve(null); }
    });
  }
  function idbGet(key) {
    return new Promise(function (resolve) {
      try {
        var r = idb.transaction('kv', 'readonly').objectStore('kv').get(key);
        r.onsuccess = function () { resolve(r.result || null); };
        r.onerror = function () { resolve(null); };
      } catch (e) { resolve(null); }
    });
  }
  function idbPut(key, val) {
    return new Promise(function (resolve) {
      try {
        var tx = idb.transaction('kv', 'readwrite');
        tx.objectStore('kv').put(val, key);
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { resolve(false); };
        tx.onabort = function () { resolve(false); };
      } catch (e) { resolve(false); }
    });
  }
  function lsGet(key) {
    try { var raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch (e) { return false; }
  }

  function persist() {
    if (backend === 'idb') return idbPut(DATA_KEY, state);
    if (backend === 'local') return Promise.resolve(lsSet(DATA_KEY, state));
    return Promise.resolve(true);
  }
  var saving = false, dirty = false, warned = false;
  function cloudOn() { return !!(window.Cloud && Cloud.enabled); }
  function save() {
    if (cloudOn()) { Cloud.schedule(); return; }
    dirty = true;
    if (!saving) flush();
  }
  function flush() {
    if (!dirty) return;
    dirty = false; saving = true;
    persist().then(function (ok) {
      saving = false;
      if (!ok && !warned && window.UI) {
        warned = true;
        UI.toast('저장 공간이 부족해 저장하지 못했어요. 설정에서 백업 후 사진을 줄여 주세요.');
      }
      if (dirty) flush();
    });
  }

  function loadDevice() {
    var d = lsGet(DEVICE_KEY);
    if (d && typeof d === 'object') device = d;
    if (!device.session) device.session = null;
  }
  function saveDevice() { lsSet(DEVICE_KEY, device); }

  // 예전 버전 데이터에 없는 항목을 채워 넣습니다
  function upgrade(d) {
    var b = blank();
    Object.keys(b).forEach(function (k) { if (d[k] == null) d[k] = b[k]; });
    var s = d.settings;
    Object.keys(b.settings).forEach(function (k) { if (s[k] == null) s[k] = b.settings[k]; });
    Object.keys(b.settings.privacy).forEach(function (k) { if (s.privacy[k] == null) s.privacy[k] = b.settings.privacy[k]; });
    // 퇴원일이 없던 예전 기록은 오늘을 퇴원일로 봅니다 (보관 기간을 넉넉하게 잡기 위해)
    d.students.forEach(function (st) { if (st.status === 'left' && !st.leftAt) st.leftAt = U.today(); });
    return d;
  }

  // 기존 '승급심사 결과증' 데이터를 가져옵니다 (같은 주소에서 열었을 때만 보입니다)
  function yymmdd(code) {
    if (!code || code.length < 6) return '';
    var yy = +code.slice(0, 2), cur = new Date().getFullYear() % 100;
    return (yy > cur ? 1900 : 2000) + yy + '-' + code.slice(2, 4) + '-' + code.slice(4, 6);
  }
  function importLegacy(st, arr) {
    var today = U.today();
    arr.forEach(function (o) {
      if (!o || !o.name) return;
      var sid = U.uid();
      var guardians = [];
      if (o.parent1) guardians.push({ name: o.parent1, relation: '보호자', phone: '' });
      if (o.parent2) guardians.push({ name: o.parent2, relation: '보호자', phone: '' });
      st.students.push({
        id: sid, name: o.name, gender: '', birth: yymmdd(o.birth), school: '',
        grade: o.grade || '9급', className: st.settings.classes[0], pin: newPin(st),
        guardians: guardians, joinDate: '', status: 'active', fee: null, memo: '',
        photo: o.photo || null, createdAt: Date.now()
      });
      var items = {};
      EXAM_ITEMS.forEach(function (k) { items[k] = (o.items && +o.items[k]) || 0; });
      st.exams.push({
        id: U.uid(), studentId: sid, examDate: o.examDate || today, gradeAt: o.grade || '9급',
        items: items, scored: !!o.scored, comment: o.comment || '', promoted: false
      });
    });
  }

  // ---------- 출석번호 ----------
  function trivialPin(p) {
    if (/^(\d)\1{3}$/.test(p)) return true;
    var asc = '0123456789012', desc = '9876543210987';
    return asc.indexOf(p) >= 0 || desc.indexOf(p) >= 0;
  }
  function pinTakenIn(st, pin, exceptId) {
    return st.students.some(function (s) { return s.pin === pin && s.id !== exceptId && s.status !== 'left'; });
  }
  function newPin(st) {
    for (var i = 0; i < 500; i++) {
      var p = String(Math.floor(Math.random() * 10000));
      while (p.length < 4) p = '0' + p;
      if (!trivialPin(p) && !pinTakenIn(st, p)) return p;
    }
    return '';
  }

  // ---------- 공개 API ----------
  var DB = {
    GRADES: GRADES, BELT_BY_GRADE: BELT_BY_GRADE, BELT_COLOR: BELT_COLOR,
    EXAM_ITEMS: EXAM_ITEMS, HEX_LABELS: HEX_LABELS, PASS_SCORE: PASS_SCORE,
    PAY_METHODS: ['계좌이체', '카드', '현금', '면제'],
    PAY_CATEGORIES: ['월회비', '심사비', '대회비', '행사비', '용품', '기타'],
    EVENT_KINDS: ['대회', '승급심사', '캠프', '행사', '기타'],
    STATUS_LABEL: { active: '재원', paused: '휴원', left: '퇴원' },
    get state() { return state; },
    get device() { return device; },
    get backend() { return cloudOn() ? 'cloud' : backend; }
  };

  DB.blankState = blank;
  DB.upgradeState = upgrade;
  DB.localSnapshot = null;
  // 서버 모드에서 화면에 보이는 자료를 통째로 바꿀 때 (로그인·로그아웃·처음 설정)
  DB._replaceState = function (st) { state = st || blank(); };

  DB.init = function () {
    loadDevice();
    if (cloudOn()) {
      // 서버 모드: 이 기기에 남아 있던 1단계 자료는 '처음 설정'에서 올릴 수 있게 읽어만 둡니다
      return openIDB().then(function (db) {
        idb = db;
        return db ? idbGet(DATA_KEY) : null;
      }).then(function (data) {
        data = data || lsGet(DATA_KEY);
        DB.localSnapshot = data && data.version ? upgrade(data) : null;
        if (!DB.localSnapshot) {
          // 예전 '승급심사 결과증' 페이지를 이 주소에서 썼다면 그 자료도 처음 설정에서 올릴 수 있게 합니다
          var legacy = lsGet(LEGACY_KEY);
          if (Array.isArray(legacy) && legacy.length) {
            var st = blank();
            importLegacy(st, legacy);
            DB.localSnapshot = st;
          }
        }
        state = blank();
        return Cloud.init();
      }).catch(function (e) {
        console.error(e);
        Cloud.role = 'offline';
        Cloud.initError = e;
      });
    }
    return openIDB().then(function (db) {
      idb = db;
      if (db) { backend = 'idb'; return idbGet(DATA_KEY); }
      try { localStorage.setItem('tkd-probe', '1'); localStorage.removeItem('tkd-probe'); backend = 'local'; } catch (e) { backend = 'memory'; }
      return null;
    }).then(function (data) {
      if (!data) data = lsGet(DATA_KEY);
      if (data && data.version) {
        state = upgrade(data);
      } else {
        state = blank();
        var legacy = lsGet(LEGACY_KEY);
        if (Array.isArray(legacy) && legacy.length) {
          importLegacy(state, legacy);
        } else if (window.Seed) {
          Seed.fill(state);
          state.demo = true;
        }
        save();
      }
      try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
    });
  };
  DB.save = save;
  DB.saveDevice = saveDevice;

  DB.settings = function () { return state.settings; };
  DB.byId = function (coll, id) {
    var arr = state[coll];
    for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i];
    return null;
  };
  DB.upsert = function (coll, obj) {
    if (!obj.id) obj.id = U.uid();
    var arr = state[coll];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === obj.id) { arr[i] = obj; save(); return obj; }
    }
    arr.push(obj);
    save();
    return obj;
  };
  DB.remove = function (coll, id) {
    var arr = state[coll];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === id) { var r = arr.splice(i, 1)[0]; save(); return r; }
    }
    return null;
  };

  // ---- 급수·띠 ----
  DB.beltOf = function (grade) { return BELT_BY_GRADE[grade] || ''; };
  DB.beltColor = function (grade) { return BELT_COLOR[BELT_BY_GRADE[grade]] || 'var(--line)'; };
  DB.nextGrade = function (grade, age) {
    var i = GRADES.indexOf(grade);
    if (i < 0) return grade;
    if (grade === '1급') return age != null && age >= 15 ? '1단' : '1품';
    if (grade === '4품' || grade === '4단') return grade;
    return GRADES[i + 1];
  };

  // ---- 원생 ----
  DB.classIndex = function (c) { var i = state.settings.classes.indexOf(c); return i < 0 ? 99 : i; };
  DB.sortStudents = function (list) {
    return list.slice().sort(function (a, b) {
      return DB.classIndex(a.className) - DB.classIndex(b.className) || U.byName(a, b);
    });
  };
  DB.students = function (status) {
    return state.students.filter(function (s) { return !status || s.status === status; });
  };
  DB.active = function () { return DB.students('active'); };
  DB.student = function (id) { return DB.byId('students', id); };
  DB.pinTaken = function (pin, exceptId) { return pinTakenIn(state, pin, exceptId); };
  DB.newPin = function () { return newPin(state); };
  DB.trivialPin = trivialPin;
  DB.findByPin = function (pin) {
    for (var i = 0; i < state.students.length; i++) {
      var s = state.students[i];
      if (s.pin === pin && s.status !== 'left') return s;
    }
    return null;
  };
  DB.feeOf = function (s) { return s && s.fee != null && s.fee !== '' ? +s.fee : +state.settings.monthlyFee; };
  DB.removeStudent = function (id) {
    state.students = state.students.filter(function (s) { return s.id !== id; });
    Object.keys(state.attendance).forEach(function (d) { delete state.attendance[d][id]; });
    state.payments = state.payments.filter(function (p) { return p.studentId !== id; });
    state.fitness = state.fitness.filter(function (f) { return f.studentId !== id; });
    state.applications = state.applications.filter(function (a) { return a.studentId !== id; });
    state.exams = state.exams.filter(function (e) { return e.studentId !== id; });
    state.notices.forEach(function (n) {
      if (n.target && n.target.studentIds) n.target.studentIds = n.target.studentIds.filter(function (x) { return x !== id; });
      n.replies = (n.replies || []).filter(function (r) { return r.studentId !== id; });
    });
    save();
  };
  DB.studentsByPhone = function (phone) {
    var d = U.digits(phone);
    if (d.length < 9) return [];
    return state.students.filter(function (s) {
      return s.status !== 'left' && (s.guardians || []).some(function (g) { return U.digits(g.phone) === d; });
    });
  };

  // ---- 출석 ----
  DB.day = function (date) { return state.attendance[date] || {}; };
  DB.checkIn = function (sid, date, time, by) {
    date = date || U.today();
    var day = state.attendance[date] || (state.attendance[date] = {});
    if (day[sid]) return { already: true, rec: day[sid] };
    day[sid] = { t: time != null ? time : U.hm(), by: by || 'kiosk' };
    save();
    return { already: false, rec: day[sid] };
  };
  DB.setCheck = function (sid, date, rec) {
    var day = state.attendance[date] || (state.attendance[date] = {});
    day[sid] = rec;
    save();
  };
  DB.uncheck = function (sid, date) {
    var day = state.attendance[date];
    if (!day || !day[sid]) return null;
    var r = day[sid];
    delete day[sid];
    if (!Object.keys(day).length) delete state.attendance[date];
    save();
    return r;
  };
  DB.countAtt = function (sid, from, to) {
    var n = 0;
    for (var d in state.attendance) if (d >= from && d <= to && state.attendance[d][sid]) n++;
    return n;
  };
  DB.monthCounts = function (ym) {
    var m = {};
    for (var d in state.attendance) {
      if (d.slice(0, 7) !== ym) continue;
      for (var sid in state.attendance[d]) m[sid] = (m[sid] || 0) + 1;
    }
    return m;
  };
  DB.lastAttMap = function () {
    var m = {};
    for (var d in state.attendance) {
      for (var sid in state.attendance[d]) if (!m[sid] || m[sid] < d) m[sid] = d;
    }
    return m;
  };

  // ---- 회비 ----
  DB.isMonthly = function (p) { return p.category === '월회비'; };
  DB.feeMap = function (ym) {
    var m = {};
    state.payments.forEach(function (p) { if (p.category === '월회비' && p.month === ym && p.studentId) m[p.studentId] = p; });
    return m;
  };
  // 장부를 쓰기 시작한 달. 그 전 달은 납부 기록이 없어도 미납으로 치지 않습니다.
  DB.ledgerStart = function () { return state.ledgerStart || U.ym(new Date(state.createdAt || Date.now())); };
  // 해당 달 회비를 내야 하는 원생: 재원 중이고 그 달 이전에 입관한 원생 + 이미 낸 기록이 있는 원생
  DB.billed = function (ym) {
    var paid = DB.feeMap(ym), end = U.monthEnd(ym), before = ym < DB.ledgerStart();
    return state.students.filter(function (s) {
      if (paid[s.id]) return true;
      return !before && s.status === 'active' && (!s.joinDate || s.joinDate <= end);
    });
  };
  DB.otherIncome = function (ym) {
    return state.payments.filter(function (p) { return p.category !== '월회비' && (p.paidAt || '').slice(0, 7) === ym; });
  };

  // ---- 체력측정 ----
  DB.fitnessOf = function (sid) {
    return state.fitness.filter(function (f) { return f.studentId === sid; })
      .sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
  };
  DB.fitnessAt = function (sid, date) {
    for (var i = 0; i < state.fitness.length; i++) {
      var f = state.fitness[i];
      if (f.studentId === sid && f.date === date) return f;
    }
    return null;
  };
  DB.fitnessDates = function () {
    var seen = {};
    state.fitness.forEach(function (f) { seen[f.date] = (seen[f.date] || 0) + 1; });
    return Object.keys(seen).sort().reverse().map(function (d) { return { date: d, count: seen[d] }; });
  };

  // ---- 알림장 ----
  DB.noticeVisible = function (n, s) {
    var t = n.target || { type: 'all' };
    if (t.type === 'all') return true;
    if (t.type === 'class') return (t.classes || []).indexOf(s.className) >= 0;
    return (t.studentIds || []).indexOf(s.id) >= 0;
  };
  DB.noticeAudience = function (n) {
    return state.students.filter(function (s) { return s.status === 'active' && DB.noticeVisible(n, s); });
  };
  DB.noticesFor = function (s) {
    return DB.sortNotices(state.notices.filter(function (n) { return DB.noticeVisible(n, s); }));
  };
  DB.sortNotices = function (list) {
    return list.slice().sort(function (a, b) {
      return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.createdAt - a.createdAt;
    });
  };
  DB.unreadFor = function (s) {
    return DB.noticesFor(s).filter(function (n) { return !(n.reads && n.reads[s.id]); }).length;
  };
  DB.unseenReplies = function () {
    var c = 0;
    state.notices.forEach(function (n) { (n.replies || []).forEach(function (r) { if (!r.seen) c++; }); });
    return c;
  };

  // ---- 참가신청 ----
  DB.eventVisible = function (e, s) {
    if (!e.target || e.target.type !== 'class') return true;
    return (e.target.classes || []).indexOf(s.className) >= 0;
  };
  DB.eventAudience = function (e) {
    return state.students.filter(function (s) { return s.status === 'active' && DB.eventVisible(e, s); });
  };
  DB.eventOpen = function (e) { return !e.closed && (!e.deadline || e.deadline >= U.today()); };
  DB.appsOf = function (eventId) {
    return state.applications.filter(function (a) { return a.eventId === eventId; });
  };
  DB.appOf = function (eventId, sid) {
    for (var i = 0; i < state.applications.length; i++) {
      var a = state.applications[i];
      if (a.eventId === eventId && a.studentId === sid && a.status !== '취소') return a;
    }
    return null;
  };
  DB.unseenApps = function () {
    return state.applications.filter(function (a) { return a.seen === false; }).length;
  };

  // ---- 승급심사 ----
  DB.examScore = function (x) {
    var t = 0;
    EXAM_ITEMS.forEach(function (k) { t += +(x.items && x.items[k]) || 0; });
    return Math.round(t * 100) / 100;
  };
  DB.examBand = function (score) {
    for (var i = 0; i < GRADE_BANDS.length; i++) if (score >= GRADE_BANDS[i].min) return GRADE_BANDS[i].label;
    return '';
  };
  DB.examPassed = function (x) { return x.scored && DB.examScore(x) >= PASS_SCORE; };
  DB.examHex = function (x) {
    var it = x.items || {};
    return {
      '출석': +it['성실'] || 0,
      '감사노트': +it['인성(감사노트)'] || 0,
      '체력': Math.round(((+it['체력(스쿼트)'] || 0) + (+it['체력(점핑잭)'] || 0)) / 2 * 100) / 100,
      '발차기': +it['기술(발차기)'] || 0,
      '겨루기': +it['기술(겨루기)'] || 0,
      '품새': +it['기술(품새)'] || 0
    };
  };
  DB.examsOf = function (sid) {
    return state.exams.filter(function (x) { return x.studentId === sid; })
      .sort(function (a, b) { return a.examDate < b.examDate ? 1 : -1; });
  };
  DB.examDates = function () {
    var seen = {};
    state.exams.forEach(function (x) { seen[x.examDate] = (seen[x.examDate] || 0) + 1; });
    return Object.keys(seen).sort().reverse();
  };
  DB.zeroItems = function () { var o = {}; EXAM_ITEMS.forEach(function (k) { o[k] = 0; }); return o; };

  // ---- 보호자 동의 (consent.js) ----
  DB.hasConsent = function (s) { return !!(s && s.consent && s.consent.required); };
  DB.photoAllowed = function (s) { return DB.hasConsent(s) && !!s.consent.photo; };
  DB.consentPending = function () {
    return state.students.filter(function (s) { return s.status !== 'left' && !s.purged && !DB.hasConsent(s); });
  };
  DB.smsPending = function () {
    return state.students.filter(function (s) { return s.status !== 'left' && DB.hasConsent(s) && s.consent.by === 'app' && !s.consent.smsSentAt; });
  };
  DB.healthWithdrawn = function () {
    return state.students.filter(function (s) { return s.consent && s.consent.healthWithdrawnAt && !s.consent.healthAck; });
  };

  // ---- 개인정보 보관 기간 (퇴원 후 1년, 행사 종료 후 1년) ----
  DB.purgeCutoff = function () { var d = new Date(); d.setFullYear(d.getFullYear() - 1); return U.ymd(d); };
  DB.purgeDue = function () {
    var cut = DB.purgeCutoff();
    return state.students.filter(function (s) { return s.status === 'left' && !s.purged && s.leftAt && s.leftAt <= cut; });
  };
  DB.oldApps = function () {
    var cut = DB.purgeCutoff();
    return state.applications.filter(function (a) {
      if (a.purged) return false;
      var ev = DB.byId('events', a.eventId);
      return ev && ev.date <= cut;
    });
  };
  // 이름·연락처 등은 지우고, 회비 금액 기록만 장부용으로 남깁니다
  DB.purgeStudent = function (id) {
    var s = DB.student(id);
    if (!s) return;
    var anon = {
      id: s.id, name: '정리된 퇴원생', gender: '', birth: '', school: '', grade: s.grade, className: s.className,
      pin: '', guardians: [], joinDate: s.joinDate, status: 'left', leftAt: s.leftAt, fee: s.fee, memo: '', photo: null,
      createdAt: s.createdAt, purged: true, purgedAt: U.today()
    };
    state.students = state.students.map(function (x) { return x.id === id ? anon : x; });
    Object.keys(state.attendance).forEach(function (d) {
      delete state.attendance[d][id];
      if (!Object.keys(state.attendance[d]).length) delete state.attendance[d];
    });
    state.fitness = state.fitness.filter(function (f) { return f.studentId !== id; });
    state.exams = state.exams.filter(function (x) { return x.studentId !== id; });
    state.applications = state.applications.filter(function (a) { return a.studentId !== id; });
    state.notices.forEach(function (n) {
      if (n.target && n.target.studentIds) n.target.studentIds = n.target.studentIds.filter(function (x) { return x !== id; });
      if (n.reads) delete n.reads[id];
      n.replies = (n.replies || []).filter(function (r) { return r.studentId !== id; });
    });
    state.payments.forEach(function (p) { if (p.studentId === id) { p.memo = ''; p.ref = null; } });
    save();
  };
  DB.purgeApps = function (apps) {
    apps.forEach(function (a) {
      a.signature = null; a.memo = ''; a.answer = ''; a.guardianName = ''; a.purged = true;
    });
    save();
  };

  // ---- 백업·초기화 ----
  DB.exportJSON = function () { return JSON.stringify(state); };
  DB.importJSON = function (text) {
    var d = JSON.parse(text);
    if (!d || !d.version || !Array.isArray(d.students)) throw new Error('백업 파일 형식이 아닙니다');
    var emails = state.settings.adminEmails;
    state = upgrade(d);
    if (cloudOn()) { state.settings.adminEmails = emails; state.parents = []; state.invites = []; }
    save();
  };
  DB.reset = function (withDemo) {
    var keep = state.settings, parents = state.parents, invites = state.invites;
    state = blank();
    if (withDemo && window.Seed) { Seed.fill(state); state.demo = true; }
    else { state.settings = keep; }
    // 서버 모드에서는 관리자 이메일·비밀번호와 학부모 기기 연결을 그대로 둡니다
    if (cloudOn()) {
      state.settings.adminEmails = keep.adminEmails;
      state.settings.adminPin = keep.adminPin;
      state.parents = withDemo ? [] : parents;
      state.invites = withDemo ? [] : invites;
    }
    save();
  };
  DB.clearDemoFlag = function () { state.demo = false; save(); };
  DB.estimateSize = function () {
    try { return new Blob([JSON.stringify(state)]).size; } catch (e) { return 0; }
  };

  window.DB = DB;
})();
