/* 엑셀에서 원생 가져오기: 다른 프로그램에서 쓰던 명단을 원생으로 옮겨요.
   .xlsx, .csv(한글 엑셀의 EUC-KR 포함), 웹 프로그램이 내려 주는 표 모양 .xls, 엑셀에서 복사해 붙여 넣은 표를 읽어요.
   파일은 이 브라우저 안에서만 읽어요. .xlsx 는 압축(zip) 안의 XML을 직접 풀어 읽어서 따로 받는 프로그램이 없어요. */
(function () {
  'use strict';
  var esc = U.esc;

  // ---------- 파일 읽기 ----------
  function decodeText(bytes) {
    var u8 = new Uint8Array(bytes);
    try { return new TextDecoder('utf-8', { fatal: true }).decode(u8).replace(/^﻿/, ''); }
    catch (e) { return new TextDecoder('euc-kr').decode(u8); }   // 한글 윈도우 엑셀이 저장한 CSV
  }

  // 쉼표(CSV)나 탭(엑셀에서 복사)으로 나뉜 글을 표로
  function parseDelimited(text) {
    var first = text.split(/\r?\n/)[0] || '';
    var sep = (first.match(/\t/g) || []).length >= (first.match(/,/g) || []).length && first.indexOf('\t') >= 0 ? '\t' : ',';
    var rows = [], row = [], cell = '', q = false;
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      if (q) {
        if (ch === '"') { if (text.charAt(i + 1) === '"') { cell += '"'; i++; } else q = false; }
        else cell += ch;
      } else if (ch === '"' && cell === '') q = true;
      else if (ch === sep) { row.push(cell); cell = ''; }
      else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && text.charAt(i + 1) === '\n') i++;
        row.push(cell); rows.push(row); row = []; cell = '';
      } else cell += ch;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return rows;
  }

  // 웹 프로그램의 "엑셀 다운로드"는 이름만 .xls 이고 속은 HTML 표인 경우가 많아요
  function parseHtmlTables(text) {
    var doc = new DOMParser().parseFromString(text, 'text/html');
    return [].map.call(doc.querySelectorAll('table'), function (t, i) {
      return {
        name: '표 ' + (i + 1),
        rows: [].map.call(t.querySelectorAll('tr'), function (tr) {
          return [].map.call(tr.querySelectorAll('th,td'), function (c) { return c.textContent.replace(/\s+/g, ' ').trim(); });
        })
      };
    }).filter(function (s) { return s.rows.length; });
  }

  // .xlsx: zip 목록을 읽고, 필요한 파일만 브라우저의 압축 풀기(DecompressionStream)로 풀어요
  function unzip(buf) {
    var u8 = new Uint8Array(buf), dv = new DataView(buf), eocd = -1;
    for (var i = u8.length - 22; i >= Math.max(0, u8.length - 65557); i--) if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    if (eocd < 0) throw new Error('엑셀(.xlsx) 파일을 열지 못했어요');
    var n = dv.getUint16(eocd + 10, true), off = dv.getUint32(eocd + 16, true), files = {};
    for (var k = 0; k < n && dv.getUint32(off, true) === 0x02014b50; k++) {
      var nameLen = dv.getUint16(off + 28, true), local = dv.getUint32(off + 42, true);
      var name = new TextDecoder().decode(u8.subarray(off + 46, off + 46 + nameLen));
      var start = local + 30 + dv.getUint16(local + 26, true) + dv.getUint16(local + 28, true);
      files[name] = { method: dv.getUint16(off + 10, true), data: u8.subarray(start, start + dv.getUint32(off + 20, true)) };
      off += 46 + nameLen + dv.getUint16(off + 30, true) + dv.getUint16(off + 32, true);
    }
    return files;
  }
  function zipText(files, name) {
    var f = files[name.replace(/^\//, '')];
    if (!f) return Promise.resolve(null);
    if (f.method === 0) return Promise.resolve(new TextDecoder().decode(f.data));
    if (f.method !== 8) return Promise.reject(new Error('이 엑셀 파일 형식은 읽지 못해요'));
    if (typeof DecompressionStream === 'undefined') return Promise.reject(new Error('이 브라우저는 .xlsx 파일을 읽지 못해요. 엑셀에서 CSV로 저장하거나, 표를 복사해 붙여 넣어 주세요.'));
    var stream = new Blob([f.data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return new Response(stream).arrayBuffer().then(function (b) { return new TextDecoder().decode(b); });
  }
  function xml(text) { return new DOMParser().parseFromString(text, 'application/xml'); }
  function tags(node, name) { return [].slice.call(node.getElementsByTagNameNS('*', name)); }
  function colIndex(ref) {
    var m = /^([A-Z]+)/.exec(ref || ''), n = 0;
    if (!m) return -1;
    for (var i = 0; i < m[1].length; i++) n = n * 26 + m[1].charCodeAt(i) - 64;
    return n - 1;
  }
  function readXlsx(buf) {
    var files = unzip(buf);
    return Promise.all([zipText(files, 'xl/workbook.xml'), zipText(files, 'xl/_rels/workbook.xml.rels'), zipText(files, 'xl/sharedStrings.xml')]).then(function (r) {
      if (!r[0]) throw new Error('엑셀(.xlsx) 파일을 열지 못했어요');
      var rels = {};
      if (r[1]) tags(xml(r[1]), 'Relationship').forEach(function (x) { rels[x.getAttribute('Id')] = x.getAttribute('Target'); });
      // 글자 칸 목록 (발음 표시 rPh 는 빼요)
      var shared = r[2] ? tags(xml(r[2]), 'si').map(function (si) {
        return tags(si, 't').filter(function (t) { return t.parentNode.localName !== 'rPh'; }).map(function (t) { return t.textContent; }).join('');
      }) : [];
      var sheets = tags(xml(r[0]), 'sheet').map(function (s) {
        var target = rels[s.getAttribute('r:id') || s.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id')] || '';
        return { name: s.getAttribute('name'), path: target.charAt(0) === '/' ? target.slice(1) : 'xl/' + target };
      });
      return Promise.all(sheets.map(function (s) {
        return zipText(files, s.path).then(function (text) {
          var rows = [];
          if (text) tags(xml(text), 'row').forEach(function (rowEl) {
            var row = [];
            tags(rowEl, 'c').forEach(function (c, i) {
              var t = c.getAttribute('t'), v = tags(c, 'v')[0], col = colIndex(c.getAttribute('r'));
              var val = t === 's' ? shared[+(v && v.textContent)] || ''
                : t === 'inlineStr' ? tags(c, 't').map(function (x) { return x.textContent; }).join('')
                : t === 'b' ? (v && v.textContent === '1' ? 'TRUE' : 'FALSE')
                : v ? v.textContent : '';
              row[col < 0 ? i : col] = val;
            });
            var at = +rowEl.getAttribute('r');
            rows[at > 0 ? at - 1 : rows.length] = row;
          });
          // 빈 줄·빈 칸(엑셀이 건너뛴 자리)도 빈 값으로 채워요
          return { name: s.name, rows: Array.from(rows, function (x) { return Array.from(x || [], function (c) { return c == null ? '' : c; }); }) };
        });
      }));
    });
  }

  // 파일 → [{ name, rows }]
  function readFile(file) {
    return file.arrayBuffer().then(function (buf) {
      var head = new Uint8Array(buf.slice(0, 8));
      if (head[0] === 0x50 && head[1] === 0x4b) return readXlsx(buf);
      // 엑셀의 "유니코드 텍스트" 저장 (UTF-16)
      if (head[0] === 0xff && head[1] === 0xfe) return [{ name: file.name, rows: parseDelimited(new TextDecoder('utf-16le').decode(buf).replace(/^\ufeff/, '')) }];
      if (head[0] === 0xd0 && head[1] === 0xcf) throw new Error('옛 엑셀(.xls) 파일이에요. 엑셀에서 "다른 이름으로 저장 → Excel 통합 문서(.xlsx)"로 바꾸거나, 표를 복사해 붙여 넣어 주세요.');
      var text = decodeText(buf);
      if (/^\s*</.test(text) && /<table/i.test(text)) return parseHtmlTables(text);
      return [{ name: file.name, rows: parseDelimited(text) }];
    });
  }

  // ---------- 칸 맞추기 ----------
  var FIELDS = [
    ['', '가져오지 않음'], ['name', '이름 *'], ['birth', '생년월일'], ['gender', '성별'], ['school', '학교'], ['className', '반 (수련 시간)'],
    ['grade', '급수 · 띠'], ['joinDate', '입관일'], ['fee', '월 회비'], ['status', '상태 (재원·휴원·퇴원)'], ['pin', '출석번호'], ['memo', '메모'],
    ['g1Name', '보호자1 이름'], ['g1Rel', '보호자1 관계'], ['g1Phone', '보호자1 연락처'],
    ['g2Name', '보호자2 이름'], ['g2Rel', '보호자2 관계'], ['g2Phone', '보호자2 연락처']
  ];
  var TEMPLATE = ['이름', '생년월일', '성별', '학교', '반', '급수', '입관일', '월 회비', '상태', '보호자1 이름', '보호자1 관계', '보호자1 연락처', '보호자2 이름', '보호자2 관계', '보호자2 연락처', '메모'];
  function norm(h) { return String(h || '').replace(/[\s()\[\]._\-·:*]/g, '').toLowerCase(); }
  function relOf(h) {
    if (/어머니|엄마|모친|母/.test(h)) return '어머니';
    if (/아버지|아빠|부친|父/.test(h)) return '아버지';
    if (/할머니|할아버지|조부|조모/.test(h)) return '조부모';
    if (/부모|보호자/.test(h)) return '';
    return /^모/.test(h) ? '어머니' : /^부/.test(h) ? '아버지' : '';
  }
  // 제목 줄을 보고 칸마다 짐작해요. 보호자 칸은 나온 순서대로 1, 2번
  function guess(headers) {
    var used = {}, map = [], rel = {}, gN = { Name: 0, Phone: 0, Rel: 0 };
    function take(f) { if (!f || used[f]) return ''; used[f] = true; return f; }
    function guardian(kind, h) {
      for (var i = 1; i <= 2; i++) {
        var f = 'g' + i + kind;
        if (used[f]) continue;
        // 어머니·아버지가 따로 적힌 표는 관계가 같은 보호자 번호에 모아요
        var r = relOf(h);
        if (r && rel[i] && rel[i] !== r) continue;
        if (r) rel[i] = r;
        return take(f);
      }
      return '';
    }
    headers.forEach(function (raw) {
      var h = norm(raw), f = '';
      var isGuardian = /보호자|학부모|부모|어머니|엄마|아버지|아빠|모친|부친|^[부모](이름|성명|연락처|전화|휴대폰|핸드폰|hp)/.test(h);
      var isPhone = /연락처|전화|휴대폰|핸드폰|폰|^hp|tel|mobile|phone/.test(h);
      if (/학생|원생|본인|자녀|아이/.test(h) && isPhone) f = '';
      else if (isPhone) f = guardian('Phone', h);
      else if (/관계/.test(h)) f = guardian('Rel', h);
      else if (isGuardian) f = guardian('Name', h);
      else if (/^(이름|성명|원생명|원생이름|학생명|학생이름|수련생|수련생명|회원명|회원이름|name|아동명)$/.test(h) || (/이름|성명/.test(h) && !isGuardian)) f = take('name');
      else if (/생년월일|생일|출생|birth/.test(h)) f = take('birth');
      else if (/^(성별|gender|sex|남녀)$/.test(h)) f = take('gender');
      else if (/학교|school/.test(h)) f = take('school');
      else if (/입관|등록일|가입일|입회|입학일|시작일|join/.test(h)) f = take('joinDate');
      else if (/출석번호|출결번호|출석코드|출석id/.test(h)) f = take('pin');
      else if (/회비|수강료|교육비|원비|금액|fee/.test(h) && !/일$|일자|날짜|여부|방법/.test(h)) f = take('fee');
      else if (/급수|^급$|띠|^단$|^품$|단급|급단|grade|belt/.test(h)) f = take('grade');
      else if (/^(반|부|반명|반이름|반시간|수업|수업시간|시간|시간대|타임|클래스|class|수련시간|부서)$|반$/.test(h)) f = take('className');
      else if (/^(상태|재원여부|재원상태|구분|회원상태)$/.test(h)) f = take('status');
      else if (/메모|비고|특이사항|참고|기타|memo|note/.test(h)) f = 'memo';
      map.push(f);
    });
    return { map: map, rel: rel };
  }

  // ---------- 값 정리 ----------
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ymdOk(y, m, d) { var t = new Date(y, m - 1, d); return t.getFullYear() === y && t.getMonth() === m - 1 && t.getDate() === d && y > 1930 && y < 2100; }
  function century(yy) { return yy + (yy > new Date().getFullYear() % 100 ? 1900 : 2000); }
  // 2016-03-15, 2016.3.15, 16.03.15, 20160315, 160315, 2016년 3월 15일, 엑셀 날짜 숫자
  function parseDate(v) {
    var s = String(v == null ? '' : v).trim(), m, y, mo, d;
    if (!s) return { v: '' };
    if (/^\d{5}(\.\d+)?$/.test(s) && +s > 10000 && +s < 80000) {
      var t = new Date(Date.UTC(1899, 11, 30) + Math.floor(+s) * 86400000);
      return { v: t.getUTCFullYear() + '-' + pad(t.getUTCMonth() + 1) + '-' + pad(t.getUTCDate()) };
    }
    if ((m = /^(\d{4})(\d{2})(\d{2})$/.exec(s))) { y = +m[1]; mo = +m[2]; d = +m[3]; }
    else if ((m = /^(\d{2})(\d{2})(\d{2})$/.exec(s))) { y = century(+m[1]); mo = +m[2]; d = +m[3]; }
    else if ((m = /^(\d{2,4})\s*[.\-\/년]\s*(\d{1,2})\s*[.\-\/월]\s*(\d{1,2})/.exec(s))) { y = m[1].length === 2 ? century(+m[1]) : +m[1]; mo = +m[2]; d = +m[3]; }
    if (y && ymdOk(y, mo, d)) return { v: y + '-' + pad(mo) + '-' + pad(d) };
    return { v: '', bad: s };
  }
  // 엑셀이 숫자로 바꿔 앞의 0이 빠진 번호(1012345678)도 되살려요
  function phone(v) {
    var d = U.digits(v);
    if (/^\s*\+?82/.test(String(v || '')) && d.length >= 11) d = '0' + d.slice(2).replace(/^0/, '');   // +82 10-…
    if (d.length === 10 && /^1[016789]/.test(d)) d = '0' + d;
    return d;
  }
  // 150,000원 · 15만원 · 13만5천 · 엑셀 숫자(150000.0)
  function money(v) {
    var s = String(v == null ? '' : v).replace(/[,\s원₩]/g, ''), m;
    if (!s) return null;
    if ((m = /^([\d.]+)만(?:(\d+)천)?(\d*)$/.exec(s))) return Math.round(parseFloat(m[1]) * 10000) + (+m[2] || 0) * 1000 + (+m[3] || 0);
    if (/^\d+(\.\d+)?(e\d+)?$/i.test(s)) return Math.round(parseFloat(s));
    var d = U.digits(s);
    return d === '' ? null : +d;
  }
  function gender(v) {
    var s = norm(v);
    if (/^(남|남자|남아|m|male|man|boy|1|3)$/.test(s)) return 'M';
    if (/^(여|여자|여아|f|female|woman|girl|2|4)$/.test(s)) return 'F';
    return '';
  }
  // 급수 → 9급~1급, 1품~4품, 1단~4단. 띠 이름만 있으면 그 띠의 가장 낮은 급수로
  function grade(v) {
    var s = String(v || '').replace(/\s/g, '');
    if (!s) return { v: '' };
    var m = /(\d)\s*(급|품|단)/.exec(s);
    if (m && DB.GRADES.indexOf(m[1] + m[2]) >= 0) return { v: m[1] + m[2] };
    var belt = /흰|하양|백/.test(s) ? '흰띠' : /노랑|노란|황/.test(s) ? '노란띠' : /초록|녹/.test(s) ? '초록띠' : /파랑|파란|청/.test(s) ? '파랑띠'
      : /보라/.test(s) ? '보라띠' : /밤|갈색/.test(s) ? '밤띠' : /주황/.test(s) ? '주황띠' : /빨강|빨간|적|홍/.test(s) ? '빨강띠' : /검정|검은|흑/.test(s) ? '검정띠' : /품띠/.test(s) ? '품띠' : '';
    for (var i = 0; belt && i < DB.GRADES.length; i++) if (DB.beltOf(DB.GRADES[i]) === belt) return { v: DB.GRADES[i] };
    return { v: '', bad: s };
  }
  function status(v) {
    var s = norm(v);
    if (/휴원|휴관|휴식|쉼|정지/.test(s)) return 'paused';
    if (/퇴원|탈퇴|그만|종료|해지|퇴관/.test(s)) return 'left';
    return 'active';
  }
  // 반: 지금 반 이름과 같거나 앞부분이 같으면 그 반, 아니면 새 반
  function classOf(v, classes) {
    var s = String(v || '').trim();
    if (!s) return '';
    var k = norm(s);
    for (var i = 0; i < classes.length; i++) if (norm(classes[i]) === k) return classes[i];
    for (i = 0; i < classes.length; i++) if (norm(classes[i]).indexOf(k) === 0 || k.indexOf(norm(classes[i])) === 0) return classes[i];
    return s;
  }

  // 표 한 장 + 칸 맞추기 → 가져올 원생 목록과 문제
  function build(sheet, opt) {
    var classes = DB.settings().classes, rows = sheet.rows.slice(opt.header ? 1 : 0);
    var existing = DB.state.students.filter(function (s) { return !s.purged; });
    var seen = {}, out = [], newClasses = [];
    var headers = opt.header ? sheet.rows[0] || [] : [];
    var memoCols = opt.map.filter(function (f) { return f === 'memo'; }).length;
    rows.forEach(function (cells, ri) {
      if (!cells.some(function (c) { return String(c == null ? '' : c).trim(); })) return;
      var r = { line: ri + (opt.header ? 2 : 1), issues: [], memo: [] }, g = [{}, {}];
      opt.map.forEach(function (f, ci) {
        if (!f) return;
        var raw = String(cells[ci] == null ? '' : cells[ci]).trim();
        if (!raw) return;
        // 메모로 가는 칸이 여럿이면 칸 이름을 붙여 구분해요
        if (f === 'memo') { r.memo.push((memoCols > 1 && opt.header && headers[ci] ? String(headers[ci]).trim() + ': ' : '') + raw); return; }
        var gm = /^g([12])(Name|Rel|Phone)$/.exec(f);
        if (gm) { g[gm[1] - 1][gm[2]] = raw; return; }
        r[f] = raw;
      });
      var s = { id: U.uid(), name: (r.name || '').replace(/\s+/g, ' '), createdAt: Date.now(), importedAt: U.today(), photo: null };
      if (!s.name) { r.skip = '이름 없음'; out.push({ r: r, s: s }); return; }
      var b = parseDate(r.birth), j = parseDate(r.joinDate), gr = grade(r.grade);
      if (b.bad) r.issues.push('생년월일 "' + b.bad + '"을(를) 읽지 못했어요');
      if (j.bad) r.issues.push('입관일 "' + j.bad + '"을(를) 읽지 못했어요');
      if (gr.bad) r.issues.push('급수 "' + gr.bad + '" → 9급으로');
      s.birth = b.v; s.joinDate = j.v; s.grade = gr.v || '9급';
      s.gender = gender(r.gender); s.school = r.school || '';
      s.className = classOf(r.className, classes) || classes[0] || '';
      if (s.className && classes.indexOf(s.className) < 0 && newClasses.indexOf(s.className) < 0) newClasses.push(s.className);
      var fee = money(r.fee);
      s.fee = fee == null || fee === +DB.settings().monthlyFee ? null : fee;
      s.status = status(r.status);
      if (s.status === 'left') s.leftAt = U.today();
      // 엑셀이 숫자로 바꿔 앞의 0이 빠진 출석번호(0123 → 123)도 4자리로
      var pin = U.digits(String(r.pin || '').replace(/\.0+$/, ''));
      s.pin = pin.length && pin.length <= 4 ? ('000' + pin).slice(-4) : '';
      s.memo = r.memo.join('\n');
      s.guardians = [];
      g.forEach(function (x, i) {
        var p = phone(x.Phone);
        if (x.Phone && p.length < 9) r.issues.push('보호자' + (i + 1) + ' 연락처 "' + x.Phone + '"이(가) 이상해요');
        // 관계는 앱의 네 가지(어머니·아버지·조부모·보호자) 중 하나로
        var rel = x.Rel ? relOf(norm(x.Rel)) || '보호자' : opt.rel[i + 1] || (i === 0 ? '어머니' : '아버지');
        if (x.Name || p) s.guardians.push({ name: x.Name || '', relation: rel, phone: p });
      });
      if (!s.guardians.some(function (x) { return x.phone; })) r.issues.push('보호자 연락처가 없어요 (학부모 초대에 필요)');
      // 같은 원생: 이름이 같고 생년월일이 같거나 한쪽이 비어 있으면
      var key = s.name + '|' + s.birth;
      var dup = existing.some(function (x) { return x.name === s.name && (!x.birth || !s.birth || x.birth === s.birth); });
      if (dup) r.skip = '이미 있는 원생';
      else if (seen[key]) r.skip = '표 안에서 겹침';
      seen[key] = true;
      out.push({ r: r, s: s });
    });
    return { list: out, newClasses: newClasses };
  }

  // ---------- 화면 ----------
  Parts.importStudents = function () {
    UI.modal({
      title: '엑셀에서 원생 가져오기', wide: true,
      html: '<p class="soft">다른 프로그램에서 쓰던 원생 명단을 옮겨요. 엑셀 파일을 고르거나, 엑셀에서 표를 복사해 아래에 붙여 넣으세요. 다음 화면에서 칸을 맞추고 미리 본 뒤 가져와요.</p>' +
        '<div class="hstack"><button class="btn primary" type="button" data-pick>' + UI.icon('upload') + '파일 고르기 (.xlsx · .csv)</button>' +
        '<input type="file" hidden accept=".xlsx,.csv,.txt,.xls,.htm,.html" data-file>' +
        '<button class="btn quiet" type="button" data-template>' + UI.icon('download') + '빈 양식 받기</button></div>' +
        '<div class="field"><label for="imPaste">또는 엑셀에서 복사해 붙여 넣기 (제목 줄 포함)</label><textarea class="input mono" id="imPaste" rows="6" placeholder="이름&#9;생년월일&#9;보호자 연락처&#10;홍길동&#9;2016-03-15&#9;010-1234-5678"></textarea></div>' +
        '<p class="fine">옛 엑셀(.xls) 파일은 엑셀에서 "다른 이름으로 저장 → Excel 통합 문서(.xlsx)"로 바꾸거나 표를 복사해 붙여 넣어 주세요. 파일은 이 기기 안에서만 읽고 다른 곳으로 보내지 않아요.</p>' +
        '<p class="bad-t small" data-err></p>',
      actions: [{ label: '취소', kind: 'quiet' }, {
        label: '붙여 넣은 표 읽기', kind: 'primary', onClick: function (root, close) {
          var text = root.querySelector('#imPaste').value;
          var rows = parseDelimited(text.replace(/\s+$/, ''));
          if (!text.trim() || !rows.length) { root.querySelector('[data-err]').textContent = '붙여 넣은 표가 없어요. 파일을 고르거나 표를 붙여 넣어 주세요.'; return false; }
          close();
          mapModal([{ name: '붙여 넣은 표', rows: rows }]);
        }
      }],
      onMount: function (root, close) {
        var input = root.querySelector('[data-file]'), err = root.querySelector('[data-err]');
        root.querySelector('[data-pick]').onclick = function () { input.click(); };
        root.querySelector('[data-template]').onclick = function () { U.download('원생_가져오기_양식.csv', U.csv([TEMPLATE]), 'text/csv;charset=utf-8'); };
        input.onchange = function () {
          var f = input.files && input.files[0];
          if (!f) return;
          err.textContent = '읽는 중…';
          readFile(f).then(function (sheets) {
            sheets = sheets.filter(function (s) { return s.rows.some(function (r) { return r.some(function (c) { return String(c || '').trim(); }); }); });
            if (!sheets.length) { err.textContent = '파일에 표가 없어요'; return; }
            close();
            mapModal(sheets);
          }, function (e) { err.textContent = e.message || '파일을 읽지 못했어요'; input.value = ''; });
        };
      }
    });
  };

  function mapModal(sheets) {
    var si = 0, opt;
    function reset() {
      var rows = sheets[si].rows, g = guess(rows[0] || []);
      opt = { header: g.map.some(Boolean), map: g.map, rel: g.rel };
      if (!opt.header) opt.map = (rows[0] || []).map(function () { return ''; });
    }
    reset();
    UI.modal({
      title: '칸 맞추기와 미리 보기', wide: true,
      html: '<div data-body></div>',
      actions: [{ label: '취소', kind: 'quiet' }, { label: '가져오기', kind: 'primary', onClick: function (root) { return doImport(root); } }],
      onMount: function (root) { draw(root); }
    });

    function draw(root) {
      var sheet = sheets[si], width = 0;
      sheet.rows.forEach(function (r) { width = Math.max(width, r.length); });
      while (opt.map.length < width) opt.map.push('');
      var res = build(sheet, opt), ok = res.list.filter(function (x) { return !x.r.skip; });
      var skipped = res.list.length - ok.length, warn = ok.filter(function (x) { return x.r.issues.length; }).length;
      // 예시 값 두 개 (날짜 칸은 엑셀 날짜 숫자 대신 읽은 날짜로)
      var samples = function (ci) {
        var isDate = opt.map[ci] === 'birth' || opt.map[ci] === 'joinDate';
        return sheet.rows.slice(opt.header ? 1 : 0).map(function (r) { return String(r[ci] == null ? '' : r[ci]).trim(); }).filter(Boolean).slice(0, 2)
          .map(function (v) { return isDate ? parseDate(v).v || v : v; }).join(', ');
      };
      var h = '';
      if (sheets.length > 1) h += '<div class="field"><label for="imSheet">시트</label><select class="input" id="imSheet">' + UI.options(sheets.map(function (s, i) { return { value: i, label: s.name + ' (' + s.rows.length + '줄)' }; }), si) + '</select></div>';
      h += '<label class="check"><input type="checkbox" id="imHeader"' + (opt.header ? ' checked' : '') + '><span>첫 줄은 칸 이름(제목 줄)이에요</span></label>';
      h += '<div class="table-wrap im-map"><table class="t"><thead><tr><th>엑셀 칸</th><th>예시</th><th>앱에 넣을 곳</th></tr></thead><tbody>';
      for (var ci = 0; ci < width; ci++) {
        var label = opt.header ? String(sheet.rows[0][ci] == null ? '' : sheet.rows[0][ci]).trim() : '';
        h += '<tr><td><b>' + esc(label || colName(ci) + '열') + '</b></td><td class="wrap small soft">' + esc(samples(ci)) + '</td>' +
          '<td><select class="input sm" data-col="' + ci + '">' + UI.options(FIELDS.map(function (f) { return { value: f[0], label: f[1] }; }), opt.map[ci]) + '</select></td></tr>';
      }
      h += '</tbody></table></div>';
      if (opt.map.indexOf('name') < 0) h += '<p class="bad-t small">이름 칸을 골라 주세요.</p>';
      h += '<div class="im-sum"><b>가져올 원생 ' + ok.length + '명</b>' + (skipped ? ' · 건너뜀 ' + skipped + '명' : '') + (warn ? ' · <span class="warn-t">확인할 것 ' + warn + '명</span>' : '') + '</div>';
      if (res.newClasses.length) h += '<p class="small soft">새 반으로 추가돼요: <b>' + res.newClasses.map(esc).join(', ') + '</b> (나중에 설정에서 이름이나 순서를 바꿀 수 있어요)</p>';
      h += '<div class="table-wrap im-prev"><table class="t"><thead><tr><th>줄</th><th>이름</th><th>생년월일</th><th>반</th><th>급수</th><th>보호자 연락처</th><th>결과</th></tr></thead><tbody>' +
        res.list.map(function (x) {
          var s = x.s, r = x.r, g = (s.guardians || []).filter(function (q) { return q.phone; })[0];
          return '<tr class="' + (r.skip ? 'skip' : r.issues.length ? 'warn' : '') + '"><td class="num">' + r.line + '</td><td>' + esc(s.name || '-') + '</td><td>' + esc(s.birth || '') + '</td>' +
            '<td>' + esc(s.className || '') + '</td><td>' + esc(s.grade || '') + '</td><td>' + esc(g ? (g.relation + ' ' + U.fmtPhone(g.phone)) : '') + '</td>' +
            '<td class="wrap">' + (r.skip ? UI.pill('건너뜀: ' + r.skip, '') : r.issues.length ? '<span class="warn-t small">' + r.issues.map(esc).join('<br>') + '</span>' : UI.pill('가져옴', 'good')) + '</td></tr>';
        }).join('') + '</tbody></table></div>';
      h += '<p class="fine">가져온 원생은 보호자 동의가 "동의 전"으로 들어가요. 학부모 앱 초대나 현장 동의서로 받아 주세요. ' +
        '메모(특이사항)에 알레르기 같은 건강 정보가 있으면, 보호자의 건강 정보 동의를 받은 뒤에 남겨 두세요. 출석번호가 없거나 겹치면 새로 만들어요.</p>';
      var body = root.querySelector('[data-body]');
      body.innerHTML = h;
      var btn = root.parentNode.querySelector('[data-mact="1"]');
      btn.textContent = ok.length ? ok.length + '명 가져오기' : '가져오기';
      btn.disabled = !ok.length || opt.map.indexOf('name') < 0;
      var sheetSel = body.querySelector('#imSheet');
      if (sheetSel) sheetSel.onchange = function () { si = +sheetSel.value; reset(); draw(root); };
      body.querySelector('#imHeader').onchange = function (e) {
        opt.header = e.target.checked;
        if (opt.header) { var g = guess(sheets[si].rows[0] || []); opt.map = g.map; opt.rel = g.rel; }
        draw(root);
      };
      [].forEach.call(body.querySelectorAll('[data-col]'), function (sel) {
        sel.onchange = function () {
          var ci = +sel.getAttribute('data-col'), f = sel.value;
          // 메모 말고는 한 칸에만: 같은 곳을 고른 다른 칸은 비워요
          if (f && f !== 'memo') opt.map = opt.map.map(function (x, i) { return i !== ci && x === f ? '' : x; });
          opt.map[ci] = f;
          draw(root);
        };
      });
    }

    function doImport(root) {
      var res = build(sheets[si], opt), st = DB.settings(), ids = [];
      var addedClasses = res.newClasses.filter(function (c) { return st.classes.indexOf(c) < 0; });
      addedClasses.forEach(function (c) { st.classes.push(c); });
      res.list.forEach(function (x) {
        if (x.r.skip) return;
        var s = x.s;
        if (!s.pin || DB.pinTaken(s.pin)) s.pin = DB.newPin();
        DB.state.students.push(s);
        ids.push(s.id);
        if (window.Cloud && Cloud.enabled) Cloud.linkSiblings(s);
      });
      DB.save();
      App.nav('students');
      UI.toast('원생 ' + ids.length + '명을 가져왔어요', {
        label: '되돌리기', fn: function () {
          DB.state.students = DB.state.students.filter(function (s) { return ids.indexOf(s.id) < 0; });
          st.classes = st.classes.filter(function (c) { return addedClasses.indexOf(c) < 0 || DB.state.students.some(function (s) { return s.className === c; }); });
          DB.save();
          App.refresh();
          UI.toast('가져온 원생 ' + ids.length + '명을 지웠어요');
        }
      });
    }
  }
  function colName(i) { var s = ''; i++; while (i > 0) { var m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; }

  // 테스트용으로 읽기·정리 함수를 열어 둬요
  Parts.importParse = { readFile: readFile, parseDelimited: parseDelimited, guess: guess, parseDate: parseDate, phone: phone, grade: grade, build: build };
})();
