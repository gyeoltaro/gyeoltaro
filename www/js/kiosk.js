/* 출석 키오스크: 도장 태블릿(공기계)에 켜두고 아이들이 출석번호 4자리를 누릅니다 */
(function () {
  'use strict';
  var esc = U.esc;
  var CHEERS = ['오늘도 힘차게!', '바른 자세, 큰 기합!', '오늘도 최고!', '반가워요!', '멋진 하루 보내요!'];

  function makeSound() {
    var ctx = null;
    function on() { return DB.settings().kioskSound !== false; }
    function tone(freq, start, dur, type, vol) {
      var o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + start;
      o.type = type || 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.22, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(ctx.destination);
      o.start(t); o.stop(t + dur + 0.05);
    }
    return {
      unlock: function () {
        if (!on()) return;
        try {
          if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
          if (ctx.state === 'suspended') ctx.resume();
        } catch (e) { ctx = null; }
      },
      ok: function () { if (ctx && on()) { tone(880, 0, 0.14); tone(1318, 0.12, 0.24); } },
      warn: function () { if (ctx && on()) tone(660, 0, 0.2); },
      fail: function () { if (ctx && on()) tone(196, 0, 0.32, 'square', 0.08); },
      close: function () { try { if (ctx) ctx.close(); } catch (e) {} }
    };
  }
  function buzz(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }

  Views.kiosk = function (root) {
    var st = DB.settings();
    var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'del'];
    root.innerHTML =
      '<div class="kiosk">' +
      '<header class="k-top"><div class="k-brand"><b>' + esc(st.dojangName) + '</b><span>출석체크</span></div>' +
      '<div class="k-clock"><b data-time></b><span data-date></span></div></header>' +
      '<section class="k-main">' +
      '<div class="k-left"><p class="k-prompt">출석번호 4자리를 눌러 주세요</p>' +
      '<div class="k-dots" data-dots><i></i><i></i><i></i><i></i></div>' +
      '<p class="k-count">오늘 출석 <b data-count>0</b>명</p></div>' +
      '<div class="k-pad" data-pad>' + keys.map(function (k) {
        if (k === 'clear') return '<button type="button" class="fn" data-k="clear">전체 지움</button>';
        if (k === 'del') return '<button type="button" class="fn" data-k="del" aria-label="한 칸 지우기">' + UI.icon('backspace') + '</button>';
        return '<button type="button" data-k="' + k + '">' + k + '</button>';
      }).join('') + '</div>' +
      '</section>' +
      '<footer class="k-foot"><span>번호가 기억나지 않으면 사범님께 말해 주세요</span>' +
      '<button type="button" class="k-exit" data-exit>' + UI.icon('lock') + '관리자</button></footer>' +
      '<div class="k-result" data-result hidden></div>' +
      '</div>';

    var el = root.querySelector('.kiosk');
    var dots = el.querySelector('[data-dots]'), result = el.querySelector('[data-result]');
    var timeEl = el.querySelector('[data-time]'), dateEl = el.querySelector('[data-date]'), countEl = el.querySelector('[data-count]');
    var val = '', busy = false, resultTimer = null, wake = null;
    var sound = makeSound();

    function tick() {
      timeEl.textContent = U.fmtTime(U.hm());
      dateEl.textContent = U.fmtMD(U.today());
    }
    function countToday() { countEl.textContent = Object.keys(DB.day(U.today())).length; }
    function paint() {
      [].forEach.call(dots.children, function (d, i) { d.classList.toggle('on', i < val.length); });
    }
    function hideResult() {
      clearTimeout(resultTimer);
      result.hidden = true;
      result.innerHTML = '';
    }
    function showResult(kind, html, ms) {
      clearTimeout(resultTimer);
      result.className = 'k-result ' + kind;
      result.innerHTML = html;
      result.hidden = false;
      resultTimer = setTimeout(hideResult, ms);
    }
    function studentCard(s, msg, meta) {
      var b = DB.beltOf(s.grade);
      return '<div class="k-card" style="--belt:' + esc(DB.beltColor(s.grade)) + '">' + UI.av(s) +
        '<p class="k-hello">태권!</p><h2>' + esc(s.name) + '</h2>' +
        '<p class="k-sub">' + esc(s.grade + (b ? ' ' + b : '') + (s.className ? ' · ' + s.className : '')) + '</p>' +
        '<p class="k-msg">' + esc(msg) + '</p><p class="k-meta">' + esc(meta) + '</p></div>';
    }
    function fail(title, meta) {
      dots.classList.remove('shake'); void dots.offsetWidth; dots.classList.add('shake');
      sound.fail(); buzz([60, 60, 60]);
      showResult('fail', '<div class="k-card"><div class="k-icon">' + UI.icon('alert') + '</div><h2>' + esc(title) + '</h2><p class="k-meta">' + esc(meta) + '</p></div>', 2200);
    }
    function submit() {
      var pin = val;
      val = ''; paint(); busy = false;
      var s = DB.findByPin(pin);
      if (!s) { fail('없는 번호예요', '번호를 다시 확인하고 눌러 주세요'); return; }
      if (s.status === 'paused') {
        sound.warn(); buzz(80);
        showResult('warn', studentCard(s, '지금은 휴원 중이에요', '사범님께 말씀해 주세요'), 3000);
        return;
      }
      var today = U.today();
      var r = DB.checkIn(s.id, today, null, 'kiosk');
      if (r.already) {
        sound.warn(); buzz(80);
        showResult('warn', studentCard(s, '이미 출석했어요', U.fmtTime(r.rec.t) + '에 출석했어요'), 2600);
      } else {
        var n = DB.countAtt(s.id, today.slice(0, 7) + '-01', today);
        sound.ok(); buzz(40);
        showResult('ok', studentCard(s, '출석 완료 · ' + U.fmtTime(r.rec.t), '이번 달 ' + n + '번째 출석 · ' + CHEERS[n % CHEERS.length]), 3200);
      }
      countToday();
    }
    function press(k) {
      if (!result.hidden) hideResult();
      if (busy) return;
      sound.unlock();
      if (k === 'clear') val = '';
      else if (k === 'del') val = val.slice(0, -1);
      else if (val.length < 4) val += k;
      paint();
      if (val.length === 4) { busy = true; setTimeout(submit, 140); }
    }

    el.querySelector('[data-pad]').addEventListener('click', function (e) {
      var b = e.target.closest('[data-k]');
      if (b) press(b.getAttribute('data-k'));
    });
    result.addEventListener('click', hideResult);
    el.querySelector('[data-exit]').addEventListener('click', function () {
      App.askAdminPin({ title: '관리자 확인' }).then(function (ok) { if (ok) App.setSession({ role: 'admin' }); });
    });
    function onKey(e) {
      if (UI.modalOpen()) return;
      var k = /^\d$/.test(e.key) ? e.key : e.key === 'Backspace' ? 'del' : e.key === 'Escape' ? 'clear' : null;
      if (!k) return;
      e.preventDefault();
      var b = el.querySelector('[data-k="' + k + '"]');
      if (b) { b.classList.add('down'); setTimeout(function () { b.classList.remove('down'); }, 120); }
      press(k);
    }
    document.addEventListener('keydown', onKey);

    // 화면 꺼짐 방지 (지원하는 기기만)
    function requestWake() {
      try {
        if (navigator.wakeLock && document.visibilityState === 'visible') {
          navigator.wakeLock.request('screen').then(function (w) { wake = w; }, function () {});
        }
      } catch (e) {}
    }
    document.addEventListener('visibilitychange', requestWake);
    requestWake();

    tick(); countToday();
    var clock = setInterval(function () { tick(); countToday(); }, 5000);

    App.onLeave(function () {
      clearInterval(clock);
      clearTimeout(resultTimer);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', requestWake);
      try { if (wake) wake.release(); } catch (e) {}
      sound.close();
    });
  };
})();
