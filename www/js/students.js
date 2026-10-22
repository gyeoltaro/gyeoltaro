/* 원생 관리: 목록, 상세, 등록·수정 */
(function () {
  'use strict';
  var esc = U.esc;
  var ls = { q: '', cls: 'all', status: 'active', sort: 'class' };
  var calYm = {};

  function sortList(list) {
    if (ls.sort === 'name') return list.slice().sort(U.byName);
    if (ls.sort === 'grade') return list.slice().sort(function (a, b) { return DB.GRADES.indexOf(b.grade) - DB.GRADES.indexOf(a.grade) || U.byName(a, b); });
    return DB.sortStudents(list);
  }

  function renderList(el) {
    var all = DB.state.students.filter(function (s) { return !s.purged; }), ym = U.ym();
    var counts = { active: 0, paused: 0, left: 0 };
    all.forEach(function (s) { counts[s.status] = (counts[s.status] || 0) + 1; });
    var q = ls.q.trim(), qd = U.digits(q);
    var list = all.filter(function (s) {
      if (s.status !== ls.status) return false;
      if (ls.cls !== 'all' && s.className !== ls.cls) return false;
      if (!q) return true;
      if (s.name.indexOf(q) >= 0) return true;
      if (qd && (s.pin === qd || (s.guardians || []).some(function (g) { return U.digits(g.phone).indexOf(qd) >= 0; }))) return true;
      return (s.guardians || []).some(function (g) { return g.name && g.name.indexOf(q) >= 0; });
    });
    list = sortList(list);
    var mc = DB.monthCounts(ym), fm = DB.feeMap(ym);
    var classes = DB.settings().classes;

    var h = '<header class="page-head"><div><span class="eyebrow">재원 ' + counts.active + '명 · 휴원 ' + counts.paused + '명</span><h1>원생</h1></div>' +
      '<div class="actions"><button class="btn primary" type="button" data-act="add">' + UI.icon('plus') + '원생 등록</button></div></header>';
    h += '<div class="toolbar"><div class="search grow">' + UI.icon('search') + '<input class="input" type="search" id="stuSearch" placeholder="이름, 출석번호, 보호자 연락처로 찾기" value="' + esc(ls.q) + '"></div>' +
      '<div class="seg" role="tablist">' + [['active', '재원'], ['paused', '휴원'], ['left', '퇴원']].map(function (x) {
        return '<button type="button" data-act="status" data-v="' + x[0] + '" class="' + (ls.status === x[0] ? 'on' : '') + '">' + x[1] + '<span class="ct">' + (counts[x[0]] || 0) + '</span></button>';
      }).join('') + '</div>' +
      '<select class="input sm" id="stuSort" style="width:auto">' + UI.options([{ value: 'class', label: '반 순서' }, { value: 'name', label: '이름 순서' }, { value: 'grade', label: '급수 높은 순' }], ls.sort) + '</select></div>';
    h += '<div class="chips scroll"><button type="button" class="chip' + (ls.cls === 'all' ? ' on' : '') + '" data-act="cls" data-v="all">전체 반</button>' +
      classes.map(function (c) {
        var n = all.filter(function (s) { return s.status === ls.status && s.className === c; }).length;
        return '<button type="button" class="chip' + (ls.cls === c ? ' on' : '') + '" data-act="cls" data-v="' + esc(c) + '">' + esc(c) + '<span class="ct">' + n + '</span></button>';
      }).join('') + '</div>';

    h += '<div class="card list" id="stuList">';
    if (!list.length) {
      h += all.length ? UI.empty('조건에 맞는 원생이 없어요', '검색어나 반 선택을 바꿔 보세요.')
        : UI.empty('등록된 원생이 없어요', '첫 원생을 등록하면 출석번호가 자동으로 만들어져요.', '<button class="btn primary" type="button" data-act="add">' + UI.icon('plus') + '원생 등록</button>');
    }
    list.forEach(function (s) {
      var unpaid = s.status === 'active' && !fm[s.id] && (!s.joinDate || s.joinDate <= U.monthEnd(ym));
      var noConsent = s.status !== 'left' && !DB.hasConsent(s);
      h += '<button class="row" type="button" data-act="open" data-id="' + esc(s.id) + '">' + UI.av(s) +
        '<span class="main"><span class="title">' + esc(s.name) + ' ' + UI.statusPill(s) + (noConsent ? UI.pill('동의 전', 'warn') : '') + (unpaid ? UI.pill('회비 미납', 'bad') : '') + '</span>' +
        '<span class="sub">' + esc(UI.studentSub(s)) + (s.status === 'left' && s.leftAt ? ' · 퇴원 ' + esc(U.fmtDate(s.leftAt)) : ' · 번호 <span class="mono">' + esc(s.pin || '----') + '</span>') + '</span></span>' +
        '<span class="side"><span class="hide-sm">' + UI.belt(s.grade) + '</span><span class="small muted num">이번 달 ' + (mc[s.id] || 0) + '회</span></span></button>';
    });
    h += '</div>';
    el.innerHTML = h;

    var search = el.querySelector('#stuSearch');
    search.addEventListener('input', U.debounce(function () {
      ls.q = search.value;
      var pos = search.selectionStart;
      renderList(el);
      var s2 = el.querySelector('#stuSearch');
      s2.focus();
      try { s2.setSelectionRange(pos, pos); } catch (e) {}
    }, 200));
    el.querySelector('#stuSort').addEventListener('change', function (e) { ls.sort = e.target.value; renderList(el); });
    UI.bind(el, {
      add: function () { openForm(null); },
      status: function (b) { ls.status = b.getAttribute('data-v'); renderList(el); },
      cls: function (b) { ls.cls = b.getAttribute('data-v'); renderList(el); },
      open: function (b) { App.go('students', { id: b.getAttribute('data-id') }); }
    });
  }

  // 서버 모드: 초대 코드로 연결된 학부모 기기
  function parentAppRow(s) {
    var list = Cloud.parentsOf(s.id);
    var waiting = (DB.state.invites || []).filter(function (i) { return !i.usedBy && i.expiresAt > Date.now() && i.studentIds.indexOf(s.id) >= 0; });
    return (list.length ? UI.pill('기기 ' + list.length + '대 연결', 'good') : UI.pill('연결 안 됨', '')) +
      (waiting.length ? ' ' + UI.pill('초대 코드 ' + waiting.length + '개 대기', 'info') : '') +
      ' <button class="link-btn" type="button" data-act="invite">초대 코드 보내기</button>' +
      list.map(function (p) {
        return '<div class="small soft" style="margin-top:4px">' + esc(U.fmtPhone(p.phone) || '보호자') + ' · ' + esc(U.fmtDate(U.ymd(new Date(p.createdAt)))) + ' 연결 ' +
          '<button class="link-btn" type="button" data-act="unlink" data-id="' + esc(p.id) + '">연결 끊기</button></div>';
      }).join('');
  }

  function renderDetail(el, s) {
    var today = U.today();
    var ym = calYm[s.id] || U.ym();
    var monthsIn = s.joinDate ? Math.max(0, (U.parse(today).getFullYear() - U.parse(s.joinDate).getFullYear()) * 12 + U.parse(today).getMonth() - U.parse(s.joinDate).getMonth()) : null;
    var age = U.age(s.birth);
    var h = '';
    h += '<div>' + UI.backLink('원생 목록') +
      '<header class="page-head"><div class="hstack" style="gap:16px">' + UI.av(s, 'lg') +
      '<div><h1>' + esc(s.name) + ' ' + UI.statusPill(s) + '</h1><div class="hstack small soft">' + UI.belt(s.grade) + '<span>' + esc(UI.studentSub(s)) + '</span></div></div></div>' +
      '<div class="actions"><button class="btn" type="button" data-act="preview">' + UI.icon('user') + '학부모 화면 보기</button>' +
      '<button class="btn primary" type="button" data-act="edit">' + UI.icon('edit') + '정보 수정</button></div></header></div>';

    h += '<div class="card pad"><dl class="kv">' +
      '<dt>출석번호</dt><dd><b class="mono" style="font-size:17px;letter-spacing:.1em">' + esc(s.pin || '----') + '</b> <button class="link-btn" type="button" data-act="repin">새 번호 만들기</button></dd>' +
      '<dt>생년월일</dt><dd>' + esc(s.birth ? U.fmtDate(s.birth) + ' (만 ' + age + '세 · ' + U.schoolYear(s.birth) + ')' : '-') + '</dd>' +
      '<dt>학교</dt><dd>' + esc(s.school || '-') + '</dd>' +
      '<dt>반</dt><dd>' + esc(s.className || '-') + '</dd>' +
      '<dt>입관일</dt><dd>' + esc(s.joinDate ? U.fmtDate(s.joinDate) + ' (' + (monthsIn + 1) + '개월째)' : '-') + '</dd>' +
      (s.status === 'left' && s.leftAt ? '<dt>퇴원일</dt><dd>' + esc(U.fmtDate(s.leftAt)) + ' <span class="small muted">(1년이 지나면 개인정보를 정리해요)</span></dd>' : '') +
      '<dt>보호자 동의</dt><dd>' + UI.pill(Parts.consentLabel(s).text, Parts.consentLabel(s).tone) + ' ' +
        (DB.hasConsent(s) ? '<button class="link-btn" type="button" data-act="consent-view">동의서 보기</button>' + (s.consent.by === 'app' && !s.consent.smsSentAt ? ' · <button class="link-btn" type="button" data-act="consent-sms">확인 문자 보내기</button>' : '')
          : '<button class="link-btn" type="button" data-act="consent-take">지금 이 기기에서 받기</button>') +
        (DB.hasConsent(s) ? '<div class="small soft" style="margin-top:4px">' + Parts.consentSummary(s) + '</div>' : '') + '</dd>' +
      (window.Cloud && Cloud.enabled ? '<dt>학부모 앱</dt><dd>' + parentAppRow(s) + '</dd>' : '') +
      '<dt>월 회비</dt><dd>' + esc(U.won(DB.feeOf(s))) + (s.fee != null && s.fee !== '' ? ' <span class="small muted">(개별 금액)</span>' : '') + '</dd>' +
      '<dt>보호자</dt><dd>' + ((s.guardians || []).length ? s.guardians.map(function (g) {
        return '<div>' + esc(g.name || '-') + ' <span class="muted small">' + esc(g.relation || '') + '</span> <span class="mono">' + esc(U.fmtPhone(g.phone)) + '</span></div>';
      }).join('') : '-') + '</dd>' +
      (s.memo ? '<dt>메모</dt><dd style="white-space:pre-wrap">' + esc(s.memo) + '</dd>' : '') +
      '</dl></div>';

    h += '<div class="cols">';
    h += '<section class="section"><div class="section-head"><h2>출석</h2><span class="sub">최근 4주 ' + DB.countAtt(s.id, U.addDays(today, -27), today) + '회</span></div>' +
      '<div class="card pad">' + Parts.attCalendar(s, ym) + '</div></section>';
    h += '<section class="section"><div class="section-head"><h2>회비</h2><button class="link-btn" type="button" data-act="fees">회비장부</button></div>' +
      '<div class="card list">' + Parts.feeHistory(s, 6) + '</div></section>';
    h += '</div>';
    h += '<section class="section"><div class="section-head"><h2>체력측정</h2></div>' + Parts.fitnessReport(s) + '</section>';
    h += '<div class="cols">';
    h += '<section class="section"><div class="section-head"><h2>승급심사</h2></div><div class="card list">' + Parts.examList(s, true) + '</div></section>';
    h += '<section class="section"><div class="section-head"><h2>참가신청</h2></div><div class="card list">' + Parts.appList(s, true) + '</div></section>';
    h += '</div>';
    el.innerHTML = h;

    UI.bind(el, {
      back: function () { App.back(); },
      edit: function () { openForm(s); },
      'consent-view': function () { Parts.viewConsent(s); },
      'consent-sms': function () { Parts.smsPendingModal(); },
      'consent-take': function () { Parts.openConsentForm(s); },
      invite: function () { Cloud.inviteModal(s); },
      unlink: function (b) {
        UI.confirm({ title: '학부모 기기 연결 끊기', message: '이 기기에서 더 이상 학부모 앱을 볼 수 없게 할까요?\n다시 연결하려면 새 초대 코드가 필요해요.', ok: '연결 끊기', danger: true }).then(function (ok) {
          if (!ok) return;
          Cloud.unlinkParent(b.getAttribute('data-id'));
          App.refresh();
          UI.toast('연결을 끊었어요');
        });
      },
      preview: function () { App.previewParent(s); },
      fees: function () { App.nav('fees'); },
      repin: function () {
        UI.confirm({ title: '새 출석번호', message: s.name + ' 원생의 출석번호를 새로 만들까요?\n지금 번호(' + s.pin + ')는 더 이상 쓸 수 없어요.', ok: '새 번호 만들기' }).then(function (ok) {
          if (!ok) return;
          s.pin = DB.newPin();
          DB.upsert('students', s);
          App.refresh();
          UI.toast('새 출석번호는 ' + s.pin + ' 이에요. 아이에게 알려 주세요.');
        });
      },
      'cal-prev': function () { calYm[s.id] = U.addMonths(ym, -1); App.refresh(); },
      'cal-next': function () { calYm[s.id] = U.addMonths(ym, 1); App.refresh(); },
      exam: function (b) { App.go('exams', { id: b.getAttribute('data-id') }); },
      'event-open': function (b) { App.go('events', { id: b.getAttribute('data-id') }); }
    });
  }

  // ---------- 등록·수정 ----------
  function guardianFields(n, g) {
    g = g || {};
    return '<div class="full form-title">보호자 ' + n + (n === 1 ? ' (학부모 로그인에 쓰는 번호)' : '') + '</div>' +
      '<div class="field"><label for="fG' + n + 'n">이름</label><input class="input" id="fG' + n + 'n" value="' + esc(g.name || '') + '"></div>' +
      '<div class="field"><label for="fG' + n + 'r">관계</label><select class="input" id="fG' + n + 'r">' + UI.options(['어머니', '아버지', '조부모', '보호자'], g.relation || (n === 1 ? '어머니' : '아버지')) + '</select></div>' +
      '<div class="field full"><label for="fG' + n + 'p">휴대폰 번호</label><input class="input" id="fG' + n + 'p" type="tel" inputmode="numeric" placeholder="010-0000-0000" value="' + esc(U.fmtPhone(g.phone || '')) + '"></div>';
  }

  function openForm(s) {
    var isNew = !s;
    var st = DB.settings();
    var d = s ? JSON.parse(JSON.stringify(s)) : {
      name: '', gender: '', birth: '', school: '', grade: '9급', className: st.classes[0] || '', pin: DB.newPin(),
      guardians: [], joinDate: U.today(), status: 'active', fee: null, memo: '', photo: null
    };
    var photo = d.photo;
    var html =
      '<div class="hstack" style="gap:14px"><span data-photo>' + UI.av(d, 'lg') + '</span>' +
      '<div class="stack sm"><div class="hstack"><button class="btn sm" type="button" data-pick' + (DB.photoAllowed(s) ? '' : ' disabled') + '>' + UI.icon('camera') + '사진 선택</button>' +
      '<button class="btn sm quiet" type="button" data-unphoto' + (photo ? '' : ' hidden') + '>사진 삭제</button></div>' +
      (DB.photoAllowed(s) ? '' : '<span class="small muted">보호자가 사진 촬영·이용에 동의하면 올릴 수 있어요.</span>') + '</div>' +
      '<input type="file" accept="image/*" hidden data-file></div>' +
      '<div class="form-grid">' +
      '<div class="field"><label for="fName">이름 *</label><input class="input" id="fName" value="' + esc(d.name) + '" autofocus></div>' +
      '<div class="field"><label for="fGender">성별</label><select class="input" id="fGender">' + UI.options([{ value: '', label: '선택 안 함' }, { value: 'M', label: '남' }, { value: 'F', label: '여' }], d.gender) + '</select></div>' +
      '<div class="field"><label for="fBirth">생년월일</label><input class="input" id="fBirth" type="date" value="' + esc(d.birth) + '"></div>' +
      '<div class="field"><label for="fSchool">학교</label><input class="input" id="fSchool" value="' + esc(d.school) + '" placeholder="예: 햇살초"></div>' +
      '<div class="field"><label for="fGrade">급수</label><select class="input" id="fGrade">' + UI.options(DB.GRADES, d.grade, function (g) { return g + ' · ' + DB.beltOf(g); }) + '</select></div>' +
      '<div class="field"><label for="fClass">반 (수련 시간)</label><select class="input" id="fClass">' + UI.options(st.classes.indexOf(d.className) >= 0 || !d.className ? st.classes : st.classes.concat([d.className]), d.className) + '</select></div>' +
      '<div class="field"><label for="fPin">출석번호 (4자리)</label><div class="hstack" style="flex-wrap:nowrap"><input class="input mono" id="fPin" inputmode="numeric" maxlength="4" value="' + esc(d.pin) + '" style="letter-spacing:.2em">' +
      '<button class="btn sm" type="button" data-newpin>자동</button></div><span class="err" data-pinerr></span></div>' +
      '<div class="field"><label for="fJoin">입관일</label><input class="input" id="fJoin" type="date" value="' + esc(d.joinDate) + '"></div>' +
      '<div class="field"><label for="fFee">월 회비 (원)</label><input class="input" id="fFee" inputmode="numeric" value="' + esc(d.fee != null ? d.fee : '') + '" placeholder="' + esc(U.n(st.monthlyFee)) + '"><span class="hint">비워 두면 기본 회비로 계산해요. 형제 할인 등은 여기에 적어 주세요.</span></div>' +
      '<div class="field"><label for="fStatus">상태</label><select class="input" id="fStatus">' + UI.options([{ value: 'active', label: '재원' }, { value: 'paused', label: '휴원' }, { value: 'left', label: '퇴원' }], d.status) + '</select></div>' +
      guardianFields(1, d.guardians[0]) + guardianFields(2, d.guardians[1]) +
      '<div class="field full"><label for="fMemo">메모</label><textarea class="input" id="fMemo" placeholder="차량, 주의할 점 등">' + esc(d.memo) + '</textarea>' +
      '<span class="hint">' + (s && s.consent && s.consent.health ? '보호자가 건강 정보 처리에 동의했어요. 알레르기 등 안전에 필요한 내용만 적어 주세요.' : '알레르기·질환 같은 건강 정보는 보호자가 건강 정보 처리에 동의한 경우에만 적어 주세요.') + '</span></div>' +
      '</div>';

    var actions = [];
    if (!isNew) actions.push({ label: '삭제', kind: 'danger', left: true, onClick: function () { removeStudent(s); } });
    actions.push({ label: '취소', kind: 'quiet' });
    actions.push({
      label: isNew ? '등록' : '저장', kind: 'primary', onClick: function (root) {
        var v = function (id) { return root.querySelector('#' + id).value.trim(); };
        var name = v('fName');
        if (!name) { root.querySelector('#fName').focus(); UI.toast('이름을 입력해 주세요'); return false; }
        var pin = U.digits(v('fPin'));
        var pinErr = root.querySelector('[data-pinerr]');
        if (pin.length !== 4) { pinErr.textContent = '숫자 4자리로 입력해 주세요'; return false; }
        if (DB.pinTaken(pin, s && s.id)) { pinErr.textContent = '다른 원생이 쓰는 번호예요'; return false; }
        var guardians = [];
        [1, 2].forEach(function (n) {
          var gn = v('fG' + n + 'n'), gp = U.digits(v('fG' + n + 'p'));
          if (gn || gp) guardians.push({ name: gn, relation: v('fG' + n + 'r'), phone: gp });
        });
        var fee = U.digits(v('fFee'));
        var obj = s || { id: U.uid(), createdAt: Date.now() };
        var prevStatus = s ? s.status : null;
        obj.name = name;
        obj.gender = v('fGender');
        obj.birth = v('fBirth');
        obj.school = v('fSchool');
        obj.grade = v('fGrade');
        obj.className = v('fClass');
        obj.pin = pin;
        obj.joinDate = v('fJoin');
        obj.fee = fee === '' ? null : +fee;
        obj.status = v('fStatus');
        if (obj.status === 'left' && prevStatus !== 'left') obj.leftAt = U.today();
        if (obj.status !== 'left') delete obj.leftAt;
        obj.guardians = guardians;
        obj.memo = root.querySelector('#fMemo').value.trim();
        if (obj.consent && obj.consent.healthWithdrawnAt) obj.consent.healthAck = Date.now();
        obj.photo = photo || null;
        if (window.Cloud && Cloud.enabled) Cloud.linkSiblings(obj);
        DB.upsert('students', obj);
        if (isNew) {
          UI.toast(name + ' 원생을 등록했어요. 출석번호는 ' + pin + ' 이에요.');
          App.go('students', { id: obj.id });
          UI.confirm({ title: '보호자 동의 받기', message: '보호자가 옆에 계시면 지금 이 기기에서 동의서를 받을 수 있어요.\n나중에 받거나 학부모 앱으로 받을 수도 있어요.', ok: '지금 받기', cancel: '나중에' })
            .then(function (ok) { if (ok) Parts.openConsentForm(obj); });
        } else {
          UI.toast('저장했어요');
          App.refresh();
        }
      }
    });

    UI.modal({
      title: isNew ? '원생 등록' : '원생 정보 수정', wide: true, html: html, actions: actions,
      onMount: function (root) {
        var file = root.querySelector('[data-file]');
        function paintPhoto() {
          var tmp = { name: root.querySelector('#fName').value || d.name, grade: root.querySelector('#fGrade').value, photo: photo };
          root.querySelector('[data-photo]').innerHTML = UI.av(tmp, 'lg');
          root.querySelector('[data-unphoto]').hidden = !photo;
        }
        root.querySelector('[data-pick]').onclick = function () { file.click(); };
        root.querySelector('[data-unphoto]').onclick = function () { photo = null; paintPhoto(); };
        file.onchange = function () {
          var f = file.files && file.files[0];
          file.value = '';
          if (!f) return;
          U.readImage(f, 240, 0.82).then(function (url) { photo = url; paintPhoto(); }, function (e) { UI.toast(e.message); });
        };
        root.querySelector('#fGrade').onchange = paintPhoto;
        root.querySelector('[data-newpin]').onclick = function () {
          root.querySelector('#fPin').value = DB.newPin();
          root.querySelector('[data-pinerr]').textContent = '';
        };
        root.querySelector('#fPin').oninput = function () { root.querySelector('[data-pinerr]').textContent = ''; };
      }
    });
  }

  function removeStudent(s) {
    UI.confirm({
      title: '원생 삭제',
      message: s.name + ' 원생과 출석·회비·체력측정·승급심사·참가신청 기록이 모두 지워집니다.\n그만둔 원생이라면 삭제 대신 상태를 "퇴원"으로 바꾸면 기록이 남아요.',
      ok: '모두 삭제', danger: true
    }).then(function (ok) {
      if (!ok) return;
      DB.removeStudent(s.id);
      UI.toast(s.name + ' 원생을 삭제했어요');
      App.nav('students');
    });
  }

  Views.admin.students = {
    render: function (el, params) {
      var s = params.id && DB.student(params.id);
      if (s) renderDetail(el, s); else renderList(el);
    },
    openForm: openForm
  };
})();
