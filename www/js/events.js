/* 참가신청서: 대회·승급심사·캠프 등 행사를 만들고 학부모 신청을 받습니다 */
(function () {
  'use strict';
  var esc = U.esc;
  var es = { tab: 'open' };

  var DEFAULT_CONSENT = '위 행사에 자녀의 참가를 신청합니다. 행사 중 안전 수칙을 지키도록 지도하며, 안내 사항을 확인했습니다.';

  function feeCategory(ev) { return ev.kind === '승급심사' ? '심사비' : ev.kind === '대회' ? '대회비' : '행사비'; }
  function liveApps(ev) { return DB.appsOf(ev.id).filter(function (a) { return a.status !== '취소'; }); }
  function targetText(ev) { return ev.target && ev.target.type === 'class' ? (ev.target.classes || []).join(', ') : '전체 원생'; }

  Parts.eventDateBox = function (ev) {
    var d = U.parse(ev.date);
    return '<span class="ev-date"><small>' + (d.getMonth() + 1) + '월</small><b>' + d.getDate() + '</b><span>' + U.WEEK[d.getDay()] + '요일</span></span>';
  };
  Parts.eventInfo = function (ev) {
    return '<dl class="kv">' +
      '<dt>일시</dt><dd>' + esc(U.fmtLong(ev.date) + (ev.time ? ' ' + U.fmtTime(ev.time) : '')) + '</dd>' +
      (ev.place ? '<dt>장소</dt><dd>' + esc(ev.place) + '</dd>' : '') +
      '<dt>참가비</dt><dd>' + esc(ev.fee ? U.won(ev.fee) : '없음') + '</dd>' +
      '<dt>신청 마감</dt><dd>' + esc(ev.deadline ? U.fmtMD(ev.deadline) + ' (' + U.dueLabel(ev.deadline) + ')' : '정하지 않음') + (ev.closed ? ' ' + UI.pill('신청 마감', '') : '') + '</dd>' +
      '<dt>대상</dt><dd>' + esc(targetText(ev)) + '</dd>' +
      '</dl>' + (ev.description ? '<p class="n-full" style="font-size:14.5px">' + esc(ev.description) + '</p>' : '');
  };

  // 원생 상세용 신청 내역
  Parts.appList = function (s, admin) {
    var apps = DB.state.applications.filter(function (a) { return a.studentId === s.id; })
      .map(function (a) { return { a: a, e: DB.byId('events', a.eventId) }; })
      .filter(function (x) { return x.e; })
      .sort(function (x, y) { return x.e.date < y.e.date ? 1 : -1; });
    if (!apps.length) return UI.empty('참가신청 기록이 없어요');
    return apps.map(function (x) {
      var tone = x.a.status === '확정' ? 'good' : x.a.status === '취소' ? '' : 'accent';
      return '<button class="row" type="button" data-act="event-open" data-id="' + esc(x.e.id) + '">' +
        '<span class="main"><span class="title">' + esc(x.e.title) + '</span><span class="sub">' + esc(U.fmtMD(x.e.date) + (x.a.choice ? ' · ' + x.a.choice : '') + (x.e.fee ? ' · 참가비 ' + (x.a.paymentId ? '납부' : '미납') : '')) + '</span></span>' +
        '<span class="side">' + UI.pill(x.a.status, tone) + '</span></button>';
    }).join('');
  };

  function form(ev) {
    var isNew = !ev, st = DB.settings();
    var d = ev ? JSON.parse(JSON.stringify(ev)) : {
      kind: '대회', title: '', date: U.addDays(U.today(), 21), time: '10:00', place: '', fee: 0,
      deadline: U.addDays(U.today(), 10), target: { type: 'all' }, choiceLabel: '', choices: [], askLabel: '',
      description: '', consent: DEFAULT_CONSENT, closed: false, thirdParty: null
    };
    var tp = d.thirdParty || {}, tpOn = !!d.thirdParty || (isNew && d.kind === '대회');
    var kind = d.kind, tclasses = (d.target.classes || []).slice(), ttype = d.target.type || 'all';
    var html = '<div class="field"><span class="label">종류</span><div class="chips" data-kinds>' +
      DB.EVENT_KINDS.map(function (k) { return '<button type="button" class="chip' + (k === kind ? ' on' : '') + '" data-k="' + k + '">' + k + '</button>'; }).join('') + '</div></div>' +
      '<div class="form-grid">' +
      '<div class="field full"><label for="eTitle">행사 이름</label><input class="input" id="eTitle" value="' + esc(d.title) + '" placeholder="예: 제12회 구청장배 태권도 대회" autofocus></div>' +
      '<div class="field"><label for="eDate">날짜</label><input class="input" type="date" id="eDate" value="' + esc(d.date) + '"></div>' +
      '<div class="field"><label for="eTime">시간</label><input class="input" type="time" id="eTime" value="' + esc(d.time) + '"></div>' +
      '<div class="field full"><label for="ePlace">장소</label><input class="input" id="ePlace" value="' + esc(d.place) + '"></div>' +
      '<div class="field"><label for="eFee">참가비 (원)</label><input class="input num" id="eFee" inputmode="numeric" value="' + esc(d.fee || '') + '" placeholder="0"></div>' +
      '<div class="field"><label for="eDeadline">신청 마감일</label><input class="input" type="date" id="eDeadline" value="' + esc(d.deadline) + '"></div>' +
      '<div class="field full"><span class="label">대상</span><div class="seg" data-ttype><button type="button" data-t="all" class="' + (ttype === 'all' ? 'on' : '') + '">전체 원생</button><button type="button" data-t="class" class="' + (ttype === 'class' ? 'on' : '') + '">반 선택</button></div>' +
      '<div class="chips" data-tclasses' + (ttype === 'class' ? '' : ' hidden') + '>' + st.classes.map(function (c) { return '<button type="button" class="chip' + (tclasses.indexOf(c) >= 0 ? ' on' : '') + '" data-c="' + esc(c) + '">' + esc(c) + '</button>'; }).join('') + '</div></div>' +
      '<div class="field full"><label for="eDesc">안내 내용</label><textarea class="input" id="eDesc" placeholder="준비물, 이동 방법, 일정 등">' + esc(d.description) + '</textarea></div>' +
      '<div class="full form-title">신청서 항목</div>' +
      '<div class="field"><label for="eChoiceLabel">선택 항목 이름</label><input class="input" id="eChoiceLabel" value="' + esc(d.choiceLabel) + '" placeholder="예: 참가 부문"></div>' +
      '<div class="field"><label for="eChoices">선택지 (쉼표로 구분)</label><input class="input" id="eChoices" value="' + esc((d.choices || []).join(', ')) + '" placeholder="예: 품새, 겨루기"></div>' +
      '<div class="field full"><label for="eAsk">추가 질문 (선택)</label><input class="input" id="eAsk" value="' + esc(d.askLabel) + '" placeholder="예: 체중 (kg), 티셔츠 사이즈"></div>' +
      '<div class="field full"><label for="eConsent">보호자 동의 문구</label><textarea class="input" id="eConsent" style="min-height:80px">' + esc(d.consent || DEFAULT_CONSENT) + '</textarea></div>' +
      '<div class="full form-title">개인정보 제3자 제공</div>' +
      '<label class="check full"><input type="checkbox" id="eTP"' + (tpOn ? ' checked' : '') + '>대회 주최 측 등 다른 곳에 참가자 정보를 넘겨야 해요</label>' +
      '<div class="full form-grid" data-tp' + (tpOn ? '' : ' hidden') + '>' +
      '<div class="field"><label for="eTPto">받는 곳</label><input class="input" id="eTPto" value="' + esc(tp.to || '') + '" placeholder="예: OO구 태권도협회"></div>' +
      '<div class="field"><label for="eTPpurpose">목적</label><input class="input" id="eTPpurpose" value="' + esc(tp.purpose || '대회 참가 접수 및 경기 진행') + '"></div>' +
      '<div class="field full"><label for="eTPitems">넘기는 항목</label><input class="input" id="eTPitems" value="' + esc(tp.items || '이름, 생년월일, 성별, 소속 도장, 체급(체중)') + '"></div>' +
      '<div class="field full"><label for="eTPperiod">받는 곳의 보유 기간</label><input class="input" id="eTPperiod" value="' + esc(tp.period || '대회 종료 후 주최 측 기준에 따라 파기') + '"></div>' +
      '</div><p class="full fine">켜 두면 학부모 신청서에 "제3자 제공 동의"가 따로 나오고, 동의해야 신청할 수 있어요. 개인정보 처리방침에도 자동으로 들어가요.</p>' +
      '</div>';
    UI.modal({
      title: isNew ? '행사 만들기' : '행사 수정', wide: true, html: html,
      actions: [{ label: '취소', kind: 'quiet' }, {
        label: isNew ? '만들기' : '저장', kind: 'primary', onClick: function (root) {
          var v = function (id) { return root.querySelector('#' + id).value.trim(); };
          if (!v('eTitle')) { UI.toast('행사 이름을 입력해 주세요'); root.querySelector('#eTitle').focus(); return false; }
          if (!v('eDate')) { UI.toast('날짜를 정해 주세요'); return false; }
          if (ttype === 'class' && !tclasses.length) { UI.toast('대상 반을 골라 주세요'); return false; }
          var tpChecked = root.querySelector('#eTP').checked;
          if (tpChecked && !v('eTPto')) { UI.toast('개인정보를 받는 곳을 입력해 주세요'); root.querySelector('#eTPto').focus(); return false; }
          var obj = ev || { id: U.uid(), createdAt: Date.now(), closed: false };
          obj.kind = kind;
          obj.title = v('eTitle');
          obj.date = v('eDate');
          obj.time = v('eTime');
          obj.place = v('ePlace');
          obj.fee = +U.digits(v('eFee')) || 0;
          obj.deadline = v('eDeadline');
          obj.target = ttype === 'class' ? { type: 'class', classes: tclasses } : { type: 'all' };
          obj.description = root.querySelector('#eDesc').value.trim();
          obj.choiceLabel = v('eChoiceLabel');
          obj.choices = v('eChoices').split(',').map(function (x) { return x.trim(); }).filter(Boolean);
          if (obj.choices.length && !obj.choiceLabel) obj.choiceLabel = '선택';
          obj.askLabel = v('eAsk');
          obj.consent = v('eConsent') || DEFAULT_CONSENT;
          obj.thirdParty = tpChecked ? { to: v('eTPto'), purpose: v('eTPpurpose'), items: v('eTPitems'), period: v('eTPperiod') } : null;
          DB.upsert('events', obj);
          UI.toast(isNew ? '행사를 만들었어요. 학부모 화면에서 신청할 수 있어요.' : '저장했어요');
          if (isNew) App.go('events', { id: obj.id }); else App.refresh();
        }
      }],
      onMount: function (root) {
        root.querySelector('#eTP').onchange = function (e) { root.querySelector('[data-tp]').hidden = !e.target.checked; };
        root.querySelector('[data-kinds]').addEventListener('click', function (e) {
          var b = e.target.closest('[data-k]');
          if (!b) return;
          kind = b.getAttribute('data-k');
          [].forEach.call(root.querySelectorAll('[data-k]'), function (x) { x.classList.toggle('on', x === b); });
        });
        var tc = root.querySelector('[data-tclasses]');
        root.querySelector('[data-ttype]').addEventListener('click', function (e) {
          var b = e.target.closest('[data-t]');
          if (!b) return;
          ttype = b.getAttribute('data-t');
          [].forEach.call(root.querySelectorAll('[data-t]'), function (x) { x.classList.toggle('on', x === b); });
          tc.hidden = ttype !== 'class';
        });
        tc.addEventListener('click', function (e) {
          var b = e.target.closest('[data-c]');
          if (!b) return;
          var c = b.getAttribute('data-c'), i = tclasses.indexOf(c);
          if (i >= 0) tclasses.splice(i, 1); else tclasses.push(c);
          b.classList.toggle('on', i < 0);
        });
      }
    });
  }

  function togglePaid(a, ev) {
    if (a.paymentId) {
      DB.remove('payments', a.paymentId);
      a.paymentId = null;
    } else {
      var p = DB.upsert('payments', {
        id: U.uid(), studentId: a.studentId, category: feeCategory(ev), month: U.ym(), amount: ev.fee,
        paidAt: U.today(), method: '계좌이체', memo: ev.title, ref: a.id, createdAt: Date.now()
      });
      a.paymentId = p.id;
    }
    DB.save();
  }

  function exportCsv(ev) {
    var rows = [['이름', '반', '학년', ev.choiceLabel || '선택', ev.askLabel || '추가 질문', '메모', '보호자', '연락처', '신청일', '상태', '참가비']];
    DB.sortStudents(DB.appsOf(ev.id).map(function (a) { return DB.student(a.studentId); }).filter(Boolean)).forEach(function (s) {
      var a = DB.appsOf(ev.id).filter(function (x) { return x.studentId === s.id; })[0];
      var g = (s.guardians || [])[0];
      rows.push([s.name, s.className, U.schoolYear(s.birth), a.choice, a.answer, a.memo, a.guardianName, g ? U.fmtPhone(g.phone) : '', U.fmtStamp(a.submittedAt), a.status, ev.fee ? (a.paymentId ? '납부' : '미납') : '']);
    });
    var csv = U.csv(rows), name = ev.title.replace(/[\\/:*?"<>|]/g, '') + '_신청자.csv';
    UI.modal({
      title: '신청자 명단 내보내기', wide: true,
      html: '<p class="soft">신청자 ' + (rows.length - 1) + '명을 CSV 파일로 저장해요.</p><textarea class="input mono" readonly style="min-height:200px;font-size:12.5px">' + esc(csv.slice(1)) + '</textarea>',
      actions: [
        { label: '내용 복사', icon: 'copy', onClick: function () { U.copy(csv.slice(1).replace(/,/g, '\t')).then(function (ok) { UI.toast(ok ? '복사했어요. 엑셀에 붙여 넣으세요.' : '복사하지 못했어요'); }); return false; } },
        { label: '파일 저장', kind: 'primary', icon: 'download', onClick: function () { U.download(name, csv, 'text/csv;charset=utf-8'); UI.toast(name + ' 저장을 시작했어요'); return false; } }
      ]
    });
  }

  function consentText(a) {
    if (a.by === 'admin') return '종이 신청서로 받음';
    var c = a.consents || {};
    var list = [c.privacy ? '개인정보 수집·이용' : null, c.third ? '제3자 제공' : null, c.event || a.agreed ? '참가 안내' : null].filter(Boolean);
    return list.length ? list.join(' · ') + ' 동의 (' + U.fmtStamp(a.submittedAt) + ')' : '-';
  }

  function appDetail(a, ev) {
    var s = DB.student(a.studentId);
    var html = '<dl class="kv">' +
      '<dt>원생</dt><dd>' + esc(s ? s.name + ' (' + s.className + ')' : '-') + '</dd>' +
      (ev.choiceLabel ? '<dt>' + esc(ev.choiceLabel) + '</dt><dd>' + esc(a.choice || '-') + '</dd>' : '') +
      (ev.askLabel ? '<dt>' + esc(ev.askLabel) + '</dt><dd>' + esc(a.answer || '-') + '</dd>' : '') +
      '<dt>메모</dt><dd>' + esc(a.memo || '-') + '</dd>' +
      '<dt>보호자</dt><dd>' + esc(a.guardianName || '-') + '</dd>' +
      '<dt>신청</dt><dd>' + esc(U.fmtStamp(a.submittedAt) + (a.by === 'admin' ? ' · 관리자 등록' : ' · 학부모 신청')) + '</dd>' +
      '<dt>동의</dt><dd>' + esc(consentText(a)) + '</dd>' +
      '<dt>서명</dt><dd>' + (a.signature ? '<img class="sig-img" style="height:72px" src="' + esc(a.signature) + '" alt="보호자 서명">' : '<span class="muted">없음</span>') + '</dd>' +
      '</dl>';
    var actions = [];
    if (a.status === '취소') {
      actions.push({ label: '다시 접수', kind: 'primary', onClick: function () { a.status = '접수'; DB.save(); App.refresh(); } });
    } else {
      actions.push({ label: '신청 취소', kind: 'danger', left: true, onClick: function () { a.status = '취소'; DB.save(); App.refresh(); UI.toast('신청을 취소했어요'); } });
      actions.push({ label: a.status === '확정' ? '접수로 되돌리기' : '참가 확정', kind: 'primary', onClick: function () { a.status = a.status === '확정' ? '접수' : '확정'; DB.save(); App.refresh(); } });
    }
    UI.modal({ title: '신청서', html: html, actions: actions });
  }

  function renderList(el) {
    var today = U.today();
    var all = DB.state.events.slice();
    var open = all.filter(function (e) { return e.date >= today; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    var past = all.filter(function (e) { return e.date < today; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    var list = es.tab === 'open' ? open : past;
    var h = '<header class="page-head"><div><span class="eyebrow">대회 · 승급심사 · 캠프 · 행사</span><h1>참가신청</h1></div>' +
      '<div class="actions"><button class="btn primary" type="button" data-act="new">' + UI.icon('plus') + '행사 만들기</button></div></header>';
    h += '<div class="seg"><button type="button" data-act="tab" data-v="open" class="' + (es.tab === 'open' ? 'on' : '') + '">다가오는 행사<span class="ct">' + open.length + '</span></button>' +
      '<button type="button" data-act="tab" data-v="past" class="' + (es.tab === 'past' ? 'on' : '') + '">지난 행사<span class="ct">' + past.length + '</span></button></div>';
    h += '<div class="stack">';
    if (!list.length) h += '<div class="card">' + UI.empty(es.tab === 'open' ? '다가오는 행사가 없어요' : '지난 행사가 없어요', es.tab === 'open' ? '대회나 승급심사를 만들면 학부모님이 참가신청서를 낼 수 있어요.' : '') + '</div>';
    list.forEach(function (ev) {
      var apps = liveApps(ev), aud = DB.eventAudience(ev).length;
      var newN = DB.appsOf(ev.id).filter(function (a) { return a.seen === false; }).length;
      var paidN = apps.filter(function (a) { return a.paymentId; }).length;
      h += '<button class="card ev' + (es.tab === 'past' ? ' past' : '') + '" type="button" data-act="open" data-id="' + esc(ev.id) + '">' + Parts.eventDateBox(ev) +
        '<span class="ev-main"><span class="hstack">' + UI.pill(ev.kind, ev.kind === '대회' ? 'info' : ev.kind === '승급심사' ? 'accent' : '') + (newN ? UI.pill('새 신청 ' + newN, 'bad') : '') + '</span>' +
        '<h3>' + esc(ev.title) + '</h3><span class="sub">' + esc((ev.place || '장소 미정') + (ev.fee ? ' · 참가비 ' + U.won(ev.fee) : '')) + '</span></span>' +
        '<span class="ev-side"><b class="num">' + apps.length + '<span class="small muted"> / ' + aud + '명</span></b>' +
        (es.tab === 'open' ? UI.pill(DB.eventOpen(ev) ? U.dueLabel(ev.deadline) : '신청 마감', DB.eventOpen(ev) ? 'accent' : '') : '') +
        (ev.fee && apps.length ? '<span class="small muted">참가비 ' + paidN + '/' + apps.length + '</span>' : '') + '</span></button>';
    });
    h += '</div>';
    el.innerHTML = h;
    UI.bind(el, {
      new: function () { form(null); },
      tab: function (b) { es.tab = b.getAttribute('data-v'); App.refresh(); },
      open: function (b) { App.go('events', { id: b.getAttribute('data-id') }); }
    });
  }

  function renderDetail(el, ev) {
    var apps = DB.appsOf(ev.id);
    var live = apps.filter(function (a) { return a.status !== '취소'; });
    var aud = DB.eventAudience(ev);
    var appliedIds = {};
    live.forEach(function (a) { appliedIds[a.studentId] = true; });
    var notApplied = DB.sortStudents(aud.filter(function (s) { return !appliedIds[s.id]; }));
    var confirmed = live.filter(function (a) { return a.status === '확정'; }).length;
    var paidN = live.filter(function (a) { return a.paymentId; }).length;
    var rows = apps.map(function (a) { return { a: a, s: DB.student(a.studentId) }; }).filter(function (x) { return x.s; })
      .sort(function (x, y) { return (x.a.status === '취소') - (y.a.status === '취소') || DB.classIndex(x.s.className) - DB.classIndex(y.s.className) || U.byName(x.s, y.s); });

    var h = '<div>' + UI.backLink('참가신청') + '<header class="page-head"><div><span class="eyebrow">' + esc(ev.kind + ' · ' + U.fmtMD(ev.date)) + '</span><h1>' + esc(ev.title) + '</h1></div>' +
      '<div class="actions"><button class="btn" type="button" data-act="notify">' + UI.icon('bell') + '알림장으로 안내</button>' +
      '<button class="btn" type="button" data-act="edit">' + UI.icon('edit') + '수정</button>' +
      '<button class="btn" type="button" data-act="close">' + (ev.closed ? '신청 다시 받기' : '신청 마감') + '</button>' +
      '<button class="btn danger" type="button" data-act="del">' + UI.icon('trash') + '삭제</button></div></header></div>';

    h += '<div class="tiles">' +
      '<div class="card tile"><span class="t-label">신청</span><span class="t-value">' + live.length + '<small>/ ' + aud.length + '명</small></span><span class="t-sub">' + (DB.eventOpen(ev) ? esc(U.dueLabel(ev.deadline)) : '신청 마감') + '</span></div>' +
      '<div class="card tile"><span class="t-label">참가 확정</span><span class="t-value">' + confirmed + '<small>명</small></span><span class="t-sub">접수 ' + (live.length - confirmed) + '명</span></div>' +
      '<div class="card tile"><span class="t-label">참가비</span><span class="t-value">' + (ev.fee ? paidN + '<small>/ ' + live.length + '명 납부</small>' : '-') + '</span><span class="t-sub num">' + esc(ev.fee ? U.won(paidN * ev.fee) + ' 받음' : '참가비 없음') + '</span></div>' +
      '<div class="card tile"><span class="t-label">미신청</span><span class="t-value">' + notApplied.length + '<small>명</small></span><span class="t-sub">' + esc(targetText(ev)) + ' 중</span></div>' +
      '</div>';

    h += '<div class="cols"><section class="section"><div class="section-head"><h2>행사 안내</h2></div><div class="card pad stack">' + Parts.eventInfo(ev) + '</div></section>';
    h += '<section class="section"><div class="section-head"><h2>신청서 항목</h2></div><div class="card pad stack">' +
      '<dl class="kv">' + (ev.choiceLabel ? '<dt>' + esc(ev.choiceLabel) + '</dt><dd>' + esc(ev.choices.join(' / ')) + '</dd>' : '') +
      (ev.askLabel ? '<dt>추가 질문</dt><dd>' + esc(ev.askLabel) + '</dd>' : '') +
      '<dt>개인정보</dt><dd class="soft">수집·이용 동의 (필수)' + (ev.thirdParty ? '<br>제3자 제공 동의 (필수): ' + esc(ev.thirdParty.to + ' · ' + ev.thirdParty.items) : '') + '</dd>' +
      '<dt>보호자 동의</dt><dd class="soft">' + esc(ev.consent || DEFAULT_CONSENT) + '</dd><dt>서명</dt><dd>보호자 손글씨 서명</dd></dl>';
    if (ev.choices && ev.choices.length && live.length) {
      h += '<div class="breakdown">' + ev.choices.map(function (c) { return '<span>' + esc(c) + '<b>' + live.filter(function (a) { return a.choice === c; }).length + '명</b></span>'; }).join('') + '</div>';
    }
    if (ev.kind === '승급심사') {
      var made = DB.state.exams.filter(function (x) { return x.examDate === ev.date; }).length;
      h += '<button class="btn" type="button" data-act="exams">' + UI.icon('belt') + (made ? '승급심사 채점표 열기 (' + made + '명)' : '신청자로 승급심사 채점표 만들기') + '</button>';
    }
    h += '</div></section></div>';

    h += '<section class="section"><div class="section-head"><h2>신청자 명단</h2><div class="hstack">' +
      '<button class="btn sm" type="button" data-act="add">' + UI.icon('plus') + '직접 등록</button>' +
      '<button class="btn sm" type="button" data-act="csv">' + UI.icon('download') + '명단 내보내기</button></div></div>';
    h += '<div class="card table-wrap"><table class="t"><thead><tr><th>이름</th><th>반</th>' + (ev.choiceLabel ? '<th>' + esc(ev.choiceLabel) + '</th>' : '') + (ev.askLabel ? '<th>' + esc(ev.askLabel) + '</th>' : '') +
      '<th>신청</th><th>서명</th>' + (ev.fee ? '<th>참가비</th>' : '') + '<th>상태</th></tr></thead><tbody>';
    if (!rows.length) h += '<tr><td colspan="8">' + UI.empty('아직 신청자가 없어요', '학부모 화면의 참가신청 메뉴에서 신청할 수 있어요.') + '</td></tr>';
    rows.forEach(function (x) {
      var a = x.a, s = x.s, cancelled = a.status === '취소';
      h += '<tr class="click"' + (cancelled ? ' style="opacity:.5"' : '') + ' data-act="app" data-id="' + esc(a.id) + '">' +
        '<td><div class="hstack" style="flex-wrap:nowrap">' + UI.av(s, 'xs') + '<b>' + esc(s.name) + '</b>' + (a.seen === false ? UI.pill('새 신청', 'bad') : '') + '</div></td>' +
        '<td>' + esc(s.className) + '</td>' + (ev.choiceLabel ? '<td>' + esc(a.choice || '-') + '</td>' : '') + (ev.askLabel ? '<td>' + esc(a.answer || '-') + '</td>' : '') +
        '<td class="small muted">' + esc(U.fmtDate(U.ymd(new Date(a.submittedAt))).slice(5) + (a.by === 'admin' ? ' 직접' : '')) + '</td>' +
        '<td>' + (a.signature ? '<img class="sig-img" src="' + esc(a.signature) + '" alt="서명">' : '<span class="muted small">-</span>') + '</td>' +
        (ev.fee ? '<td>' + (cancelled ? '' : '<button type="button" class="pill ' + (a.paymentId ? 'good' : 'bad') + '" data-act="paid" data-id="' + esc(a.id) + '">' + (a.paymentId ? '납부' : '미납') + '</button>') + '</td>' : '') +
        '<td>' + UI.pill(a.status, a.status === '확정' ? 'good' : cancelled ? '' : 'accent') + '</td></tr>';
    });
    h += '</tbody></table></div>';
    if (ev.fee) h += '<p class="fine">참가비 칸을 누르면 납부/미납이 바뀌고, 납부한 참가비는 회비장부의 기타 수입에 함께 기록돼요.</p>';
    h += '</section>';

    if (notApplied.length) {
      h += '<section class="section"><div class="section-head"><h2>아직 신청하지 않은 원생</h2><span class="sub">' + notApplied.length + '명</span></div>' +
        '<div class="card pad"><div class="name-chips">' + notApplied.map(function (s) { return '<span>' + esc(s.name) + '</span>'; }).join('') + '</div></div></section>';
    }
    el.innerHTML = h;

    // 관리자가 본 신청서는 확인 처리
    var changed = false;
    apps.forEach(function (a) { if (a.seen === false) { a.seen = true; changed = true; } });
    if (changed) { DB.save(); App.updateShell(); }

    UI.bind(el, {
      back: function () { App.back(); },
      edit: function () { form(ev); },
      close: function () { ev.closed = !ev.closed; DB.save(); App.refresh(); UI.toast(ev.closed ? '신청을 마감했어요' : '신청을 다시 받아요'); },
      del: function () {
        UI.confirm({ title: '행사 삭제', message: '"' + ev.title + '"과 신청서 ' + apps.length + '건을 지울까요?\n회비장부에 기록된 참가비는 그대로 남아요.', ok: '삭제', danger: true }).then(function (ok) {
          if (!ok) return;
          DB.state.applications = DB.state.applications.filter(function (a) { return a.eventId !== ev.id; });
          DB.remove('events', ev.id);
          UI.toast('행사를 지웠어요');
          App.nav('events');
        });
      },
      notify: function () {
        Views.admin.notices.compose(null, {
          title: ev.title + ' 참가 신청 안내',
          body: ev.title + ' 참가 신청을 받습니다.\n\n일시: ' + U.fmtMD(ev.date) + (ev.time ? ' ' + U.fmtTime(ev.time) : '') + '\n' + (ev.place ? '장소: ' + ev.place + '\n' : '') +
            (ev.fee ? '참가비: ' + U.won(ev.fee) + '\n' : '') + (ev.deadline ? '신청 마감: ' + U.fmtMD(ev.deadline) + '\n' : '') + '\n앱의 참가신청 메뉴에서 신청서를 작성해 주세요.',
          target: ev.target && ev.target.type === 'class' ? { type: 'class', classes: ev.target.classes } : { type: 'all' }
        });
      },
      add: function () {
        UI.pickStudents({ title: '직접 등록할 원생', students: notApplied, ok: '신청 등록' }).then(function (ids) {
          if (!ids || !ids.length) return;
          ids.forEach(function (id) {
            var old = apps.filter(function (a) { return a.studentId === id; })[0];
            if (old) { old.status = '접수'; return; }
            var s = DB.student(id);
            DB.state.applications.push({
              id: U.uid(), eventId: ev.id, studentId: id, choice: '', answer: '', memo: '종이 신청서',
              guardianName: s && s.guardians[0] ? s.guardians[0].name : '', agreed: false, signature: null,
              submittedAt: Date.now(), status: '접수', paymentId: null, seen: true, by: 'admin'
            });
          });
          DB.save();
          App.refresh();
          UI.toast(ids.length + '명을 신청자로 등록했어요');
        });
      },
      csv: function () { exportCsv(ev); },
      app: function (b) { var a = DB.byId('applications', b.getAttribute('data-id')); if (a) appDetail(a, ev); },
      paid: function (b, e) {
        e.stopPropagation();
        var a = DB.byId('applications', b.getAttribute('data-id'));
        togglePaid(a, ev);
        App.refresh();
        var s = DB.student(a.studentId);
        UI.toast(s.name + ' 참가비 ' + (a.paymentId ? '납부' : '미납') + '으로 바꿨어요');
      },
      exams: function () {
        var made = 0;
        live.forEach(function (a) {
          var exists = DB.state.exams.some(function (x) { return x.studentId === a.studentId && x.examDate === ev.date; });
          if (exists) return;
          var s = DB.student(a.studentId);
          DB.state.exams.push({ id: U.uid(), studentId: a.studentId, examDate: ev.date, gradeAt: s.grade, items: DB.zeroItems(), scored: false, comment: '', promoted: false, eventId: ev.id });
          made++;
        });
        DB.save();
        if (made) UI.toast(made + '명의 채점표를 만들었어요');
        Views.admin.exams.showDate(ev.date);
      }
    });
  }

  Views.admin.events = {
    render: function (el, params) {
      var ev = params.id && DB.byId('events', params.id);
      if (ev) renderDetail(el, ev); else renderList(el);
    }
  };
})();
