/* 공통 화면 부품: 아이콘, 모달, 알림, 비밀번호 입력, 원생 선택, 서명, 그래프 */
(function () {
  'use strict';
  var esc = U.esc;
  var UI = {};

  // ---------- 아이콘 (24px 선 아이콘) ----------
  var ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-5h4v5"/>',
    check: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><path d="m9 14.5 2 2 4-4"/>',
    ledger: '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3"/><path d="M9 7.5h6M9 11h4"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8"/><path d="M18.5 14.4A6.5 6.5 0 0 1 21.5 20"/>',
    activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="M9 10h6M9 14h6M9 18h3"/>',
    belt: '<path d="M2.5 9h19v4h-19z"/><rect x="9.5" y="7.5" width="5" height="7" rx="1"/><path d="m10.5 14.5-2 6M13.5 14.5l2 6"/>',
    sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
    tablet: '<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
    logout: '<path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/><path d="m10 8-4 4 4 4M6 12h10"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    chevL: '<path d="m15 5-7 7 7 7"/>',
    chevR: '<path d="m9 5 7 7-7 7"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    download: '<path d="M12 4v11M7 10.5 12 15.5l5-5"/><path d="M5 19.5h14"/>',
    upload: '<path d="M12 16V5M7 9.5 12 4.5l5 5"/><path d="M5 19.5h14"/>',
    ok: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    iosShare: '<path d="M12 15V3.5M8 7.5l4-4 4 4"/><path d="M8.5 10H6v11h12V10h-2.5"/>',
    share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/>',
    camera: '<path d="M4 8h3l2-2.5h6L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    trash: '<path d="M4.5 6.5h15M9.5 6.5V4h5v2.5M6.5 6.5l1 13.5h9l1-13.5"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    backspace: '<path d="M9 5h11v14H9l-6-7z"/><path d="m12.5 9.5 5 5M17.5 9.5l-5 5"/>',
    pin: '<path d="M9 3h6l-1 6 3 3H7l3-3z"/><path d="M12 12v9"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    send: '<path d="M4 12 20 4l-5 16-3-7z"/><path d="m12 13 8-9"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M2.5 20h19"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    alert: '<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17v.5"/>',
    smile: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14a4.5 4.5 0 0 0 7 0"/><path d="M9 9.5h.01M15 9.5h.01"/>'
  };
  UI.icon = function (name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  };

  // ---------- 작은 부품 ----------
  UI.av = function (s, cls) {
    var grade = s && s.grade;
    var belt = DB.beltColor(grade);
    var light = DB.beltOf(grade) === '흰띠' || !grade;
    var inner = s && s.photo ? '<img src="' + esc(s.photo) + '" alt="">' : esc(s && s.name ? s.name.charAt(s.name.length > 2 ? 1 : 0) : '?');
    return '<span class="av ' + (cls || '') + (light ? ' light' : '') + '" style="--belt:' + esc(belt) + '"><span>' + inner + '</span></span>';
  };
  UI.belt = function (grade) {
    var b = DB.beltOf(grade);
    return '<span class="belt"><i style="background:' + esc(DB.beltColor(grade)) + '"></i>' + esc(grade || '-') + (b ? ' · ' + esc(b) : '') + '</span>';
  };
  UI.pill = function (text, tone, dot) {
    return '<span class="pill ' + (tone || '') + '">' + (dot ? '<span class="dot"></span>' : '') + esc(text) + '</span>';
  };
  UI.statusPill = function (s) {
    if (s.status === 'paused') return UI.pill('휴원', 'warn');
    if (s.status === 'left') return UI.pill('퇴원', '');
    return '';
  };
  UI.empty = function (title, sub, btnHtml) {
    return '<div class="empty"><b>' + esc(title) + '</b>' + (sub ? '<span>' + esc(sub) + '</span>' : '') + (btnHtml || '') + '</div>';
  };
  UI.options = function (list, value, labelFn) {
    return list.map(function (o) {
      var v = typeof o === 'object' ? o.value : o, l = typeof o === 'object' ? o.label : (labelFn ? labelFn(o) : o);
      return '<option value="' + esc(v) + '"' + (String(v) === String(value) ? ' selected' : '') + '>' + esc(l) + '</option>';
    }).join('');
  };
  UI.backLink = function (label) {
    return '<button class="back-link" type="button" data-act="back">' + UI.icon('chevL') + esc(label || '뒤로') + '</button>';
  };
  UI.monthNav = function (ym) {
    return '<div class="month-nav"><button class="icon-btn" type="button" data-act="prev-month" aria-label="이전 달">' + UI.icon('chevL') + '</button>' +
      '<b>' + esc(U.fmtYM(ym)) + '</b>' +
      '<button class="icon-btn" type="button" data-act="next-month" aria-label="다음 달">' + UI.icon('chevR') + '</button></div>';
  };
  UI.studentSub = function (s) {
    var parts = [];
    var sy = U.schoolYear(s.birth), age = U.age(s.birth);
    if (sy) parts.push(sy + (age != null ? ' · ' + age + '세' : ''));
    if (s.className) parts.push(s.className);
    return parts.join(' · ');
  };

  // 클릭 위임: data-act="이름" 요소를 누르면 handlers[이름](요소, 이벤트) 실행
  UI.bind = function (el, handlers) {
    el.onclick = function (e) {
      var t = e.target.closest('[data-act]');
      if (!t || !el.contains(t)) return;
      var fn = handlers[t.getAttribute('data-act')];
      if (fn) { e.preventDefault(); fn(t, e); }
    };
  };

  // ---------- 모달 ----------
  var modals = [];
  UI.modalOpen = function () { return modals.length > 0; };
  // 뒤로가기·Esc로 맨 위 창 닫기. 잠금 화면(sticky)은 닫히지 않고 그대로 남습니다.
  UI.closeTop = function () {
    if (!modals.length) return false;
    var top = modals[modals.length - 1];
    if (!top.sticky) top.close();
    return true;
  };
  UI.closeAll = function () {
    modals.slice().reverse().forEach(function (m) { m.close(); });
  };
  UI.isTop = function (root) { return modals.length > 0 && modals[modals.length - 1].root === root; };
  /* opts: { title, html, wide, actions:[{label, kind, left, onClick(root, close) → false면 닫지 않음}], onMount(root, close), onClose, dismissable,
             sticky: 잠금 화면처럼 사용자가 닫을 수 없는 창, cls: 바깥 틀에 붙일 클래스 } */
  UI.modal = function (opts) {
    var back = document.createElement('div');
    back.className = 'modal-back' + (opts.cls ? ' ' + opts.cls : '');
    var acts = (opts.actions || []).map(function (a, i) {
      return '<button type="button" class="btn ' + (a.kind || '') + (a.left ? ' left' : '') + '" data-mact="' + i + '">' + (a.icon ? UI.icon(a.icon) : '') + esc(a.label) + '</button>';
    }).join('');
    back.innerHTML =
      '<div class="modal' + (opts.wide ? ' wide' : '') + '" role="dialog" aria-modal="true" aria-label="' + esc(opts.title || '') + '">' +
      '<div class="modal-head"><h2>' + esc(opts.title || '') + '</h2>' + (opts.sticky ? '' : '<button type="button" class="icon-btn" data-x aria-label="닫기">' + UI.icon('x') + '</button>') + '</div>' +
      '<div class="modal-body">' + (opts.html || '') + '</div>' +
      (acts ? '<div class="modal-foot">' + acts + '</div>' : '') +
      '</div>';
    var root = back.querySelector('.modal');
    var closed = false;
    var entry = {
      root: root,
      sticky: !!opts.sticky,
      close: function () {
        if (closed) return;
        closed = true;
        back.remove();
        modals.splice(modals.indexOf(entry), 1);
        if (!modals.length) document.body.classList.remove('modal-open');
        if (opts.onClose) opts.onClose();
        if (window.App) App.syncBack();
      }
    };
    back.addEventListener('click', function (e) {
      if (e.target === back) { if (opts.dismissable !== false && !opts.sticky) entry.close(); return; }
      if (e.target.closest('[data-x]')) { entry.close(); return; }
      var b = e.target.closest('[data-mact]');
      if (b) {
        var a = opts.actions[+b.getAttribute('data-mact')];
        var r = a.onClick ? a.onClick(root, entry.close) : undefined;
        if (r !== false) entry.close();
      }
    });
    document.getElementById('layer').appendChild(back);
    modals.push(entry);
    document.body.classList.add('modal-open');
    if (opts.onMount) opts.onMount(root, entry.close);
    var first = root.querySelector('[autofocus]');
    // 이미 창 안의 다른 칸에 입력 중이면 커서를 옮기지 않습니다
    if (first) setTimeout(function () { try { if (!root.contains(document.activeElement)) first.focus(); } catch (e) {} }, 30);
    if (window.App) App.syncBack();
    return entry.close;
  };
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modals.length) { e.preventDefault(); UI.closeTop(); }
  });

  UI.confirm = function (opts) {
    if (typeof opts === 'string') opts = { message: opts };
    return new Promise(function (resolve) {
      var done = false;
      UI.modal({
        title: opts.title || '확인',
        html: '<p class="soft" style="white-space:pre-line">' + esc(opts.message || '') + '</p>',
        actions: [
          { label: opts.cancel || '취소', kind: 'quiet', onClick: function () { done = true; resolve(false); } },
          { label: opts.ok || '확인', kind: opts.danger ? 'danger' : 'primary', onClick: function () { done = true; resolve(true); } }
        ],
        onClose: function () { if (!done) resolve(false); }
      });
    });
  };

  // ---------- 알림(토스트) ----------
  var toastEl = null, toastTimer = null;
  UI.toast = function (msg, action) {
    if (toastEl) toastEl.remove();
    clearTimeout(toastTimer);
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.setAttribute('role', 'status');
    toastEl.innerHTML = '<span>' + esc(msg) + '</span>' + (action ? '<button type="button">' + esc(action.label) + '</button>' : '');
    if (action) {
      toastEl.querySelector('button').onclick = function () {
        action.fn();
        if (toastEl) toastEl.remove();
        toastEl = null;
      };
    }
    document.getElementById('layer').appendChild(toastEl);
    var el = toastEl;
    toastTimer = setTimeout(function () { el.remove(); if (toastEl === el) toastEl = null; }, action ? 5000 : 2600);
  };

  // ---------- 비밀번호 입력 ----------
  /* opts: { title, sub, length(기본 4), check(pin) → true 또는 오류 문구, lockedMsg() → 잠겨 있으면 문구,
             sticky: 닫을 수 없는 잠금 화면, extra: { label, fn } 아래쪽 보조 버튼 } */
  UI.pinPrompt = function (opts) {
    return new Promise(function (resolve) {
      var len = opts.length || 4;
      var val = '', ok = false, onKey = null;
      var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'del'];
      var html = '<p class="pin-msg" data-msg>' + esc(opts.sub || len + '자리 번호를 눌러 주세요') + '</p>' +
        '<div class="pin-dots" data-dots>' + new Array(len + 1).join('<i></i>') + '</div>' +
        '<div class="pin-pad">' + keys.map(function (k) {
          if (k === 'clear') return '<button type="button" class="fn" data-k="clear">지우기</button>';
          if (k === 'del') return '<button type="button" class="fn" data-k="del" aria-label="한 칸 지우기">' + UI.icon('backspace') + '</button>';
          return '<button type="button" data-k="' + k + '">' + k + '</button>';
        }).join('') + '</div>' +
        (opts.extra ? '<button type="button" class="link-btn pin-extra" data-extra>' + esc(opts.extra.label) + '</button>' : '');
      var close = UI.modal({
        title: opts.title || '비밀번호',
        html: html,
        sticky: opts.sticky,
        cls: opts.sticky ? 'lock' : '',
        onClose: function () { if (onKey) document.removeEventListener('keydown', onKey); resolve(ok); },
        onMount: function (root) {
          var dots = root.querySelector('[data-dots]'), msg = root.querySelector('[data-msg]');
          function paint() {
            [].forEach.call(dots.children, function (d, i) { d.classList.toggle('on', i < val.length); });
          }
          function say(text) {
            msg.textContent = text;
            msg.classList.add('err');
            dots.classList.remove('shake'); void dots.offsetWidth; dots.classList.add('shake');
          }
          function locked() {
            var m = opts.lockedMsg && opts.lockedMsg();
            if (m) { val = ''; paint(); say(m); }
            return !!m;
          }
          function press(k) {
            if (locked()) return;
            if (k === 'clear') val = '';
            else if (k === 'del') val = val.slice(0, -1);
            else if (val.length < len) val += k;
            paint();
            if (val.length === len) {
              setTimeout(function () {
                var r = opts.check(val);
                if (r === true) { ok = true; close(); return; }
                val = ''; paint();
                say(typeof r === 'string' ? r : (opts.error || '번호가 맞지 않아요. 다시 눌러 주세요.'));
              }, 120);
            }
          }
          root.querySelector('.pin-pad').addEventListener('click', function (e) {
            var b = e.target.closest('[data-k]');
            if (b) press(b.getAttribute('data-k'));
          });
          var extra = root.querySelector('[data-extra]');
          if (extra) extra.onclick = function () { close(); opts.extra.fn(); };
          onKey = function (e) {
            if (!UI.isTop(root)) return;
            if (/^\d$/.test(e.key)) { e.preventDefault(); press(e.key); }
            else if (e.key === 'Backspace') { e.preventDefault(); press('del'); }
          };
          document.addEventListener('keydown', onKey);
          locked();
        }
      });
    });
  };

  // ---------- 원생 여러 명 고르기 ----------
  UI.pickStudents = function (opts) {
    return new Promise(function (resolve) {
      var list = DB.sortStudents(opts.students || DB.active());
      var sel = {};
      (opts.selected || []).forEach(function (id) { sel[id] = true; });
      var cls = 'all', q = '', result = null;
      var classes = DB.settings().classes;
      var html =
        '<div class="search">' + UI.icon('search') + '<input class="input" type="search" placeholder="이름으로 찾기" data-q id="pickSearch"></div>' +
        '<div class="chips scroll" data-cls><button type="button" class="chip on" data-c="all">전체</button>' +
        classes.map(function (c) { return '<button type="button" class="chip" data-c="' + esc(c) + '">' + esc(c) + '</button>'; }).join('') + '</div>' +
        '<div class="hstack"><button type="button" class="btn sm" data-all>보이는 원생 모두 선택</button><button type="button" class="btn sm quiet" data-none>선택 해제</button><span class="spacer"></span><span class="small soft" data-count></span></div>' +
        '<div class="pick-list" data-list></div>';
      UI.modal({
        title: opts.title || '원생 선택',
        html: html,
        actions: [
          { label: '취소', kind: 'quiet' },
          { label: opts.ok || '선택 완료', kind: 'primary', onClick: function () { result = Object.keys(sel).filter(function (k) { return sel[k]; }); } }
        ],
        onClose: function () { resolve(result); },
        onMount: function (root) {
          var listEl = root.querySelector('[data-list]'), countEl = root.querySelector('[data-count]');
          function visible() {
            return list.filter(function (s) {
              return (cls === 'all' || s.className === cls) && (!q || s.name.indexOf(q) >= 0);
            });
          }
          function count() { countEl.textContent = Object.keys(sel).filter(function (k) { return sel[k]; }).length + '명 선택'; }
          function paint() {
            var v = visible();
            listEl.innerHTML = v.length ? v.map(function (s) {
              return '<label><input type="checkbox" data-id="' + esc(s.id) + '"' + (sel[s.id] ? ' checked' : '') + '>' +
                UI.av(s, 'xs') + '<b>' + esc(s.name) + '</b><span class="sub">' + esc(s.className || '') + '</span></label>';
            }).join('') : UI.empty('찾는 원생이 없어요');
            count();
          }
          listEl.addEventListener('change', function (e) {
            var id = e.target.getAttribute('data-id');
            if (id) { sel[id] = e.target.checked; count(); }
          });
          root.querySelector('[data-q]').addEventListener('input', function (e) { q = e.target.value.trim(); paint(); });
          root.querySelector('[data-cls]').addEventListener('click', function (e) {
            var b = e.target.closest('[data-c]');
            if (!b) return;
            cls = b.getAttribute('data-c');
            [].forEach.call(root.querySelectorAll('[data-c]'), function (x) { x.classList.toggle('on', x === b); });
            paint();
          });
          root.querySelector('[data-all]').addEventListener('click', function () { visible().forEach(function (s) { sel[s.id] = true; }); paint(); });
          root.querySelector('[data-none]').addEventListener('click', function () { sel = {}; paint(); });
          paint();
        }
      });
    });
  };

  // ---------- 서명 ----------
  UI.signaturePad = function (wrap) {
    var canvas = wrap.querySelector('canvas'), ph = wrap.querySelector('.ph');
    var ctx = canvas.getContext('2d'), drawing = false, empty = true, last = null;
    function size() {
      var r = canvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#201d18';
    }
    function pos(e) { var r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    canvas.addEventListener('pointerdown', function (e) {
      drawing = true; last = pos(e);
      try { canvas.setPointerCapture(e.pointerId); } catch (x) {}
      ctx.beginPath(); ctx.arc(last.x, last.y, 1.2, 0, Math.PI * 2); ctx.fillStyle = '#201d18'; ctx.fill();
      if (empty) { empty = false; ph.hidden = true; }
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!drawing) return;
      var p = pos(e);
      ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      last = p;
    });
    function end() { drawing = false; }
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);
    size();
    return {
      clear: function () { size(); ctx.clearRect(0, 0, canvas.width, canvas.height); empty = true; ph.hidden = false; },
      isEmpty: function () { return empty; },
      toDataURL: function () {
        // 저장 용량을 줄이려고 가로 480px로 줄여 저장
        var w = 480, h = Math.round(canvas.height / canvas.width * w);
        var c = document.createElement('canvas'); c.width = w; c.height = h;
        c.getContext('2d').drawImage(canvas, 0, 0, w, h);
        return c.toDataURL('image/png');
      }
    };
  };

  // ---------- 그래프 ----------
  // 레이더(육각형) 그래프: values는 0~max
  UI.radar = function (labels, values, opts) {
    opts = opts || {};
    var n = labels.length, max = opts.max || 10, cx = 120, cy = 116, r = 80;
    function pt(i, frac) {
      var a = -Math.PI / 2 + i * (2 * Math.PI / n);
      return [cx + r * frac * Math.cos(a), cy + r * frac * Math.sin(a)];
    }
    var svg = '<svg viewBox="0 0 240 232" role="img" aria-label="' + esc(opts.label || '항목별 점수 그래프') + '">';
    [0.25, 0.5, 0.75, 1].forEach(function (f) {
      svg += '<polygon points="' + labels.map(function (l, i) { return pt(i, f).join(','); }).join(' ') + '" fill="none" stroke="var(--line)" stroke-width="1"/>';
    });
    labels.forEach(function (l, i) {
      var e = pt(i, 1), t = pt(i, 1.24);
      svg += '<line x1="' + cx + '" y1="' + cy + '" x2="' + e[0] + '" y2="' + e[1] + '" stroke="var(--line)" stroke-width="1"/>';
      svg += '<text x="' + t[0] + '" y="' + t[1] + '" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="var(--ink-soft)" font-family="Noto Sans KR, sans-serif">' + esc(l) + '</text>';
    });
    var has = values.some(function (v) { return v != null; });
    if (has) {
      var pts = values.map(function (v, i) { return pt(i, U.clamp((+v || 0) / max, 0, 1)); });
      svg += '<polygon points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2" fill-opacity="0.92"/>';
      pts.forEach(function (p) { svg += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.8" fill="var(--accent-ink)"/>'; });
    }
    return svg + '</svg>';
  };

  // 작은 추세선
  UI.spark = function (values, opts) {
    opts = opts || {};
    var w = opts.w || 96, h = opts.h || 28, pad = 3;
    var v = values.filter(function (x) { return x != null; });
    if (v.length < 2) return '<span class="small muted">-</span>';
    var lo = Math.min.apply(null, v), hi = Math.max.apply(null, v);
    if (hi === lo) { hi += 1; lo -= 1; }
    var pts = v.map(function (x, i) {
      return [pad + i * (w - pad * 2) / (v.length - 1), h - pad - (x - lo) / (hi - lo) * (h - pad * 2)];
    });
    var line = pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
    var area = 'M' + pts[0][0] + ',' + (h - pad) + ' L' + line.replace(/ /g, ' L') + ' L' + pts[pts.length - 1][0] + ',' + (h - pad) + ' Z';
    var end = pts[pts.length - 1];
    return '<svg class="spark" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true">' +
      '<path d="' + area + '" fill="var(--accent-soft)"/>' +
      '<polyline points="' + line + '" fill="none" stroke="var(--accent)" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<circle cx="' + end[0] + '" cy="' + end[1] + '" r="2.6" fill="var(--accent-ink)"/></svg>';
  };

  // 달력: marks = { 'YYYY-MM-DD': true }
  UI.calendar = function (ym, marks) {
    var first = U.parse(ym + '-01').getDay(), days = U.daysInMonth(ym), today = U.today();
    var h = '<div class="cal">' + U.WEEK.map(function (w) { return '<span class="wd">' + w + '</span>'; }).join('');
    for (var i = 0; i < first; i++) h += '<span class="d blank"></span>';
    for (var d = 1; d <= days; d++) {
      var ymd = ym + '-' + U.pad(d), dow = (first + d - 1) % 7;
      var c = 'd' + (marks[ymd] ? ' on' : '') + (ymd === today ? ' today' : '') + (dow === 0 ? ' sun' : '') + (ymd > today ? ' future' : '');
      h += '<span class="' + c + '">' + d + '</span>';
    }
    return h + '</div>';
  };

  window.UI = UI;
})();
