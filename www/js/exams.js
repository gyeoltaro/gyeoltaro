/* 승급심사 결과증 (기존 '심사체점시스템' 페이지의 채점표·급수기준·육각형 계산을 그대로 옮겼습니다) */
(function () {
  'use strict';
  var esc = U.esc;
  var xs = { date: null };

  function statusOf(x) {
    if (!x.scored) return { cls: 'pending', label: '심사 전' };
    return DB.examScore(x) >= DB.PASS_SCORE ? { cls: 'pass', label: '합격' } : { cls: 'fail', label: '불합격' };
  }
  function verdictText(x, s) {
    var score = DB.examScore(x);
    if (!x.scored) return s.name + ' 수련생은 아직 채점되지 않았습니다.';
    var text = '<최종평가>\n' + s.name + ' 수련생 최종점수 (' + score + ' , ' + (DB.examBand(score) || '-') + ') 승급심사 ' + (score >= DB.PASS_SCORE ? '합격' : '불합격') + '입니다.';
    if (x.comment) text += '\n' + x.comment;
    return text;
  }
  function nextGradeOf(x, s) { return DB.nextGrade(x.gradeAt, U.age(s.birth, x.examDate)); }

  // 원생 상세·학부모 화면용 심사 기록
  Parts.examList = function (s, admin) {
    var list = DB.examsOf(s.id);
    if (!admin) list = list.filter(function (x) { return x.scored; });
    if (!list.length) return UI.empty(admin ? '승급심사 기록이 없어요' : '아직 채점된 승급심사가 없어요');
    return list.map(function (x) {
      var st = statusOf(x);
      return '<button class="row" type="button" data-act="exam" data-id="' + esc(x.id) + '">' +
        '<span class="main"><span class="title">' + esc(U.fmtDate(x.examDate) + ' 승급심사') + '</span>' +
        '<span class="sub">' + esc(x.gradeAt + ' → ' + nextGradeOf(x, s) + (x.scored ? ' · ' + DB.examScore(x) + '점 · ' + (DB.examBand(DB.examScore(x)) || '미달') : '')) + '</span></span>' +
        '<span class="side"><span class="pill ' + (st.cls === 'pass' ? 'good' : st.cls === 'fail' ? 'bad' : 'warn') + '">' + st.label + '</span></span></button>';
    }).join('');
  };

  // 결과증 본문 (관리자는 점수 입력, 학부모는 보기만)
  Parts.certificate = function (x, s, editable) {
    var st = statusOf(x), score = DB.examScore(x), hex = DB.examHex(x);
    var since = U.addDays(x.examDate, -56);
    var attN = DB.countAtt(s.id, since, x.examDate);
    var h = '<div class="card cert"><div class="cert-head"><div class="cert-id">' + UI.av(s, 'lg') +
      '<div><h2>' + esc(s.name) + '</h2><div class="cert-sub">' +
      '<span>나이 <b>' + esc(U.age(s.birth, x.examDate) != null ? U.age(s.birth, x.examDate) + '세' : '-') + '</b></span>' +
      '<span>급수 <b>' + esc(x.gradeAt + ' → ' + nextGradeOf(x, s)) + '</b></span>' +
      '<span>심사일 <b>' + esc(U.fmtDate(x.examDate)) + '</b></span>' +
      ((s.guardians || []).length ? '<span>보호자 <b>' + esc(s.guardians.map(function (g) { return g.name; }).filter(Boolean).join(' · ')) + '</b></span>' : '') +
      '</div></div></div>' +
      (editable ? '<button class="badge ' + st.cls + '" type="button" data-act="toggle-scored" title="눌러서 채점 완료 여부를 바꿔요"><span class="dot"></span><span data-status>' + st.label + '</span></button>'
        : '<span class="badge ' + st.cls + '"><span class="dot"></span>' + st.label + '</span>') + '</div>';
    h += '<div class="cert-body"><div class="cert-panel"><h3>항목별 점수 (10점 만점)</h3><table class="scores">';
    DB.EXAM_ITEMS.forEach(function (k) {
      var v = x.items[k] || 0;
      var hint = editable && k === '성실' ? '<span class="hint-inline">심사 전 8주 출석 ' + attN + '회</span>' : '';
      h += '<tr><td>' + esc(k) + hint + '</td><td>' + (editable
        ? '<input class="score-input" type="number" inputmode="decimal" min="0" max="10" step="0.1" data-item="' + esc(k) + '" value="' + esc(v) + '" aria-label="' + esc(k) + ' 점수">'
        : esc(x.scored ? v : '-')) + '</td></tr>';
    });
    h += '<tr class="total"><td>합계</td><td data-total>' + (x.scored || editable ? score : '-') + '</td></tr></table></div>';
    h += '<div class="cert-panel"><h3>육각형 점수</h3><div class="radar" data-radar>' + UI.radar(DB.HEX_LABELS, DB.HEX_LABELS.map(function (k) { return hex[k]; }), { label: '육각형 점수' }) + '</div>' +
      '<p class="small muted" style="text-align:center">출석 · 감사노트 · 체력 · 발차기 · 겨루기 · 품새</p></div></div>';
    h += '<div class="verdict"><div class="grade-row"><div class="score-big" data-big>' + (x.scored || editable ? score : 0) + '<small>/ 100점</small></div>' +
      '<div class="grade-chip" data-band>등급 ' + esc(x.scored || editable ? (DB.examBand(score) || '미달') : '-') + '</div></div>' +
      '<p class="comment" data-verdict>' + esc(verdictText(x, s)) + '</p>' +
      (editable ? '<div class="field"><label for="xComment">사범님 코멘트</label><textarea class="input" id="xComment" placeholder="부모님께 전할 말을 적어 주세요">' + esc(x.comment || '') + '</textarea></div>' : '') +
      '</div></div>';
    return h;
  };

  // ---------- 결과증 이미지 (카톡 등으로 공유) ----------
  var C = {
    bg: '#f4f1ea', surface: '#ffffff', surface2: '#ece7dc', ink: '#201d18', inkSoft: '#514c42',
    muted: '#8b8477', line: '#ddd5c4', accent: '#a8742a', accentInk: '#6e4b19', accentSoft: '#efe0c3',
    good: '#3c7a4f', goodSoft: '#e2ede4', bad: '#a53f3f', badSoft: '#f3e2e2', pending: '#7a6a3f', pendingSoft: '#efe9d8'
  };
  function loadImg(src) {
    return new Promise(function (resolve, reject) { var i = new Image(); i.onload = function () { resolve(i); }; i.onerror = reject; i.src = src; });
  }
  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function wrap(ctx, text, maxW) {
    var lines = [];
    String(text).split('\n').forEach(function (p) {
      if (p === '') { lines.push(''); return; }
      var line = '';
      for (var i = 0; i < p.length; i++) {
        var t = line + p[i];
        if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = p[i]; } else line = t;
      }
      if (line) lines.push(line);
    });
    return lines;
  }
  function drawRadar(ctx, cx, cy, r, hex) {
    var order = DB.HEX_LABELS, n = order.length;
    function at(i, f) { var a = -Math.PI / 2 + i * (2 * Math.PI / n); return [cx + r * f * Math.cos(a), cy + r * f * Math.sin(a)]; }
    [0.25, 0.5, 0.75, 1].forEach(function (f) {
      ctx.beginPath();
      order.forEach(function (k, i) { var p = at(i, f); if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
      ctx.closePath(); ctx.strokeStyle = C.line; ctx.lineWidth = 1.5; ctx.stroke();
    });
    ctx.font = "500 20px 'Noto Sans KR', sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    order.forEach(function (k, i) {
      var e = at(i, 1), l = at(i, 1.22);
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(e[0], e[1]); ctx.strokeStyle = C.line; ctx.stroke();
      ctx.fillStyle = C.muted; ctx.fillText(k, l[0], l[1]);
    });
    ctx.beginPath();
    order.forEach(function (k, i) { var p = at(i, U.clamp((hex[k] || 0) / 10, 0, 1)); if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
    ctx.closePath(); ctx.globalAlpha = 0.92; ctx.fillStyle = C.accentSoft; ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = C.accent; ctx.lineWidth = 3; ctx.stroke();
    order.forEach(function (k, i) { var p = at(i, U.clamp((hex[k] || 0) / 10, 0, 1)); ctx.beginPath(); ctx.arc(p[0], p[1], 5, 0, Math.PI * 2); ctx.fillStyle = C.accentInk; ctx.fill(); });
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  }
  function drawBeltCircle(ctx, cx, cy, r, s) {
    var belt = DB.beltOf(s.grade);
    if (belt === '품띠') {
      ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2); ctx.closePath(); ctx.fillStyle = '#b23a3a'; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI / 2, Math.PI * 1.5); ctx.closePath(); ctx.fillStyle = '#1c1c1c'; ctx.fill();
    } else {
      var col = DB.BELT_COLOR[belt];
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = col && col.indexOf('gradient') < 0 ? col : C.surface2; ctx.fill();
    }
    ctx.fillStyle = !belt || belt === '흰띠' ? C.inkSoft : '#ffffff';
    ctx.font = "700 64px 'Noto Serif KR', serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(s.name.charAt(s.name.length > 2 ? 1 : 0), cx, cy + 4);
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  }
  function drawCard(ctx, x, s, W, photo) {
    var pad = 64, score = DB.examScore(x), st = statusOf(x), hex = DB.examHex(x);
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, 3200);
    var y = 80;
    ctx.fillStyle = C.accentInk; ctx.font = "700 22px 'Noto Sans KR', sans-serif";
    ctx.fillText(DB.settings().dojangName, pad, y); y += 50;
    ctx.fillStyle = C.ink; ctx.font = "700 46px 'Noto Serif KR', serif";
    ctx.fillText('승급심사 결과증', pad, y); y += 34;
    ctx.strokeStyle = C.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke(); y += 60;

    var R = 96, cx = pad + R, cy = y + R;
    if (photo) {
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.closePath(); ctx.clip();
      var sc = Math.max(R * 2 / photo.width, R * 2 / photo.height);
      ctx.drawImage(photo, cx - photo.width * sc / 2, cy - photo.height * sc / 2, photo.width * sc, photo.height * sc);
      ctx.restore();
    } else drawBeltCircle(ctx, cx, cy, R, s);
    ctx.strokeStyle = C.surface; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

    var ix = pad + R * 2 + 40, iy = y + 36;
    ctx.fillStyle = C.ink; ctx.font = "700 44px 'Noto Serif KR', serif"; ctx.fillText(s.name, ix, iy); iy += 42;
    ctx.font = "500 22px 'Noto Sans KR', sans-serif"; ctx.fillStyle = C.inkSoft;
    var age = U.age(s.birth, x.examDate);
    ctx.fillText((age != null ? '나이 ' + age + '세    ' : '') + '급수 ' + x.gradeAt + ' → ' + nextGradeOf(x, s), ix, iy); iy += 34;
    ctx.fillText('심사일 ' + U.fmtDate(x.examDate), ix, iy); iy += 34;
    var gnames = (s.guardians || []).map(function (g) { return g.name; }).filter(Boolean);
    if (gnames.length) { ctx.fillText('보호자 ' + gnames.join(' · '), ix, iy); iy += 34; }
    var col = st.cls === 'pending' ? C.pending : st.cls === 'pass' ? C.good : C.bad;
    var bg = st.cls === 'pending' ? C.pendingSoft : st.cls === 'pass' ? C.goodSoft : C.badSoft;
    ctx.font = "700 22px 'Noto Sans KR', sans-serif";
    var bw = ctx.measureText(st.label).width + 48;
    rr(ctx, ix, iy + 6, bw, 44, 22); ctx.fillStyle = bg; ctx.fill();
    ctx.fillStyle = col; ctx.textBaseline = 'middle'; ctx.fillText(st.label, ix + 24, iy + 28); ctx.textBaseline = 'alphabetic';

    y = Math.max(cy + R, iy + 70) + 30;
    ctx.strokeStyle = C.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke(); y += 50;
    ctx.fillStyle = C.accent; ctx.fillRect(pad, y - 20, 6, 22);
    ctx.fillStyle = C.ink; ctx.font = "700 26px 'Noto Serif KR', serif"; ctx.fillText('항목별 점수 (10점 만점)', pad + 18, y); y += 46;
    var gap = 24, cw = (W - pad * 2 - gap) / 2, rh = 44;
    function row(px, py, label, v) {
      ctx.fillStyle = C.inkSoft; ctx.font = "500 21px 'Noto Sans KR', sans-serif"; ctx.textBaseline = 'middle';
      ctx.fillText(label, px, py + 14);
      ctx.fillStyle = C.ink; ctx.font = "600 22px 'IBM Plex Mono', monospace"; ctx.textAlign = 'right';
      ctx.fillText(v == null ? '-' : String(v), px + cw, py + 14);
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      ctx.strokeStyle = C.line; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px, py + 34); ctx.lineTo(px + cw, py + 34); ctx.stroke(); ctx.setLineDash([]);
    }
    DB.EXAM_ITEMS.slice(0, 5).forEach(function (k, i) { row(pad, y + i * rh, k, x.items[k]); });
    DB.EXAM_ITEMS.slice(5).forEach(function (k, i) { row(pad + cw + gap, y + i * rh, k, x.items[k]); });
    y += 5 * rh + 20;

    ctx.strokeStyle = C.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke(); y += 50;
    ctx.fillStyle = C.accent; ctx.fillRect(pad, y - 20, 6, 22);
    ctx.fillStyle = C.ink; ctx.font = "700 26px 'Noto Serif KR', serif"; ctx.fillText('육각형 점수', pad + 18, y); y += 40;
    var rr2 = 160, rcy = y + rr2 + 20;
    drawRadar(ctx, W / 2, rcy, rr2, hex);
    y = rcy + rr2 + 60;

    ctx.strokeStyle = C.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke(); y += 50;
    ctx.font = "500 24px 'Noto Sans KR', sans-serif";
    var lines = wrap(ctx, verdictText(x, s).replace('<최종평가>\n', ''), W - pad * 2 - 100);
    var lh = 36, ph = 36 + 60 + 40 + lines.length * lh + 36;
    rr(ctx, pad, y, W - pad * 2, ph, 16); ctx.fillStyle = C.surface2; ctx.fill();
    var by = y + 36 + 50, stxt = String(x.scored ? score : 0);
    ctx.fillStyle = C.accentInk; ctx.font = "700 66px 'Noto Serif KR', serif"; ctx.fillText(stxt, pad + 40, by);
    var sw = ctx.measureText(stxt).width;
    ctx.font = "500 24px 'Noto Sans KR', sans-serif"; ctx.fillStyle = C.muted; ctx.fillText(' / 100점', pad + 40 + sw, by);
    var gt = '등급 ' + (x.scored ? (DB.examBand(score) || '미달') : '-');
    ctx.font = "600 22px 'IBM Plex Mono', monospace";
    var gw = ctx.measureText(gt).width + 32, chx = pad + 40 + sw + 150;
    rr(ctx, chx, by - 34, gw, 44, 8); ctx.fillStyle = C.surface; ctx.fill(); ctx.strokeStyle = C.line; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = C.inkSoft; ctx.textBaseline = 'middle'; ctx.fillText(gt, chx + 16, by - 12); ctx.textBaseline = 'alphabetic';
    var cy2 = by + 46;
    ctx.fillStyle = C.accent; ctx.fillRect(pad + 40, cy2 - 26, 5, lines.length * lh + 6);
    ctx.fillStyle = C.inkSoft; ctx.font = "500 24px 'Noto Sans KR', sans-serif";
    lines.forEach(function (l, i) { ctx.fillText(l, pad + 62, cy2 + i * lh); });
    y += ph + 50;
    ctx.fillStyle = C.muted; ctx.font = "500 18px 'Noto Sans KR', sans-serif";
    ctx.fillText(DB.settings().dojangName + ' · ' + U.fmtDate(U.today()) + ' 발급', pad, y);
    return y + 40;
  }

  Parts.shareCertificate = function (x, s) {
    var html = '<div data-wrap style="min-height:160px;display:flex;align-items:center;justify-content:center"><span class="muted">결과증 이미지를 만드는 중…</span></div>' +
      '<p class="fine">이미지를 길게 눌러 사진으로 저장하거나, 저장 버튼을 누르세요. 저장한 사진은 카카오톡으로 보낼 수 있어요.</p>';
    var dataUrl = null, filename = s.name + '_승급심사결과증.jpg';
    UI.modal({
      title: '결과증 이미지', html: html,
      actions: [
        { label: '공유', icon: 'share', onClick: function () {
          if (!dataUrl) return false;
          try {
            var file = new File([U.dataUrlToBlob(dataUrl)], filename, { type: 'image/jpeg' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              navigator.share({ files: [file], title: '승급심사 결과증' }).catch(function () {});
              return false;
            }
          } catch (e) {}
          UI.toast('이 화면에서는 바로 공유할 수 없어요. 이미지를 길게 눌러 저장해 주세요.');
          return false;
        } },
        { label: '저장', kind: 'primary', icon: 'download', onClick: function () { if (dataUrl) { U.download(filename, U.dataUrlToBlob(dataUrl)); UI.toast('저장을 시작했어요'); } return false; } }
      ],
      onMount: function (root) {
        var W = 1080;
        var ready = document.fonts && document.fonts.ready ? document.fonts.ready.catch(function () {}) : Promise.resolve();
        ready.then(function () { return s.photo ? loadImg(s.photo).catch(function () { return null; }) : null; }).then(function (photo) {
          var scratch = document.createElement('canvas'); scratch.width = W; scratch.height = 3200;
          var hgt = drawCard(scratch.getContext('2d'), x, s, W, photo);
          var c = document.createElement('canvas'); c.width = W; c.height = Math.ceil(hgt);
          drawCard(c.getContext('2d'), x, s, W, photo);
          dataUrl = c.toDataURL('image/jpeg', 0.92);
          root.querySelector('[data-wrap]').innerHTML = '<img class="share-img" src="' + dataUrl + '" alt="' + esc(s.name) + ' 승급심사 결과증">';
        }).catch(function () {
          root.querySelector('[data-wrap]').innerHTML = '<span class="bad-t">이미지를 만들지 못했어요. 다시 시도해 주세요.</span>';
        });
      }
    });
  };

  // ---------- 화면 ----------
  function newExamModal() {
    var date = U.today(), picked = [];
    var events = DB.state.events.filter(function (e) { return e.kind === '승급심사'; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    var html = '<div class="field"><label for="xDate">심사일</label><input class="input" type="date" id="xDate" value="' + date + '"></div>' +
      '<div class="field"><span class="label">대상 원생</span><div class="hstack"><button class="btn sm" type="button" data-pick>' + UI.icon('users') + '원생 고르기</button><span class="small soft" data-sum>아직 고르지 않았어요</span></div></div>' +
      (events.length ? '<div class="field"><label for="xEvent">또는 승급심사 신청자 불러오기</label><select class="input" id="xEvent"><option value="">선택 안 함</option>' +
        events.map(function (e) { return '<option value="' + esc(e.id) + '">' + esc(e.title + ' (' + U.fmtDate(e.date) + ') · 신청 ' + DB.appsOf(e.id).filter(function (a) { return a.status !== '취소'; }).length + '명') + '</option>'; }).join('') + '</select></div>' : '') +
      '<p class="fine">채점표가 만들어지면 한 명씩 점수를 입력하세요. 70점 이상이면 합격이에요.</p>';
    UI.modal({
      title: '승급심사 채점표 만들기', html: html,
      actions: [{ label: '취소', kind: 'quiet' }, {
        label: '만들기', kind: 'primary', onClick: function (root) {
          var d = root.querySelector('#xDate').value || U.today();
          if (!picked.length) { UI.toast('대상 원생을 골라 주세요'); return false; }
          var ev = root.querySelector('#xEvent');
          var made = 0;
          picked.forEach(function (id) {
            if (DB.state.exams.some(function (x) { return x.studentId === id && x.examDate === d; })) return;
            var s = DB.student(id);
            DB.state.exams.push({ id: U.uid(), studentId: id, examDate: d, gradeAt: s.grade, items: DB.zeroItems(), scored: false, comment: '', promoted: false, eventId: ev && ev.value ? ev.value : null });
            made++;
          });
          DB.save();
          xs.date = d;
          App.refresh();
          UI.toast(made ? made + '명의 채점표를 만들었어요' : '이미 채점표가 있는 원생들이에요');
        }
      }],
      onMount: function (root) {
        function sum() {
          var names = picked.map(function (id) { var s = DB.student(id); return s ? s.name : ''; }).filter(Boolean);
          root.querySelector('[data-sum]').textContent = names.length ? names.length + '명 · ' + names.slice(0, 3).join(', ') + (names.length > 3 ? ' 외' : '') : '아직 고르지 않았어요';
        }
        root.querySelector('[data-pick]').onclick = function () {
          UI.pickStudents({ title: '승급심사 대상', selected: picked }).then(function (ids) { if (ids) { picked = ids; sum(); } });
        };
        var ev = root.querySelector('#xEvent');
        if (ev) ev.onchange = function () {
          var e = DB.byId('events', ev.value);
          if (!e) return;
          picked = DB.appsOf(e.id).filter(function (a) { return a.status !== '취소'; }).map(function (a) { return a.studentId; });
          root.querySelector('#xDate').value = e.date;
          sum();
        };
      }
    });
  }

  function renderList(el) {
    var dates = DB.examDates();
    if (!xs.date || dates.indexOf(xs.date) < 0) {
      var today = U.today();
      var upcoming = dates.filter(function (d) { return d >= today; }).sort();
      xs.date = upcoming[0] || dates[0] || null;
    }
    var list = DB.state.exams.filter(function (x) { return x.examDate === xs.date; })
      .map(function (x) { return { x: x, s: DB.student(x.studentId) }; }).filter(function (r) { return r.s; })
      .sort(function (a, b) { return DB.classIndex(a.s.className) - DB.classIndex(b.s.className) || U.byName(a.s, b.s); });
    var scored = list.filter(function (r) { return r.x.scored; });
    var passed = scored.filter(function (r) { return DB.examScore(r.x) >= DB.PASS_SCORE; });
    var avg = scored.length ? U.round(U.sum(scored, function (r) { return DB.examScore(r.x); }) / scored.length, 1) : null;

    var h = '<header class="page-head"><div><span class="eyebrow">승급심사 결과증</span><h1>승급심사</h1></div>' +
      '<div class="actions"><button class="btn primary" type="button" data-act="new">' + UI.icon('plus') + '채점표 만들기</button></div></header>';
    if (dates.length) {
      h += '<div class="toolbar"><label for="xDateSel" class="soft nowrap">심사일</label><select class="input sm" id="xDateSel" style="width:auto">' +
        dates.map(function (d) { return '<option value="' + d + '"' + (d === xs.date ? ' selected' : '') + '>' + esc(U.fmtDate(d) + ' (' + DB.state.exams.filter(function (x) { return x.examDate === d; }).length + '명)') + '</option>'; }).join('') + '</select></div>';
    }
    h += '<div class="tiles">' +
      '<div class="card tile"><span class="t-label">대상 인원</span><span class="t-value">' + list.length + '<small>명</small></span></div>' +
      '<div class="card tile"><span class="t-label">채점 완료</span><span class="t-value">' + scored.length + '<small>/ ' + list.length + '</small></span></div>' +
      '<div class="card tile"><span class="t-label">합격률</span><span class="t-value good">' + (scored.length ? U.pct(passed.length, scored.length) + '<small>%</small>' : '-') + '</span></div>' +
      '<div class="card tile"><span class="t-label">평균 점수</span><span class="t-value">' + (avg != null ? avg + '<small>점</small>' : '-') + '</span></div></div>';
    h += '<div class="card table-wrap"><table class="t"><thead><tr><th>이름</th><th>반</th><th>급수</th><th class="num">최종점수</th><th>등급</th><th>상태</th></tr></thead><tbody>';
    if (!list.length) h += '<tr><td colspan="6">' + UI.empty('승급심사 채점표가 없어요', '"채점표 만들기"로 심사일과 대상 원생을 정하세요.') + '</td></tr>';
    list.forEach(function (r) {
      var st = statusOf(r.x), score = DB.examScore(r.x);
      h += '<tr class="click" data-act="open" data-id="' + esc(r.x.id) + '"><td><div class="hstack" style="flex-wrap:nowrap">' + UI.av(r.s, 'xs') + '<b>' + esc(r.s.name) + '</b></div></td>' +
        '<td>' + esc(r.s.className) + '</td><td>' + esc(r.x.gradeAt + ' → ' + nextGradeOf(r.x, r.s)) + (r.x.promoted ? ' ' + UI.pill('승급 완료', 'good') : '') + '</td>' +
        '<td class="num">' + (r.x.scored ? score : '—') + '</td><td>' + (r.x.scored ? esc(DB.examBand(score) || '미달') : '—') + '</td>' +
        '<td><span class="pill ' + (st.cls === 'pass' ? 'good' : st.cls === 'fail' ? 'bad' : 'warn') + '">' + st.label + '</span></td></tr>';
    });
    h += '</tbody></table></div><p class="fine">행을 누르면 결과증 화면에서 점수를 입력할 수 있어요. 채점을 마치면 상단 배지를 눌러 "채점 완료"로 바꾸세요.</p>';
    el.innerHTML = h;
    var sel = el.querySelector('#xDateSel');
    if (sel) sel.onchange = function () { xs.date = sel.value; App.refresh(); };
    UI.bind(el, {
      new: newExamModal,
      open: function (b) { App.go('exams', { id: b.getAttribute('data-id') }); }
    });
  }

  function renderCert(el, x) {
    var s = DB.student(x.studentId);
    if (!s) { renderList(el); return; }
    var same = DB.state.exams.filter(function (y) { return y.examDate === x.examDate; })
      .map(function (y) { return { y: y, s: DB.student(y.studentId) }; }).filter(function (r) { return r.s; })
      .sort(function (a, b) { return DB.classIndex(a.s.className) - DB.classIndex(b.s.className) || U.byName(a.s, b.s); });
    var idx = 0;
    same.forEach(function (r, i) { if (r.y.id === x.id) idx = i; });
    var prev = same[idx - 1], next = same[idx + 1];
    var passed = DB.examPassed(x), ng = nextGradeOf(x, s);

    var h = '<div>' + UI.backLink('심사 명단') + '<header class="page-head"><div><span class="eyebrow">' + esc(U.fmtDate(x.examDate) + ' 승급심사 · ' + (idx + 1) + ' / ' + same.length) + '</span><h1>' + esc(s.name) + ' 결과증</h1></div>' +
      '<div class="actions">' +
      '<button class="btn" type="button" data-act="prev"' + (prev ? '' : ' disabled') + '>' + UI.icon('chevL') + '이전</button>' +
      '<button class="btn" type="button" data-act="next"' + (next ? '' : ' disabled') + '>다음' + UI.icon('chevR') + '</button>' +
      '<button class="btn" type="button" data-act="share">' + UI.icon('share') + '이미지로 저장·공유</button>' +
      '<button class="btn danger" type="button" data-act="del">' + UI.icon('trash') + '삭제</button></div></header></div>';
    h += '<div data-promote>' + promoteBar(x, s, passed, ng) + '</div>';
    h += Parts.certificate(x, s, true);
    el.innerHTML = h;

    function live() {
      var score = DB.examScore(x), st = statusOf(x);
      el.querySelector('[data-total]').textContent = score;
      el.querySelector('[data-big]').innerHTML = score + '<small>/ 100점</small>';
      el.querySelector('[data-band]').textContent = '등급 ' + (DB.examBand(score) || '미달');
      el.querySelector('[data-verdict]').textContent = verdictText(x, s);
      var badge = el.querySelector('[data-act="toggle-scored"]');
      badge.className = 'badge ' + st.cls;
      badge.querySelector('[data-status]').textContent = st.label;
      var hex = DB.examHex(x);
      el.querySelector('[data-radar]').innerHTML = UI.radar(DB.HEX_LABELS, DB.HEX_LABELS.map(function (k) { return hex[k]; }), { label: '육각형 점수' });
      el.querySelector('[data-promote]').innerHTML = promoteBar(x, s, DB.examPassed(x), ng);
    }
    el.querySelector('.scores').addEventListener('input', function (e) {
      var k = e.target.getAttribute('data-item');
      if (!k) return;
      var v = parseFloat(e.target.value);
      x.items[k] = isNaN(v) ? 0 : U.clamp(v, 0, 10);
      DB.save();
      live();
    });
    el.querySelector('#xComment').addEventListener('input', U.debounce(function (e) {
      x.comment = e.target.value.trim();
      DB.save();
      el.querySelector('[data-verdict]').textContent = verdictText(x, s);
    }, 300));

    UI.bind(el, {
      back: function () { xs.date = x.examDate; App.back(); },
      prev: function () { if (prev) { App.params = { id: prev.y.id }; App.refresh(); window.scrollTo(0, 0); } },
      next: function () { if (next) { App.params = { id: next.y.id }; App.refresh(); window.scrollTo(0, 0); } },
      share: function () { Parts.shareCertificate(x, s); },
      'toggle-scored': function () { x.scored = !x.scored; DB.save(); live(); },
      promote: function () {
        var before = s.grade;
        s.grade = ng; x.promoted = true;
        DB.save();
        live();
        UI.toast(s.name + ' 급수를 ' + ng + '(으)로 올렸어요', { label: '되돌리기', fn: function () { s.grade = before; x.promoted = false; DB.save(); App.refresh(); } });
      },
      del: function () {
        UI.confirm({ title: '채점표 삭제', message: s.name + ' 원생의 ' + U.fmtDate(x.examDate) + ' 채점표를 지울까요?', ok: '삭제', danger: true }).then(function (ok) {
          if (!ok) return;
          DB.remove('exams', x.id);
          xs.date = x.examDate;
          App.back();
        });
      }
    });
  }

  function promoteBar(x, s, passed, ng) {
    if (!passed) return '';
    if (x.promoted || s.grade === ng) return '<div class="notice-bar">' + UI.icon('belt') + '<span>합격 처리 완료 · 지금 급수는 <b>' + esc(s.grade) + '</b>이에요.</span></div>';
    return '<div class="notice-bar">' + UI.icon('belt') + '<span>합격했어요! 원생 급수를 <b>' + esc(x.gradeAt + ' → ' + ng) + '</b>(으)로 올릴까요?</span>' +
      '<button class="btn sm primary" type="button" data-act="promote">급수 올리기</button></div>';
  }

  Views.admin.exams = {
    render: function (el, params) {
      var x = params.id && DB.byId('exams', params.id);
      if (x) renderCert(el, x); else renderList(el);
    },
    showDate: function (d) { xs.date = d; App.nav('exams'); }
  };
})();
