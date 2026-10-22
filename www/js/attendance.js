/* 출석부: 일별 체크, 월별 표 */
(function () {
  'use strict';
  var esc = U.esc;
  var as = { mode: 'day', date: null, ym: null, cls: 'all', show: 'all', q: '' };

  // 원생 상세·학부모 화면에서 쓰는 출석 달력
  Parts.attCalendar = function (s, ym) {
    var marks = {}, n = 0;
    for (var d in DB.state.attendance) {
      if (d.slice(0, 7) === ym && DB.state.attendance[d][s.id]) { marks[d] = true; n++; }
    }
    return '<div class="stack"><div class="cal-head"><button class="icon-btn" type="button" data-act="cal-prev" aria-label="이전 달">' + UI.icon('chevL') + '</button>' +
      '<b>' + esc(U.fmtYM(ym)) + ' · ' + n + '회 출석</b>' +
      '<button class="icon-btn" type="button" data-act="cal-next" aria-label="다음 달"' + (ym >= U.ym() ? ' disabled' : '') + '>' + UI.icon('chevR') + '</button></div>' +
      UI.calendar(ym, marks) + '</div>';
  };

  function filtered(list) {
    var q = as.q.trim();
    return list.filter(function (s) {
      return (as.cls === 'all' || s.className === as.cls) && (!q || s.name.indexOf(q) >= 0 || s.pin === q);
    });
  }

  function renderDay(el) {
    var date = as.date, day = DB.day(date), today = U.today();
    var roster = DB.sortStudents(DB.state.students.filter(function (s) {
      return (s.status === 'active' && (!s.joinDate || s.joinDate <= date)) || day[s.id];
    }));
    var present = roster.filter(function (s) { return day[s.id]; });
    var classes = DB.settings().classes;
    var list = filtered(roster).filter(function (s) {
      return as.show === 'all' || (as.show === 'present' ? !!day[s.id] : !day[s.id]);
    });

    var h = '<div class="toolbar"><div class="month-nav"><button class="icon-btn" type="button" data-act="prev-day" aria-label="전날">' + UI.icon('chevL') + '</button>' +
      '<b>' + esc(U.fmtMD(date)) + '</b><button class="icon-btn" type="button" data-act="next-day" aria-label="다음날"' + (date >= today ? ' disabled' : '') + '>' + UI.icon('chevR') + '</button></div>' +
      (date !== today ? '<button class="btn sm" type="button" data-act="today">오늘</button>' : '') +
      '<span class="spacer"></span><span class="soft">출석 <b class="num">' + present.length + '</b> / ' + roster.length + '명 · ' + U.pct(present.length, roster.length) + '%</span></div>';

    h += '<div class="chips scroll"><button type="button" class="chip' + (as.cls === 'all' ? ' on' : '') + '" data-act="cls" data-v="all">전체</button>' +
      classes.map(function (c) {
        var tot = roster.filter(function (s) { return s.className === c; });
        var n = tot.filter(function (s) { return day[s.id]; }).length;
        return '<button type="button" class="chip' + (as.cls === c ? ' on' : '') + '" data-act="cls" data-v="' + esc(c) + '">' + esc(c) + '<span class="ct">' + n + '/' + tot.length + '</span></button>';
      }).join('') + '</div>';

    h += '<div class="toolbar"><div class="seg">' + [['all', '전체'], ['present', '출석'], ['absent', '미출석']].map(function (x) {
      return '<button type="button" data-act="show" data-v="' + x[0] + '" class="' + (as.show === x[0] ? 'on' : '') + '">' + x[1] + '</button>';
    }).join('') + '</div><div class="search grow">' + UI.icon('search') + '<input class="input" type="search" id="attSearch" placeholder="이름으로 찾기" value="' + esc(as.q) + '"></div></div>';

    h += '<div class="card list">';
    if (!list.length) h += UI.empty(roster.length ? '해당하는 원생이 없어요' : '등록된 원생이 없어요');
    var lastCls = null;
    list.forEach(function (s) {
      if (as.cls === 'all' && s.className !== lastCls) {
        lastCls = s.className;
        var tot = roster.filter(function (x) { return x.className === lastCls; });
        h += '<div class="group-label"><span>' + esc(lastCls || '반 없음') + '</span><span class="num">' + tot.filter(function (x) { return day[x.id]; }).length + ' / ' + tot.length + '</span></div>';
      }
      var r = day[s.id];
      h += '<div class="row">' + UI.av(s, 'sm') +
        '<span class="main"><span class="title">' + esc(s.name) + ' ' + UI.statusPill(s) + '</span><span class="sub">' + esc(s.grade + ' · ' + U.schoolYear(s.birth)) + '</span></span>' +
        '<span class="side">' + (r
          ? UI.pill(r.t ? U.fmtTime(r.t) + (r.by === 'admin' ? ' · 직접' : '') : '직접 입력', 'good', true) + '<button class="icon-btn" type="button" data-act="uncheck" data-id="' + esc(s.id) + '" aria-label="' + esc(s.name) + ' 출석 취소">' + UI.icon('x') + '</button>'
          : '<button class="btn sm" type="button" data-act="check" data-id="' + esc(s.id) + '">' + UI.icon('check') + '출석</button>') +
        '</span></div>';
    });
    h += '</div>';
    return h;
  }

  function renderMonth(el) {
    var ym = as.ym, days = U.daysInMonth(ym), today = U.today(), end = U.monthEnd(ym);
    var att = DB.state.attendance;
    var roster = DB.sortStudents(DB.state.students.filter(function (s) {
      if (s.joinDate && s.joinDate > end) return false;
      if (s.status === 'active') return true;
      for (var d in att) if (d.slice(0, 7) === ym && att[d][s.id]) return true;
      return false;
    }));
    var list = filtered(roster);
    var classes = DB.settings().classes;

    var h = '<div class="toolbar">' + UI.monthNav(ym) + '<span class="spacer"></span>' +
      '<div class="legend"><span><i style="background:var(--good)"></i>출석 화면</span><span><i style="background:var(--accent)"></i>관리자 입력</span></div></div>';
    h += '<div class="chips scroll"><button type="button" class="chip' + (as.cls === 'all' ? ' on' : '') + '" data-act="cls" data-v="all">전체</button>' +
      classes.map(function (c) { return '<button type="button" class="chip' + (as.cls === c ? ' on' : '') + '" data-act="cls" data-v="' + esc(c) + '">' + esc(c) + '</button>'; }).join('') + '</div>';

    var cols = [];
    for (var d = 1; d <= days; d++) cols.push(ym + '-' + U.pad(d));
    h += '<div class="card table-wrap"><table class="matrix"><thead><tr><th class="nm">이름</th>' +
      cols.map(function (c) {
        var w = U.dow(c);
        return '<th class="' + (w === 0 || w === 6 ? 'we' : '') + (c === today ? ' today' : '') + '">' + (+c.slice(8)) + '<small>' + U.WEEK[w] + '</small></th>';
      }).join('') + '<th class="tot">합계</th></tr></thead><tbody>';
    var daily = cols.map(function () { return 0; });
    if (!list.length) h += '<tr><td class="nm" colspan="' + (days + 2) + '">' + UI.empty('해당하는 원생이 없어요') + '</td></tr>';
    list.forEach(function (s) {
      var tot = 0;
      h += '<tr><td class="nm" title="' + esc(s.name) + '">' + esc(s.name) + '</td>';
      cols.forEach(function (c, i) {
        var r = att[c] && att[c][s.id], w = U.dow(c);
        if (r) { tot++; daily[i]++; }
        h += '<td class="' + (w === 0 || w === 6 ? 'we' : '') + '">' + (c > today ? '' :
          '<button type="button" class="mk' + (r ? ' on' + (r.by === 'admin' ? ' admin' : '') : '') + '" data-act="toggle" data-id="' + esc(s.id) + '" data-d="' + c + '" aria-label="' + esc(s.name + ' ' + (+c.slice(8)) + '일 ' + (r ? '출석' : '결석')) + '"></button>') + '</td>';
      });
      h += '<td class="tot">' + tot + '</td></tr>';
    });
    h += '</tbody><tfoot><tr><td class="nm">일별 인원</td>' + daily.map(function (n, i) {
      var w = U.dow(cols[i]);
      return '<td class="' + (w === 0 || w === 6 ? 'we' : '') + '">' + (cols[i] > today ? '' : n || '') + '</td>';
    }).join('') + '<td class="tot">' + U.sum(daily) + '</td></tr></tfoot></table></div>';
    h += '<p class="fine">칸을 누르면 출석을 넣거나 뺄 수 있어요. 아이가 출석을 깜빡한 날을 고칠 때 쓰세요.</p>';
    return h;
  }

  Views.admin.attendance = {
    render: function (el) {
      if (!as.date) as.date = U.today();
      if (!as.ym) as.ym = U.ym();
      var h = '<header class="page-head"><div><span class="eyebrow">' + esc(as.mode === 'day' ? U.fmtLong(as.date) : U.fmtYM(as.ym)) + '</span><h1>출석부</h1></div>' +
        '<div class="actions"><div class="seg"><button type="button" data-act="mode" data-v="day" class="' + (as.mode === 'day' ? 'on' : '') + '">일별</button>' +
        '<button type="button" data-act="mode" data-v="month" class="' + (as.mode === 'month' ? 'on' : '') + '">월별</button></div>' +
        '<button class="btn" type="button" data-act="kiosk">' + UI.icon('tablet') + '출석 화면 열기</button></div></header>';
      h += as.mode === 'day' ? renderDay(el) : renderMonth(el);
      el.innerHTML = h;

      var search = el.querySelector('#attSearch');
      if (search) {
        search.addEventListener('input', U.debounce(function () {
          as.q = search.value;
          App.refresh();
          var s2 = document.getElementById('attSearch');
          if (s2) { s2.focus(); var n = s2.value.length; try { s2.setSelectionRange(n, n); } catch (e) {} }
        }, 200));
      }
      UI.bind(el, {
        mode: function (b) { as.mode = b.getAttribute('data-v'); App.refresh(); },
        kiosk: function () { App.openKiosk(); },
        cls: function (b) { as.cls = b.getAttribute('data-v'); App.refresh(); },
        show: function (b) { as.show = b.getAttribute('data-v'); App.refresh(); },
        'prev-day': function () { as.date = U.addDays(as.date, -1); App.refresh(); },
        'next-day': function () { if (as.date < U.today()) { as.date = U.addDays(as.date, 1); App.refresh(); } },
        today: function () { as.date = U.today(); App.refresh(); },
        'prev-month': function () { as.ym = U.addMonths(as.ym, -1); App.refresh(); },
        'next-month': function () { as.ym = U.addMonths(as.ym, 1); App.refresh(); },
        check: function (b) {
          var id = b.getAttribute('data-id'), s = DB.student(id);
          var t = as.date === U.today() ? U.hm() : '';
          DB.checkIn(id, as.date, t, 'admin');
          App.refresh();
          UI.toast(s.name + ' 출석 처리했어요', { label: '되돌리기', fn: function () { DB.uncheck(id, as.date); App.refresh(); } });
        },
        uncheck: function (b) {
          var id = b.getAttribute('data-id'), s = DB.student(id), date = as.date;
          var rec = DB.uncheck(id, date);
          App.refresh();
          UI.toast(s.name + ' 출석을 취소했어요', { label: '되돌리기', fn: function () { DB.setCheck(id, date, rec); App.refresh(); } });
        },
        toggle: function (b) {
          var id = b.getAttribute('data-id'), d = b.getAttribute('data-d'), s = DB.student(id);
          var day = DB.day(d);
          if (day[id]) {
            var rec = DB.uncheck(id, d);
            UI.toast(s.name + ' ' + U.fmtMD(d) + ' 출석을 뺐어요', { label: '되돌리기', fn: function () { DB.setCheck(id, d, rec); App.refresh(); } });
          } else {
            DB.checkIn(id, d, d === U.today() ? U.hm() : '', 'admin');
            UI.toast(s.name + ' ' + U.fmtMD(d) + ' 출석을 넣었어요', { label: '되돌리기', fn: function () { DB.uncheck(id, d); App.refresh(); } });
          }
          App.refresh();
        }
      });
    }
  };
})();
