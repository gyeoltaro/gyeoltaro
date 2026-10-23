/* 보호자 전자 동의서 (종이 동의서 대신)
   - 개인정보 보호법 제15조(수집·이용 동의), 제22조(항목별 구분 동의, 선택 항목 거부 시 불이익 금지),
     제22조의2(만 14세 미만은 법정대리인 동의), 제23조(민감정보 별도 동의)에 맞춰 항목을 나눴습니다.
   - 법정대리인 확인: 도장에서 직접 받는 경우는 얼굴을 보고 서명을 받고,
     학부모 앱으로 받은 경우는 도장이 보호자 휴대폰으로 "동의 확인 문자"를 보냅니다(시행령이 정한 확인 방법). */
(function () {
  'use strict';
  var esc = U.esc;
  var VERSION = 1;

  function isMinor(s) { var a = U.age(s.birth); return a == null || a < 14; }
  function smsHref(phone, body) { return 'sms:' + U.digits(phone) + '?body=' + encodeURIComponent(body); }
  function guardianOf(s) { return (s.guardians || []).filter(function (g) { return g.phone; })[0] || (s.guardians || [])[0] || null; }
  function stamp(ts) { return U.fmtStamp(ts); }

  function box(title, rows, refuse) {
    return '<table class="consent-t"><tbody>' + rows.map(function (r) {
      return '<tr><th scope="row">' + esc(r[0]) + '</th><td>' + r[1] + '</td></tr>';
    }).join('') + '</tbody></table><p class="small muted">' + esc(refuse) + '</p>';
  }
  function strong(t) { return '<b><u>' + esc(t) + '</u></b>'; }

  // 동의서 본문 (도장 기기와 학부모 앱이 함께 씀)
  Parts.consentDoc = function (s) {
    var st = DB.settings(), g = guardianOf(s) || {};
    var h = '<div class="stack">';
    h += '<p class="soft">' + esc(st.dojangName) + '은(는) <b>' + esc(s.name) + '</b> 원생의 수련 관리를 위해 아래와 같이 개인정보를 처리합니다. 항목마다 읽고 동의해 주세요.</p>';
    // 한 번에 모두 체크 (선택 항목은 다시 풀 수 있어요: 항목별 구분 동의는 그대로)
    h += '<div class="stack sm"><button class="btn primary block" type="button" data-allagree>' + UI.icon('ok') + '모두 동의하기</button>' +
      '<p class="fine" style="margin:0">선택 항목(사진, 건강 정보)은 체크를 풀면 동의하지 않은 것으로 돼요. 동의하지 않아도 수련에는 불이익이 없어요.</p></div>';

    h += '<div class="consent-box"><label class="check"><input type="checkbox" id="cReq"><span><b>[필수]</b> 개인정보 수집·이용에 동의합니다</span></label>' +
      box('', [
        ['목적', '원생 등록과 관리(반 배정, 출석 확인, 안전 관리), 회비 관리, 체력측정·승급심사 기록, 알림장 소통, 대회·행사 안내'],
        ['항목', '원생: 이름, 생년월일, 성별, 학교, 반, 급수, 출석번호<br>보호자: 이름, 관계, 휴대폰 번호<br>이용 중 생기는 정보: 출석 시각, 회비 납부 내역, 체력측정·승급심사 기록, 알림장 답글'],
        ['보유 기간', strong('퇴원 후 1년') + ' (회비 금액 기록은 이름을 지운 상태로 5년)']
      ], '동의하지 않을 수 있지만, 필수 항목에 동의하지 않으면 도장 등록과 앱 이용이 어려워요.') + '</div>';

    h += '<div class="consent-box"><label class="check"><input type="checkbox" id="cPhoto"><span><b>[선택]</b> 사진 촬영·이용에 동의합니다</span></label>' +
      box('', [
        ['목적', '원생 확인, 승급심사 결과증과 알림장에 쓰는 사진'],
        ['항목', '원생 사진'],
        ['보유 기간', strong('퇴원 후 1년 또는 동의를 철회할 때까지')]
      ], '동의하지 않아도 수련에는 아무 불이익이 없어요.') + '</div>';

    h += '<div class="consent-box"><label class="check"><input type="checkbox" id="cHealth"><span><b>[선택]</b> 건강 정보(민감정보) 처리에 동의합니다</span></label>' +
      box('', [
        ['목적', '수련 중 안전 관리 (알레르기·질환이 있을 때 대응)'],
        ['항목', strong('알레르기, 질환 등 보호자가 알려 준 건강 정보')],
        ['보유 기간', strong('퇴원 후 1년 또는 동의를 철회할 때까지')]
      ], '동의하지 않아도 수련에는 아무 불이익이 없어요.') + '</div>';

    if (!isMinor(s)) {
      h += '<div class="consent-box"><label class="check"><input type="checkbox" id="cSelf"><span><b>[필수]</b> 원생 본인도 위 내용을 확인하고 동의했어요</span></label>' +
        '<p class="small muted">만 14세 이상 원생은 본인의 동의도 함께 받아요.</p></div>';
    }

    h += '<div class="consent-box"><label class="check"><input type="checkbox" id="cGuardian"><span><b>[필수]</b> 저는 위 원생의 법정대리인(부모 등 보호자)입니다</span></label>' +
      '<div class="form-grid"><div class="field"><label for="cName">보호자 성함</label><input class="input" id="cName" value="' + esc(g.name || '') + '"></div>' +
      '<div class="field"><label for="cRel">관계</label><select class="input" id="cRel">' + UI.options(['어머니', '아버지', '조부모', '보호자'], g.relation || '어머니') + '</select></div></div>' +
      '<div class="field"><span class="label">보호자 서명</span><div class="sig" id="cSig"><canvas></canvas><span class="ph">여기에 손가락으로 서명해 주세요</span><button type="button" class="btn sm clear" data-sigclear>다시 쓰기</button></div></div></div>';

    h += '<button class="link-btn" type="button" data-policy style="align-self:flex-start">개인정보 처리방침 전체 보기</button>';
    return h + '</div>';
  };

  // 동의서 화면을 붙이고, 제출할 때 쓸 읽기 함수를 돌려줍니다
  Parts.bindConsent = function (root, s, by, phone) {
    var pad = UI.signaturePad(root.querySelector('#cSig'));
    root.querySelector('[data-sigclear]').onclick = function () { pad.clear(); };
    root.querySelector('[data-allagree]').onclick = function () {
      ['#cReq', '#cPhoto', '#cHealth', '#cSelf', '#cGuardian'].forEach(function (sel) { var el = root.querySelector(sel); if (el) el.checked = true; });
      var sig = root.querySelector('#cSig');
      if (sig && sig.scrollIntoView) sig.scrollIntoView({ behavior: 'smooth', block: 'center' });
      UI.toast('모두 체크했어요. 이름을 확인하고 서명해 주세요.');
    };
    root.querySelector('[data-policy]').onclick = function () { Parts.openPrivacy(); };
    return function read() {
      if (!root.querySelector('#cReq').checked) return '[필수] 개인정보 수집·이용 동의에 체크해 주세요';
      var self = root.querySelector('#cSelf');
      if (self && !self.checked) return '[필수] 원생 본인 동의에 체크해 주세요';
      if (!root.querySelector('#cGuardian').checked) return '[필수] 법정대리인 확인에 체크해 주세요';
      var name = root.querySelector('#cName').value.trim();
      if (!name) return '보호자 성함을 적어 주세요';
      if (pad.isEmpty()) return '보호자 서명을 해 주세요';
      var g = guardianOf(s) || {};
      return {
        v: VERSION, at: Date.now(), by: by, guardianName: name, relation: root.querySelector('#cRel').value,
        phone: U.digits(phone || g.phone || ''), required: true,
        photo: root.querySelector('#cPhoto').checked, health: root.querySelector('#cHealth').checked,
        self: self ? true : null, signature: pad.toDataURL(), smsSentAt: null
      };
    };
  };

  function applyConsent(s, c) {
    s.consent = c;
    if (!c.photo) s.photo = null;
    DB.save();
  }

  // 관리자: 도장 기기에서 보호자에게 직접 받기
  Parts.openConsentForm = function (s, onDone) {
    var read = null;
    UI.modal({
      title: '보호자 동의서 · ' + s.name, wide: true, html: '<p class="notice-bar">' + UI.icon('info') + '<span>이 화면을 보호자께 건네 드리고 직접 읽고 서명하시게 해 주세요.</span></p>' + Parts.consentDoc(s),
      actions: [{ label: '취소', kind: 'quiet' }, {
        label: '동의서 제출', kind: 'primary', onClick: function () {
          var c = read();
          if (typeof c === 'string') { UI.toast(c); return false; }
          applyConsent(s, c);
          UI.toast(s.name + ' 원생의 보호자 동의를 받았어요');
          if (onDone) onDone(); else App.refresh();
        }
      }],
      onMount: function (root) { read = Parts.bindConsent(root, s, 'in-person'); }
    });
  };

  Parts.consentLabel = function (s) {
    var c = s.consent;
    if (!c || !c.required) return { text: '보호자 동의 전', tone: 'warn' };
    if (c.by === 'app' && !c.smsSentAt) return { text: '앱 동의 · 확인 문자 필요', tone: 'info' };
    return { text: '동의 완료', tone: 'good' };
  };

  Parts.consentSummary = function (s) {
    var c = s.consent;
    if (!c || !c.required) return '<span class="muted">아직 받지 않았어요</span>';
    var opt = [c.photo ? '사진 동의' : '사진 미동의', c.health ? '건강 정보 동의' : '건강 정보 미동의'];
    return esc(stamp(c.at) + ' · ' + (c.by === 'app' ? '학부모 앱' : '도장에서 직접') + ' · ' + c.guardianName + '(' + c.relation + ')') +
      '<br><span class="small muted">' + esc(opt.join(' · ') + (c.self ? ' · 원생 본인 동의' : '') + (c.by === 'app' ? (c.smsSentAt ? ' · 확인 문자 ' + stamp(c.smsSentAt) : ' · 확인 문자 안 보냄') : '')) + '</span>';
  };

  // 관리자: 동의서 보기
  Parts.viewConsent = function (s) {
    var c = s.consent;
    UI.modal({
      title: '보호자 동의서 · ' + s.name,
      html: '<dl class="kv"><dt>동의 일시</dt><dd>' + esc(stamp(c.at)) + '</dd><dt>받은 방법</dt><dd>' + (c.by === 'app' ? '학부모 앱' : '도장에서 직접') + '</dd>' +
        '<dt>보호자</dt><dd>' + esc(c.guardianName + ' (' + c.relation + ')' + (c.phone ? ' · ' + U.fmtPhone(c.phone) : '')) + '</dd>' +
        '<dt>필수 동의</dt><dd>개인정보 수집·이용' + (c.self ? ', 원생 본인 동의' : '') + '</dd>' +
        '<dt>사진</dt><dd>' + (c.photo ? '동의' : '미동의') + (c.photoWithdrawnAt ? ' (' + esc(stamp(c.photoWithdrawnAt)) + ' 철회)' : '') + '</dd>' +
        '<dt>건강 정보</dt><dd>' + (c.health ? '동의' : '미동의') + (c.healthWithdrawnAt ? ' (' + esc(stamp(c.healthWithdrawnAt)) + ' 철회)' : '') + '</dd>' +
        (c.by === 'app' ? '<dt>확인 문자</dt><dd>' + (c.smsSentAt ? esc(stamp(c.smsSentAt)) + ' 보냄' : '아직 안 보냄') + '</dd>' : '') +
        '<dt>서명</dt><dd>' + (c.signature ? '<img class="sig-img" style="height:80px" src="' + esc(c.signature) + '" alt="보호자 서명">' : '<span class="muted">서명 없음 (예시 데이터)</span>') + '</dd></dl>',
      actions: [{ label: '닫기', kind: 'primary' }]
    });
  };

  // 관리자: 동의를 아직 안 받은 원생
  Parts.consentPendingModal = function () {
    var list = DB.sortStudents(DB.consentPending());
    var st = DB.settings();
    if (!list.length) { UI.toast('모든 원생의 보호자 동의를 받았어요'); return; }
    var html = '<p class="soft">보호자가 도장에 있으면 "지금 받기"로 이 기기에서 바로 받을 수 있어요. 학부모 앱으로 받으려면 안내 문자를 보내세요.</p><div class="card list">' +
      list.map(function (s) {
        var g = guardianOf(s);
        var msg = '[' + st.dojangName + '] ' + s.name + ' 원생의 개인정보 동의를 학부모 앱에서 부탁드립니다. 로그인: 보호자 휴대폰 번호 + 출석번호 ' + s.pin;
        return '<div class="row">' + UI.av(s, 'sm') + '<span class="main"><span class="title">' + esc(s.name) + '</span><span class="sub">' + esc(g ? (g.name || '') + ' ' + U.fmtPhone(g.phone) : '보호자 연락처 없음') + '</span></span>' +
          '<span class="side">' + (g && g.phone ? (window.Cloud && Cloud.enabled
            ? '<button class="btn sm" type="button" data-invite="' + esc(s.id) + '">초대 코드 보내기</button>'
            : '<a class="btn sm" href="' + esc(smsHref(g.phone, msg)) + '">앱 안내 문자</a>') : '') +
          '<button class="btn sm primary" type="button" data-now="' + esc(s.id) + '">지금 받기</button></span></div>';
      }).join('') + '</div>';
    UI.modal({
      title: '보호자 동의가 없는 원생 ' + list.length + '명', wide: true, html: html, actions: [{ label: '닫기', kind: 'primary' }],
      onMount: function (root, close) {
        root.addEventListener('click', function (e) {
          var iv = e.target.closest('[data-invite]');
          if (iv) { close(); Cloud.inviteModal(DB.student(iv.getAttribute('data-invite'))); return; }
          var b = e.target.closest('[data-now]');
          if (!b) return;
          var s = DB.student(b.getAttribute('data-now'));
          close();
          Parts.openConsentForm(s);
        });
      }
    });
  };

  // 관리자: 학부모 앱으로 받은 동의에 확인 문자 보내기
  Parts.smsPendingModal = function () {
    var list = DB.sortStudents(DB.smsPending());
    var st = DB.settings(), pv = st.privacy || {};
    if (!list.length) { UI.toast('보낼 확인 문자가 없어요'); return; }
    function msgOf(s) {
      return '[' + st.dojangName + '] ' + s.name + ' 원생의 개인정보 수집·이용 동의(' + stamp(s.consent.at) + ', 학부모 앱)를 확인했습니다. 직접 동의하지 않으셨다면 도장으로 연락해 주세요.' + (pv.phone ? ' ' + U.fmtPhone(pv.phone) : '');
    }
    var html = '<p class="soft">만 14세 미만 아동은 법정대리인 동의를 받았다는 확인이 필요해요. 학부모 앱으로 동의한 보호자 휴대폰으로 확인 문자를 보내 주세요. "문자 보내기"를 누르면 문자 앱이 열려요.</p><div class="card list">' +
      list.map(function (s) {
        var phone = s.consent.phone || (guardianOf(s) || {}).phone || '';
        return '<div class="row">' + UI.av(s, 'sm') + '<span class="main"><span class="title">' + esc(s.name) + '</span><span class="sub">' + esc(s.consent.guardianName + ' ' + U.fmtPhone(phone) + ' · ' + stamp(s.consent.at) + ' 동의') + '</span></span>' +
          '<span class="side">' + (phone ? '<a class="btn sm" href="' + esc(smsHref(phone, msgOf(s))) + '">문자 보내기</a>' : '') +
          '<button class="btn sm primary" type="button" data-sent="' + esc(s.id) + '">보냈어요</button></span></div>';
      }).join('') + '</div><p class="fine">문자 앱이 열리지 않는 화면에서는 아래 문구를 복사해서 보내세요.</p>' +
      '<div class="copy-line"><span>' + esc(msgOf(list[0])) + '</span></div>';
    UI.modal({
      title: '동의 확인 문자 ' + list.length + '건', wide: true, html: html, actions: [{ label: '닫기', kind: 'primary' }],
      onMount: function (root, close) {
        root.addEventListener('click', function (e) {
          var b = e.target.closest('[data-sent]');
          if (!b) return;
          var s = DB.student(b.getAttribute('data-sent'));
          s.consent.smsSentAt = Date.now();
          DB.save();
          var row = b.closest('.row');
          if (row) row.remove();
          UI.toast(s.name + ' 확인 문자를 보낸 것으로 기록했어요');
          if (!DB.smsPending().length) close();
          App.refresh();
        });
      }
    });
  };

  // ---------- 학부모 앱 ----------
  // 처음 로그인했을 때 동의서를 받기 전에는 다른 화면을 볼 수 없습니다
  Views.parent.consent = {
    render: function (el) {
      var s = DB.student(App.session.cur);
      el.innerHTML = '<div class="section-head"><h2 style="font-size:20px">보호자 동의가 필요해요</h2></div>' +
        '<p class="soft">' + esc(DB.settings().dojangName) + ' 앱을 쓰려면 먼저 ' + esc(s.name) + ' 원생의 개인정보 처리에 대한 보호자 동의가 필요해요. 종이 동의서 대신 이 화면에서 받아요.</p>' +
        '<div class="card pad stack">' + Parts.consentDoc(s) + '<button class="btn primary lg block" type="button" id="cSubmit">동의하고 시작하기</button></div>' +
        '<p class="fine">동의 후 도장에서 보호자님 휴대폰으로 확인 문자를 보내 드려요. 나중에 메뉴 → 개인정보 동의 내역에서 선택 항목을 철회할 수 있어요.</p>';
      var read = Parts.bindConsent(el, s, 'app', App.session.phone);
      el.querySelector('#cSubmit').onclick = function () {
        var c = read();
        if (typeof c === 'string') { UI.toast(c); return; }
        applyConsent(s, c);
        UI.toast('동의해 주셔서 감사합니다');
        App.nav('home');
      };
    }
  };

  // 학부모: 동의 내역 보기와 선택 항목 철회
  Parts.consentManage = function (s) {
    var c = s.consent;
    if (!c) return;
    function line(label, on, key) {
      return '<div class="row"><span class="main"><span class="title">' + esc(label) + '</span><span class="sub">' + (on ? '동의함' : '동의하지 않음') + '</span></span>' +
        (key && on ? '<span class="side"><button class="btn sm danger" type="button" data-withdraw="' + key + '">동의 철회</button></span>' : '') + '</div>';
    }
    UI.modal({
      title: '개인정보 동의 내역',
      html: '<p class="soft">' + esc(s.name) + ' · ' + esc(stamp(c.at)) + ' 동의 (' + esc(c.guardianName) + ')</p><div class="card list">' +
        line('[필수] 개인정보 수집·이용', true) + line('[선택] 사진 촬영·이용', c.photo, 'photo') + line('[선택] 건강 정보 처리', c.health, 'health') + '</div>' +
        '<p class="fine">선택 항목은 여기서 바로 철회할 수 있어요. 필수 항목 철회(퇴원과 함께 정보 삭제)는 도장에 말씀해 주세요.</p>' +
        '<button class="link-btn" type="button" data-policy style="align-self:flex-start">개인정보 처리방침 전체 보기</button>',
      actions: [{ label: '닫기', kind: 'primary' }],
      onMount: function (root, close) {
        root.querySelector('[data-policy]').onclick = function () { Parts.openPrivacy(); };
        root.addEventListener('click', function (e) {
          var b = e.target.closest('[data-withdraw]');
          if (!b) return;
          var key = b.getAttribute('data-withdraw');
          UI.confirm({ title: '동의 철회', message: (key === 'photo' ? '사진' : '건강 정보') + ' 동의를 철회할까요?' + (key === 'photo' ? '\n등록된 사진이 바로 지워져요.' : '\n도장에서 건강 정보를 지우도록 알려 드려요.'), ok: '철회', danger: true }).then(function (ok) {
            if (!ok) return;
            c[key] = false;
            c[key + 'WithdrawnAt'] = Date.now();
            if (key === 'photo') s.photo = null;
            DB.save();
            close();
            UI.toast('동의를 철회했어요');
            App.refresh();
          });
        });
      }
    });
  };
})();
