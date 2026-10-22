/* 공통 유틸리티: 날짜·금액 포맷, 이미지 줄이기, 파일 저장, 복사 */
(function () {
  'use strict';

  var U = {};
  var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  U.esc = function (s) {
    return s == null ? '' : String(s).replace(/[&<>"']/g, function (c) { return ESC[c]; });
  };

  // ---- 날짜 (모두 기기 현지 시간 기준, 'YYYY-MM-DD' 문자열) ----
  U.pad = function (n) { return (n < 10 ? '0' : '') + n; };
  U.ymd = function (d) { d = d || new Date(); return d.getFullYear() + '-' + U.pad(d.getMonth() + 1) + '-' + U.pad(d.getDate()); };
  U.ym = function (d) { d = d || new Date(); return d.getFullYear() + '-' + U.pad(d.getMonth() + 1); };
  U.today = function () { return U.ymd(new Date()); };
  U.hm = function (d) { d = d || new Date(); return U.pad(d.getHours()) + ':' + U.pad(d.getMinutes()); };
  U.parse = function (s) {
    var p = String(s).split('-');
    return new Date(+p[0], (+p[1] || 1) - 1, +p[2] || 1);
  };
  U.addDays = function (ymd, n) { var d = U.parse(ymd); d.setDate(d.getDate() + n); return U.ymd(d); };
  U.addMonths = function (ym, n) { var p = ym.split('-'); return U.ym(new Date(+p[0], +p[1] - 1 + n, 1)); };
  U.daysInMonth = function (ym) { var p = ym.split('-'); return new Date(+p[0], +p[1], 0).getDate(); };
  U.monthEnd = function (ym) { return ym + '-' + U.pad(U.daysInMonth(ym)); };
  U.diffDays = function (a, b) { return Math.round((U.parse(b) - U.parse(a)) / 86400000); };
  U.WEEK = ['일', '월', '화', '수', '목', '금', '토'];
  U.dow = function (ymd) { return U.parse(ymd).getDay(); };
  U.fmtDate = function (ymd) { return ymd ? String(ymd).replace(/-/g, '.') : '-'; };
  U.fmtMD = function (ymd) {
    if (!ymd) return '-';
    var d = U.parse(ymd);
    return (d.getMonth() + 1) + '월 ' + d.getDate() + '일 (' + U.WEEK[d.getDay()] + ')';
  };
  U.fmtLong = function (ymd) {
    var d = U.parse(ymd);
    return d.getFullYear() + '년 ' + (d.getMonth() + 1) + '월 ' + d.getDate() + '일 ' + U.WEEK[d.getDay()] + '요일';
  };
  U.fmtYM = function (ym) { var p = ym.split('-'); return p[0] + '년 ' + (+p[1]) + '월'; };
  U.fmtM = function (ym) { return (+ym.split('-')[1]) + '월'; };
  U.fmtTime = function (hm) {
    if (!hm) return '';
    var p = hm.split(':'), h = +p[0];
    return (h < 12 ? '오전 ' : '오후 ') + (h % 12 || 12) + ':' + p[1];
  };
  U.fmtStamp = function (ts) { var d = new Date(ts); return U.fmtDate(U.ymd(d)) + ' ' + U.hm(d); };
  U.ago = function (ts) {
    var s = (Date.now() - ts) / 1000;
    if (s < 60) return '방금';
    if (s < 3600) return Math.floor(s / 60) + '분 전';
    if (s < 86400) return Math.floor(s / 3600) + '시간 전';
    if (s < 86400 * 7) return Math.floor(s / 86400) + '일 전';
    return U.fmtDate(U.ymd(new Date(ts)));
  };
  // 마감일까지 남은 날 표시
  U.dueLabel = function (ymd) {
    if (!ymd) return '';
    var n = U.diffDays(U.today(), ymd);
    if (n < 0) return '마감';
    if (n === 0) return '오늘 마감';
    return '마감 D-' + n;
  };

  // ---- 숫자·금액 ----
  U.won = function (n) { return Math.round(+n || 0).toLocaleString('ko-KR') + '원'; };
  U.n = function (n) { return (+n || 0).toLocaleString('ko-KR'); };
  U.pct = function (a, b) { return b ? Math.round(a / b * 100) : 0; };
  U.clamp = function (v, lo, hi) { return Math.max(lo, Math.min(hi, v)); };
  U.round = function (v, d) { var m = Math.pow(10, d || 0); return Math.round(v * m) / m; };
  U.sum = function (arr, fn) { var t = 0; for (var i = 0; i < arr.length; i++) t += +(fn ? fn(arr[i]) : arr[i]) || 0; return t; };
  U.uid = function () { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); };
  U.digits = function (s) { return String(s == null ? '' : s).replace(/\D/g, ''); };
  U.fmtPhone = function (s) {
    var d = U.digits(s);
    if (d.length === 11) return d.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    if (d.length === 10) return d.replace(/(\d{2,3})(\d{3,4})(\d{4})/, '$1-$2-$3');
    return s || '';
  };
  U.byName = function (a, b) { return String(a.name).localeCompare(String(b.name), 'ko'); };

  // ---- 나이·학년 ----
  U.age = function (birth, at) {
    if (!birth) return null;
    var b = U.parse(birth), t = at ? U.parse(at) : new Date();
    var a = t.getFullYear() - b.getFullYear();
    if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--;
    return a;
  };
  // 한국 학년 (3월 입학 기준, 조기입학 등은 반영하지 않음)
  U.schoolYear = function (birth) {
    if (!birth) return '';
    var now = new Date();
    var year = now.getFullYear() - (now.getMonth() < 2 ? 1 : 0);
    var g = year - (+birth.slice(0, 4)) - 6;
    if (g <= 0) return '유치부';
    if (g <= 6) return '초' + g;
    if (g <= 9) return '중' + (g - 6);
    if (g <= 12) return '고' + (g - 9);
    return '성인';
  };

  U.debounce = function (fn, ms) {
    var t;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, ms);
    };
  };

  // ---- 이미지: 저장 공간을 아끼려고 크기를 줄여 JPEG data URL로 만듭니다 ----
  U.readImage = function (file, maxDim, quality) {
    return new Promise(function (resolve, reject) {
      if (!file || !/^image\//.test(file.type)) { reject(new Error('이미지 파일이 아닙니다')); return; }
      var reader = new FileReader();
      reader.onerror = function () { reject(reader.error); };
      reader.onload = function () {
        var img = new Image();
        img.onerror = function () { reject(new Error('이미지를 읽을 수 없습니다')); };
        img.onload = function () {
          var scale = Math.min(1, maxDim / Math.max(img.width, img.height));
          var w = Math.max(1, Math.round(img.width * scale));
          var h = Math.max(1, Math.round(img.height * scale));
          var c = document.createElement('canvas');
          c.width = w; c.height = h;
          var ctx = c.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          resolve(c.toDataURL('image/jpeg', quality || 0.8));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  };

  U.dataUrlToBlob = function (dataUrl) {
    var parts = dataUrl.split(','), mime = parts[0].match(/:(.*?);/)[1];
    var bin = atob(parts[1]), arr = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
  };

  // 파일 저장 시도. 미리보기 화면 등 다운로드가 막힌 곳에서는 아무 일도 일어나지 않을 수 있습니다.
  U.download = function (filename, content, type) {
    try {
      var blob = content instanceof Blob ? content : new Blob([content], { type: type || 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = filename; a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1500);
      return true;
    } catch (e) { return false; }
  };

  U.copy = function (text) {
    function fallback() {
      try {
        var ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', '');
        ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        var ok = document.execCommand('copy');
        ta.remove();
        return ok;
      } catch (e) { return false; }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallback(); });
    }
    return Promise.resolve(fallback());
  };

  // 엑셀에서 한글이 깨지지 않도록 BOM을 붙인 CSV
  U.csv = function (rows) {
    return '﻿' + rows.map(function (r) {
      return r.map(function (c) {
        var s = c == null ? '' : String(c);
        return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
      }).join(',');
    }).join('\r\n');
  };

  // ---- 백업 암호화: 비밀번호 → PBKDF2(SHA-256) → AES-256-GCM ----
  function b64(buf) {
    var a = new Uint8Array(buf), s = '';
    for (var i = 0; i < a.length; i += 0x8000) s += String.fromCharCode.apply(null, a.subarray(i, i + 0x8000));
    return btoa(s);
  }
  function unb64(str) {
    var bin = atob(str), a = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
    return a;
  }
  function deriveKey(password, salt, iterations) {
    var subtle = window.crypto && window.crypto.subtle;
    if (!subtle) return Promise.reject(new Error('이 기기에서는 암호화를 쓸 수 없어요 (https 주소나 앱에서 열어 주세요)'));
    return subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']).then(function (base) {
      return subtle.deriveKey({ name: 'PBKDF2', salt: salt, iterations: iterations, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    });
  }
  U.encryptText = function (text, password) {
    var salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12)), iterations = 250000;
    return deriveKey(password, salt, iterations).then(function (key) {
      return crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, new TextEncoder().encode(text));
    }).then(function (ct) {
      return JSON.stringify({
        format: 'tkd-backup', version: 1, cipher: 'AES-256-GCM', kdf: 'PBKDF2-SHA256', iterations: iterations,
        salt: b64(salt), iv: b64(iv), data: b64(ct), createdAt: new Date().toISOString()
      });
    });
  };
  U.isEncrypted = function (obj) { return !!(obj && obj.format === 'tkd-backup' && obj.data); };
  U.decryptText = function (obj, password) {
    return deriveKey(password, unb64(obj.salt), obj.iterations).then(function (key) {
      return crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(obj.iv) }, key, unb64(obj.data));
    }).then(function (pt) { return new TextDecoder().decode(pt); }, function (e) {
      throw new Error(/암호화/.test(e.message) ? e.message : '비밀번호가 맞지 않아요');
    });
  };

  window.U = U;
  // 화면 등록용
  window.Views = { admin: {}, parent: {} };
  window.Parts = {};
})();
