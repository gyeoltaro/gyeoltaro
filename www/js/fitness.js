/* 체력측정: 반별 한꺼번에 입력, 또래 비교 결과표 */
(function () {
  'use strict';
  var esc = U.esc;
  var fz = { mode: 'enter', date: null, cls: 'all', q: '', sid: null, item: null };

  function items() { return DB.settings().fitnessItems; }
  function fmtVal(it, v) { return v == null || v === '' ? '-' : U.n(v) + it.unit; }
  // 원생별 항목마다 가장 최근에 잰 값 (한 날에 일부 항목만 재도 다른 항목은 지난 기록을 씁니다)
  function merged(recs) {
    var out = { date: '', values: {} };
    recs.forEach(function (r) {
      Object.keys(r.values).forEach(function (k) {
        if (r.values[k] != null && r.values[k] !== '') out.values[k] = +r.values[k];
      });
      if (r.date > out.date) out.date = r.date;
    });
    return out;
  }
  function latestMap() {
    var by = {};
    DB.state.fitness.slice().sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; })
      .forEach(function (f) { (by[f.studentId] || (by[f.studentId] = [])).push(f); });
    var m = {};
    Object.keys(by).forEach(function (id) { m[id] = merged(by[id]); });
    return m;
  }
  function series(recs, key) {
    return recs.filter(function (r) { return r.values[key] != null && r.values[key] !== ''; }).map(function (r) { return +r.values[key]; });
  }

  // 나이별 기록 모음 (이름 없음). 서버 모드에서 학부모 화면의 또래 비교에 쓰입니다.
  // 5명보다 적은 나이 묶음은 누구 기록인지 짐작할 수 있어 빼고 '전체'에만 넣습니다.
  Parts.fitnessStats = function () {
    var latest = latestMap(), by = {}, all = {};
    Object.keys(latest).forEach(function (id) {
      var s = DB.student(id);
      if (!s || s.purged) return;
      var r = latest[id], age = U.age(s.birth, r.date);
      Object.keys(r.values).forEach(function (k) {
        (all[k] || (all[k] = [])).push(r.values[k]);
        if (age != null) { var g = by[age] || (by[age] = {}); (g[k] || (g[k] = [])).push(r.values[k]); }
      });
    });
    function sortAll(o) { Object.keys(o).forEach(function (k) { o[k].sort(function (a, b) { return a - b; }); }); }
    Object.keys(by).forEach(function (a) {
      var n = Math.max.apply(null, Object.keys(by[a]).map(function (k) { return by[a][k].length; }));
      if (n < 5) delete by[a]; else sortAll(by[a]);
    });
    sortAll(all);
    return { by: by, all: all };
  };

  // 비교할 또래 기록: 관리자는 전체 원생 자료로, 서버 모드 학부모는 통계로
  function peerPool(s, rec, latest) {
    var age = U.age(s.birth, rec.date);
    var stats = window.Cloud && Cloud.enabled && Cloud.role === 'parent' ? DB.state.fitnessStats : null;
    function size(vals) { return Math.max.apply(null, [0].concat(Object.keys(vals).map(function (k) { return vals[k].length; }))); }
    var gather;
    if (stats) {
      gather = function (d) {
        var out = {};
        Object.keys(stats.by || {}).forEach(function (a) {
          if (age != null && Math.abs(+a - age) > d) return;
          var g = stats.by[a];
          Object.keys(g).forEach(function (k) { out[k] = (out[k] || []).concat(g[k]); });
        });
        return out;
      };
    } else {
      latest = latest || latestMap();
      var pool = Object.keys(latest).map(function (id) { return { s: DB.student(id), r: latest[id] }; }).filter(function (x) { return x.s; });
      gather = function (d) {
        var out = {};
        pool.forEach(function (x) {
          var a = U.age(x.s.birth, x.r.date);
          if (d != null && age != null && a != null && Math.abs(a - age) > d) return;
          Object.keys(x.r.values).forEach(function (k) {
            var v = x.r.values[k];
            if (v != null && v !== '') (out[k] || (out[k] = [])).push(+v);
          });
        });
        return out;
      };
    }
    var vals = gather(0), scope = '같은 나이';
    if (size(vals) < 6) { vals = gather(1); scope = '비슷한 나이'; }
    if (size(vals) < 6) { vals = stats ? (stats.all || {}) : gather(null); scope = '전체 원생'; }
    return { vals: vals, scope: scope, n: size(vals) };
  }

  // 또래 비교 점수(0~10): 같은 나이 원생들의 최근 기록 중 몇 %보다 잘했는지
  function peerScore(s, rec, latest) {
    var peers = peerPool(s, rec, latest), scope = peers.scope;
    var out = {};
    items().forEach(function (it) {
      var v = rec.values[it.key];
      if (v == null || v === '') { out[it.key] = null; return; }
      v = +v;
      var vals = (peers.vals[it.key] || []).map(Number);
      if (vals.length < 3) { out[it.key] = null; return; }
      var beat = 0, tie = 0;
      vals.forEach(function (x) {
        if (x === v) tie++;
        else if (it.better === 'low' ? x > v : x < v) beat++;
      });
      var pct = (beat + tie / 2) / vals.length;
      out[it.key] = { score: U.round(0.5 + pct * 9.5, 1), top: Math.max(1, Math.round((1 - pct) * 100)) };
    });
    return { scores: out, scope: scope, n: peers.n };
  }

  function deltaHtml(it, v, pv) {
    if (v == null || v === '' || pv == null || pv === '') return '<span class="muted">-</span>';
    var d = U.round(v - pv, 1);
    if (!d) return '<span class="muted">같음</span>';
    var good = it.better === 'low' ? d < 0 : d > 0;
    return '<span class="' + (good ? 'delta-up' : 'delta-down') + '">' + (d > 0 ? '▲ +' : '▼ ') + U.n(d) + it.unit + '</span>';
  }

  // 원생 상세·학부모 화면용 결과표
  Parts.fitnessReport = function (s, opts) {
    opts = opts || {};
    var recs = DB.fitnessOf(s.id);
    if (!recs.length) {
      return '<div class="card">' + UI.empty('체력측정 기록이 없어요', opts.parent ? '측정을 하면 여기에서 결과를 볼 수 있어요.' : '체력측정 메뉴에서 측정값을 입력하세요.') + '</div>';
    }
    var last = merged(recs), prev = recs.length > 1 ? recs[recs.length - 2] : null;
    var ps = peerScore(s, last), its = items();
    var radar = UI.radar(its.map(function (it) { return it.short || it.label; }), its.map(function (it) { return ps.scores[it.key] ? ps.scores[it.key].score : null; }), { label: '또래 비교 그래프' });
    var rows = its.map(function (it) {
      var ser = series(recs, it.key);
      var v = ser.length ? ser[ser.length - 1] : null, pv = ser.length > 1 ? ser[ser.length - 2] : null, sc = ps.scores[it.key];
      return '<tr><td>' + esc(it.label) + (it.better === 'low' ? ' <span class="small muted">(짧을수록 좋음)</span>' : '') + '</td>' +
        '<td class="num"><b>' + esc(fmtVal(it, v)) + '</b></td>' +
        '<td class="num">' + deltaHtml(it, v, pv) + '</td>' +
        '<td>' + (sc ? UI.pill('상위 ' + sc.top + '%', sc.top <= 30 ? 'good' : sc.top >= 70 ? 'warn' : '') : '<span class="muted small">-</span>') + '</td>' +
        '<td>' + UI.spark(ser) + '</td></tr>';
    }).join('');
    return '<div class="card pad fit-report"><div class="radar">' + radar +
      '<p class="small muted" style="text-align:center">최근 측정 ' + esc(U.fmtDate(last.date)) + ' · ' + esc(ps.scope) + ' ' + ps.n + '명과 비교<br>바깥쪽일수록 또래보다 잘한 항목이에요</p></div>' +
      '<div class="table-wrap"><table class="t"><thead><tr><th>항목</th><th class="num">기록</th><th class="num">지난번보다</th><th>또래 비교</th><th>추이</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      (prev ? '<p class="fine" style="padding:8px 2px 0">지난 측정: ' + esc(U.fmtDate(prev.date)) + ' · 모두 ' + recs.length + '번 측정</p>' : '<p class="fine" style="padding:8px 2px 0">첫 측정이에요. 다음 측정부터 변화가 표시돼요.</p>') +
      '</div></div>';
  };

  function saveValue(sid, date, key, raw) {
    var rec = DB.fitnessAt(sid, date);
    var v = String(raw).trim().replace(/,/g, '');
    var num = v === '' ? null : Number(v);
    if (v !== '' && isNaN(num)) return false;
    if (!rec) {
      if (num == null) return true;
      rec = { id: U.uid(), studentId: sid, date: date, values: {}, memo: '' };
    }
    if (num == null) delete rec.values[key]; else rec.values[key] = num;
    if (!Object.keys(rec.values).length) DB.remove('fitness', rec.id);
    else DB.upsert('fitness', rec);
    return true;
  }

  function renderEnter(el) {
    var date = fz.date, its = items();
    var roster = DB.sortStudents(DB.active()).filter(function (s) {
      return (fz.cls === 'all' || s.className === fz.cls) && (!fz.q || s.name.indexOf(fz.q) >= 0);
    });
    var classes = DB.settings().classes;
    var dates = DB.fitnessDates();
    // 입력칸 회색 글씨로 지난번 기록 보여주기
    var prevMap = {};
    DB.state.fitness.forEach(function (f) {
      if (f.date >= date) return;
      if (!prevMap[f.studentId] || prevMap[f.studentId].date < f.date) prevMap[f.studentId] = f;
    });

    var h = '<div class="toolbar"><div class="field" style="flex-direction:row;align-items:center;gap:8px"><label for="fitDate" class="nowrap">측정일</label>' +
      '<input class="input sm" type="date" id="fitDate" value="' + esc(date) + '" style="width:auto"></div>' +
      (dates.length ? '<div class="chips scroll" style="flex:1;min-width:0">' + dates.slice(0, 6).map(function (d) {
        return '<button type="button" class="chip' + (d.date === date ? ' on' : '') + '" data-act="date" data-v="' + d.date + '">' + esc(U.fmtDate(d.date)) + '<span class="ct">' + d.count + '명</span></button>';
      }).join('') + '</div>' : '') + '</div>';
    h += '<div class="toolbar"><div class="chips scroll" style="flex:1;min-width:0"><button type="button" class="chip' + (fz.cls === 'all' ? ' on' : '') + '" data-act="cls" data-v="all">전체 반</button>' +
      classes.map(function (c) { return '<button type="button" class="chip' + (fz.cls === c ? ' on' : '') + '" data-act="cls" data-v="' + esc(c) + '">' + esc(c) + '</button>'; }).join('') + '</div>' +
      '<div class="search" style="flex:0 1 200px">' + UI.icon('search') + '<input class="input" type="search" id="fitSearch" placeholder="이름" value="' + esc(fz.q) + '"></div></div>';
    h += '<p class="fine">칸에 숫자를 넣으면 바로 저장돼요. Enter를 누르면 아래 칸으로 넘어가요. 회색 숫자는 지난번 기록이에요.</p>';

    h += '<div class="card table-wrap"><table class="t fit-table"><thead><tr><th class="nm">이름</th>' +
      its.map(function (it) { return '<th class="num">' + esc(it.label) + '<small>' + esc(it.unit) + (it.better === 'low' ? ' · 짧을수록 좋음' : '') + '</small></th>'; }).join('') +
      '<th></th></tr></thead><tbody>';
    if (!roster.length) h += '<tr><td colspan="' + (its.length + 2) + '">' + UI.empty('해당하는 원생이 없어요') + '</td></tr>';
    roster.forEach(function (s, r) {
      var rec = DB.fitnessAt(s.id, date), pv = prevMap[s.id];
      h += '<tr><td class="nm"><b>' + esc(s.name) + '</b><div class="small muted">' + esc(U.schoolYear(s.birth) + ' · ' + s.className.split(' ')[0]) + '</div></td>' +
        its.map(function (it, c) {
          var v = rec && rec.values[it.key] != null ? rec.values[it.key] : '';
          var ph = pv && pv.values[it.key] != null ? pv.values[it.key] : '';
          return '<td class="num"><input class="input" inputmode="decimal" data-sid="' + esc(s.id) + '" data-key="' + esc(it.key) + '" data-r="' + r + '" data-c="' + c + '" value="' + esc(v) + '" placeholder="' + esc(ph) + '" aria-label="' + esc(s.name + ' ' + it.label) + '"></td>';
        }).join('') +
        '<td><span class="saved-flag" data-flag="' + esc(s.id) + '">' + (rec ? '저장됨' : '') + '</span></td></tr>';
    });
    h += '</tbody></table></div>';
    return h;
  }

  function renderResults(el) {
    var students = DB.sortStudents(DB.active());
    if (!fz.sid || !DB.student(fz.sid)) {
      var withRec = students.filter(function (s) { return DB.fitnessOf(s.id).length; });
      fz.sid = (withRec[0] || students[0] || {}).id;
    }
    var its = items();
    if (!fz.item || !its.some(function (it) { return it.key === fz.item; })) fz.item = its[0] && its[0].key;
    var s = DB.student(fz.sid);
    var h = '<div class="toolbar"><label for="fitStu" class="soft nowrap">원생</label><select class="input" id="fitStu" style="max-width:320px">' +
      students.map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.id === fz.sid ? ' selected' : '') + '>' + esc(x.name + ' · ' + x.className) + '</option>'; }).join('') + '</select></div>';
    h += s ? Parts.fitnessReport(s) : UI.empty('원생이 없어요');

    // 항목별 TOP 10
    var it = its.filter(function (x) { return x.key === fz.item; })[0];
    if (it) {
      var latest = latestMap();
      var ranked = students.map(function (x) { var r = latest[x.id]; return { s: x, v: r && r.values[it.key] != null ? +r.values[it.key] : null }; })
        .filter(function (x) { return x.v != null; })
        .sort(function (a, b) { return it.better === 'low' ? a.v - b.v : b.v - a.v; }).slice(0, 10);
      h += '<section class="section"><div class="section-head"><h2>항목별 TOP 10</h2><span class="sub">원생별 가장 최근 기록 기준</span></div>' +
        '<div class="chips scroll">' + its.map(function (x) { return '<button type="button" class="chip' + (x.key === fz.item ? ' on' : '') + '" data-act="item" data-v="' + esc(x.key) + '">' + esc(x.short || x.label) + '</button>'; }).join('') + '</div>' +
        '<div class="card list">' + (ranked.length ? ranked.map(function (x, i) {
          return '<button class="row" type="button" data-act="pick" data-id="' + esc(x.s.id) + '"><b class="mono" style="width:24px;text-align:center">' + (i + 1) + '</b>' + UI.av(x.s, 'sm') +
            '<span class="main"><span class="title">' + esc(x.s.name) + '</span><span class="sub">' + esc(UI.studentSub(x.s)) + '</span></span>' +
            '<span class="side num"><b>' + esc(fmtVal(it, x.v)) + '</b></span></button>';
        }).join('') : UI.empty('기록이 없어요')) + '</div></section>';
    }
    return h;
  }

  Views.admin.fitness = {
    render: function (el) {
      if (!fz.date) fz.date = U.today();
      var h = '<header class="page-head"><div><span class="eyebrow">' + esc(items().map(function (it) { return it.short || it.label; }).join(' · ')) + '</span><h1>체력측정</h1></div>' +
        '<div class="actions"><div class="seg"><button type="button" data-act="mode" data-v="enter" class="' + (fz.mode === 'enter' ? 'on' : '') + '">측정 입력</button>' +
        '<button type="button" data-act="mode" data-v="results" class="' + (fz.mode === 'results' ? 'on' : '') + '">결과 보기</button></div>' +
        '<button class="btn" type="button" data-act="items">' + UI.icon('sliders') + '측정 항목</button></div></header>';
      h += fz.mode === 'enter' ? renderEnter(el) : renderResults(el);
      el.innerHTML = h;

      if (fz.mode === 'enter') {
        el.querySelector('#fitDate').addEventListener('change', function (e) { if (e.target.value) { fz.date = e.target.value; App.refresh(); } });
        var search = el.querySelector('#fitSearch');
        search.addEventListener('input', U.debounce(function () {
          fz.q = search.value.trim();
          App.refresh();
          var s2 = document.getElementById('fitSearch');
          if (s2) { s2.focus(); var n = s2.value.length; try { s2.setSelectionRange(n, n); } catch (e) {} }
        }, 250));
        var table = el.querySelector('.fit-table');
        table.addEventListener('change', function (e) {
          var inp = e.target;
          if (!inp.getAttribute('data-sid')) return;
          var sid = inp.getAttribute('data-sid');
          if (!saveValue(sid, fz.date, inp.getAttribute('data-key'), inp.value)) {
            UI.toast('숫자만 입력해 주세요');
            inp.focus();
            return;
          }
          var flag = table.querySelector('[data-flag="' + sid + '"]');
          if (flag) flag.textContent = DB.fitnessAt(sid, fz.date) ? '저장됨' : '';
        });
        table.addEventListener('keydown', function (e) {
          if (e.key !== 'Enter' || !e.target.getAttribute('data-sid')) return;
          e.preventDefault();
          var r = +e.target.getAttribute('data-r'), c = e.target.getAttribute('data-c');
          var next = table.querySelector('input[data-r="' + (r + 1) + '"][data-c="' + c + '"]');
          if (next) { next.focus(); next.select(); } else e.target.blur();
        });
      } else {
        el.querySelector('#fitStu').addEventListener('change', function (e) { fz.sid = e.target.value; App.refresh(); });
      }
      UI.bind(el, {
        mode: function (b) { fz.mode = b.getAttribute('data-v'); App.refresh(); },
        date: function (b) { fz.date = b.getAttribute('data-v'); App.refresh(); },
        cls: function (b) { fz.cls = b.getAttribute('data-v'); App.refresh(); },
        item: function (b) { fz.item = b.getAttribute('data-v'); App.refresh(); },
        pick: function (b) { fz.sid = b.getAttribute('data-id'); App.refresh(); window.scrollTo(0, 0); },
        items: function () { App.nav('settings'); }
      });
    }
  };
})();
