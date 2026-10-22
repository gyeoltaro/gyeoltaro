/* 어머님 알림장: 전체·반별·개별 알림장 작성, 읽음 확인, 학부모 답글 */
(function () {
  'use strict';
  var esc = U.esc;
  var ns = { filter: 'any', q: '', readTab: 'unread' };

  var TEMPLATES = [
    { label: '오늘의 수련', title: '오늘의 수련 이야기', body: '오늘은 ___을(를) 배웠어요.\n아이가 집에서 보여 주면 많이 칭찬해 주세요.' },
    { label: '휴관 안내', title: '__월 __일 휴관 안내', body: '안녕하세요, {도장}입니다.\n\n__월 __일(_)은 도장 사정으로 휴관합니다.\n다음 날부터 평소대로 수련합니다.\n\n감사합니다.' },
    { label: '준비물', title: '준비물 안내', body: '다음 수련 시간에 아래 준비물을 챙겨 주세요.\n\n- \n- ' },
    { label: '승급 축하', title: '승급을 축하합니다', body: '이번 승급심사에 합격했어요! 그동안 열심히 수련한 결과입니다.\n새 띠에 맞게 더 멋진 모습 기대할게요.' }
  ];

  function targetLabel(n) {
    var t = n.target || { type: 'all' };
    if (t.type === 'all') return '전체';
    if (t.type === 'class') return (t.classes || []).join(', ') || '반 미지정';
    var ids = t.studentIds || [];
    var first = ids.length && DB.student(ids[0]);
    if (!ids.length) return '받는 사람 없음';
    return (first ? first.name : '원생') + (ids.length > 1 ? ' 외 ' + (ids.length - 1) + '명' : '');
  }
  Parts.noticeTarget = targetLabel;

  function readStats(n) {
    var aud = DB.noticeAudience(n), reads = n.reads || {};
    var read = aud.filter(function (s) { return reads[s.id]; });
    return { aud: aud, read: read, unread: aud.filter(function (s) { return !reads[s.id]; }) };
  }

  function compose(notice, preset) {
    var isNew = !notice;
    var st = DB.settings();
    var d = notice ? JSON.parse(JSON.stringify(notice)) : {
      title: (preset && preset.title) || '', body: (preset && preset.body) || '', image: null, pinned: false,
      target: (preset && preset.target) || { type: 'all' }
    };
    var target = { type: d.target.type, classes: (d.target.classes || []).slice(), studentIds: (d.target.studentIds || []).slice() };
    var image = d.image;
    var html =
      '<div class="field"><span class="label">받는 사람</span><div class="seg" data-ttype>' +
      [['all', '전체'], ['class', '반 선택'], ['students', '원생 지정']].map(function (x) { return '<button type="button" data-t="' + x[0] + '" class="' + (target.type === x[0] ? 'on' : '') + '">' + x[1] + '</button>'; }).join('') + '</div>' +
      '<div class="chips" data-tclasses' + (target.type === 'class' ? '' : ' hidden') + '>' + st.classes.map(function (c) { return '<button type="button" class="chip' + (target.classes.indexOf(c) >= 0 ? ' on' : '') + '" data-c="' + esc(c) + '">' + esc(c) + '</button>'; }).join('') + '</div>' +
      '<div class="hstack" data-tstudents' + (target.type === 'students' ? '' : ' hidden') + '><button type="button" class="btn sm" data-pickstu>' + UI.icon('users') + '원생 고르기</button><span class="small soft" data-stusum></span></div>' +
      '<span class="hint" data-audience></span></div>' +
      (isNew ? '<div class="field"><span class="label">자주 쓰는 글</span><div class="chips">' + TEMPLATES.map(function (t, i) { return '<button type="button" class="chip" data-tpl="' + i + '">' + esc(t.label) + '</button>'; }).join('') + '</div></div>' : '') +
      '<div class="field"><label for="nTitle">제목</label><input class="input" id="nTitle" value="' + esc(d.title) + '" autofocus></div>' +
      '<div class="field"><label for="nBody">내용</label><textarea class="input" id="nBody" style="min-height:180px">' + esc(d.body) + '</textarea></div>' +
      '<div class="field"><span class="label">사진 (1장)</span><div class="img-pick"><span data-imgprev>' + (image ? '<img src="' + esc(image) + '" alt="">' : '') + '</span>' +
      '<button type="button" class="btn sm" data-pickimg>' + UI.icon('camera') + '사진 선택</button>' +
      '<button type="button" class="btn sm quiet" data-noimg' + (image ? '' : ' hidden') + '>사진 빼기</button>' +
      '<input type="file" accept="image/*" hidden data-imgfile></div></div>' +
      '<label class="check"><input type="checkbox" id="nPin"' + (d.pinned ? ' checked' : '') + '>맨 위에 고정</label>' +
      '<p class="fine">보내면 학부모 화면에 바로 나타나요. 휴대폰 푸시 알림은 2단계(서버 연결) 이후부터 함께 보내집니다.</p>';

    UI.modal({
      title: isNew ? '알림장 쓰기' : '알림장 수정', wide: true, html: html,
      actions: [{ label: '취소', kind: 'quiet' }, {
        label: isNew ? '보내기' : '저장', kind: 'primary', icon: isNew ? 'send' : null, onClick: function (root) {
          var title = root.querySelector('#nTitle').value.trim();
          var body = root.querySelector('#nBody').value.trim();
          if (!title) { UI.toast('제목을 입력해 주세요'); root.querySelector('#nTitle').focus(); return false; }
          if (target.type === 'class' && !target.classes.length) { UI.toast('받을 반을 골라 주세요'); return false; }
          if (target.type === 'students' && !target.studentIds.length) { UI.toast('받을 원생을 골라 주세요'); return false; }
          var obj = notice || { id: U.uid(), createdAt: Date.now(), reads: {}, replies: [] };
          obj.title = title;
          obj.body = body;
          obj.image = image || null;
          obj.pinned = root.querySelector('#nPin').checked;
          obj.target = target.type === 'all' ? { type: 'all' } : target.type === 'class' ? { type: 'class', classes: target.classes } : { type: 'students', studentIds: target.studentIds };
          if (!isNew) obj.updatedAt = Date.now();
          DB.upsert('notices', obj);
          var n = DB.noticeAudience(obj).length;
          UI.toast(isNew ? n + '명에게 알림장을 보냈어요' : '알림장을 고쳤어요');
          if (isNew) { App.nav('notices'); } else App.refresh();
        }
      }],
      onMount: function (root) {
        var tClasses = root.querySelector('[data-tclasses]'), tStudents = root.querySelector('[data-tstudents]');
        function paintTarget() {
          tClasses.hidden = target.type !== 'class';
          tStudents.hidden = target.type !== 'students';
          var names = target.studentIds.map(function (id) { var s = DB.student(id); return s ? s.name : ''; }).filter(Boolean);
          root.querySelector('[data-stusum]').textContent = names.length ? names.slice(0, 4).join(', ') + (names.length > 4 ? ' 외 ' + (names.length - 4) + '명' : '') : '아직 고르지 않았어요';
          var tmp = { target: target.type === 'all' ? { type: 'all' } : target };
          root.querySelector('[data-audience]').textContent = '받는 원생 ' + DB.noticeAudience(tmp).length + '명';
        }
        root.querySelector('[data-ttype]').addEventListener('click', function (e) {
          var b = e.target.closest('[data-t]');
          if (!b) return;
          target.type = b.getAttribute('data-t');
          [].forEach.call(root.querySelectorAll('[data-t]'), function (x) { x.classList.toggle('on', x === b); });
          paintTarget();
        });
        tClasses.addEventListener('click', function (e) {
          var b = e.target.closest('[data-c]');
          if (!b) return;
          var c = b.getAttribute('data-c'), i = target.classes.indexOf(c);
          if (i >= 0) target.classes.splice(i, 1); else target.classes.push(c);
          b.classList.toggle('on', i < 0);
          paintTarget();
        });
        root.querySelector('[data-pickstu]').onclick = function () {
          UI.pickStudents({ title: '알림장 받을 원생', selected: target.studentIds }).then(function (ids) {
            if (ids) { target.studentIds = ids; paintTarget(); }
          });
        };
        [].forEach.call(root.querySelectorAll('[data-tpl]'), function (b) {
          b.onclick = function () {
            var t = TEMPLATES[+b.getAttribute('data-tpl')];
            root.querySelector('#nTitle').value = t.title;
            root.querySelector('#nBody').value = t.body.replace('{도장}', st.dojangName);
            root.querySelector('#nBody').focus();
          };
        });
        var file = root.querySelector('[data-imgfile]');
        function paintImg() {
          root.querySelector('[data-imgprev]').innerHTML = image ? '<img src="' + esc(image) + '" alt="">' : '';
          root.querySelector('[data-noimg]').hidden = !image;
        }
        root.querySelector('[data-pickimg]').onclick = function () { file.click(); };
        root.querySelector('[data-noimg]').onclick = function () { image = null; paintImg(); };
        file.onchange = function () {
          var f = file.files && file.files[0];
          file.value = '';
          if (!f) return;
          U.readImage(f, 1280, 0.78).then(function (url) { image = url; paintImg(); }, function (e) { UI.toast(e.message); });
        };
        paintTarget();
      }
    });
  }

  function renderList(el) {
    var q = ns.q.trim();
    var list = DB.sortNotices(DB.state.notices).filter(function (n) {
      var t = (n.target || {}).type || 'all';
      if (ns.filter !== 'any' && t !== ns.filter) return false;
      return !q || n.title.indexOf(q) >= 0 || (n.body || '').indexOf(q) >= 0;
    });
    var h = '<header class="page-head"><div><span class="eyebrow">학부모님께 보내는 알림장</span><h1>알림장</h1></div>' +
      '<div class="actions"><button class="btn primary" type="button" data-act="new">' + UI.icon('edit') + '알림장 쓰기</button></div></header>';
    h += '<div class="toolbar"><div class="seg">' + [['any', '모두'], ['all', '전체 공지'], ['class', '반별'], ['students', '개별']].map(function (x) {
      return '<button type="button" data-act="filter" data-v="' + x[0] + '" class="' + (ns.filter === x[0] ? 'on' : '') + '">' + x[1] + '</button>';
    }).join('') + '</div><div class="search grow">' + UI.icon('search') + '<input class="input" type="search" id="nSearch" placeholder="제목, 내용으로 찾기" value="' + esc(ns.q) + '"></div></div>';
    h += '<div class="stack">';
    if (!list.length) h += '<div class="card">' + UI.empty(DB.state.notices.length ? '해당하는 알림장이 없어요' : '아직 보낸 알림장이 없어요', '공지, 수련 이야기, 준비물 안내를 보내 보세요.') + '</div>';
    list.forEach(function (n) {
      var rs = readStats(n), newRep = (n.replies || []).filter(function (r) { return !r.seen; }).length;
      h += '<button class="card n-card' + (n.pinned ? ' pinned' : '') + '" type="button" data-act="open" data-id="' + esc(n.id) + '">' +
        '<div class="n-meta">' + (n.pinned ? UI.pill('고정', 'accent') : '') + UI.pill(targetLabel(n), (n.target || {}).type === 'students' ? 'info' : '') + '<span>' + esc(U.ago(n.createdAt)) + '</span></div>' +
        '<h3>' + esc(n.title) + '</h3><p class="n-preview">' + esc(n.body) + '</p>' +
        '<div class="n-foot"><span>읽음 ' + rs.read.length + '/' + rs.aud.length + '</span><span>답글 ' + (n.replies || []).length + '</span>' +
        (newRep ? UI.pill('새 답글 ' + newRep, 'bad') : '') + (n.image ? '<span>사진 1장</span>' : '') + '</div></button>';
    });
    h += '</div>';
    el.innerHTML = h;
    var search = el.querySelector('#nSearch');
    search.addEventListener('input', U.debounce(function () {
      ns.q = search.value;
      App.refresh();
      var s2 = document.getElementById('nSearch');
      if (s2) { s2.focus(); var k = s2.value.length; try { s2.setSelectionRange(k, k); } catch (e) {} }
    }, 250));
    UI.bind(el, {
      new: function () { compose(null); },
      filter: function (b) { ns.filter = b.getAttribute('data-v'); App.refresh(); },
      open: function (b) { App.go('notices', { id: b.getAttribute('data-id') }); }
    });
  }

  function renderDetail(el, n) {
    var rs = readStats(n);
    var replies = (n.replies || []).slice().sort(function (a, b) { return a.at - b.at; });
    var h = '<div>' + UI.backLink('알림장') + '<header class="page-head"><div><span class="eyebrow">' + esc(targetLabel(n) + ' · ' + U.fmtStamp(n.createdAt)) + '</span>' +
      '<h1>' + esc(n.title) + '</h1></div><div class="actions">' +
      '<button class="btn" type="button" data-act="pin">' + UI.icon('pin') + (n.pinned ? '고정 해제' : '맨 위 고정') + '</button>' +
      '<button class="btn" type="button" data-act="edit">' + UI.icon('edit') + '수정</button>' +
      '<button class="btn danger" type="button" data-act="del">' + UI.icon('trash') + '삭제</button></div></header></div>';
    h += '<div class="card pad stack"><div class="n-full">' + esc(n.body) + '</div>' + (n.image ? '<img class="n-img" src="' + esc(n.image) + '" alt="첨부 사진">' : '') + '</div>';
    h += '<div class="cols">';
    h += '<section class="section"><div class="section-head"><h2>읽음 확인</h2><span class="sub">' + rs.read.length + ' / ' + rs.aud.length + '명 읽음</span></div><div class="card pad stack">' +
      '<div class="seg"><button type="button" data-act="rtab" data-v="unread" class="' + (ns.readTab === 'unread' ? 'on' : '') + '">안 읽음<span class="ct">' + rs.unread.length + '</span></button>' +
      '<button type="button" data-act="rtab" data-v="read" class="' + (ns.readTab === 'read' ? 'on' : '') + '">읽음<span class="ct">' + rs.read.length + '</span></button></div>';
    var names = ns.readTab === 'read' ? rs.read : rs.unread;
    h += names.length ? '<div class="name-chips">' + DB.sortStudents(names).map(function (s) { return '<span>' + esc(s.name) + '</span>'; }).join('') + '</div>'
      : '<p class="small muted">' + (ns.readTab === 'read' ? '아직 읽은 학부모가 없어요.' : '모두 읽었어요.') + '</p>';
    h += '</div></section>';
    h += '<section class="section"><div class="section-head"><h2>학부모 답글</h2><span class="sub">' + replies.length + '개</span></div><div class="card pad">';
    h += replies.length ? replies.map(function (r) {
      var s = DB.student(r.studentId);
      return '<div class="reply">' + (s ? UI.av(s, 'sm') : '') + '<div class="bubble"><div class="who">' + esc(s ? s.name + ' 보호자' : '보호자') + ' <small>' + esc(U.fmtStamp(r.at)) + '</small>' + (r.seen ? '' : UI.pill('새 답글', 'bad')) + '</div><p>' + esc(r.body) + '</p></div></div>';
    }).join('') : '<p class="small muted">아직 답글이 없어요.</p>';
    h += '</div></section></div>';
    el.innerHTML = h;

    // 관리자가 열어 본 답글은 확인한 것으로 표시
    var changed = false;
    (n.replies || []).forEach(function (r) { if (!r.seen) { r.seen = true; changed = true; } });
    if (changed) { DB.save(); App.updateShell(); }

    UI.bind(el, {
      back: function () { App.back(); },
      edit: function () { compose(n); },
      pin: function () { n.pinned = !n.pinned; DB.save(); App.refresh(); UI.toast(n.pinned ? '맨 위에 고정했어요' : '고정을 풀었어요'); },
      del: function () {
        UI.confirm({ title: '알림장 삭제', message: '"' + n.title + '" 알림장을 지울까요?\n학부모 화면에서도 사라지고 답글도 함께 지워져요.', ok: '삭제', danger: true }).then(function (ok) {
          if (!ok) return;
          DB.remove('notices', n.id);
          UI.toast('알림장을 지웠어요');
          App.nav('notices');
        });
      },
      rtab: function (b) { ns.readTab = b.getAttribute('data-v'); App.refresh(); }
    });
  }

  Views.admin.notices = {
    render: function (el, params) {
      var n = params.id && DB.byId('notices', params.id);
      if (n) renderDetail(el, n); else renderList(el);
    },
    compose: compose
  };
})();
