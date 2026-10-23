/* 학부모 화면: 우리 아이 출석, 알림장, 참가신청서, 성장기록(체력·승급심사·회비) */
(function () {
  'use strict';
  var esc = U.esc;
  var ps = { calYm: null, recTab: 'att' };

  function kid() { return App.session && DB.student(App.session.cur); }
  function preview() { return !!(App.session && App.session.preview); }
  function accountLine() {
    var acc = DB.settings().account;
    if (!acc) return '';
    return '<div class="copy-line"><span>' + esc(acc) + '</span><button class="btn sm" type="button" data-act="copy-acc">' + UI.icon('copy') + '복사</button></div>';
  }
  function copyAcc() {
    U.copy(DB.settings().account).then(function (ok) { UI.toast(ok ? '계좌번호를 복사했어요' : '복사하지 못했어요. 글자를 길게 눌러 선택해 주세요.'); });
  }
  function noticeCard(n, s) {
    var unread = !(n.reads && n.reads[s.id]);
    return '<button class="card n-card' + (n.pinned ? ' pinned' : '') + '" type="button" data-act="notice" data-id="' + esc(n.id) + '">' +
      '<div class="n-meta">' + (n.pinned ? UI.pill('중요', 'accent') : '') + ((n.target || {}).type === 'students' ? UI.pill(s.name + '에게', 'info') : '') + '<span>' + esc(U.ago(n.createdAt)) + '</span></div>' +
      '<h3>' + (unread ? '<span class="unread" aria-label="안 읽음"></span>' : '') + esc(n.title) + '</h3><p class="n-preview">' + esc(n.body) + '</p></button>';
  }
  function eventCard(ev, s) {
    var a = DB.appOf(ev.id, s.id), open = DB.eventOpen(ev);
    var state = a ? UI.pill(a.status === '확정' ? '참가 확정' : '신청 완료', 'good') : open ? UI.pill(U.dueLabel(ev.deadline), 'accent') : UI.pill('신청 마감', '');
    return '<button class="card ev' + (ev.date < U.today() ? ' past' : '') + '" type="button" data-act="event" data-id="' + esc(ev.id) + '">' + Parts.eventDateBox(ev) +
      '<span class="ev-main"><span class="hstack">' + UI.pill(ev.kind, ev.kind === '대회' ? 'info' : ev.kind === '승급심사' ? 'accent' : '') + '</span>' +
      '<h3>' + esc(ev.title) + '</h3><span class="sub">' + esc((ev.place || '') + (ev.fee ? ' · 참가비 ' + U.won(ev.fee) : '')) + '</span></span>' +
      '<span class="ev-side">' + state + '</span></button>';
  }
  function visibleEvents(s) {
    return DB.state.events.filter(function (e) { return DB.eventVisible(e, s) || DB.appOf(e.id, s.id); });
  }

  // ---------- 홈 ----------
  // 처음 한 번: 홈 화면에 추가 · 알림 받기를 큰 버튼으로 (서버에 연결된 학부모 기기에서, 다 하면 사라져요)
  function setupCard() {
    if (preview() || !Cloud.enabled || DB.device.hideSetup) return '';
    var ios = U.isIOS(), home = U.standalone();
    function row(done, title, desc, btn) { return { done: done, title: title, desc: desc, btn: btn }; }
    var homeRow = home ? row(true, '홈 화면 앱으로 쓰고 있어요')
      : App.installed ? row(true, '홈 화면에 추가했어요', '다음부터는 홈 화면 아이콘으로 여세요.')
      : ios ? row(false, '홈 화면에 추가', '화면 아래 <b>공유</b> ' + UI.icon('iosShare') + ' → <b>홈 화면에 추가</b> → <b>추가</b>를 눌러요. ' +
          (Cloud.transferUrl ? '홈 화면 아이콘을 열면 <b>저절로 연결</b>돼요.' : '아이콘에서 처음 열 때는 도장에 새 초대 코드를 받아 연결해요.'))
      : App.installPrompt ? row(false, '홈 화면에 추가', '앱처럼 바로 열 수 있어요.', '<button class="btn primary" type="button" data-act="install">추가</button>')
      : row(false, '홈 화면에 추가', '크롬 오른쪽 위 메뉴(⋮) → <b>홈 화면에 추가</b>(또는 앱 설치)를 눌러요.');
    var pushRow = null;
    if (Cloud.pushEnabled()) {
      var st = Cloud.pushState();
      pushRow = st === 'on' ? row(true, '알림을 받고 있어요')
        : st === 'off' ? row(false, '알림 받기', '새 알림장과 출석을 휴대폰 알림으로 받아요.', '<button class="btn primary" type="button" data-act="push-on">알림 받기</button>')
        : st === 'ios-home' ? row(false, '알림 받기', '홈 화면 아이콘으로 열면 여기서 켤 수 있어요.')
        : st === 'denied' ? row(false, '알림 받기', '알림이 차단되어 있어요. 휴대폰 설정에서 이 앱(브라우저)의 알림을 허용해 주세요.')
        : null;
    }
    // 아이폰 사파리는 홈 화면 추가가 먼저(알림은 아이콘에서만), 나머지는 알림이 먼저
    var rows = (ios && !home ? [homeRow, pushRow] : [pushRow, homeRow]).filter(Boolean);
    if (rows.every(function (r) { return r.done; })) return '';
    return '<div class="card setup-card"><div class="setup-head"><b>처음 한 번만 해 주세요</b><button class="link-btn" type="button" data-act="hide-setup">나중에 하기</button></div>' +
      rows.map(function (r, i) {
        return '<div class="setup-row' + (r.done ? ' done' : '') + '"><span class="mark">' + (r.done ? UI.icon('ok') : i + 1) + '</span>' +
          '<div class="txt"><b>' + esc(r.title) + '</b>' + (r.desc ? '<span>' + r.desc + '</span>' : '') + '</div>' + (r.btn || '') + '</div>';
      }).join('') + '</div>';
  }

  Views.parent.home = {
    render: function (el) {
      var s = kid(), today = U.today(), ym = U.ym();
      if (!ps.calYm) ps.calYm = ym;
      var r = DB.day(today)[s.id];
      var monthN = DB.countAtt(s.id, ym + '-01', today);
      var fee = DB.feeMap(ym)[s.id];
      var billed = !fee && s.status === 'active' && (!s.joinDate || s.joinDate <= U.monthEnd(ym));
      var unread = DB.unreadFor(s);
      var notices = DB.noticesFor(s).slice(0, 3);
      var openEvents = visibleEvents(s).filter(function (e) { return DB.eventOpen(e) && e.date >= today && !DB.appOf(e.id, s.id); })
        .sort(function (a, b) { return a.deadline < b.deadline ? -1 : 1; });

      var h = setupCard() + '<div class="card kid-card"><div class="kid-top">' + UI.av(s, 'lg') + '<div class="stack sm"><h2>' + esc(s.name) + '</h2>' +
        '<div class="hstack small soft">' + UI.belt(s.grade) + '<span>' + esc(s.className) + '</span></div></div></div>' +
        '<div class="today-state' + (r ? ' on' : '') + '">' + UI.icon(r ? 'check' : 'smile') + '<div><b>' + (r ? '오늘 ' + esc(r.t ? U.fmtTime(r.t) : '') + ' 도장에 왔어요' : '오늘은 아직 출석 전이에요') + '</b>' +
        '<span>' + esc(U.fmtMD(today)) + '</span></div></div>' +
        '<div class="mini-stats"><div><small>이번 달 출석</small><b>' + monthN + '회</b></div>' +
        '<div><small>' + esc(U.fmtM(ym)) + ' 회비</small><b class="' + (fee ? 'good' : billed ? 'bad' : '') + '">' + (fee ? (fee.method === '면제' ? '면제' : '납부') : billed ? '미납' : '-') + '</b></div>' +
        '<div><small>새 알림장</small><b class="' + (unread ? 'bad' : '') + '">' + unread + '개</b></div></div></div>';

      if (openEvents.length) {
        h += '<section class="section"><div class="section-head"><h2>신청 받는 중</h2></div><div class="stack">' + openEvents.slice(0, 2).map(function (e) { return eventCard(e, s); }).join('') + '</div></section>';
      }
      h += '<section class="section"><div class="section-head"><h2>알림장</h2><button class="link-btn" type="button" data-act="tab" data-v="notices">모두 보기</button></div><div class="stack">' +
        (notices.length ? notices.map(function (n) { return noticeCard(n, s); }).join('') : '<div class="card">' + UI.empty('아직 받은 알림장이 없어요') + '</div>') + '</div></section>';
      h += '<section class="section"><div class="section-head"><h2>출석 달력</h2></div><div class="card pad">' + Parts.attCalendar(s, ps.calYm) + '</div></section>';
      if (billed) {
        h += '<section class="section"><div class="section-head"><h2>' + esc(U.fmtM(ym)) + ' 회비 안내</h2></div><div class="card pad stack">' +
          '<p>' + esc(U.fmtM(ym)) + ' 회비 <b class="num">' + esc(U.won(DB.feeOf(s))) + '</b>이(가) 아직 확인되지 않았어요.</p>' + accountLine() +
          '<p class="fine">입금하셨다면 관장님이 확인한 뒤 "납부"로 바뀌어요.</p></div></section>';
      }
      el.innerHTML = h;
      UI.bind(el, {
        tab: function (b) { App.nav(b.getAttribute('data-v')); },
        notice: function (b) { App.go('notices', { id: b.getAttribute('data-id') }); },
        event: function (b) { App.go('events', { id: b.getAttribute('data-id') }); },
        'cal-prev': function () { ps.calYm = U.addMonths(ps.calYm, -1); App.refresh(); },
        'cal-next': function () { ps.calYm = U.addMonths(ps.calYm, 1); App.refresh(); },
        'copy-acc': copyAcc,
        install: function () { App.install(); },
        'push-on': function () { Cloud.pushToggle(true); },
        'hide-setup': function () { DB.device.hideSetup = true; DB.saveDevice(); App.refresh(); }
      });
    }
  };

  // ---------- 알림장 ----------
  Views.parent.notices = {
    render: function (el, params) {
      var s = kid();
      var n = params.id && DB.byId('notices', params.id);
      if (n && DB.noticeVisible(n, s)) { detail(el, n, s); return; }
      var list = DB.noticesFor(s);
      var h = '<div class="section-head"><h2 style="font-size:20px">알림장</h2><span class="sub">' + DB.unreadFor(s) + '개 안 읽음</span></div><div class="stack">' +
        (list.length ? list.map(function (x) { return noticeCard(x, s); }).join('') : '<div class="card">' + UI.empty('아직 받은 알림장이 없어요', '관장님이 보내는 공지와 우리 아이 소식이 여기에 와요.') + '</div>') + '</div>';
      el.innerHTML = h;
      UI.bind(el, { notice: function (b) { App.go('notices', { id: b.getAttribute('data-id') }); } });
    }
  };

  function detail(el, n, s) {
    if (!preview() && !(n.reads && n.reads[s.id])) {
      n.reads = n.reads || {};
      n.reads[s.id] = Date.now();
      DB.save();
      App.updateShell();
    }
    var mine = (n.replies || []).filter(function (r) { return r.studentId === s.id; }).sort(function (a, b) { return a.at - b.at; });
    var h = '<div>' + UI.backLink('알림장') + '<div class="n-meta" style="margin-bottom:6px">' + (n.pinned ? UI.pill('중요', 'accent') : '') + '<span>' + esc(DB.settings().dojangName + ' · ' + U.fmtStamp(n.createdAt)) + '</span></div>' +
      '<h1 style="font-family:var(--f-display);font-size:22px">' + esc(n.title) + '</h1></div>';
    h += '<div class="card pad stack"><div class="n-full">' + esc(n.body) + '</div>' + (n.image ? '<img class="n-img" src="' + esc(n.image) + '" alt="첨부 사진">' : '') + '</div>';
    h += '<section class="section"><div class="section-head"><h2>관장님께 답글</h2></div><div class="card pad stack">';
    if (mine.length) {
      h += '<div>' + mine.map(function (r) {
        return '<div class="reply"><div class="bubble"><div class="who">나 <small>' + esc(U.fmtStamp(r.at)) + '</small>' + (r.seen ? '<small>· 관장님 확인</small>' : '') + '</div><p>' + esc(r.body) + '</p></div></div>';
      }).join('') + '</div>';
    }
    h += '<div class="chips">' + ['확인했습니다', '감사합니다', '오늘 결석합니다'].map(function (q) { return '<button type="button" class="chip" data-act="quick" data-v="' + esc(q) + '">' + esc(q) + '</button>'; }).join('') + '</div>' +
      '<textarea class="input" id="replyBody" placeholder="관장님께 전할 말을 적어 주세요" style="min-height:90px"></textarea>' +
      '<div><button class="btn primary" type="button" data-act="send">' + UI.icon('send') + '답글 보내기</button></div></div></section>';
    el.innerHTML = h;
    function send(text) {
      text = (text || '').trim();
      if (!text) { UI.toast('내용을 입력해 주세요'); return; }
      n.replies = n.replies || [];
      n.replies.push({ id: U.uid(), studentId: s.id, body: text, at: Date.now(), seen: false });
      DB.save();
      App.refresh();
      UI.toast('관장님께 답글을 보냈어요');
    }
    UI.bind(el, {
      back: function () { App.back(); },
      quick: function (b) { send(b.getAttribute('data-v')); },
      send: function () { send(el.querySelector('#replyBody').value); }
    });
  }

  // ---------- 참가신청 ----------
  Views.parent.events = {
    render: function (el, params) {
      var s = kid(), today = U.today();
      var ev = params.id && DB.byId('events', params.id);
      if (ev) { eventDetail(el, ev, s); return; }
      var all = visibleEvents(s);
      var upcoming = all.filter(function (e) { return e.date >= today; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; });
      var past = all.filter(function (e) { return e.date < today; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 6);
      var h = '<div class="section-head"><h2 style="font-size:20px">참가신청</h2><span class="sub">대회 · 승급심사 · 캠프</span></div>' +
        '<div class="stack">' + (upcoming.length ? upcoming.map(function (e) { return eventCard(e, s); }).join('') : '<div class="card">' + UI.empty('지금 신청할 수 있는 행사가 없어요', '새 행사가 열리면 알림장으로도 알려 드려요.') + '</div>') + '</div>';
      if (past.length) h += '<section class="section"><div class="section-head"><h2>지난 행사</h2></div><div class="stack">' + past.map(function (e) { return eventCard(e, s); }).join('') + '</div></section>';
      el.innerHTML = h;
      UI.bind(el, { event: function (b) { App.go('events', { id: b.getAttribute('data-id') }); } });
    }
  };

  function eventDetail(el, ev, s) {
    var a = DB.appOf(ev.id, s.id), open = DB.eventOpen(ev) && ev.date >= U.today();
    var h = '<div>' + UI.backLink('참가신청') + '<div class="hstack" style="margin-bottom:6px">' + UI.pill(ev.kind, ev.kind === '대회' ? 'info' : 'accent') + '</div>' +
      '<h1 style="font-family:var(--f-display);font-size:22px">' + esc(ev.title) + '</h1></div>';
    h += '<div class="card pad stack">' + Parts.eventInfo(ev) + '</div>';

    if (a) {
      var paid = !!a.paymentId;
      h += '<section class="section"><div class="section-head"><h2>' + esc(s.name) + ' 신청 내역</h2>' + UI.pill(a.status === '확정' ? '참가 확정' : '신청 완료', 'good') + '</div><div class="card pad stack"><dl class="kv">' +
        (ev.choiceLabel ? '<dt>' + esc(ev.choiceLabel) + '</dt><dd>' + esc(a.choice || '-') + '</dd>' : '') +
        (ev.askLabel ? '<dt>' + esc(ev.askLabel) + '</dt><dd>' + esc(a.answer || '-') + '</dd>' : '') +
        (a.memo ? '<dt>메모</dt><dd>' + esc(a.memo) + '</dd>' : '') +
        '<dt>신청일</dt><dd>' + esc(U.fmtStamp(a.submittedAt)) + '</dd>' +
        (ev.fee ? '<dt>참가비</dt><dd>' + UI.pill(paid ? '납부 확인' : '입금 전', paid ? 'good' : 'bad') + ' <span class="num">' + esc(U.won(ev.fee)) + '</span></dd>' : '') +
        '</dl>' + (ev.fee && !paid ? accountLine() : '') +
        (open && a.status === '접수' && !paid ? '<div><button class="btn danger" type="button" data-act="cancel">신청 취소</button></div>' : '') +
        '</div></section>';
    } else if (open) {
      var g = (s.guardians || [])[0];
      h += '<section class="section"><div class="section-head"><h2>참가신청서</h2><span class="sub">' + esc(U.dueLabel(ev.deadline)) + '</span></div><div class="card pad stack">' +
        '<div class="field"><span class="label">참가자</span><div class="hstack">' + UI.av(s, 'sm') + '<b>' + esc(s.name) + '</b><span class="small muted">' + esc(UI.studentSub(s)) + '</span></div></div>' +
        (ev.choices && ev.choices.length ? '<div class="field"><span class="label">' + esc(ev.choiceLabel || '선택') + ' *</span><div class="radio-list">' +
          ev.choices.map(function (c, i) { return '<label><input type="radio" name="evChoice" value="' + esc(c) + '" id="evChoice' + i + '">' + esc(c) + '</label>'; }).join('') + '</div></div>' : '') +
        (ev.askLabel ? '<div class="field"><label for="evAnswer">' + esc(ev.askLabel) + '</label><input class="input" id="evAnswer"></div>' : '') +
        '<div class="field"><label for="evMemo">전하실 말씀 (선택)</label><textarea class="input" id="evMemo" style="min-height:72px" placeholder="알레르기, 이동 방법 등"></textarea></div>' +
        '<div class="field"><label for="evGuardian">보호자 성함 *</label><input class="input" id="evGuardian" value="' + esc(g ? g.name : '') + '"></div>' +
        '<div class="consent-box"><label class="check"><input type="checkbox" id="evAgreePriv"><span><b>[필수]</b> 개인정보 수집·이용에 동의합니다</span></label>' + Parts.consentTable(ev) +
        '<p class="small muted">동의하지 않을 수 있지만, 동의하지 않으면 참가 신청을 할 수 없어요.</p></div>' +
        (ev.thirdParty ? '<div class="consent-box"><label class="check"><input type="checkbox" id="evAgree3"><span><b>[필수]</b> 개인정보 제3자 제공에 동의합니다</span></label>' + Parts.thirdPartyTable(ev.thirdParty) +
          '<p class="small muted">동의하지 않을 수 있지만, 동의하지 않으면 주최 측 접수가 어려워 참가할 수 없어요.</p></div>' : '') +
        '<div class="consent-box"><label class="check"><input type="checkbox" id="evAgree"><span><b>[필수]</b> 행사 안내를 확인했고 참가에 동의합니다</span></label><div class="consent">' + esc(ev.consent || '') + '</div></div>' +
        '<button class="link-btn" type="button" data-act="privacy" style="align-self:flex-start">개인정보 처리방침 전체 보기</button>' +
        '<div class="field"><span class="label">보호자 서명 *</span><div class="sig" id="evSig"><canvas></canvas><span class="ph">여기에 손가락으로 서명해 주세요</span><button type="button" class="btn sm clear" data-act="sig-clear">다시 쓰기</button></div></div>' +
        (ev.fee ? '<p class="soft">참가비 <b class="num">' + esc(U.won(ev.fee)) + '</b>은(는) 신청 후 아래 계좌로 보내 주세요.</p>' + accountLine() : '') +
        '<button class="btn primary lg block" type="button" data-act="submit">' + UI.icon('send') + '참가신청서 제출</button>' +
        '</div></section>';
    } else {
      h += '<div class="card">' + UI.empty('신청이 마감된 행사예요', '궁금한 점은 알림장 답글로 관장님께 물어봐 주세요.') + '</div>';
    }
    el.innerHTML = h;

    var pad = null, sigEl = el.querySelector('#evSig');
    if (sigEl) pad = UI.signaturePad(sigEl);
    UI.bind(el, {
      back: function () { App.back(); },
      'copy-acc': copyAcc,
      'sig-clear': function () { if (pad) pad.clear(); },
      privacy: function () { Parts.openPrivacy(); },
      cancel: function () {
        UI.confirm({ title: '신청 취소', message: ev.title + ' 신청을 취소할까요?', ok: '신청 취소', danger: true }).then(function (ok) {
          if (!ok) return;
          a.status = '취소';
          a.seen = false;
          DB.save();
          App.refresh();
          UI.toast('신청을 취소했어요');
        });
      },
      submit: function () {
        var choiceEl = el.querySelector('input[name="evChoice"]:checked');
        if (ev.choices && ev.choices.length && !choiceEl) { UI.toast((ev.choiceLabel || '선택 항목') + '을(를) 골라 주세요'); return; }
        var guardian = el.querySelector('#evGuardian').value.trim();
        if (!guardian) { UI.toast('보호자 성함을 적어 주세요'); el.querySelector('#evGuardian').focus(); return; }
        if (!el.querySelector('#evAgreePriv').checked) { UI.toast('개인정보 수집·이용 동의에 체크해 주세요'); return; }
        var third = el.querySelector('#evAgree3');
        if (third && !third.checked) { UI.toast('개인정보 제3자 제공 동의에 체크해 주세요'); return; }
        if (!el.querySelector('#evAgree').checked) { UI.toast('참가 동의에 체크해 주세요'); return; }
        var now = Date.now();
        if (!pad || pad.isEmpty()) { UI.toast('보호자 서명을 해 주세요'); return; }
        var ans = el.querySelector('#evAnswer');
        DB.upsert('applications', {
          id: U.uid(), eventId: ev.id, studentId: s.id,
          choice: choiceEl ? choiceEl.value : '', answer: ans ? ans.value.trim() : '',
          memo: el.querySelector('#evMemo').value.trim(), guardianName: guardian, agreed: true,
          signature: pad.toDataURL(), submittedAt: now, status: '접수', paymentId: null, seen: false, by: 'parent',
          consents: { privacy: now, third: third ? now : null, event: now }
        });
        App.refresh();
        window.scrollTo(0, 0);
        UI.toast('참가신청서를 냈어요');
      }
    });
  }

  // ---------- 성장기록 ----------
  Views.parent.records = {
    render: function (el, params) {
      var s = kid();
      if (params.exam) {
        var x = DB.byId('exams', params.exam);
        if (x && x.studentId === s.id) {
          el.innerHTML = '<div>' + UI.backLink('성장기록') + '</div>' + Parts.certificate(x, s, false) +
            '<button class="btn primary lg block" type="button" data-act="share">' + UI.icon('download') + '결과증 이미지로 저장</button>';
          UI.bind(el, { back: function () { App.back(); }, share: function () { Parts.shareCertificate(x, s); } });
          return;
        }
      }
      if (!ps.calYm) ps.calYm = U.ym();
      var tabs = [['att', '출석'], ['fit', '체력'], ['exam', '승급심사'], ['fee', '회비']];
      var h = '<div class="section-head"><h2 style="font-size:20px">성장기록</h2></div><div class="seg">' +
        tabs.map(function (t) { return '<button type="button" data-act="rtab" data-v="' + t[0] + '" class="' + (ps.recTab === t[0] ? 'on' : '') + '">' + t[1] + '</button>'; }).join('') + '</div>';
      if (ps.recTab === 'att') {
        var today = U.today();
        h += '<div class="card pad">' + Parts.attCalendar(s, ps.calYm) + '</div>';
        h += '<div class="mini-stats"><div><small>최근 4주</small><b>' + DB.countAtt(s.id, U.addDays(today, -27), today) + '회</b></div>' +
          '<div><small>지난달</small><b>' + DB.countAtt(s.id, U.addMonths(U.ym(), -1) + '-01', U.monthEnd(U.addMonths(U.ym(), -1))) + '회</b></div>' +
          '<div><small>입관 후</small><b>' + DB.countAtt(s.id, s.joinDate || '2000-01-01', today) + '회</b></div></div>';
      } else if (ps.recTab === 'fit') {
        h += Parts.fitnessReport(s, { parent: true });
      } else if (ps.recTab === 'exam') {
        h += '<div class="card list">' + Parts.examList(s, false) + '</div>';
      } else {
        h += '<div class="card list">' + Parts.feeHistory(s, 12) + '</div>' + (DB.settings().account ? '<div class="card pad stack"><span class="small soft">회비 입금 계좌</span>' + accountLine() + '</div>' : '');
      }
      el.innerHTML = h;
      UI.bind(el, {
        rtab: function (b) { ps.recTab = b.getAttribute('data-v'); App.refresh(); },
        'cal-prev': function () { ps.calYm = U.addMonths(ps.calYm, -1); App.refresh(); },
        'cal-next': function () { ps.calYm = U.addMonths(ps.calYm, 1); App.refresh(); },
        exam: function (b) { App.go('records', { exam: b.getAttribute('data-id') }); },
        'copy-acc': copyAcc
      });
    }
  };

  Views.parent.reset = function () { ps.calYm = null; ps.recTab = 'att'; };
})();
