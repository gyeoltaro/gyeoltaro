/* 회비장부: 월별 납부 현황, 납부 처리, 기타 수입, 엑셀(CSV) 내보내기 */
(function () {
  'use strict';
  var esc = U.esc;
  var fs = { ym: null, filter: 'all', cls: 'all', q: '' };

  function payLabel(p) {
    return U.fmtDate(p.paidAt).slice(5) + ' · ' + p.method;
  }

  // 원생 상세·학부모 화면용: 최근 몇 달의 회비 납부 상태
  Parts.feeHistory = function (s, months) {
    var ym = U.ym(), rows = [];
    for (var i = 0; i < months; i++) {
      var m = U.addMonths(ym, -i);
      if (s.joinDate && s.joinDate.slice(0, 7) > m) break;
      var p = DB.feeMap(m)[s.id];
      if (!p && m < DB.ledgerStart()) continue;
      var billed = p || (s.status === 'active');
      if (!billed) continue;
      rows.push('<div class="row"><span class="main"><span class="title">' + esc(U.fmtYM(m)) + '</span>' +
        '<span class="sub">' + esc(p ? payLabel(p) + (p.memo ? ' · ' + p.memo : '') : '아직 납부 기록이 없어요') + '</span></span>' +
        '<span class="side"><span class="num">' + esc(U.won(p ? p.amount : DB.feeOf(s))) + '</span>' +
        (p ? UI.pill(p.method === '면제' ? '면제' : '납부', 'good') : UI.pill('미납', 'bad')) + '</span></div>');
    }
    var others = DB.state.payments.filter(function (p) { return p.studentId === s.id && p.category !== '월회비'; })
      .sort(function (a, b) { return a.paidAt < b.paidAt ? 1 : -1; }).slice(0, 4);
    others.forEach(function (p) {
      rows.push('<div class="row"><span class="main"><span class="title">' + esc(p.category) + '</span><span class="sub">' + esc(payLabel(p) + (p.memo ? ' · ' + p.memo : '')) + '</span></span>' +
        '<span class="side"><span class="num">' + esc(U.won(p.amount)) + '</span>' + UI.pill('납부', 'good') + '</span></div>');
    });
    return rows.join('') || UI.empty('회비 기록이 없어요');
  };

  function payModal(s, ym) {
    var fee = DB.feeOf(s), method = '계좌이체';
    var html =
      '<div class="hstack">' + UI.av(s, 'sm') + '<b>' + esc(s.name) + '</b><span class="muted small">' + esc(s.className) + '</span></div>' +
      '<div class="form-grid">' +
      '<div class="field"><label for="payAmt">금액 (원)</label><input class="input num" id="payAmt" inputmode="numeric" value="' + fee + '"></div>' +
      '<div class="field"><label for="payDate">납부일</label><input class="input" id="payDate" type="date" value="' + U.today() + '"></div>' +
      '<div class="field full"><span class="label">납부 방법</span><div class="chips" data-methods>' +
      DB.PAY_METHODS.map(function (m) { return '<button type="button" class="chip' + (m === method ? ' on' : '') + '" data-m="' + m + '">' + m + '</button>'; }).join('') + '</div></div>' +
      '<div class="field full"><label for="payMemo">메모</label><input class="input" id="payMemo" placeholder="예: 2달 치 함께 납부"></div></div>';
    UI.modal({
      title: U.fmtM(ym) + ' 회비 납부 처리', html: html,
      actions: [{ label: '취소', kind: 'quiet' }, {
        label: '납부 처리', kind: 'primary', onClick: function (root) {
          var amt = +U.digits(root.querySelector('#payAmt').value);
          if (method === '면제') amt = 0;
          var p = DB.upsert('payments', {
            id: U.uid(), studentId: s.id, category: '월회비', month: ym, amount: amt,
            paidAt: root.querySelector('#payDate').value || U.today(), method: method,
            memo: root.querySelector('#payMemo').value.trim(), createdAt: Date.now()
          });
          App.refresh();
          UI.toast(s.name + ' ' + U.fmtM(ym) + ' 회비를 ' + (method === '면제' ? '면제' : '납부') + ' 처리했어요', {
            label: '되돌리기', fn: function () { DB.remove('payments', p.id); App.refresh(); }
          });
        }
      }],
      onMount: function (root) {
        root.querySelector('[data-methods]').addEventListener('click', function (e) {
          var b = e.target.closest('[data-m]');
          if (!b) return;
          method = b.getAttribute('data-m');
          [].forEach.call(root.querySelectorAll('[data-m]'), function (x) { x.classList.toggle('on', x === b); });
        });
      }
    });
  }

  function paidModal(p) {
    var s = DB.student(p.studentId);
    var html = '<dl class="kv">' +
      '<dt>원생</dt><dd>' + esc(s ? s.name : '-') + '</dd>' +
      '<dt>항목</dt><dd>' + esc(p.category + (p.category === '월회비' ? ' (' + U.fmtYM(p.month) + ')' : '')) + '</dd>' +
      '<dt>금액</dt><dd class="num">' + esc(U.won(p.amount)) + '</dd>' +
      '<dt>납부일</dt><dd>' + esc(U.fmtDate(p.paidAt)) + '</dd>' +
      '<dt>방법</dt><dd>' + esc(p.method) + '</dd>' +
      (p.memo ? '<dt>메모</dt><dd>' + esc(p.memo) + '</dd>' : '') + '</dl>' +
      (p.ref ? '<p class="fine">참가신청에서 처리한 참가비예요. 취소하면 신청서의 납부 표시도 함께 풀려요.</p>' : '');
    UI.modal({
      title: '납부 내역', html: html,
      actions: [{
        label: '납부 취소', kind: 'danger', left: true, onClick: function () {
          var removed = DB.remove('payments', p.id);
          var app = p.ref && DB.byId('applications', p.ref);
          if (app) { app.paymentId = null; DB.save(); }
          App.refresh();
          UI.toast('납부 기록을 지웠어요', { label: '되돌리기', fn: function () { DB.upsert('payments', removed); if (app) { app.paymentId = removed.id; DB.save(); } App.refresh(); } });
        }
      }, { label: '닫기', kind: 'primary' }]
    });
  }

  function otherModal() {
    var students = DB.sortStudents(DB.students().filter(function (s) { return s.status !== 'left'; }));
    var method = '계좌이체';
    var html = '<div class="form-grid">' +
      '<div class="field"><label for="oCat">항목</label><select class="input" id="oCat">' + UI.options(DB.PAY_CATEGORIES.filter(function (c) { return c !== '월회비'; }), '용품') + '</select></div>' +
      '<div class="field"><label for="oStu">원생 (선택)</label><select class="input" id="oStu"><option value="">원생 없음</option>' + students.map(function (s) { return '<option value="' + esc(s.id) + '">' + esc(s.name + ' · ' + s.className) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label for="oAmt">금액 (원)</label><input class="input num" id="oAmt" inputmode="numeric" autofocus></div>' +
      '<div class="field"><label for="oDate">날짜</label><input class="input" id="oDate" type="date" value="' + U.today() + '"></div>' +
      '<div class="field full"><span class="label">납부 방법</span><div class="chips" data-methods>' +
      DB.PAY_METHODS.filter(function (m) { return m !== '면제'; }).map(function (m) { return '<button type="button" class="chip' + (m === method ? ' on' : '') + '" data-m="' + m + '">' + m + '</button>'; }).join('') + '</div></div>' +
      '<div class="field full"><label for="oMemo">내용</label><input class="input" id="oMemo" placeholder="예: 도복 140, 겨루기 보호대"></div></div>';
    UI.modal({
      title: '기타 수입 추가', html: html,
      actions: [{ label: '취소', kind: 'quiet' }, {
        label: '추가', kind: 'primary', onClick: function (root) {
          var amt = +U.digits(root.querySelector('#oAmt').value);
          if (!amt) { UI.toast('금액을 입력해 주세요'); root.querySelector('#oAmt').focus(); return false; }
          var date = root.querySelector('#oDate').value || U.today();
          DB.upsert('payments', {
            id: U.uid(), studentId: root.querySelector('#oStu').value || null, category: root.querySelector('#oCat').value,
            month: date.slice(0, 7), amount: amt, paidAt: date, method: method,
            memo: root.querySelector('#oMemo').value.trim(), createdAt: Date.now()
          });
          if (date.slice(0, 7) !== fs.ym) fs.ym = date.slice(0, 7);
          App.refresh();
          UI.toast('기타 수입을 추가했어요');
        }
      }],
      onMount: function (root) {
        root.querySelector('[data-methods]').addEventListener('click', function (e) {
          var b = e.target.closest('[data-m]');
          if (!b) return;
          method = b.getAttribute('data-m');
          [].forEach.call(root.querySelectorAll('[data-m]'), function (x) { x.classList.toggle('on', x === b); });
        });
      }
    });
  }

  function exportCsv(ym, billed, map, others) {
    var rows = [['구분', '이름', '반', '보호자 연락처', '청구액', '납부 여부', '납부일', '납부 방법', '납부액', '메모']];
    DB.sortStudents(billed).forEach(function (s) {
      var p = map[s.id], g = (s.guardians || [])[0];
      rows.push(['월회비', s.name, s.className, g ? U.fmtPhone(g.phone) : '', DB.feeOf(s), p ? (p.method === '면제' ? '면제' : '납부') : '미납', p ? p.paidAt : '', p ? p.method : '', p ? p.amount : '', p ? p.memo : '']);
    });
    others.forEach(function (p) {
      var s = DB.student(p.studentId);
      rows.push([p.category, s ? s.name : '', s ? s.className : '', '', '', '납부', p.paidAt, p.method, p.amount, p.memo]);
    });
    var csv = U.csv(rows), name = '회비장부_' + ym + '.csv';
    UI.modal({
      title: '엑셀로 내보내기', wide: true,
      html: '<p class="soft">' + esc(U.fmtYM(ym)) + ' 장부 ' + (rows.length - 1) + '줄을 CSV 파일로 저장해요. 엑셀이나 구글 스프레드시트에서 열 수 있어요.</p>' +
        '<textarea class="input mono" readonly style="min-height:200px;font-size:12.5px" id="csvOut">' + esc(csv.slice(1)) + '</textarea>' +
        '<p class="fine">파일 저장이 안 되는 화면에서는 "내용 복사"를 눌러 엑셀에 붙여 넣으세요.</p>',
      actions: [
        { label: '내용 복사', kind: '', icon: 'copy', onClick: function () { U.copy(csv.slice(1).replace(/,/g, '\t')).then(function (ok) { UI.toast(ok ? '복사했어요. 엑셀에 붙여 넣으세요.' : '복사하지 못했어요. 글자를 길게 눌러 선택해 주세요.'); }); return false; } },
        { label: '파일 저장', kind: 'primary', icon: 'download', onClick: function () { U.download(name, csv, 'text/csv;charset=utf-8'); UI.toast(name + ' 저장을 시작했어요'); return false; } }
      ]
    });
  }

  Views.admin.fees = {
    render: function (el) {
      if (!fs.ym) fs.ym = U.ym();
      var ym = fs.ym, map = DB.feeMap(ym), billed = DB.billed(ym);
      var paid = billed.filter(function (s) { return map[s.id]; });
      var unpaid = billed.filter(function (s) { return !map[s.id]; });
      var billSum = U.sum(billed, function (s) { return map[s.id] ? map[s.id].amount : DB.feeOf(s); });
      var paidSum = U.sum(paid, function (s) { return map[s.id].amount; });
      var unpaidSum = U.sum(unpaid, DB.feeOf);
      var others = DB.otherIncome(ym).sort(function (a, b) { return a.paidAt < b.paidAt ? 1 : -1; });
      var otherSum = U.sum(others, function (p) { return p.amount; });
      var classes = DB.settings().classes;
      var q = fs.q.trim();
      var list = DB.sortStudents(billed.filter(function (s) {
        if (fs.filter === 'paid' && !map[s.id]) return false;
        if (fs.filter === 'unpaid' && map[s.id]) return false;
        if (fs.cls !== 'all' && s.className !== fs.cls) return false;
        return !q || s.name.indexOf(q) >= 0;
      }));

      var h = '<header class="page-head"><div><span class="eyebrow">회비장부</span>' +
        '<div class="hstack" style="gap:2px;flex-wrap:nowrap"><button class="icon-btn" type="button" data-act="prev-month" aria-label="이전 달">' + UI.icon('chevL') + '</button>' +
        '<h1>' + esc(U.fmtYM(ym)) + '</h1><button class="icon-btn" type="button" data-act="next-month" aria-label="다음 달">' + UI.icon('chevR') + '</button></div></div>' +
        '<div class="actions"><button class="btn" type="button" data-act="csv">' + UI.icon('download') + '엑셀로 내보내기</button>' +
        '<button class="btn" type="button" data-act="other">' + UI.icon('plus') + '기타 수입</button></div></header>';

      h += '<div class="tiles">' +
        '<div class="card tile"><span class="t-label">청구</span><span class="t-value">' + billed.length + '<small>명</small></span><span class="t-sub num">' + esc(U.won(billSum)) + '</span></div>' +
        '<div class="card tile"><span class="t-label">납부</span><span class="t-value good">' + paid.length + '<small>명 · ' + U.pct(paid.length, billed.length) + '%</small></span><div class="bar good"><i style="width:' + U.pct(paid.length, billed.length) + '%"></i></div><span class="t-sub num">' + esc(U.won(paidSum)) + '</span></div>' +
        '<div class="card tile"><span class="t-label">미납</span><span class="t-value' + (unpaid.length ? ' bad' : '') + '">' + unpaid.length + '<small>명</small></span><span class="t-sub num">' + esc(U.won(unpaidSum)) + '</span></div>' +
        '<div class="card tile"><span class="t-label">기타 수입</span><span class="t-value">' + others.length + '<small>건</small></span><span class="t-sub num">' + esc(U.won(otherSum)) + '</span></div>' +
        '</div>';

      h += '<div class="toolbar"><div class="seg">' + [['all', '전체', billed.length], ['unpaid', '미납', unpaid.length], ['paid', '납부', paid.length]].map(function (x) {
        return '<button type="button" data-act="filter" data-v="' + x[0] + '" class="' + (fs.filter === x[0] ? 'on' : '') + '">' + x[1] + '<span class="ct">' + x[2] + '</span></button>';
      }).join('') + '</div>' +
        '<select class="input sm" id="feeCls" style="width:auto">' + UI.options([{ value: 'all', label: '전체 반' }].concat(classes.map(function (c) { return { value: c, label: c }; })), fs.cls) + '</select>' +
        '<div class="search grow">' + UI.icon('search') + '<input class="input" type="search" id="feeSearch" placeholder="이름으로 찾기" value="' + esc(fs.q) + '"></div>' +
        (unpaid.length ? '<button class="btn sm" type="button" data-act="remind">' + UI.icon('bell') + '미납 안내 알림장</button>' : '') + '</div>';

      h += '<div class="card list">';
      if (!list.length) h += UI.empty(billed.length ? '해당하는 원생이 없어요' : '이 달에 회비를 낼 원생이 없어요');
      list.forEach(function (s) {
        var p = map[s.id];
        h += '<div class="row' + (p ? ' click' : '') + '"' + (p ? ' data-act="paid" data-id="' + esc(p.id) + '"' : '') + '>' + UI.av(s, 'sm') +
          '<span class="main"><span class="title">' + esc(s.name) + ' ' + UI.statusPill(s) + '</span>' +
          '<span class="sub">' + esc(s.className + (p ? ' · ' + payLabel(p) + (p.memo ? ' · ' + p.memo : '') : '')) + '</span></span>' +
          '<span class="side"><span class="num">' + esc(U.won(p ? p.amount : DB.feeOf(s))) + '</span>' +
          (p ? UI.pill(p.method === '면제' ? '면제' : '납부', 'good', true)
            : '<button class="btn sm primary" type="button" data-act="pay" data-id="' + esc(s.id) + '">납부 처리</button>') +
          '</span></div>';
      });
      h += '</div>';

      h += '<section class="section"><div class="section-head"><h2>기타 수입</h2><span class="sub">심사비 · 대회비 · 용품 등</span></div><div class="card list">';
      h += others.length ? others.map(function (p) {
        var s = DB.student(p.studentId);
        return '<button class="row" type="button" data-act="paid" data-id="' + esc(p.id) + '">' +
          '<span class="main"><span class="title">' + esc(p.category + (s ? ' · ' + s.name : '')) + '</span><span class="sub">' + esc(payLabel(p) + (p.memo ? ' · ' + p.memo : '')) + '</span></span>' +
          '<span class="side num">' + esc(U.won(p.amount)) + '</span></button>';
      }).join('') : UI.empty('이 달의 기타 수입이 없어요');
      h += '</div></section>';

      el.innerHTML = h;
      el.querySelector('#feeCls').addEventListener('change', function (e) { fs.cls = e.target.value; App.refresh(); });
      var search = el.querySelector('#feeSearch');
      search.addEventListener('input', U.debounce(function () {
        fs.q = search.value;
        App.refresh();
        var s2 = document.getElementById('feeSearch');
        if (s2) { s2.focus(); var n = s2.value.length; try { s2.setSelectionRange(n, n); } catch (e) {} }
      }, 200));
      UI.bind(el, {
        'prev-month': function () { fs.ym = U.addMonths(fs.ym, -1); App.refresh(); },
        'next-month': function () { fs.ym = U.addMonths(fs.ym, 1); App.refresh(); },
        filter: function (b) { fs.filter = b.getAttribute('data-v'); App.refresh(); },
        pay: function (b) { payModal(DB.student(b.getAttribute('data-id')), ym); },
        paid: function (b) { var p = DB.byId('payments', b.getAttribute('data-id')); if (p) paidModal(p); },
        other: otherModal,
        csv: function () { exportCsv(ym, billed, map, others); },
        remind: function () {
          var st = DB.settings();
          Views.admin.notices.compose(null, {
            title: U.fmtM(ym) + ' 회비 납부 안내',
            body: '안녕하세요, ' + st.dojangName + '입니다.\n' + U.fmtM(ym) + ' 회비가 아직 확인되지 않아 안내드립니다.\n' +
              (st.account ? '\n입금 계좌: ' + st.account + '\n' : '\n') + '\n이미 납부하셨다면 이 알림장에 답글을 남겨 주세요. 감사합니다.',
            target: { type: 'students', studentIds: unpaid.map(function (s) { return s.id; }) }
          });
        }
      });
    }
  };
})();
