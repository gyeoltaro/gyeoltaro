/* 관리자 홈: 오늘 출석, 회비 미납, 다가오는 행사, 학부모 답글을 한눈에 */
(function () {
  'use strict';
  var esc = U.esc;

  function guardianPhone(s) {
    var g = (s.guardians || [])[0];
    return g && g.phone ? U.fmtPhone(g.phone) : '';
  }

  Views.admin.home = {
    render: function (el) {
      var st = DB.state, today = U.today(), ym = U.ym();
      var active = DB.sortStudents(DB.active());
      var day = DB.day(today);
      var present = active.filter(function (s) { return day[s.id]; })
        .sort(function (a, b) { return day[b.id].t < day[a.id].t ? -1 : 1; });

      var byClass = DB.settings().classes.map(function (c) {
        var tot = active.filter(function (s) { return s.className === c; });
        return { c: c, n: tot.filter(function (s) { return day[s.id]; }).length, of: tot.length };
      }).filter(function (x) { return x.of > 0; });

      var feeMap = DB.feeMap(ym), billed = DB.billed(ym);
      var unpaid = DB.sortStudents(billed.filter(function (s) { return !feeMap[s.id]; }));
      var paidCount = billed.length - unpaid.length;
      var unpaidSum = U.sum(unpaid, DB.feeOf);

      var upcoming = st.events.filter(function (e) { return e.date >= today; })
        .sort(function (a, b) { return a.date < b.date ? -1 : 1; });
      var nextEv = upcoming.filter(DB.eventOpen)[0] || upcoming[0];

      var lastMap = DB.lastAttMap();
      var away = active.map(function (s) {
        var last = lastMap[s.id];
        return { s: s, last: last, days: last ? U.diffDays(last, today) : (s.joinDate ? U.diffDays(s.joinDate, today) : null) };
      }).filter(function (x) { return x.days != null && x.days >= 7; })
        .sort(function (a, b) { return b.days - a.days; });

      var replies = [];
      st.notices.forEach(function (n) { (n.replies || []).forEach(function (r) { replies.push({ n: n, r: r }); }); });
      replies.sort(function (a, b) { return b.r.at - a.r.at; });
      var unseenRep = DB.unseenReplies();

      var h = '';
      h += '<header class="page-head"><div><span class="eyebrow">' + esc(U.fmtLong(today)) + '</span><h1>' + esc(DB.settings().dojangName) + '</h1></div>' +
        '<div class="actions"><button class="btn" type="button" data-act="kiosk">' + UI.icon('tablet') + '출석 화면 열기</button>' +
        '<button class="btn primary" type="button" data-act="notice">' + UI.icon('edit') + '알림장 쓰기</button></div></header>';

      var setting = DB.settings();
      var todos = [];
      if (Cloud.enabled && Cloud.rulesOutdated) todos.push(['Firebase 보안 규칙이 예전 것이에요. 새 규칙을 붙여 넣어야 학부모 아이폰 자동 연결 같은 새 기능이 동작해요.', '규칙 보기', 'rules', '']);
      if (setting.adminPin.length < 6) todos.push(['관리자 비밀번호가 ' + setting.adminPin.length + '자리예요. 6자리로 바꿔 주세요.', '설정', 'go', 'settings']);
      if (!(setting.privacy || {}).officer) todos.push(['개인정보 처리방침에 보호책임자 이름과 연락처를 넣어 주세요.', '설정', 'go', 'settings']);
      var pendN = DB.consentPending().length, smsN = DB.smsPending().length, healthN = DB.healthWithdrawn().length;
      if (pendN) todos.push(['보호자 동의를 아직 받지 않은 원생이 ' + pendN + '명 있어요.', '동의 받기', 'consent', '']);
      if (smsN) todos.push(['학부모 앱으로 동의한 보호자 ' + smsN + '명에게 확인 문자를 보내 주세요.', '확인 문자', 'sms', '']);
      if (healthN) todos.push(['건강 정보 동의를 철회한 원생이 ' + healthN + '명 있어요. 메모의 건강 정보를 지워 주세요.', '원생 보기', 'health', '']);
      var purgeN = DB.purgeDue().length + DB.oldApps().length;
      if (purgeN) todos.push(['보관 기간(1년)이 지난 개인정보가 ' + purgeN + '건 있어요.', '정리하기', 'purge', '']);
      var bars = '';
      todos.forEach(function (t) {
        bars += '<div class="notice-bar">' + UI.icon('lock') + '<span>' + esc(t[0]) + '</span><button class="btn sm" type="button" data-act="' + t[2] + '" data-v="' + t[3] + '">' + esc(t[1]) + '</button></div>';
      });

      if (st.demo) {
        bars += '<div class="notice-bar">' + UI.icon('info') + '<span>지금은 <b>샘플 데이터(원생 100명)</b>로 보고 있어요. 실제로 쓰려면 설정에서 샘플을 지우고 원생을 등록하세요.</span>' +
          '<button class="btn sm" type="button" data-act="go" data-v="settings">설정</button></div>';
      }
      if (bars) h += '<div class="stack sm">' + bars + '</div>';

      // 요약 타일
      h += '<div class="tiles">';
      h += '<button class="card tile" type="button" data-act="go" data-v="attendance"><span class="t-label">오늘 출석</span>' +
        '<span class="t-value">' + present.length + '<small>/ ' + active.length + '명</small></span>' +
        '<div class="bar good"><i style="width:' + U.pct(present.length, active.length) + '%"></i></div>' +
        '<span class="t-sub">' + esc(byClass.map(function (x) { return x.c.split(' ')[0] + ' ' + x.n; }).join(' · ') || '등록된 반 없음') + '</span></button>';
      h += '<button class="card tile" type="button" data-act="go" data-v="fees"><span class="t-label">' + esc(U.fmtM(ym)) + ' 회비 납부</span>' +
        '<span class="t-value">' + U.pct(paidCount, billed.length) + '<small>%</small></span>' +
        '<div class="bar"><i style="width:' + U.pct(paidCount, billed.length) + '%"></i></div>' +
        '<span class="t-sub">미납 ' + unpaid.length + '명 · ' + esc(U.won(unpaidSum)) + '</span></button>';
      if (nextEv) {
        h += '<button class="card tile" type="button" data-act="event" data-id="' + esc(nextEv.id) + '"><span class="t-label">' + esc(nextEv.kind) + ' 신청</span>' +
          '<span class="t-value">' + DB.appsOf(nextEv.id).filter(function (a) { return a.status !== '취소'; }).length + '<small>명</small></span>' +
          '<span class="t-sub">' + esc(nextEv.title) + '</span>' +
          '<span class="t-sub">' + esc(U.fmtMD(nextEv.date) + ' · ' + U.dueLabel(nextEv.deadline)) + '</span></button>';
      } else {
        h += '<button class="card tile" type="button" data-act="go" data-v="events"><span class="t-label">참가신청</span><span class="t-value">-</span><span class="t-sub">예정된 행사가 없어요</span></button>';
      }
      h += '<button class="card tile" type="button" data-act="go" data-v="notices"><span class="t-label">학부모 답글</span>' +
        '<span class="t-value' + (unseenRep ? ' bad' : '') + '">' + unseenRep + '<small>건</small></span>' +
        '<span class="t-sub">' + (unseenRep ? '확인하지 않은 답글이 있어요' : '새 답글이 없어요') + '</span></button>';
      h += '</div>';

      // 오늘 출석 / 장기 결석
      h += '<div class="cols">';
      h += '<section class="section"><div class="section-head"><h2>오늘 출석한 원생</h2><button class="link-btn" type="button" data-act="go" data-v="attendance">출석부 보기</button></div><div class="card list">';
      h += present.length ? present.slice(0, 10).map(function (s) {
        return '<button class="row" type="button" data-act="student" data-id="' + esc(s.id) + '">' + UI.av(s, 'sm') +
          '<span class="main"><span class="title">' + esc(s.name) + '</span><span class="sub">' + esc(s.className + ' · ' + s.grade) + '</span></span>' +
          '<span class="side">' + UI.pill(day[s.id].t ? U.fmtTime(day[s.id].t) : '직접 입력', 'good') + '</span></button>';
      }).join('') + (present.length > 10 ? '<button class="row" type="button" data-act="go" data-v="attendance"><span class="main"><span class="sub">외 ' + (present.length - 10) + '명 더 보기</span></span></button>' : '')
        : UI.empty('아직 출석한 원생이 없어요', '도장 태블릿에 출석 화면을 켜 두면 아이들이 직접 출석해요.');
      h += '</div></section>';

      h += '<section class="section"><div class="section-head"><h2>1주일 넘게 안 나온 원생</h2><span class="sub">' + away.length + '명</span></div><div class="card list">';
      h += away.length ? away.slice(0, 6).map(function (x) {
        return '<button class="row" type="button" data-act="student" data-id="' + esc(x.s.id) + '">' + UI.av(x.s, 'sm') +
          '<span class="main"><span class="title">' + esc(x.s.name) + '</span><span class="sub">' + esc(x.last ? '마지막 출석 ' + U.fmtMD(x.last) : '입관 후 출석 기록 없음') + (guardianPhone(x.s) ? ' · ' + esc(guardianPhone(x.s)) : '') + '</span></span>' +
          '<span class="side">' + UI.pill(x.days + '일째', 'warn') + '</span></button>';
      }).join('') : UI.empty('모두 잘 나오고 있어요');
      h += '</div></section>';
      h += '</div>';

      // 회비 미납 / 다가오는 일정
      h += '<div class="cols">';
      h += '<section class="section"><div class="section-head"><h2>' + esc(U.fmtM(ym)) + ' 회비 미납</h2><button class="link-btn" type="button" data-act="go" data-v="fees">회비장부</button></div><div class="card list">';
      h += unpaid.length ? unpaid.slice(0, 6).map(function (s) {
        return '<button class="row" type="button" data-act="go" data-v="fees">' + UI.av(s, 'sm') +
          '<span class="main"><span class="title">' + esc(s.name) + '</span><span class="sub">' + esc(s.className) + '</span></span>' +
          '<span class="side num">' + esc(U.won(DB.feeOf(s))) + '</span></button>';
      }).join('') + (unpaid.length > 6 ? '<button class="row" type="button" data-act="go" data-v="fees"><span class="main"><span class="sub">외 ' + (unpaid.length - 6) + '명 더 보기</span></span></button>' : '')
        : UI.empty('이번 달 회비를 모두 받았어요');
      h += '</div></section>';

      h += '<section class="section"><div class="section-head"><h2>다가오는 일정</h2><button class="link-btn" type="button" data-act="go" data-v="events">참가신청</button></div><div class="card list">';
      h += upcoming.length ? upcoming.slice(0, 4).map(function (e) {
        var n = DB.appsOf(e.id).filter(function (a) { return a.status !== '취소'; }).length;
        return '<button class="row" type="button" data-act="event" data-id="' + esc(e.id) + '">' +
          '<span class="main"><span class="title">' + esc(e.title) + '</span><span class="sub">' + esc(U.fmtMD(e.date) + ' · ' + e.kind + ' · 신청 ' + n + '명') + '</span></span>' +
          '<span class="side">' + UI.pill(DB.eventOpen(e) ? U.dueLabel(e.deadline) : '신청 마감', DB.eventOpen(e) ? 'accent' : '') + '</span></button>';
      }).join('') : UI.empty('예정된 행사가 없어요');
      h += '</div></section>';
      h += '</div>';

      // 학부모 답글
      if (replies.length) {
        h += '<section class="section"><div class="section-head"><h2>최근 학부모 답글</h2></div><div class="card list">';
        h += replies.slice(0, 4).map(function (x) {
          var s = DB.student(x.r.studentId);
          return '<button class="row" type="button" data-act="notice-open" data-id="' + esc(x.n.id) + '">' + (s ? UI.av(s, 'sm') : '') +
            '<span class="main"><span class="title">' + esc(s ? s.name + ' 보호자' : '보호자') + (x.r.seen ? '' : ' ' + UI.pill('새 답글', 'bad')) + '</span>' +
            '<span class="sub">' + esc(x.r.body) + '</span></span><span class="side small muted">' + esc(U.ago(x.r.at)) + '</span></button>';
        }).join('');
        h += '</div></section>';
      }

      el.innerHTML = h;
      UI.bind(el, {
        go: function (b) { App.nav(b.getAttribute('data-v')); },
        kiosk: function () { App.openKiosk(); },
        purge: function () { Views.admin.settings.purge(); },
        rules: function () { Cloud.rulesView(DB.settings().adminEmails, '아래 규칙을 복사해 Firebase 콘솔 → Firestore Database → 규칙에 붙여 넣고 게시해 주세요. 1분쯤 뒤 이 알림이 사라져요.'); },
        consent: function () { Parts.consentPendingModal(); },
        sms: function () { Parts.smsPendingModal(); },
        health: function () { App.go('students', { id: DB.healthWithdrawn()[0].id }); },
        notice: function () { App.nav('notices'); Views.admin.notices.compose(); },
        student: function (b) { App.go('students', { id: b.getAttribute('data-id') }); },
        event: function (b) { App.go('events', { id: b.getAttribute('data-id') }); },
        'notice-open': function (b) { App.go('notices', { id: b.getAttribute('data-id') }); }
      });
    }
  };
})();
