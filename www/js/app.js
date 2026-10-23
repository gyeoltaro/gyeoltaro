/* 앱 뼈대: 시작 화면, 관리자·학부모 화면 틀, 화면 이동, 뒤로가기(안드로이드 뒤로 버튼 포함) */
(function () {
  'use strict';
  var esc = U.esc;
  var root = null;
  var leaveFns = [];

  var ADMIN_NAV = [
    ['home', '홈', 'home'], ['attendance', '출석부', 'check'], ['fees', '회비장부', 'ledger'],
    ['students', '원생', 'users'], ['notices', '알림장', 'bell'], ['events', '참가신청', 'clipboard'],
    ['fitness', '체력측정', 'activity'], ['exams', '승급심사', 'belt'], ['settings', '설정', 'sliders']
  ];
  var PARENT_TABS = [['home', '홈', 'home'], ['notices', '알림장', 'bell'], ['events', '참가신청', 'clipboard'], ['records', '성장기록', 'activity']];

  var App = window.App = { session: null, view: 'home', params: {}, stack: [] };

  App.onLeave = function (fn) { leaveFns.push(fn); };
  function runLeave() {
    var fns = leaveFns;
    leaveFns = [];
    fns.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } });
  }

  function setMode(mode) {
    if (root.getAttribute('data-mode') !== mode) {
      root.setAttribute('data-mode', mode);
      root.innerHTML = '';
      root.onclick = null;
    }
    ['start', 'kiosk', 'admin', 'parent'].forEach(function (m) { document.body.classList.toggle('mode-' + m, m === mode); });
  }

  App.render = function (toTop) {
    var y = window.scrollY || 0;
    App.formBusy = false;
    runLeave();
    var s = App.session;
    try {
      if (!s) { setMode('start'); renderStart(); }
      else if (s.role === 'kiosk') { setMode('kiosk'); Views.kiosk(root); }
      else if (s.role === 'admin') { setMode('admin'); renderAdmin(); }
      else { setMode('parent'); renderParent(); }
    } catch (e) {
      console.error(e);
      var el = root.querySelector('#view') || root;
      el.innerHTML = '<div class="card">' + UI.empty('화면을 그리다가 문제가 생겼어요', e.message) + '</div>';
    }
    window.scrollTo(0, toTop ? 0 : y);
  };
  App.refresh = function () { App.render(false); };

  // 다른 기기에서 바뀐 내용이 오면 화면을 다시 그립니다. 글을 쓰거나 서명하는 중이면 기다립니다.
  App.formBusy = false;
  var refreshWait = null;
  App.softRefresh = function () {
    clearTimeout(refreshWait);
    if (!App.session) { if (!UI.modalOpen()) App.render(false); return; }
    App.updateShell();
    if (App.session.role === 'kiosk' || App.formBusy) return;
    var ae = document.activeElement;
    var typing = ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName) && root.contains(ae);
    if (UI.modalOpen() || typing) { refreshWait = setTimeout(App.softRefresh, 1500); return; }
    App.refresh();
  };
  function markBusy(e) {
    if (e.target && e.target.closest && e.target.closest('#view') && (e.type !== 'pointerdown' || e.target.tagName === 'CANVAS')) App.formBusy = true;
  }
  document.addEventListener('input', markBusy, true);
  document.addEventListener('change', markBusy, true);
  document.addEventListener('pointerdown', markBusy, true);

  App.go = function (view, params) {
    App.formBusy = false;
    App.stack.push({ view: App.view, params: App.params, y: window.scrollY || 0 });
    App.view = view;
    App.params = params || {};
    App.render(true);
    syncBack();
  };
  App.nav = function (view, params) {
    App.formBusy = false;
    App.stack = [];
    App.view = view;
    App.params = params || {};
    App.render(true);
    syncBack();
  };

  App.setSession = function (s) {
    UI.closeAll();
    App.formBusy = false;
    App.locked = false;
    resetIdle();
    App.session = s;
    App.stack = [];
    App.view = 'home';
    App.params = {};
    if (s && s.role === 'parent' && Views.parent.reset) Views.parent.reset();
    if (!s || !s.preview) { DB.device.session = s; DB.saveDevice(); }
    App.render(true);
    syncBack();
  };
  App.logout = function () { App.setSession(null); };
  App.openKiosk = function () {
    if (!App.session) { App.setSession({ role: 'kiosk' }); return; }
    UI.confirm({
      title: '출석 화면 열기',
      message: '이 기기를 출석 화면으로 바꿀까요?\n관리자 화면으로 돌아오려면 출석 화면 오른쪽 아래 "관리자"를 누르고 비밀번호를 입력하세요.',
      ok: '출석 화면 열기'
    }).then(function (ok) { if (ok) App.setSession({ role: 'kiosk' }); });
  };
  App.previewParent = function (stu) {
    var g = (stu.guardians || []).filter(function (x) { return x.phone; })[0];
    var kids = g ? DB.studentsByPhone(g.phone) : [];
    if (!kids.some(function (k) { return k.id === stu.id; })) kids.unshift(stu);
    var ret = { view: App.view, params: App.params };
    App.setSession({ role: 'parent', ids: kids.map(function (k) { return k.id; }), cur: stu.id, preview: true, ret: ret });
  };
  function exitPreview() {
    var ret = App.session && App.session.ret;
    App.setSession({ role: 'admin' });
    if (ret) { App.view = 'students'; App.params = ret.params || {}; App.render(true); syncBack(); }
  }

  // ---------- 관리자 비밀번호: 5번 틀리면 5분 잠금 ----------
  var MAX_FAILS = 5, LOCK_MIN = 5;
  App.pinLockMsg = function () {
    var until = DB.device.pinLockUntil || 0;
    if (Date.now() >= until) return null;
    return '비밀번호를 ' + MAX_FAILS + '번 틀려서 잠겼어요. ' + Math.ceil((until - Date.now()) / 60000) + '분 뒤에 다시 해 주세요.';
  };
  App.checkAdminPin = function (pin) {
    var lockMsg = App.pinLockMsg();
    if (lockMsg) return lockMsg;
    var d = DB.device;
    if (pin === DB.settings().adminPin) { d.pinFails = 0; d.pinLockUntil = 0; DB.saveDevice(); return true; }
    d.pinFails = (d.pinFails || 0) + 1;
    if (d.pinFails >= MAX_FAILS) {
      d.pinFails = 0;
      d.pinLockUntil = Date.now() + LOCK_MIN * 60000;
      DB.saveDevice();
      return App.pinLockMsg();
    }
    DB.saveDevice();
    return '비밀번호가 맞지 않아요. (' + d.pinFails + '/' + MAX_FAILS + '번 틀림)';
  };
  App.askAdminPin = function (opts) {
    var len = DB.settings().adminPin.length;
    // 서버 모드에서는 비밀번호를 잊어도 관리자 계정 비밀번호로 다시 정할 수 있어요
    var forgot = Cloud.enabled && Cloud.role === 'admin' && Cloud.started
      ? { label: '비밀번호를 잊었어요', fn: function () { Cloud.resetPin(function () { App.setSession({ role: 'admin' }); }); } } : null;
    return UI.pinPrompt({
      title: opts.title, sub: opts.sub || '관리자 비밀번호 ' + len + '자리를 눌러 주세요', length: len,
      check: App.checkAdminPin, lockedMsg: App.pinLockMsg, sticky: opts.sticky, extra: opts.extra || forgot
    });
  };

  // ---------- 자동 잠금: 관리자 화면을 한동안 안 쓰면 비밀번호로 잠급니다 ----------
  var lastActive = Date.now(), lastSaved = 0;
  function adminish() {
    var s = App.session;
    return !!s && (s.role === 'admin' || (s.role === 'parent' && !!s.preview));
  }
  function resetIdle() { lastActive = Date.now(); lastSaved = 0; saveActive(); }
  function saveActive() {
    if (!DB.device) return;
    lastSaved = Date.now();
    DB.device.lastActive = lastActive;
    DB.saveDevice();
  }
  function touch() {
    if (App.locked) return;
    lastActive = Date.now();
    if (adminish() && lastActive - lastSaved > 15000) saveActive();
  }
  function checkIdle() {
    if (!adminish() || App.locked) return;
    var min = +DB.settings().autoLockMin;
    if (min > 0 && Date.now() - lastActive >= min * 60000) App.lock();
  }
  App.lock = function () {
    if (App.locked) return;
    App.locked = true;
    try { if (document.activeElement) document.activeElement.blur(); } catch (e) {}
    App.askAdminPin({
      title: '잠금 해제', sticky: true,
      sub: '한동안 쓰지 않아 화면을 잠갔어요. 관리자 비밀번호를 눌러 주세요.',
      extra: { label: '처음 화면으로 나가기', fn: function () { App.logout(); } }
    }).then(function (ok) {
      if (!ok) return;
      App.locked = false;
      resetIdle();
    });
  };
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (ev) {
    document.addEventListener(ev, touch, { capture: true, passive: true });
  });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') checkIdle();
    else if (adminish() && !App.locked) saveActive();
  });
  setInterval(checkIdle, 15000);

  // ---------- 뒤로가기 ----------
  // 브라우저·안드로이드 뒤로 버튼이 앱 밖으로 나가지 않고 모달 닫기 → 이전 화면 → 홈 순서로 동작하게 합니다.
  var trapped = false, skipPop = false;
  function canBack() {
    if (UI.modalOpen()) return true;
    if (!App.session) return false;
    if (App.session.role === 'kiosk') return true;
    return App.stack.length > 0 || App.view !== 'home';
  }
  function syncBack() {
    try {
      if (canBack()) {
        if (!trapped) { history.pushState({ tkd: 1 }, ''); trapped = true; }
      } else if (trapped) {
        trapped = false; skipPop = true; history.back();
      }
    } catch (e) {}
  }
  App.syncBack = syncBack;
  function internalBack() {
    if (UI.closeTop()) return true;
    if (!App.session) return false;
    if (App.session.role === 'kiosk') return true;
    if (App.stack.length) {
      var p = App.stack.pop();
      App.view = p.view;
      App.params = p.params;
      App.render(false);
      window.scrollTo(0, p.y || 0);
      return true;
    }
    if (App.view !== 'home') { App.view = 'home'; App.params = {}; App.render(true); return true; }
    return false;
  }
  window.addEventListener('popstate', function () {
    trapped = false;
    if (skipPop) { skipPop = false; return; }
    internalBack();
    syncBack();
  });
  App.back = function () { internalBack(); syncBack(); };

  // ---------- 시작 화면 ----------
  function startCard(act, icon, title, desc, cls) {
    return '<button class="start-card ' + (cls || '') + '" type="button" data-act="' + act + '"><span class="ic">' + UI.icon(icon) + '</span>' +
      '<span class="txt"><b>' + esc(title) + '</b><span class="d">' + esc(desc) + '</span></span></button>';
  }
  function renderStart() {
    var st = DB.settings();
    var cloud = Cloud.enabled;
    var demoKid = DB.state.demo && !cloud ? DB.state.students[0] : null;
    var demoPhone = demoKid && demoKid.guardians[0] ? U.fmtPhone(demoKid.guardians[0].phone) : '';
    var h = '<div class="start"><div class="start-inner">' +
      '<header class="start-head"><span class="eyebrow">' + esc(U.fmtLong(U.today())) + '</span><h1>' + esc(st.dojangName) + '</h1>' +
      '<p>출석 · 회비장부 · 체력측정 · 알림장 · 참가신청서 · 승급심사를 한 곳에서</p></header>' +
      '<div class="start-grid">' +
      startCard('kiosk', 'tablet', '출석체크', '도장 태블릿에 켜 두는 화면이에요. 아이들이 출석번호 4자리를 눌러요.', 'kiosk-card') +
      startCard('admin', 'lock', '관장 · 사범님', '원생, 출석부, 회비장부, 체력측정, 알림장, 승급심사를 관리해요.') +
      startCard('parent', 'users', '학부모', cloud ? '도장에서 받은 초대 코드로 시작해요. 우리 아이 출석, 알림장, 신청서, 성장기록을 봐요.' : '우리 아이 출석, 알림장, 참가신청서, 성장기록을 봐요.') +
      '</div>';
    if (demoKid) {
      h += '<div class="demo-box"><span>체험용 관리자 비밀번호 <b>' + esc(st.adminPin) + '</b></span>' +
        '<span>학부모 <b>' + esc(demoPhone) + '</b> · 출석번호 <b>' + esc(demoKid.pin) + '</b></span>' +
        '<button class="btn sm" type="button" data-act="demo-parent">학부모 화면 바로 보기</button></div>';
    }
    var cs = Cloud.statusText();
    var free = !Server.preset;
    if (!cloud && free) {
      h += '<div class="demo-box"><span><span class="lead">체험 모드</span> · ' + (DB.state.demo ? '샘플 자료로 둘러보는 중이에요. ' : '') + '모든 정보는 이 기기에만 저장돼요.</span>' +
        '<button class="btn sm primary" type="button" data-act="connect">' + UI.icon('lock') + '우리 도장 서버 연결</button></div>';
    }
    h += '<p class="fine">' + (cloud
      ? '자료는 도장 서버(서울)에 저장되어 도장 태블릿, 관장님 휴대폰, 학부모 휴대폰이 같은 정보를 봐요. ' + (cs ? UI.pill(cs.text, cs.tone, true) + ' ' : '') + (Cloud.role === 'admin' && Cloud.email() ? '<span class="nowrap">' + esc(Cloud.email()) + '</span> ' : '')
      : free ? '학부모님은 도장에서 받은 링크로 열어 주세요. ' : '1단계 미리보기예요. 모든 정보는 이 기기에만 저장되고, 다른 휴대폰과는 아직 공유되지 않아요. ') +
      (free ? '<a class="link-btn" href="parents.html" target="_blank" rel="noopener">학부모 안내</a> · <a class="link-btn" href="manual.html" target="_blank" rel="noopener">관리자 설명서</a> · ' : '') +
      '<button class="link-btn" type="button" data-act="privacy">개인정보 처리방침</button></p></div></div>';
    root.innerHTML = h;
    UI.bind(root, {
      kiosk: function () {
        if (cloud) { Cloud.adminFlow(function () { App.setSession({ role: 'kiosk' }); }); return; }
        App.setSession({ role: 'kiosk' });
      },
      admin: function () {
        if (cloud && !(Cloud.role === 'admin' && Cloud.started)) { Cloud.adminFlow(function () { App.setSession({ role: 'admin' }); }); return; }
        App.askAdminPin({ title: '관장 · 사범님 확인' }).then(function (ok) { if (ok) App.setSession({ role: 'admin' }); });
      },
      parent: cloud ? function () {
        if (Cloud.role === 'parent' && Cloud.started) { App.setSession(Cloud.parentSession()); return; }
        Cloud.inviteEntry(function () { App.setSession(Cloud.parentSession()); });
      } : parentLogin,
      privacy: function () { Parts.openPrivacy(); },
      connect: function () { Cloud.connectModal(); },
      'demo-parent': function () {
        var kids = DB.studentsByPhone(demoKid.guardians[0].phone);
        App.setSession({ role: 'parent', ids: kids.map(function (k) { return k.id; }), cur: demoKid.id, phone: U.digits(demoKid.guardians[0].phone) });
      }
    });
  }

  function parentLogin() {
    UI.modal({
      title: '학부모 로그인',
      html: '<div class="field"><label for="plPhone">보호자 휴대폰 번호</label><input class="input" id="plPhone" type="tel" inputmode="numeric" placeholder="010-0000-0000" autocomplete="tel" autofocus></div>' +
        '<div class="field"><label for="plPin">아이 출석번호 4자리</label><input class="input mono" id="plPin" type="password" inputmode="numeric" maxlength="4" autocomplete="off"></div>' +
        '<p class="fine">원생 등록 때 도장에 알려 주신 번호로 들어와요. 형제·자매는 한 번에 함께 보여요.</p><p class="bad-t small" data-err></p>' +
        '<button class="link-btn" type="button" data-privacy style="align-self:flex-start">개인정보 처리방침 보기</button>',
      actions: [{ label: '취소', kind: 'quiet' }, {
        label: '들어가기', kind: 'primary', onClick: function (root) {
          var phone = root.querySelector('#plPhone').value, pin = U.digits(root.querySelector('#plPin').value);
          var err = root.querySelector('[data-err]');
          var kids = DB.studentsByPhone(phone);
          var match = kids.filter(function (k) { return k.pin === pin; })[0];
          if (!kids.length || !match) { err.textContent = '휴대폰 번호 또는 출석번호가 맞지 않아요. 다시 확인해 주세요.'; return false; }
          App.setSession({ role: 'parent', ids: kids.map(function (k) { return k.id; }), cur: match.id, phone: U.digits(phone) });
        }
      }],
      onMount: function (m) {
        m.querySelector('[data-privacy]').onclick = function () { Parts.openPrivacy(); };
        m.querySelector('#plPin').addEventListener('keydown', function (e) {
          if (e.key === 'Enter') m.querySelector('[data-mact="1"]').click();
        });
      }
    });
  }

  // ---------- 관리자 화면 틀 ----------
  function renderAdmin() {
    if (!root.querySelector('.shell')) {
      root.innerHTML = '<div class="shell"><aside class="sidebar">' +
        '<div class="brand"><div class="brand-name"><small>관리자</small><b data-brand></b><span data-cloud></span></div>' +
        '<div class="brand-actions"><button class="icon-btn" type="button" data-act="kiosk" aria-label="출석 화면 열기">' + UI.icon('tablet') + '</button>' +
        '<button class="icon-btn" type="button" data-act="logout" aria-label="처음 화면으로">' + UI.icon('logout') + '</button></div></div>' +
        '<nav class="nav" aria-label="관리 메뉴">' + ADMIN_NAV.map(function (n) {
          return '<button type="button" data-nav="' + n[0] + '">' + UI.icon(n[2]) + '<span>' + n[1] + '</span><span data-badge="' + n[0] + '"></span></button>';
        }).join('') + '</nav>' +
        '<div class="side-foot"><button class="btn quiet" type="button" data-act="kiosk">' + UI.icon('tablet') + '출석 화면 열기</button>' +
        '<button class="btn quiet" type="button" data-act="logout">' + UI.icon('logout') + '처음 화면으로</button></div>' +
        '</aside><main class="app-main"><div class="main-inner" id="view"></div></main></div>';
      root.querySelector('.sidebar').addEventListener('click', function (e) {
        var n = e.target.closest('[data-nav]');
        if (n) { App.nav(n.getAttribute('data-nav')); return; }
        var a = e.target.closest('[data-act]');
        if (!a) return;
        if (a.getAttribute('data-act') === 'kiosk') App.openKiosk(); else App.logout();
      });
    }
    var v = Views.admin[App.view] || Views.admin.home;
    var el = root.querySelector('#view');
    el.onclick = null;
    v.render(el, App.params || {});
    App.updateShell();
  }

  function setBadge(key, n) {
    var b = root.querySelector('[data-badge="' + key + '"]');
    if (b) b.innerHTML = n ? '<span class="count-badge">' + n + '</span>' : '';
  }

  // ---------- 학부모 화면 틀 ----------
  function renderParent() {
    var s = App.session;
    var ids = (s.ids || []).filter(function (id) { var k = DB.student(id); return k && k.status !== 'left'; });
    if (!ids.length && Cloud.enabled && (s.ids || []).length) {
      // 서버에서 아이 정보가 아직 오지 않았을 때
      root.innerHTML = '<div class="boot">불러오는 중…</div>';
      return;
    }
    if (!ids.length) { App.session = null; DB.device.session = null; DB.saveDevice(); setMode('start'); renderStart(); return; }
    s.ids = ids;
    if (ids.indexOf(s.cur) < 0) s.cur = ids[0];
    if (!root.querySelector('.p-app')) {
      root.innerHTML = (s.preview ? '<div class="preview-bar"><span>관리자 미리보기 · 학부모님이 보는 화면이에요</span><button class="btn sm" type="button" data-act="exit-preview">관리자로 돌아가기</button></div>' : '') +
        '<div class="p-app"><header class="p-head" id="pHead"></header><main class="p-main" id="view"></main></div>' +
        '<nav class="p-tabs" aria-label="학부모 메뉴"><div class="p-tabs-inner">' + PARENT_TABS.map(function (t) {
          return '<button type="button" data-tab="' + t[0] + '">' + UI.icon(t[2]) + '<span>' + t[1] + '</span><span data-badge="' + t[0] + '"></span></button>';
        }).join('') + '</div></nav>';
      root.addEventListener('click', parentShellClick);
    }
    // 보호자 동의 전에는 동의서만 보여 줍니다 (관리자 미리보기는 예외)
    var gated = !s.preview && !DB.hasConsent(DB.student(s.cur));
    root.classList.toggle('consent-gate', gated);
    var v = gated ? Views.parent.consent : (Views.parent[App.view] || Views.parent.home);
    var el = root.querySelector('#view');
    el.onclick = null;
    v.render(el, App.params || {});
    App.updateShell();
  }
  function parentShellClick(e) {
    if (!App.session || App.session.role !== 'parent') return;
    var t = e.target.closest('[data-tab]');
    if (t) { App.nav(t.getAttribute('data-tab')); return; }
    var k = e.target.closest('[data-kid]');
    if (k) { App.session.cur = k.getAttribute('data-kid'); if (!App.session.preview) { DB.device.session = App.session; DB.saveDevice(); } App.nav(App.view === 'records' ? 'records' : 'home'); return; }
    var a = e.target.closest('[data-act]');
    if (!a || e.target.closest('#view')) return;
    var act = a.getAttribute('data-act');
    if (act === 'exit-preview') exitPreview();
    if (act === 'p-menu') parentMenu();
  }
  function parentMenu() {
    var s = App.session, kid = DB.student(s.cur), st = DB.settings();
    UI.modal({
      title: st.dojangName,
      html: '<div class="hstack">' + UI.av(kid, 'sm') + '<b>' + esc(kid.name) + '</b><span class="small muted">' + esc(UI.studentSub(kid)) + '</span></div>' +
        '<dl class="kv"><dt>출석번호</dt><dd class="mono">' + esc(kid.pin) + '</dd><dt>급수</dt><dd>' + UI.belt(kid.grade) + '</dd></dl>' +
        '<p class="fine">알림장 답글로 관장님께 언제든 연락할 수 있어요.</p>' +
        (Cloud.pushEnabled() && !s.preview ? (function () {
          var pl = Cloud.pushLine('새 알림장·출석');
          return '<div class="notice-bar">' + UI.icon('bell') + '<span>' + esc(pl.text) + '</span>' + (pl.act ? '<button class="btn sm" type="button" data-push="' + (pl.act === 'push-on' ? 1 : 0) + '">' + pl.label + '</button>' : '') + '</div>';
        })() : '') +
        (Cloud.enabled && Cloud.started && !s.preview ? '<div><button class="link-btn" type="button" data-pushcheck>알림이 안 오나요? 알림 점검</button></div>' : '') +
        '<div class="hstack">' + (DB.hasConsent(kid) ? '<button class="btn" type="button" data-consent>' + UI.icon('check') + '개인정보 동의 내역</button>' : '') +
        '<button class="btn" type="button" data-privacy>' + UI.icon('lock') + '개인정보 처리방침</button>' +
        (Server.preset ? '' : '<a class="btn" href="parents.html" target="_blank" rel="noopener">' + UI.icon('info') + '사용 안내</a>') + '</div>',
      onMount: function (m, close) {
        m.querySelector('[data-privacy]').onclick = function () { Parts.openPrivacy(); };
        var cb = m.querySelector('[data-consent]');
        if (cb) cb.onclick = function () { close(); Parts.consentManage(kid); };
        var pc = m.querySelector('[data-pushcheck]');
        if (pc) pc.onclick = function () { close(); Cloud.pushCheck(); };
        var pb = m.querySelector('[data-push]');
        if (pb) pb.onclick = function () { var on = pb.getAttribute('data-push') === '1'; close(); Cloud.pushToggle(on); };
      },
      actions: s.preview ? [{ label: '관리자로 돌아가기', kind: 'primary', onClick: exitPreview }]
        : Cloud.enabled ? [{ label: '이 기기 연결 끊기', kind: 'danger', onClick: function () {
          UI.confirm({ title: '연결 끊기', message: '이 휴대폰에서 학부모 앱 연결을 끊을까요?\n다시 쓰려면 도장에서 새 초대 코드를 받아야 해요.', ok: '연결 끊기', danger: true }).then(function (ok) {
            if (ok) Cloud.unlinkSelf().then(function () { App.setSession(null); UI.toast('연결을 끊었어요'); });
          });
        } }, { label: '닫기', kind: 'primary' }]
        : [{ label: '로그아웃', kind: 'danger', onClick: function () { App.logout(); } }, { label: '닫기', kind: 'primary' }]
    });
  }

  App.updateShell = function () {
    var s = App.session;
    if (!s || !root) return;
    if (s.role === 'admin') {
      var b = root.querySelector('[data-brand]');
      if (b) b.textContent = DB.settings().dojangName;
      var active = null;
      [].forEach.call(root.querySelectorAll('[data-nav]'), function (x) {
        var on = x.getAttribute('data-nav') === App.view;
        x.classList.toggle('on', on);
        if (on) { x.setAttribute('aria-current', 'page'); active = x; } else x.removeAttribute('aria-current');
      });
      setBadge('notices', DB.unseenReplies());
      setBadge('events', DB.unseenApps());
      var cs = Cloud.statusText(), cl = root.querySelector('[data-cloud]');
      if (cl) cl.innerHTML = cs ? UI.pill(cs.text, cs.tone, true) : '';
      var nav = root.querySelector('.nav');
      if (active && nav && nav.scrollWidth > nav.clientWidth) {
        if (active.offsetLeft < nav.scrollLeft || active.offsetLeft + active.offsetWidth > nav.scrollLeft + nav.clientWidth) nav.scrollLeft = active.offsetLeft - 16;
      }
    } else if (s.role === 'parent') {
      if (!s.preview) Cloud.applyTransferUrl();
      var kid = DB.student(s.cur);
      if (!kid) return;
      var head = root.querySelector('#pHead');
      if (head) {
        var pcs = Cloud.statusText();
        head.innerHTML = '<div class="p-who">' + UI.av(kid, 'sm') + '<div class="main"><b>' + esc(kid.name) + '</b><small>' + esc(DB.settings().dojangName + ' · ' + kid.className) + (pcs && pcs.tone === 'warn' ? ' · ' + pcs.text : '') + '</small></div></div>' +
          (s.ids.length > 1 ? '<div class="p-kids">' + s.ids.filter(function (id) { return id !== s.cur; }).map(function (id) {
            var k = DB.student(id);
            return '<button type="button" class="chip" data-kid="' + esc(id) + '" aria-label="' + esc(k.name) + ' 보기">' + esc(k.name) + '</button>';
          }).join('') + '</div>' : '') +
          '<button class="icon-btn" type="button" data-act="p-menu" aria-label="메뉴">' + UI.icon('menu') + '</button>';
      }
      [].forEach.call(root.querySelectorAll('[data-tab]'), function (x) { x.classList.toggle('on', x.getAttribute('data-tab') === App.view); });
      setBadge('notices', DB.unreadFor(kid));
    }
  };

  // ---------- 시작 ----------
  function boot() {
    root = document.getElementById('app');
    DB.init().then(function () {
      var s = DB.device.session;
      if (!Cloud.enabled) {
        if (s && s.role === 'parent' && !(s.ids || []).some(function (id) { return DB.student(id); })) s = null;
        return s;
      }
      var r = Cloud.role;
      if (s && (s.role === 'admin' || s.role === 'kiosk') && !(r === 'admin' && Cloud.hasData)) s = null;
      if (s && s.role === 'parent') s = r === 'parent' ? Object.assign(Cloud.parentSession(), { cur: s.cur }) : null;
      if (!s && r === 'parent') s = Cloud.parentSession();
      var ready = (r === 'admin' && Cloud.hasData) || r === 'parent' ? Cloud.start() : Promise.resolve();
      return ready.then(function () { return s; });
    }).then(function (s) {
      App.session = s || null;
      lastActive = DB.device.lastActive || 0;
      App.render(true);
      syncBack();
      if (adminish()) checkIdle(); else resetIdle();
      fromLink();
    }).catch(function (e) {
      console.error(e);
      root.innerHTML = '<div class="boot">앱을 불러오지 못했어요. 새로고침해 주세요. (' + esc(e.message) + ')</div>';
    });
  }
  // 도장이 보낸 링크로 열었을 때: 다른 도장 서버면 바꿀지 묻고, 초대 코드가 있으면 바로 연결 화면을 엽니다
  function fromLink() {
    var code = U.param('c'), next = Server.pending;
    // 읽은 값은 화면을 열기 전에 주소에서 지워요(뒤로가기 기록에 남지 않게). 초대 코드는 바로 연결에 써요.
    // t 는 아이폰 사파리가 연결된 뒤 주소에 넣어 두는 "기기 옮기기 코드"(Cloud.applyTransferUrl)예요.
    // 그 주소로 만든 홈 화면 아이콘에서만 써요. 주소가 공유돼 다른 사람이 브라우저로 열어도 연결되지 않아요.
    var transfer = U.param('t');
    if (!code && transfer && U.isIOS() && U.standalone()) code = transfer;
    if (next) U.dropParam('s');
    U.dropParam('c'); U.dropParam('t');
    if (next) {
      UI.confirm({
        title: '다른 서버로 연결할까요?',
        message: '이 링크는 다른 도장 서버(' + next.projectId + ')로 연결하는 링크예요.\n지금 이 기기는 ' + Cloud.projectId() + ' 서버에 연결되어 있어요.\n바꾸면 이 기기의 지금 로그인과 저장된 사본이 지워져요.',
        ok: '바꾸기'
      }).then(function (ok) { if (ok) Cloud.disconnect(next, code); });
      return;
    }
    if (!code || !Cloud.enabled) return;
    if (Cloud.role === 'parent' || App.session) return;
    Cloud.inviteEntry(function () { App.setSession(Cloud.parentSession()); }, code);
  }

  // 홈 화면에 추가 (안드로이드 크롬 등): 브라우저가 띄우는 안내 대신 앱 안의 버튼으로 보여 줍니다
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    App.installPrompt = e;
    if (App.session && App.session.role !== 'kiosk') App.softRefresh();
  });
  App.install = function () {
    var p = App.installPrompt;
    if (!p) return;
    App.installPrompt = null;
    p.prompt();
    p.userChoice.then(function (c) { if (c && c.outcome === 'accepted') App.installed = true; App.softRefresh(); }, function () {});
  };
  window.addEventListener('appinstalled', function () { App.installed = true; if (App.session) App.softRefresh(); });
  // 인터넷이 끊겼을 때도 앱을 다시 열 수 있게 화면 파일을 기기에 보관합니다
  if ('serviceWorker' in navigator && !Server.preset && /^(https:|http:\/\/(localhost|127\.0\.0\.1)[:/])/.test(location.href)) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
