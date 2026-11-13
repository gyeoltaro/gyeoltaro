/* 스케줄: 관리자만 보는 달력 (원생 생일, 참가신청 행사, 관장님이 직접 적는 일정)
   일정은 DB.state.schedules 에 두고, 서버 모드에서는 관리자만 읽는 config/schedule 문서 하나에 저장해요(cloud.js). */
(function () {
  'use strict';
  var esc = U.esc;
  var ss = { ym: null, sel: null };

  // 그달 생일인 원생 (퇴원생 제외). 2월 29일생은 평년에는 2월 28일에 보여요
  Parts.birthdaysIn = function (ym) {
    var y = +ym.slice(0, 4), m = ym.slice(5, 7), out = [];
    DB.state.students.forEach(function (s) {
      if (s.status === 'left' || s.purged || !/^\d{4}-\d\d-\d\d$/.test(s.birth || '')) return;
      var md = s.birth.slice(5);
      if (md === '02-29' && U.daysInMonth(ym) === 28) md = '02-28';
      if (md.slice(0, 2) !== m) return;
      out.push({ s: s, date: ym + '-' + md.slice(3), age: y - (+s.birth.slice(0, 4)) });
    });
    return out.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : U.byName(a.s, b.s); });
  };
  function schedulesIn(ym) {
    return (DB.state.schedules || []).filter(function (x) { return x.date && x.date.slice(0, 7) === ym; }).sort(byTime);
  }
  function eventsIn(ym) {
    return DB.state.events.filter(function (e) { return e.date && e.date.slice(0, 7) === ym; }).sort(byTime);
  }
  // 하루 종일 일정이 먼저, 그다음 시각 순
  function byTime(a, b) {
    var ka = a.date + (a.time || ''), kb = b.date + (b.time || '');
    return ka < kb ? -1 : ka > kb ? 1 : (a.createdAt || 0) - (b.createdAt || 0);
  }
  function onDay(list, d) { return list.filter(function (x) { return x.date === d; }); }

  function grid(ym, bdays, evs, mine) {
    var first = U.dow(ym + '-01'), days = U.daysInMonth(ym), today = U.today();
    var h = '<div class="sched">' + U.WEEK.map(function (w, i) { return '<span class="wd' + (i === 0 ? ' sun' : i === 6 ? ' sat' : '') + '">' + w + '</span>'; }).join('');
    for (var i = 0; i < first; i++) h += '<span class="sd blank"></span>';
    for (var d = 1; d <= days; d++) {
      var ymd = ym + '-' + U.pad(d), dow = (first + d - 1) % 7;
      var items = onDay(bdays, ymd).map(function (b) { return '<span class="it k-bday">' + UI.icon('cake') + esc(b.s.name) + '</span>'; })
        .concat(onDay(evs, ymd).map(function (e) { return '<span class="it k-ev">' + esc(e.title) + '</span>'; }))
        .concat(onDay(mine, ymd).map(function (x) { return '<span class="it k-mine">' + (x.time ? '<b>' + esc(x.time) + '</b> ' : '') + esc(x.title) + '</span>'; }));
      var more = items.length > 3 ? '<span class="more">+' + (items.length - 3) + '</span>' : '';
      h += '<button type="button" class="sd' + (ymd === today ? ' today' : '') + (ymd === ss.sel ? ' sel' : '') + (dow === 0 ? ' sun' : dow === 6 ? ' sat' : '') + '" data-act="day" data-d="' + ymd + '" aria-label="' + esc(U.fmtMD(ymd) + (items.length ? ' 일정 ' + items.length + '개' : '')) + '">' +
        '<span class="n">' + d + '</span>' + items.slice(0, 3).join('') + more + '</button>';
    }
    return h + '</div>';
  }

  function dayPanel(d, bdays, evs, mine) {
    var b = onDay(bdays, d), e = onDay(evs, d), m = onDay(mine, d);
    var h = '<section class="section"><div class="section-head"><h2>' + esc(U.fmtMD(d)) + (d === U.today() ? ' · 오늘' : '') + '</h2>' +
      '<button class="btn sm" type="button" data-act="add" data-d="' + d + '">' + UI.icon('plus') + '이 날 일정 추가</button></div><div class="card list">';
    if (!b.length && !e.length && !m.length) h += UI.empty('이 날은 일정이 없어요');
    h += b.map(function (x) {
      return '<button class="row" type="button" data-act="student" data-id="' + esc(x.s.id) + '">' + UI.av(x.s, 'sm') +
        '<span class="main"><span class="title">' + esc(x.s.name) + ' ' + UI.statusPill(x.s) + '</span><span class="sub">' + esc(x.s.className + ' · 만 ' + x.age + '살 생일') + '</span></span>' +
        '<span class="side">' + UI.pill('생일', 'accent') + '</span></button>';
    }).join('');
    h += e.map(function (x) {
      return '<button class="row" type="button" data-act="event" data-id="' + esc(x.id) + '"><span class="main"><span class="title">' + esc(x.title) + '</span>' +
        '<span class="sub">' + esc(x.kind + (x.time ? ' · ' + U.fmtTime(x.time) : '')) + '</span></span><span class="side">' + UI.pill('참가신청', 'info') + '</span></button>';
    }).join('');
    h += m.map(function (x) {
      return '<button class="row" type="button" data-act="edit" data-id="' + esc(x.id) + '"><span class="main"><span class="title">' + esc(x.title) + '</span>' +
        '<span class="sub">' + esc((x.time ? U.fmtTime(x.time) : '하루 종일') + (x.memo ? ' · ' + x.memo : '')) + '</span></span><span class="side">' + UI.pill('내 일정', 'good') + '</span></button>';
    }).join('');
    return h + '</div></section>';
  }

  function monthBirthdays(ym, bdays) {
    var h = '<section class="section"><div class="section-head"><h2>' + esc(U.fmtM(ym)) + ' 생일</h2><span class="sub">' + bdays.length + '명</span></div><div class="card list">';
    h += bdays.length ? bdays.map(function (x) {
      return '<button class="row" type="button" data-act="day" data-d="' + x.date + '">' + UI.av(x.s, 'sm') +
        '<span class="main"><span class="title">' + esc(x.s.name) + '</span><span class="sub">' + esc(x.s.className + ' · 만 ' + x.age + '살') + '</span></span>' +
        '<span class="side small soft">' + esc(U.fmtMD(x.date)) + '</span></button>';
    }).join('') : UI.empty('이번 달 생일인 원생이 없어요');
    return h + '</div></section>';
  }

  function editModal(item, date) {
    var x = item || { date: date || ss.sel || U.today(), time: '', title: '', memo: '' };
    UI.modal({
      title: item ? '일정 고치기' : '일정 추가',
      html: '<div class="form-grid">' +
        '<div class="field"><label for="scDate">날짜</label><input class="input" id="scDate" type="date" value="' + esc(x.date) + '"></div>' +
        '<div class="field"><label for="scTime">시간 (선택)</label><input class="input" id="scTime" type="time" value="' + esc(x.time || '') + '"></div>' +
        '<div class="field full"><label for="scTitle">내용</label><input class="input" id="scTitle" maxlength="60" placeholder="예: 차량 점검, 사범 회의, 심사 접수 마감" value="' + esc(x.title) + '" autofocus></div>' +
        '<div class="field full"><label for="scMemo">메모 (선택)</label><textarea class="input" id="scMemo" rows="3" maxlength="500">' + esc(x.memo || '') + '</textarea></div></div>' +
        '<p class="fine">시간을 비워 두면 하루 종일 일정이에요. 스케줄은 관리자 화면에서만 보이고 학부모 앱에는 나오지 않아요.</p><p class="bad-t small" data-err></p>',
      actions: (item ? [{
        label: '지우기', kind: 'danger', left: true, onClick: function () {
          var removed = DB.remove('schedules', item.id);
          App.refresh();
          UI.toast('일정을 지웠어요', { label: '되돌리기', fn: function () { DB.upsert('schedules', removed); App.refresh(); } });
        }
      }] : []).concat([{ label: '취소', kind: 'quiet' }, {
        label: '저장', kind: 'primary', onClick: function (root) {
          var d = root.querySelector('#scDate').value, title = root.querySelector('#scTitle').value.trim();
          var err = root.querySelector('[data-err]');
          if (!/^\d{4}-\d\d-\d\d$/.test(d)) { err.textContent = '날짜를 골라 주세요'; return false; }
          if (!title) { err.textContent = '내용을 적어 주세요'; root.querySelector('#scTitle').focus(); return false; }
          DB.upsert('schedules', {
            id: item ? item.id : U.uid(), date: d, time: root.querySelector('#scTime').value || '', title: title,
            memo: root.querySelector('#scMemo').value.trim(), createdAt: item ? item.createdAt : Date.now()
          });
          ss.sel = d; ss.ym = d.slice(0, 7);
          App.refresh();
          UI.toast(item ? '일정을 고쳤어요' : U.fmtMD(d) + ' 일정을 넣었어요');
        }
      }])
    });
  }

  Views.admin.schedule = {
    render: function (el) {
      var today = U.today();
      if (!ss.ym) ss.ym = U.ym();
      if (!ss.sel || ss.sel.slice(0, 7) !== ss.ym) ss.sel = today.slice(0, 7) === ss.ym ? today : ss.ym + '-01';
      var ym = ss.ym, bdays = Parts.birthdaysIn(ym), evs = eventsIn(ym), mine = schedulesIn(ym);

      var h = '<header class="page-head"><div><span class="eyebrow">관리자만 보는 달력</span><h1>스케줄</h1></div>' +
        '<div class="actions"><button class="btn primary" type="button" data-act="add">' + UI.icon('plus') + '일정 추가</button></div></header>';
      h += '<div class="toolbar">' + UI.monthNav(ym) + (ym !== today.slice(0, 7) ? '<button class="btn sm" type="button" data-act="this-month">오늘</button>' : '') +
        '<span class="spacer"></span><div class="legend"><span><i style="background:var(--accent)"></i>생일</span><span><i style="background:var(--info)"></i>참가신청 행사</span><span><i style="background:var(--good)"></i>내 일정</span></div></div>';
      h += '<div class="card pad sched-card">' + grid(ym, bdays, evs, mine) + '</div>';
      h += '<div class="cols">' + dayPanel(ss.sel, bdays, evs, mine) + monthBirthdays(ym, bdays) + '</div>';
      el.innerHTML = h;

      UI.bind(el, {
        'prev-month': function () { ss.ym = U.addMonths(ss.ym, -1); App.refresh(); },
        'next-month': function () { ss.ym = U.addMonths(ss.ym, 1); App.refresh(); },
        'this-month': function () { ss.ym = U.ym(); ss.sel = U.today(); App.refresh(); },
        day: function (b) { ss.sel = b.getAttribute('data-d'); App.refresh(); },
        add: function (b) { editModal(null, b.getAttribute('data-d')); },
        edit: function (b) { var x = DB.byId('schedules', b.getAttribute('data-id')); if (x) editModal(x); },
        student: function (b) { App.go('students', { id: b.getAttribute('data-id') }); },
        event: function (b) { App.go('events', { id: b.getAttribute('data-id') }); }
      });
    }
  };
})();
