/* 2단계 서버 연결 (Firebase: Firestore 서울 리전 + 로그인)
   화면 코드는 지금처럼 DB.state를 읽고 고친 뒤 DB.save()만 부릅니다.
   이 파일이 바뀐 부분만 골라 서버에 올리고(diff), 다른 기기에서 바뀐 내용을 실시간으로 받아 DB.state에 반영합니다.
   www/firebase-config.js 가 비어 있으면 이 파일은 아무것도 하지 않습니다(1단계처럼 기기에만 저장). */
(function () {
  'use strict';
  var esc = U.esc;
  var SDK = ['vendor/firebase/firebase-app-compat.js', 'vendor/firebase/firebase-auth-compat.js', 'vendor/firebase/firebase-firestore-compat.js'];
  var SIMPLE = ['students', 'payments', 'fitness', 'exams', 'events', 'applications', 'parents', 'invites'];
  var CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  var Cloud = window.Cloud = {
    enabled: !!window.FIREBASE_CONFIG,
    role: null,          // 'none' | 'unverified' | 'not-admin' | 'no-db' | 'admin' | 'parent' | 'offline'
    user: null,
    parentDoc: null,
    hasData: false,
    started: false,
    online: navigator.onLine !== false,
    pending: 0
  };
  var fb, auth, db, FV;
  var unsubs = [];
  var raw = {}, synced = {};
  var ready = false, dirty = false, flushTimer = null, changeTimer = null, listenRole = null;
  var lastStats = '';

  function S() { return DB.state; }
  function resetCache() {
    raw = { notices: {}, nview: {}, nreads: {}, nreplies: {}, att: {}, config: {} };
    synced = { notices: {}, nview: {}, nreads: {}, nreplies: {}, att: {}, config: {} };
    SIMPLE.forEach(function (c) { raw[c] = {}; synced[c] = {}; });
  }
  resetCache();

  // ---------- 공통 도우미 ----------
  function stable(v) {
    if (v === null || typeof v !== 'object') return JSON.stringify(v === undefined ? null : v);
    if (Array.isArray(v)) return '[' + v.map(stable).join(',') + ']';
    return '{' + Object.keys(v).sort().filter(function (k) { return v[k] !== undefined; }).map(function (k) { return JSON.stringify(k) + ':' + stable(v[k]); }).join(',') + '}';
  }
  function clean(v) { return v === undefined ? null : JSON.parse(JSON.stringify(v)); }
  function strip(o, exclude) {
    var d = {};
    Object.keys(o).forEach(function (k) { if (k !== 'id' && (!exclude || exclude.indexOf(k) < 0) && o[k] !== undefined) d[k] = o[k]; });
    return clean(d);
  }
  function fieldsOf(d) { var f = {}; Object.keys(d).forEach(function (k) { f[k] = stable(d[k]); }); return f; }
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = function () { reject(new Error(src + '를 불러오지 못했어요')); };
      document.head.appendChild(s);
    });
  }
  function msgOf(e) {
    var c = (e && e.code) || '';
    var map = {
      'auth/invalid-credential': '이메일 또는 비밀번호가 맞지 않아요', 'auth/wrong-password': '이메일 또는 비밀번호가 맞지 않아요',
      'auth/user-not-found': '이메일 또는 비밀번호가 맞지 않아요', 'auth/invalid-email': '이메일 주소 형식이 맞지 않아요',
      'auth/email-already-in-use': '이미 가입된 이메일이에요. 로그인해 주세요', 'auth/weak-password': '비밀번호는 6자 이상으로 정해 주세요',
      'auth/too-many-requests': '시도가 너무 많아요. 잠시 뒤에 다시 해 주세요', 'auth/network-request-failed': '인터넷 연결을 확인해 주세요',
      'auth/operation-not-allowed': 'Firebase 콘솔에서 이 로그인 방식이 아직 켜져 있지 않아요',
      'auth/admin-restricted-operation': 'Firebase 콘솔에서 익명 로그인이 아직 켜져 있지 않아요',
      'permission-denied': '권한이 없어요', 'unavailable': '서버에 연결할 수 없어요. 인터넷 연결을 확인해 주세요'
    };
    if (/api-key-not-valid/.test(c)) return '서버 설정값(API 키)이 맞지 않아요. 설정에서 서버 연결을 다시 해 주세요';
    return map[c] || (e && e.message) || '알 수 없는 오류가 났어요';
  }

  // ---------- 시작 ----------
  Cloud.init = function () {
    if (!Cloud.enabled) return Promise.resolve(false);
    return SDK.reduce(function (p, src) { return p.then(function () { return loadScript(src); }); }, Promise.resolve()).then(function () {
      fb = window.firebase;
      fb.initializeApp(window.FIREBASE_CONFIG);
      auth = fb.auth();
      db = fb.firestore();
      FV = fb.firestore.FieldValue;
      if (window.FIREBASE_EMULATOR) {
        auth.useEmulator('http://127.0.0.1:9099', { disableWarnings: true });
        db.useEmulator('127.0.0.1', 8080);
      }
      // 인터넷이 끊겨도 쓰고 읽을 수 있게 기기에 사본을 둡니다
      return db.enablePersistence({ synchronizeTabs: true }).catch(function () {});
    }).then(function () {
      return new Promise(function (resolve) {
        var off = auth.onAuthStateChanged(function (u) { off(); Cloud.user = u; resolve(); });
      });
    }).then(detectRole).then(function () { return true; });
  };

  // 로그인 직후에는 데이터베이스가 새 로그인 정보를 아직 못 받았을 수 있어, 권한 거절이면 잠깐 뒤 한 번 더 시도합니다
  function retryAuth(fn) {
    return fn().catch(function (e) {
      if (!e || e.code !== 'permission-denied' || !auth.currentUser) throw e;
      return auth.currentUser.getIdToken(true).then(function () {
        return new Promise(function (r) { setTimeout(r, 700); });
      }).then(fn);
    });
  }

  function detectRole() {
    var u = auth.currentUser;
    Cloud.user = u; Cloud.parentDoc = null;
    if (!u) { Cloud.role = 'none'; return Promise.resolve(Cloud.role); }
    if (u.isAnonymous) {
      return retryAuth(function () { return db.doc('parents/' + u.uid).get(); }).then(function (d) {
        Cloud.role = d.exists ? 'parent' : 'none';
        if (d.exists) Cloud.parentDoc = d.data();
        return remember();
      }, offlineFallback);
    }
    if (!u.emailVerified) { Cloud.role = 'unverified'; return Promise.resolve(Cloud.role); }
    return retryAuth(function () { return db.doc('config/admin').get(); }).then(function (d) {
      Cloud.role = 'admin';
      Cloud.hasData = d.exists;
      return remember();
    }, function (e) {
      if (e && e.code === 'permission-denied') { Cloud.role = 'not-admin'; return Cloud.role; }
      // Firebase 프로젝트에 Firestore 데이터베이스를 아직 만들지 않았을 때
      if (e && (e.code === 'not-found' || e.code === 'failed-precondition')) { Cloud.role = 'no-db'; return Cloud.role; }
      return offlineFallback(e);
    });
  }
  // 인터넷이 없을 때는 지난번에 확인한 역할로 계속 씁니다
  function remember() {
    DB.device.cloud = { role: Cloud.role, uid: Cloud.user && Cloud.user.uid, parentDoc: Cloud.parentDoc, hasData: Cloud.hasData };
    DB.saveDevice();
    return Cloud.role;
  }
  function offlineFallback() {
    var c = DB.device.cloud;
    if (c && Cloud.user && c.uid === Cloud.user.uid) {
      Cloud.role = c.role; Cloud.parentDoc = c.parentDoc; Cloud.hasData = c.hasData;
    } else Cloud.role = 'offline';
    return Cloud.role;
  }
  Cloud.parentSession = function () {
    var ids = (Cloud.parentDoc && Cloud.parentDoc.studentIds) || [];
    return { role: 'parent', ids: ids.slice(), cur: ids[0], phone: (Cloud.parentDoc && Cloud.parentDoc.phone) || '' };
  };
  Cloud.email = function () { return Cloud.user && Cloud.user.email; };

  // ---------- 서버 → 화면: 실시간 반영 ----------
  // 처음에는 기기 저장본이 먼저 올 수 있어서, 서버 자료가 올 때까지 기다립니다 (인터넷이 없으면 저장본으로 시작)
  function listen(ref, handler) {
    return new Promise(function (resolve) {
      var waiting = true;
      function done() { if (waiting) { waiting = false; clearTimeout(timer); resolve(); } }
      var timer = setTimeout(done, 8000);
      var lastSig = null;
      var un = ref.onSnapshot({ includeMetadataChanges: true }, function (snap) {
        var hadChanges;
        if (snap.docChanges) hadChanges = snap.docChanges().length > 0;
        else {
          // 문서 하나를 볼 때는 내용이 실제로 바뀐 경우만 반영합니다
          var sig = snap.exists ? stable(snap.data()) : '-';
          hadChanges = sig !== lastSig;
          lastSig = sig;
        }
        if (!hadChanges && !waiting) return;
        flushNow();
        if (hadChanges || waiting) handler(snap);
        if (waiting) { if (!snap.metadata.fromCache || !Cloud.online) done(); }
        else if (hadChanges) changed();
      }, function (err) {
        console.warn('listen', err);
        done();
      });
      unsubs.push(un);
    });
  }
  function eachChange(snap, fn) {
    if (snap.docChanges) snap.docChanges().forEach(function (ch) { fn(ch.type, ch.doc.id, ch.type === 'removed' ? null : ch.doc.data()); });
    else fn(snap.exists ? 'modified' : 'removed', snap.id, snap.exists ? snap.data() : null);
  }

  function applySimple(coll) {
    return function (snap) {
      eachChange(snap, function (type, id, data) {
        var arr = S()[coll] || (S()[coll] = []);
        var idx = -1;
        for (var i = 0; i < arr.length; i++) if (arr[i].id === id) { idx = i; break; }
        if (type === 'removed') {
          if (idx >= 0) arr.splice(idx, 1);
          delete raw[coll][id]; delete synced[coll][id];
          return;
        }
        raw[coll][id] = data;
        synced[coll][id] = fieldsOf(data);
        if (idx >= 0) {
          var o = arr[idx];
          Object.keys(o).forEach(function (k) { if (k !== 'id' && !(k in data)) delete o[k]; });
          Object.keys(data).forEach(function (k) { o[k] = data[k]; });
        } else {
          var n = clean(data); n.id = id; arr.push(n);
        }
      });
      if (coll === 'parents' && Cloud.role === 'parent') parentDocChanged();
    };
  }

  function applyRaw(coll, after) {
    return function (snap) {
      eachChange(snap, function (type, id, data) {
        if (type === 'removed') { delete raw[coll][id]; delete synced[coll][id]; }
        else { raw[coll][id] = data; synced[coll][id] = fieldsOf(data); }
      });
      after();
    };
  }

  function applyAtt(snap) {
    var att = S().attendance;
    eachChange(snap, function (type, id, data) {
      var cut = id.lastIndexOf('_'), sid = id.slice(0, cut), ym = id.slice(cut + 1);
      Object.keys(att).forEach(function (date) {
        if (date.slice(0, 7) === ym && att[date][sid]) { delete att[date][sid]; if (!Object.keys(att[date]).length) delete att[date]; }
      });
      if (type === 'removed') { delete raw.att[id]; delete synced.att[id]; return; }
      raw.att[id] = data;
      var f = {};
      Object.keys(data.days || {}).forEach(function (dd) {
        var date = ym + '-' + dd;
        (att[date] || (att[date] = {}))[sid] = data.days[dd];
        f[dd] = stable(data.days[dd]);
      });
      synced.att[id] = f;
    });
  }

  // 알림장 = 원본(전체·반별) + 개별 사본 + 읽음 + 답글을 합쳐서 DB.state.notices 로 만듭니다
  function rebuildNotices() {
    var byId = {};
    Object.keys(raw.notices).forEach(function (id) { var n = clean(raw.notices[id]); n.id = id; byId[id] = n; });
    if (Cloud.role === 'parent') {
      Object.keys(raw.nview).forEach(function (vid) {
        var v = raw.nview[vid];
        var n = byId[v.nid] || (byId[v.nid] = {
          id: v.nid, title: v.title, body: v.body, image: v.image || null, pinned: !!v.pinned,
          createdAt: v.createdAt, updatedAt: v.updatedAt || null, target: { type: 'students', studentIds: [] }
        });
        if (n.target.studentIds.indexOf(v.sid) < 0) n.target.studentIds.push(v.sid);
      });
    }
    Object.keys(byId).forEach(function (id) { byId[id].reads = {}; byId[id].replies = []; });
    Object.keys(raw.nreads).forEach(function (rid) { var r = raw.nreads[rid]; if (byId[r.nid]) byId[r.nid].reads[r.sid] = r.at; });
    Object.keys(raw.nreplies).forEach(function (rid) {
      var r = raw.nreplies[rid];
      if (byId[r.nid]) byId[r.nid].replies.push({ id: rid, studentId: r.sid, body: r.body, at: r.at, seen: !!r.seen });
    });
    var list = S().notices, keep = {};
    list.forEach(function (o) { keep[o.id] = o; });
    list.length = 0;
    Object.keys(byId).forEach(function (id) {
      var o = keep[id], n = byId[id];
      if (o) { Object.keys(o).forEach(function (k) { if (!(k in n)) delete o[k]; }); Object.keys(n).forEach(function (k) { o[k] = n[k]; }); list.push(o); }
      else list.push(n);
    });
  }

  function applyConfig(snap) {
    eachChange(snap, function (type, id, data) {
      if (type === 'removed') { delete raw.config[id]; delete synced.config[id]; return; }
      raw.config[id] = data;
      synced.config[id] = fieldsOf(data);
    });
    var st = S(), pub = raw.config.public, adm = raw.config.admin;
    if (pub) {
      var keepPin = st.settings.adminPin, keepEmails = st.settings.adminEmails;
      Object.keys(pub).forEach(function (k) { if (k.charAt(0) !== '_') st.settings[k] = clean(pub[k]); });
      st.settings.adminPin = keepPin; st.settings.adminEmails = keepEmails;
      st.ledgerStart = pub._ledgerStart || null;
      st.createdAt = pub._createdAt || st.createdAt;
      st.demo = !!pub._demo;
    }
    if (adm) { st.settings.adminPin = adm.adminPin || st.settings.adminPin; st.settings.adminEmails = adm.adminEmails || []; }
    if (raw.config.fitstats) { st.fitnessStats = clean(raw.config.fitstats); lastStats = stable(strip(raw.config.fitstats, ['updatedAt'])); }
  }

  function parentDocChanged() {
    var me = Cloud.user && raw.parents[Cloud.user.uid];
    if (!me) {
      // 도장에서 이 기기 연결을 끊었을 때
      stop();
      auth.signOut().then(function () {
        Cloud.role = 'none'; Cloud.parentDoc = null; remember();
        if (window.App) { App.setSession(null); UI.toast('도장에서 이 기기의 학부모 앱 연결을 끊었어요'); }
      });
      return;
    }
    var before = stable((Cloud.parentDoc || {}).studentIds || []);
    Cloud.parentDoc = me; remember();
    if (before !== stable(me.studentIds || [])) {
      Cloud.start().then(function () {
        if (window.App && App.session && App.session.role === 'parent') { App.session.ids = me.studentIds.slice(); App.refresh(); }
      });
    }
  }

  function changed() {
    clearTimeout(changeTimer);
    changeTimer = setTimeout(function () { if (window.App && App.softRefresh) App.softRefresh(); }, 250);
  }

  function stop() {
    unsubs.forEach(function (u) { try { u(); } catch (e) {} });
    unsubs = [];
    ready = false;
    Cloud.started = false;
  }

  // 역할에 맞는 자료만 받아옵니다 (학부모는 자기 아이 것만)
  Cloud.start = function () {
    stop();
    resetCache();
    DB._replaceState(null);
    listenRole = Cloud.role;
    var tasks = [];
    var col = function (c) { return db.collection(c); };
    if (Cloud.role === 'admin') {
      tasks.push(listen(col('config'), applyConfig));
      SIMPLE.forEach(function (c) { tasks.push(listen(col(c), applySimple(c))); });
      tasks.push(listen(col('att').where('ym', '>=', U.addMonths(U.ym(), -13)), applyAtt));
      tasks.push(listen(col('notices'), applyRaw('notices', rebuildNotices)));
      tasks.push(listen(col('nview'), applyRaw('nview', function () {})));
      tasks.push(listen(col('nreads').where('at', '>=', Date.now() - 400 * 86400000), applyRaw('nreads', rebuildNotices)));
      tasks.push(listen(col('nreplies'), applyRaw('nreplies', rebuildNotices)));
    } else if (Cloud.role === 'parent') {
      var ids = (Cloud.parentDoc && Cloud.parentDoc.studentIds) || [];
      tasks.push(listen(db.doc('config/public'), applyConfig));
      tasks.push(listen(db.doc('config/fitstats'), applyConfig));
      tasks.push(listen(db.doc('parents/' + Cloud.user.uid), applySimple('parents')));
      tasks.push(listen(col('events'), applySimple('events')));
      tasks.push(listen(col('notices').where('target.type', '==', 'all'), applyRaw('notices', rebuildNotices)));
      tasks.push(listen(col('notices').where('target.type', '==', 'class'), applyRaw('notices', rebuildNotices)));
      ids.forEach(function (sid) {
        tasks.push(listen(db.doc('students/' + sid), applySimple('students')));
        tasks.push(listen(col('att').where('sid', '==', sid), applyAtt));
        ['payments', 'fitness', 'exams', 'applications'].forEach(function (c) { tasks.push(listen(col(c).where('studentId', '==', sid), applySimple(c))); });
        tasks.push(listen(col('nview').where('sid', '==', sid), applyRaw('nview', rebuildNotices)));
        tasks.push(listen(col('nreads').where('sid', '==', sid), applyRaw('nreads', rebuildNotices)));
        tasks.push(listen(col('nreplies').where('sid', '==', sid), applyRaw('nreplies', rebuildNotices)));
      });
    } else {
      return Promise.resolve();
    }
    return Promise.all(tasks).then(function () {
      ready = true;
      Cloud.started = true;
      if (dirty) flushNow();
    });
  };

  // ---------- 화면 → 서버: 바뀐 부분만 올리기 ----------
  Cloud.schedule = function () {
    dirty = true;
    clearTimeout(flushTimer);
    flushTimer = setTimeout(flushNow, 250);
  };

  function diffMap(coll, want, ops, noDelete) {
    var s = synced[coll] || (synced[coll] = {});
    Object.keys(want).forEach(function (id) {
      var data = want[id], f = fieldsOf(data), prev = s[id];
      if (!prev) { ops.push(['set', coll + '/' + id, data]); s[id] = f; raw[coll] && (raw[coll][id] = data); return; }
      var upd = {}, n = 0;
      Object.keys(f).forEach(function (k) { if (prev[k] !== f[k]) { upd[k] = data[k]; n++; } });
      Object.keys(prev).forEach(function (k) { if (!(k in f)) { upd[k] = FV.delete(); n++; } });
      if (n) { ops.push(['update', coll + '/' + id, upd]); s[id] = f; raw[coll] && (raw[coll][id] = data); }
    });
    if (!noDelete) {
      Object.keys(s).forEach(function (id) {
        if (!(id in want)) { ops.push(['delete', coll + '/' + id]); delete s[id]; raw[coll] && delete raw[coll][id]; }
      });
    }
  }
  function arrayMap(arr, exclude) {
    var m = {};
    (arr || []).forEach(function (o) { if (o && o.id) m[o.id] = strip(o, exclude); });
    return m;
  }

  function diffAtt(ops) {
    var att = S().attendance, cur = {};
    Object.keys(att).forEach(function (date) {
      var ym = date.slice(0, 7), dd = date.slice(8);
      Object.keys(att[date]).forEach(function (sid) {
        var id = sid + '_' + ym;
        (cur[id] || (cur[id] = { sid: sid, ym: ym, days: {} })).days[dd] = clean(att[date][sid]);
      });
    });
    Object.keys(cur).forEach(function (id) {
      var prev = synced.att[id] || (synced.att[id] = {}), c = cur[id], add = {}, dels = {}, n = 0, m = 0;
      Object.keys(c.days).forEach(function (dd) { var j = stable(c.days[dd]); if (prev[dd] !== j) { add[dd] = c.days[dd]; prev[dd] = j; n++; } });
      Object.keys(prev).forEach(function (dd) { if (!(dd in c.days)) { dels['days.' + dd] = FV.delete(); delete prev[dd]; m++; } });
      if (n) ops.push(['merge', 'att/' + id, { sid: c.sid, ym: c.ym, days: add }]);
      if (m) ops.push(['update', 'att/' + id, dels]);
    });
    Object.keys(synced.att).forEach(function (id) {
      if (cur[id]) return;
      var prev = synced.att[id], dels = {}, m = 0;
      Object.keys(prev).forEach(function (dd) { dels['days.' + dd] = FV.delete(); m++; });
      if (m) ops.push(['update', 'att/' + id, dels]);
      synced.att[id] = {};
    });
  }

  function noticeMaps() {
    var notices = {}, views = {}, reads = {}, replies = {};
    S().notices.forEach(function (n) {
      notices[n.id] = strip(n, ['reads', 'replies']);
      if (n.target && n.target.type === 'students') {
        (n.target.studentIds || []).forEach(function (sid) {
          views[n.id + '_' + sid] = clean({ nid: n.id, sid: sid, title: n.title, body: n.body, image: n.image || null, pinned: !!n.pinned, createdAt: n.createdAt, updatedAt: n.updatedAt || null });
        });
      }
      Object.keys(n.reads || {}).forEach(function (sid) { reads[n.id + '_' + sid] = { nid: n.id, sid: sid, at: n.reads[sid] }; });
      (n.replies || []).forEach(function (r) { replies[r.id] = clean({ nid: n.id, sid: r.studentId, body: r.body, at: r.at, seen: !!r.seen }); });
    });
    return { notices: notices, views: views, reads: reads, replies: replies };
  }

  function configMaps() {
    var st = S(), pub = clean(st.settings), adm = { adminPin: pub.adminPin, adminEmails: pub.adminEmails || [] };
    delete pub.adminPin; delete pub.adminEmails;
    pub._ledgerStart = st.ledgerStart || null;
    pub._createdAt = st.createdAt || null;
    pub._demo = !!st.demo;
    var out = { public: pub, admin: adm };
    // 학부모 화면의 또래 비교용 통계 (이름 없이 나이별 기록만)
    if (Parts.fitnessStats) {
      var stats = Parts.fitnessStats();
      var key = stable(stats);
      if (key !== lastStats || !raw.config.fitstats) { stats.updatedAt = Date.now(); lastStats = key; out.fitstats = stats; }
      else out.fitstats = raw.config.fitstats;
    }
    return out;
  }

  function flushNow() {
    clearTimeout(flushTimer);
    if (!dirty || !db) return;
    if (!ready) return;            // 처음 자료를 다 받은 뒤에 올립니다
    dirty = false;
    var ops = [];
    if (Cloud.role === 'admin') {
      var cfg = configMaps();
      diffMap('config', cfg, ops, true);
      SIMPLE.forEach(function (c) { diffMap(c, arrayMap(S()[c]), ops); });
      diffAtt(ops);
      var nm = noticeMaps();
      diffMap('notices', nm.notices, ops);
      diffMap('nview', nm.views, ops);
      diffMap('nreads', nm.reads, ops);
      diffMap('nreplies', nm.replies, ops);
    } else if (Cloud.role === 'parent') {
      diffMap('students', arrayMap(S().students), ops, true);
      diffMap('applications', arrayMap(S().applications), ops, true);
      var pm = noticeMaps();
      diffMap('nreads', pm.reads, ops, true);
      diffMap('nreplies', pm.replies, ops, true);
    }
    run(ops);
  }
  Cloud.flushNow = flushNow;

  var warned = false;
  function run(ops) {
    if (!ops.length) return Promise.resolve();
    var jobs = [];
    function track(p) {
      Cloud.pending++; status();
      return p.then(function () { Cloud.pending--; status(); }, function (e) {
        Cloud.pending--; status();
        if (e && e.code === 'not-found') return;
        console.warn('write failed', e);
        if (!warned) { warned = true; UI.toast('서버에 저장하지 못한 내용이 있어요: ' + msgOf(e)); setTimeout(function () { warned = false; }, 8000); }
      });
    }
    function apply(target, op) {
      var ref = db.doc(op[1]);
      if (op[0] === 'set') target.set(ref, op[2]);
      else if (op[0] === 'merge') target.set(ref, op[2], { merge: true });
      else if (op[0] === 'update') target.update(ref, op[2]);
      else target.delete(ref);
    }
    if (Cloud.role === 'admin') {
      // 관리자는 묶어서 한 번에 (한 묶음 최대 450개)
      for (var i = 0; i < ops.length; i += 450) {
        var b = db.batch();
        ops.slice(i, i + 450).forEach(function (op) { apply(b, op); });
        jobs.push(track(b.commit()));
      }
    } else {
      ops.forEach(function (op) {
        var ref = db.doc(op[1]);
        var p = op[0] === 'set' ? ref.set(op[2]) : op[0] === 'merge' ? ref.set(op[2], { merge: true }) : op[0] === 'update' ? ref.update(op[2]) : ref.delete();
        jobs.push(track(p));
      });
    }
    return Promise.all(jobs);
  }

  // ---------- 연결 상태 ----------
  function status() { if (window.App && App.updateShell) App.updateShell(); }
  window.addEventListener('online', function () { Cloud.online = true; status(); });
  window.addEventListener('offline', function () { Cloud.online = false; status(); });
  Cloud.statusText = function () {
    if (!Cloud.enabled) return null;
    if (!Cloud.online) return { text: '오프라인 · 연결되면 자동 저장', tone: 'warn' };
    if (Cloud.pending > 0) return { text: '저장 중…', tone: 'info' };
    if (Cloud.started) return { text: '서버 연결됨', tone: 'good' };
    return { text: '서버 연결 전', tone: '' };
  };

  // ---------- 처음 설정: 자료 올리기 ----------
  Cloud.upload = function (st, onProgress) {
    stop();
    resetCache();
    st.settings.adminEmails = [Cloud.email()];
    DB._replaceState(st);
    Cloud.role = 'admin';
    ready = true;
    dirty = true;
    clearTimeout(flushTimer);
    dirty = false;
    var cfg = configMaps(), ops = [];
    diffMap('config', cfg, ops, true);
    SIMPLE.forEach(function (c) { diffMap(c, arrayMap(S()[c]), ops); });
    diffAtt(ops);
    var nm = noticeMaps();
    diffMap('notices', nm.notices, ops);
    diffMap('nview', nm.views, ops);
    diffMap('nreads', nm.reads, ops);
    diffMap('nreplies', nm.replies, ops);
    var total = ops.length, doneN = 0, chain = Promise.resolve();
    for (var i = 0; i < ops.length; i += 400) {
      (function (chunk) {
        chain = chain.then(function () {
          var b = db.batch();
          chunk.forEach(function (op) {
            var ref = db.doc(op[1]);
            if (op[0] === 'merge') b.set(ref, op[2], { merge: true }); else if (op[0] === 'set') b.set(ref, op[2]); else if (op[0] === 'update') b.update(ref, op[2]); else b.delete(ref);
          });
          return b.commit().then(function () { doneN += chunk.length; if (onProgress) onProgress(doneN, total); });
        });
      })(ops.slice(i, i + 400));
    }
    return chain.then(function () { Cloud.hasData = true; remember(); return Cloud.start(); });
  };

  // ---------- 초대 코드 ----------
  function newCode() {
    var a = new Uint8Array(8), s = '';
    crypto.getRandomValues(a);
    for (var i = 0; i < 8; i++) s += CODE_CHARS[a[i] % CODE_CHARS.length];
    return s;
  }
  Cloud.fmtCode = function (c) { return c.slice(0, 4) + '-' + c.slice(4); };
  Cloud.createInvite = function (studentIds, phone) {
    var code = newCode();
    S().invites.push({ id: code, studentIds: studentIds.slice(), phone: U.digits(phone), createdAt: Date.now(), expiresAt: Date.now() + 7 * 86400000, usedBy: null, usedAt: null });
    DB.save();
    return code;
  };
  Cloud.redeem = function (input) {
    var code = String(input || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (code.length !== 8) return Promise.reject(new Error('초대 코드 8자리를 입력해 주세요'));
    var u = auth.currentUser;
    var signIn = u && u.isAnonymous ? Promise.resolve(u) : auth.signInAnonymously().then(function (c) { return c.user; });
    return signIn.then(function (user) {
      return retryAuth(function () { return db.doc('invites/' + code).get({ source: 'server' }); }).then(function (d) {
        if (!d.exists) throw new Error('없는 코드');
        var inv = d.data();
        var b = db.batch();
        b.set(db.doc('parents/' + user.uid), { studentIds: inv.studentIds, phone: inv.phone || '', code: code, createdAt: Date.now() });
        b.update(db.doc('invites/' + code), { usedBy: user.uid, usedAt: Date.now() });
        return b.commit();
      });
    }).catch(function (e) {
      if (e && (e.code === 'permission-denied' || e.message === '없는 코드')) throw new Error('코드가 맞지 않거나, 이미 썼거나, 기한(7일)이 지났어요. 도장에 새 코드를 부탁해 주세요.');
      throw new Error(msgOf(e));
    }).then(detectRole).then(function () { return Cloud.start(); });
  };
  Cloud.unlinkSelf = function () {
    var u = auth.currentUser;
    stop();
    return db.doc('parents/' + u.uid).delete().catch(function () {}).then(function () { return auth.signOut(); }).then(function () {
      Cloud.role = 'none'; Cloud.parentDoc = null; DB._replaceState(null); remember();
    });
  };
  Cloud.signOut = function () {
    stop();
    return auth.signOut().then(function () {
      Cloud.role = 'none'; Cloud.hasData = false; DB._replaceState(null); remember();
    });
  };

  // ---------- 서버 연결 (도장마다 자기 Firebase) ----------
  Cloud.appUrl = function () { return window.APP_URL || (location.origin + location.pathname.replace(/index\.html$/, '')); };
  // 이 도장 서버로 여는 링크. 학부모 초대 코드를 붙이면 열자마자 코드가 채워져요
  Cloud.link = function (code) {
    var p = Server.param(window.FIREBASE_CONFIG), q = [];
    if (p) q.push('s=' + p);
    if (code) q.push('c=' + code);
    return Cloud.appUrl() + (q.length ? '?' + q.join('&') : '');
  };
  Cloud.projectId = function () { return (window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.projectId) || ''; };
  // 이 기기에서 서버 연결을 풀고(로그인·기기에 남은 사본까지 지움) 처음 화면으로.
  // next 를 주면 그 서버로 바꿔 연결해요(code 는 함께 받은 학부모 초대 코드)
  Cloud.disconnect = function (next, code) {
    stop();
    var u = auth && auth.currentUser;
    var leave = u && u.isAnonymous ? db.doc('parents/' + u.uid).delete().catch(function () {}) : Promise.resolve();
    return leave.then(function () { return u ? auth.signOut() : null; }).catch(function () {}).then(function () {
      return db ? db.terminate().then(function () { return db.clearPersistence(); }) : null;
    }).catch(function () {}).then(function () {
      DB.device.cloud = null; DB.device.session = null; DB.saveDevice();
      if (next) { Server.save(next); location.replace(Cloud.appUrl() + '?s=' + Server.param(next) + (code ? '&c=' + code : '')); }
      else { Server.forget(); location.replace(Cloud.appUrl()); }
    });
  };

  // 관장님: Firebase 설정값을 붙여 넣어 우리 도장 서버에 연결하기
  Cloud.connectModal = function () {
    UI.modal({
      title: '우리 도장 서버 연결', wide: true,
      html: '<p class="soft">관장님이 만든 Firebase 프로젝트의 설정값을 붙여 넣어 주세요. 프로젝트 만드는 방법은 <a href="manual.html#server" target="_blank" rel="noopener">사용설명서</a>에 있어요.</p>' +
        '<ol class="soft" style="margin:0;padding-left:20px;line-height:1.9"><li>Firebase 콘솔 → 톱니바퀴 → <b>프로젝트 설정</b> → <b>일반</b> 탭</li><li>아래쪽 <b>내 앱</b>의 웹 앱에서 <b>구성</b>을 고릅니다.</li><li><code>const firebaseConfig = { … };</code> 전체를 복사해서 아래에 붙여 넣습니다.</li></ol>' +
        '<textarea class="input mono" id="cfgText" style="min-height:170px;font-size:12px" placeholder="const firebaseConfig = {\n  apiKey: &quot;…&quot;,\n  projectId: &quot;…&quot;,\n  appId: &quot;…&quot;\n};" autofocus></textarea>' +
        '<p class="fine">도장에서 받은 연결 링크가 있으면 그 링크를 붙여 넣어도 돼요. 이 값은 비밀번호가 아니라 어느 서버를 쓰는지 알려 주는 주소예요.</p><p class="bad-t small" data-err></p>',
      actions: [{ label: '취소', kind: 'quiet' }, {
        label: '연결하기', kind: 'primary', onClick: function (root) {
          var c = Server.fromText(root.querySelector('#cfgText').value);
          if (!c) { root.querySelector('[data-err]').textContent = '설정값을 찾지 못했어요. apiKey, projectId, appId 가 들어 있는 firebaseConfig 전체를 붙여 넣어 주세요.'; return false; }
          Server.save(c);
          location.replace(Cloud.appUrl());
          return false;
        }
      }]
    });
  };

  // 관장님의 다른 기기·도장 태블릿을 같은 서버에 연결하는 링크
  Cloud.shareLinkModal = function () {
    var link = Cloud.link();
    UI.modal({
      title: '다른 기기 연결 링크',
      html: '<p class="soft">도장 태블릿이나 관장님의 다른 휴대폰·컴퓨터에서 이 링크를 열면 우리 도장 서버(<b class="mono">' + esc(Cloud.projectId()) + '</b>)에 연결돼요. 그다음 관리자 이메일로 로그인하세요.</p>' +
        '<textarea class="input mono" readonly style="min-height:96px;font-size:12px">' + esc(link) + '</textarea>' +
        '<p class="fine">학부모님께는 이 링크 대신 원생 정보의 <b>초대 코드 보내기</b>를 써 주세요. 초대 문자에 링크와 코드가 같이 들어가요.</p>',
      actions: [
        { label: '문자로', icon: 'send', onClick: function () { location.href = 'sms:?body=' + encodeURIComponent(link); return false; } },
        { label: '복사', icon: 'copy', onClick: function () { U.copy(link).then(function (ok) { UI.toast(ok ? '링크를 복사했어요' : '복사하지 못했어요. 글자를 길게 눌러 선택해 주세요.'); }); return false; } },
        { label: '닫기', kind: 'primary' }
      ]
    });
  };

  // 같은 보호자 번호를 쓰는 형제가 새로 등록되면 이미 연결된 학부모 기기에도 보이게 합니다
  Cloud.linkSiblings = function (s) {
    var phones = (s.guardians || []).map(function (g) { return U.digits(g.phone); }).filter(Boolean);
    if (!phones.length) return;
    S().parents.forEach(function (p) {
      if (phones.indexOf(U.digits(p.phone)) >= 0 && p.studentIds.indexOf(s.id) < 0) p.studentIds.push(s.id);
    });
  };

  // ---------- 화면: 관리자 로그인과 처음 설정 ----------
  Cloud.adminFlow = function (next) {
    if (Cloud.role === 'admin') { ensureSetup(next); return; }
    if (Cloud.role === 'unverified') { verifyModal(next); return; }
    if (Cloud.role === 'not-admin') { rulesModal(next); return; }
    if (Cloud.role === 'parent') { UI.toast('이 기기는 학부모 앱으로 연결되어 있어요. 학부모 메뉴에서 연결을 끊은 뒤 관리자로 로그인하세요.'); return; }
    if (Cloud.role === 'offline') { UI.toast('서버에 연결할 수 없어요. 인터넷 연결을 확인해 주세요.'); return; }
    if (Cloud.role === 'no-db') {
      UI.modal({
        title: '데이터베이스가 아직 없어요',
        html: '<p class="soft">이 Firebase 프로젝트(<b class="mono">' + esc(Cloud.projectId()) + '</b>)에 Firestore 데이터베이스가 아직 만들어지지 않았어요.</p>' +
          '<p class="soft">Firebase 콘솔 → <b>Firestore Database</b> → <b>데이터베이스 만들기</b>에서 위치를 <b>asia-northeast3 (Seoul)</b>로 골라 만든 뒤, 이 화면을 새로고침해 주세요.</p>',
        actions: [{ label: '로그아웃', kind: 'quiet', left: true, onClick: function () { Cloud.signOut(); } }, { label: '닫기', kind: 'primary' }]
      });
      return;
    }
    loginModal(next);
  };
  function again(next) { return detectRole().then(function () { Cloud.adminFlow(next); }); }

  function ensureSetup(next) {
    if (!Cloud.hasData) { firstSetupModal(next); return; }
    if (Cloud.started && listenRole === 'admin') { next(); return; }
    var close = busy('서버에서 자료를 받는 중이에요');
    Cloud.start().then(function () { close(); next(); });
  }

  function busy(text) {
    return UI.modal({ title: '잠시만요', html: '<p class="soft" data-busy>' + esc(text) + '</p>', sticky: true });
  }

  function loginModal(next) {
    var mode = 'login';
    UI.modal({
      title: '관장 · 사범님 로그인',
      html: '<p class="soft" data-intro>서버에 저장된 도장 자료를 쓰려면 관리자 계정으로 로그인해야 해요.</p>' +
        '<div class="field"><label for="clEmail">이메일</label><input class="input" id="clEmail" type="email" autocomplete="username" autofocus></div>' +
        '<div class="field"><label for="clPw">비밀번호</label><input class="input" id="clPw" type="password" autocomplete="current-password"></div>' +
        '<div class="field" data-pw2 hidden><label for="clPw2">비밀번호 한 번 더</label><input class="input" id="clPw2" type="password" autocomplete="new-password"></div>' +
        '<p class="bad-t small" data-err></p>' +
        '<div class="hstack"><button class="link-btn" type="button" data-mode>처음이에요 · 관리자 계정 만들기</button><span class="spacer"></span><button class="link-btn" type="button" data-reset>비밀번호를 잊었어요</button></div>',
      actions: [{ label: '취소', kind: 'quiet' }, {
        label: '로그인', kind: 'primary', onClick: function (root, close) {
          var email = root.querySelector('#clEmail').value.trim(), pw = root.querySelector('#clPw').value;
          var err = root.querySelector('[data-err]');
          if (mode === 'signup' && pw !== root.querySelector('#clPw2').value) { err.textContent = '두 비밀번호가 서로 달라요'; return false; }
          err.textContent = '';
          var p = mode === 'signup'
            ? auth.createUserWithEmailAndPassword(email, pw).then(function (c) { return c.user.sendEmailVerification(); })
            : auth.signInWithEmailAndPassword(email, pw);
          p.then(function () { close(); return again(next); }, function (e) { err.textContent = msgOf(e); });
          return false;
        }
      }],
      onMount: function (root) {
        var btn = root.parentNode.querySelector('[data-mact="1"]');
        root.querySelector('[data-mode]').onclick = function () {
          mode = mode === 'login' ? 'signup' : 'login';
          root.querySelector('[data-pw2]').hidden = mode !== 'signup';
          this.textContent = mode === 'signup' ? '이미 계정이 있어요 · 로그인' : '처음이에요 · 관리자 계정 만들기';
          btn.textContent = mode === 'signup' ? '계정 만들기' : '로그인';
          root.querySelector('#clPw').setAttribute('autocomplete', mode === 'signup' ? 'new-password' : 'current-password');
        };
        root.querySelector('[data-reset]').onclick = function () {
          var email = root.querySelector('#clEmail').value.trim();
          if (!email) { root.querySelector('[data-err]').textContent = '이메일을 먼저 입력해 주세요'; return; }
          auth.sendPasswordResetEmail(email).then(function () { UI.toast(email + '로 비밀번호 재설정 메일을 보냈어요'); }, function (e) { root.querySelector('[data-err]').textContent = msgOf(e); });
        };
      }
    });
  }

  function verifyModal(next) {
    var email = Cloud.email();
    UI.modal({
      title: '이메일 인증',
      html: '<p class="soft"><b>' + esc(email) + '</b>로 인증 메일을 보냈어요. 메일의 링크를 누른 뒤 아래 "인증 확인"을 눌러 주세요.</p>' +
        '<p class="fine">메일이 안 보이면 스팸함을 확인해 주세요.</p><p class="bad-t small" data-err></p>',
      actions: [
        { label: '다른 계정', kind: 'quiet', left: true, onClick: function () { Cloud.signOut(); } },
        { label: '메일 다시 보내기', onClick: function () { Cloud.user.sendEmailVerification().then(function () { UI.toast('인증 메일을 다시 보냈어요'); }, function (e) { UI.toast(msgOf(e)); }); return false; } },
        { label: '인증 확인', kind: 'primary', onClick: function (root, close) {
          Cloud.user.reload().then(function () { return auth.currentUser.getIdToken(true); }).then(function () {
            if (!auth.currentUser.emailVerified) { root.querySelector('[data-err]').textContent = '아직 인증이 확인되지 않았어요. 메일의 링크를 눌렀는지 확인해 주세요.'; return; }
            close();
            again(next);
          });
          return false;
        } }
      ]
    });
  }

  Cloud.rulesText = function (emails) { return CloudRules.rulesFor(emails); };
  function rulesModal(next) {
    var text = Cloud.rulesText([Cloud.email()]);
    UI.modal({
      title: '서버 보안 규칙 붙이기', wide: true,
      html: '<p class="soft">이 계정(<b>' + esc(Cloud.email()) + '</b>)이 아직 관리자로 등록되지 않았어요. 아래 보안 규칙을 Firebase에 한 번 붙여 넣으면 이 이메일만 관리자가 되고, 학부모는 자기 아이 정보만 볼 수 있게 돼요.</p>' +
        '<ol class="soft" style="margin:0;padding-left:20px;line-height:1.9"><li>"규칙 복사"를 누릅니다.</li><li>Firebase 콘솔 → Firestore Database → <b>규칙</b> 탭을 엽니다.</li><li>있던 내용을 모두 지우고 붙여 넣은 뒤 <b>게시</b>를 누릅니다.</li><li>1분쯤 뒤 아래 "다시 확인"을 누릅니다.</li></ol>' +
        '<textarea class="input mono" readonly style="min-height:220px;font-size:12px" id="rulesOut">' + esc(text) + '</textarea>' +
        '<p class="bad-t small" data-err></p>',
      actions: [
        { label: '로그아웃', kind: 'quiet', left: true, onClick: function () { Cloud.signOut(); } },
        { label: '규칙 복사', icon: 'copy', onClick: function () { U.copy(text).then(function (ok) { UI.toast(ok ? '규칙을 복사했어요' : '복사하지 못했어요. 글자를 길게 눌러 선택해 주세요.'); }); return false; } },
        { label: '다시 확인', kind: 'primary', onClick: function (root, close) {
          auth.currentUser.getIdToken(true).then(detectRole).then(function (r) {
            if (r === 'not-admin') { root.querySelector('[data-err]').textContent = '아직 관리자로 확인되지 않아요. 규칙을 게시했는지, 이메일이 맞는지 확인해 주세요.'; return; }
            close();
            Cloud.adminFlow(next);
          });
          return false;
        } }
      ]
    });
  }

  function firstSetupModal(next) {
    var local = DB.localSnapshot;
    var localN = local && local.students ? local.students.filter(function (s) { return !s.purged; }).length : 0;
    var choice = localN ? 'local' : 'empty';
    function opt(v, title, desc) {
      return '<label class="consent-box" style="cursor:pointer"><span class="check"><input type="radio" name="setupChoice" value="' + v + '"' + (choice === v ? ' checked' : '') + '><span><b>' + esc(title) + '</b><br><span class="small muted">' + esc(desc) + '</span></span></span></label>';
    }
    UI.modal({
      title: '서버 처음 설정',
      html: '<p class="soft">서버에 아직 도장 자료가 없어요. 어떻게 시작할까요?</p>' +
        (localN ? opt('local', '이 기기의 자료 올리기', '원생 ' + localN + '명' + (local.demo ? ' (샘플 데이터)' : '') + '과 출석·회비·알림장 기록을 서버로 옮겨요.') : '') +
        opt('demo', '샘플 데이터로 체험하기', '원생 100명 샘플로 시작해요. 나중에 설정에서 지울 수 있어요.') +
        opt('empty', '빈 상태로 시작', '원생 등록부터 새로 시작해요.') +
        '<p class="fine" data-prog></p>',
      sticky: true,
      actions: [
        { label: '로그아웃', kind: 'quiet', left: true, onClick: function () { Cloud.signOut(); } },
        { label: '시작하기', kind: 'primary', onClick: function (root, close) {
          var v = (root.querySelector('input[name="setupChoice"]:checked') || {}).value || 'empty';
          var st;
          if (v === 'local') st = DB.upgradeState(JSON.parse(JSON.stringify(local)));
          else { st = DB.blankState(); if (v === 'demo') { Seed.fill(st); st.demo = true; } }
          var prog = root.querySelector('[data-prog]');
          root.parentNode.querySelectorAll('[data-mact]').forEach(function (b) { b.disabled = true; });
          prog.textContent = '서버로 올리는 중…';
          Cloud.upload(st, function (d, t) { prog.textContent = '서버로 올리는 중… ' + d + ' / ' + t; }).then(function () {
            close();
            UI.toast('서버 설정을 마쳤어요');
            next();
          }, function (e) {
            prog.textContent = '올리지 못했어요: ' + msgOf(e);
            root.parentNode.querySelectorAll('[data-mact]').forEach(function (b) { b.disabled = false; });
          });
          return false;
        } }
      ]
    });
  }

  // ---------- 화면: 학부모 초대 코드 ----------
  Cloud.inviteEntry = function (next, code) {
    if (Cloud.role === 'admin' || (Cloud.user && !Cloud.user.isAnonymous)) {
      UI.toast('이 기기는 관리자 계정으로 로그인되어 있어요. 학부모 화면은 원생 정보의 "학부모 화면 보기"로 확인하세요.');
      return;
    }
    UI.modal({
      title: '학부모 앱 시작',
      html: (code ? '<p class="soft">도장에서 보낸 초대 코드가 들어 있어요. <b>연결하기</b>를 눌러 주세요. 형제·자매는 한 코드로 함께 연결돼요.</p>'
        : '<p class="soft">도장에서 문자로 받은 <b>초대 코드 8자리</b>를 입력해 주세요. 형제·자매는 한 코드로 함께 연결돼요.</p>') +
        (U.isIOS() && !U.standalone() ? '<div class="notice-bar">' + UI.icon('info') + '<span>아이폰은 먼저 화면 아래 <b>공유</b> 버튼 → <b>홈 화면에 추가</b>를 누르고, 홈 화면에 생긴 아이콘으로 열어서 연결해 주세요. 사파리에서 연결하면 홈 화면 아이콘에서는 다시 연결해야 해요.</span></div>' : '') +
        '<div class="field"><label for="ivCode">초대 코드</label><input class="input mono" id="ivCode" autocomplete="one-time-code" autocapitalize="characters" placeholder="ABCD-EFGH" value="' + esc(code ? Cloud.fmtCode(String(code).toUpperCase().replace(/[^A-Z0-9]/g, '')) : '') + '" style="letter-spacing:.15em;text-transform:uppercase" autofocus></div>' +
        '<p class="bad-t small" data-err></p>' +
        '<button class="link-btn" type="button" data-privacy style="align-self:flex-start">개인정보 처리방침 보기</button>',
      actions: [{ label: '취소', kind: 'quiet' }, {
        label: '연결하기', kind: 'primary', onClick: function (root, close) {
          var err = root.querySelector('[data-err]');
          err.textContent = '연결하는 중…';
          Cloud.redeem(root.querySelector('#ivCode').value).then(function () { U.dropParam('c'); close(); next(); }, function (e) { err.textContent = e.message; });
          return false;
        }
      }],
      onMount: function (root) { root.querySelector('[data-privacy]').onclick = function () { Parts.openPrivacy(); }; }
    });
  };

  // 관리자 비밀번호(6자리)를 잊었을 때: 관리자 계정의 로그인 비밀번호로 본인 확인 후 새로 정해요
  Cloud.resetPin = function (next) {
    if (!Cloud.started || listenRole !== 'admin') { UI.toast('서버 자료를 받은 뒤에 다시 해 주세요'); return; }
    UI.modal({
      title: '관리자 비밀번호 다시 정하기',
      html: '<p class="soft">관리자 계정(<b>' + esc(Cloud.email()) + '</b>)의 로그인 비밀번호로 본인 확인을 한 뒤, 새 6자리 비밀번호를 정해요.</p>' +
        '<div class="field"><label for="rpPw">계정 로그인 비밀번호</label><input class="input" id="rpPw" type="password" autocomplete="current-password" autofocus></div>' +
        '<div class="form-grid"><div class="field"><label for="rpNew">새 비밀번호 (숫자 6자리)</label><input class="input mono" id="rpNew" type="password" inputmode="numeric" maxlength="6" autocomplete="off"></div>' +
        '<div class="field"><label for="rpNew2">한 번 더</label><input class="input mono" id="rpNew2" type="password" inputmode="numeric" maxlength="6" autocomplete="off"></div></div>' +
        '<p class="bad-t small" data-err></p>',
      actions: [{ label: '취소', kind: 'quiet' }, {
        label: '바꾸기', kind: 'primary', onClick: function (root, close) {
          var err = root.querySelector('[data-err]');
          var nw = root.querySelector('#rpNew').value, bad = U.pinProblem(nw, root.querySelector('#rpNew2').value);
          if (bad) { err.textContent = bad; return false; }
          err.textContent = '확인하는 중…';
          auth.currentUser.reauthenticateWithCredential(fb.auth.EmailAuthProvider.credential(Cloud.email(), root.querySelector('#rpPw').value)).then(function () {
            DB.settings().adminPin = nw;
            DB.device.pinFails = 0; DB.device.pinLockUntil = 0; DB.saveDevice();
            DB.save();
            close();
            UI.toast('관리자 비밀번호를 새로 정했어요');
            if (next) next();
          }, function (e) { err.textContent = msgOf(e); });
          return false;
        }
      }]
    });
  };

  // 관리자: 원생 보호자에게 초대 코드 만들어 보내기
  Cloud.inviteModal = function (s) {
    var g = (s.guardians || []).filter(function (x) { return x.phone; });
    if (!g.length) { UI.toast('보호자 휴대폰 번호를 먼저 등록해 주세요'); return; }
    var phone = U.digits(g[0].phone);
    var siblings = DB.studentsByPhone(phone).filter(function (x) { return x.status !== 'left'; });
    if (!siblings.some(function (x) { return x.id === s.id; })) siblings.unshift(s);
    var code = Cloud.createInvite(siblings.map(function (x) { return x.id; }), phone);
    var st = DB.settings();
    var msg = '[' + st.dojangName + '] 학부모 앱 초대 (' + siblings.map(function (x) { return x.name; }).join(', ') + ')\n' +
      '아래 링크를 열고 "연결하기"를 누르면 우리 아이 출석, 알림장, 참가신청서를 볼 수 있어요. 7일 안에 한 번 쓸 수 있어요.\n' +
      Cloud.link(code) + '\n초대 코드: ' + Cloud.fmtCode(code);
    UI.modal({
      title: '학부모 앱 초대 코드',
      html: '<p class="soft">' + esc(siblings.map(function (x) { return x.name; }).join(', ')) + ' 보호자(' + esc(U.fmtPhone(phone)) + ')에게 보낼 코드예요. 7일 안에 한 번만 쓸 수 있어요.</p>' +
        '<div style="text-align:center;font-family:var(--f-mono);font-size:34px;font-weight:600;letter-spacing:.12em;padding:10px 0">' + esc(Cloud.fmtCode(code)) + '</div>' +
        '<a class="btn primary block" href="sms:' + esc(phone) + '?body=' + esc(encodeURIComponent(msg)) + '">' + UI.icon('send') + '문자로 보내기</a>' +
        '<p class="fine">문자 앱이 열리지 않으면 아래 "복사"를 눌러 카카오톡 등으로 보내세요.</p>',
      actions: [{ label: '복사', icon: 'copy', onClick: function () { U.copy(msg).then(function (ok) { UI.toast(ok ? '안내 문구를 복사했어요' : '복사하지 못했어요'); }); return false; } }, { label: '닫기', kind: 'primary' }]
    });
  };

  Cloud.parentsOf = function (sid) {
    return (S().parents || []).filter(function (p) { return (p.studentIds || []).indexOf(sid) >= 0; });
  };
  Cloud.unlinkParent = function (uid) {
    var arr = S().parents;
    for (var i = 0; i < arr.length; i++) if (arr[i].id === uid) { arr.splice(i, 1); break; }
    DB.save();
  };
})();
