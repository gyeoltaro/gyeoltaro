/* 설정: 도장 정보, 반, 체력측정 항목, 비밀번호, 백업·초기화 */
(function () {
  'use strict';
  var esc = U.esc;

  function section(title, sub, body) {
    return '<section class="section"><div class="section-head"><h2>' + esc(title) + '</h2>' + (sub ? '<span class="sub">' + esc(sub) + '</span>' : '') + '</div>' +
      '<div class="card pad stack">' + body + '</div></section>';
  }

  function renameClass(oldName, newName) {
    var st = DB.state;
    st.students.forEach(function (s) { if (s.className === oldName) s.className = newName; });
    st.notices.concat(st.events).forEach(function (n) {
      var c = n.target && n.target.classes;
      if (c) for (var i = 0; i < c.length; i++) if (c[i] === oldName) c[i] = newName;
    });
  }

  // ---------- 서버 · 계정 (2단계) ----------
  function cloudSection(st) {
    var emails = st.adminEmails || [];
    var cs = Cloud.statusText();
    return section('서버 · 관리자 계정', '', '<dl class="kv"><dt>도장 서버</dt><dd class="mono">' + esc(Cloud.projectId() || '-') + '</dd>' +
      '<dt>로그인</dt><dd>' + esc(Cloud.email() || '-') + '</dd>' +
      '<dt>연결 상태</dt><dd>' + (cs ? UI.pill(cs.text, cs.tone, true) : '-') + '</dd></dl>' +
      (Server.preset ? '' : '<div class="hstack"><button class="btn" type="button" data-act="share-link">' + UI.icon('share') + '다른 기기 연결 링크</button><span class="hint">도장 태블릿, 관장님의 다른 휴대폰·컴퓨터를 같은 서버에 연결할 때 써요.</span></div>') +
      '<div class="field"><span class="label">관리자 이메일 (관장·사범님)</span><div class="stack sm">' + emails.map(function (e, i) {
        return '<div class="hstack" style="flex-wrap:nowrap"><span class="mono" style="flex:1;min-width:0;overflow-wrap:anywhere">' + esc(e) + '</span>' +
          (emails.length > 1 ? '<button class="icon-btn" type="button" data-act="del-email" data-i="' + i + '" aria-label="' + esc(e) + ' 빼기">' + UI.icon('trash') + '</button>' : '') + '</div>';
      }).join('') + '</div>' +
      '<div class="hstack" style="flex-wrap:nowrap"><input class="input" id="newEmail" type="email" placeholder="사범님 이메일 추가"><button class="btn" type="button" data-act="add-email">추가</button></div>' +
      '<span class="hint">이메일을 바꾸면 아래 "보안 규칙 보기"에서 규칙을 복사해 Firebase에 다시 붙여 넣어야 적용돼요.</span></div>' +
      '<div class="hstack"><button class="btn" type="button" data-act="rules">' + UI.icon('lock') + '보안 규칙 보기</button>' +
      '<button class="btn danger" type="button" data-act="signout">' + UI.icon('logout') + '이 기기에서 로그아웃</button>' +
      (Server.preset ? '' : '<button class="btn danger" type="button" data-act="disconnect">' + UI.icon('x') + '이 기기 서버 연결 해제</button>') + '</div>');
  }
  // ---------- 앱 푸시 ----------
  function pushSection(st) {
    var pl = Cloud.pushLine('새 참가신청·학부모 답글');
    return section('앱 푸시 알림', '새 알림장·출석은 학부모님께, 새 참가신청·답글은 관장님께',
      '<p class="soft">푸시를 보내려면 Firebase 요금제를 <b>Blaze</b>로 바꾸고 알림 서버 프로그램을 한 번 올려야 해요. 방법은 <a href="manual.html#push" target="_blank" rel="noopener">사용설명서</a>에 있어요. 잠금 화면에도 보이는 글이라 알림에는 아이 이름을 넣지 않아요.</p>' +
      '<label class="check"><input type="checkbox" id="sPush"' + (st.push ? ' checked' : '') + '>앱 푸시 사용 (서버 프로그램을 올린 뒤 켜세요)</label>' +
      '<div class="field"><label for="sPushKey">웹 푸시 인증서 공개 키 (선택)</label><div class="hstack" style="flex-wrap:nowrap"><input class="input mono" id="sPushKey" value="' + esc(st.pushKey || '') + '" placeholder="비워 두면 기본 키를 써요" autocomplete="off"><button class="btn" type="button" data-act="save-pushkey">저장</button></div>' +
      '<span class="hint">Firebase 콘솔 → 프로젝트 설정 → 클라우드 메시징 → 웹 푸시 인증서에서 만든 키 쌍이에요.</span></div>' +
      (st.push ? '<div class="notice-bar">' + UI.icon('bell') + '<span>' + esc(pl.text) + '</span>' + (pl.act ? '<button class="btn sm" type="button" data-act="' + pl.act + '">' + pl.label + '</button>' : '') + '</div>' : ''));
  }
  // 체험 모드: 아직 서버에 연결하지 않았을 때
  function serverSection() {
    return section('도장 서버 연결', '지금은 체험 모드예요',
      '<p class="soft">지금은 모든 정보가 <b>이 기기에만</b> 저장돼요. 도장 태블릿, 관장님 휴대폰, 학부모님 휴대폰이 같은 자료를 보려면 우리 도장의 Firebase 서버를 만들어 연결하세요. 서버는 관장님 구글 계정에 만들어지고 무료 한도 안에서 쓸 수 있어요.</p>' +
      '<p class="fine">연결한 뒤 처음 설정에서 이 기기에 있던 자료를 서버로 옮길 수 있어요.</p>' +
      '<div class="hstack"><button class="btn primary" type="button" data-act="connect">' + UI.icon('lock') + '우리 도장 서버 연결</button>' +
      '<a class="btn" href="manual.html#server" target="_blank" rel="noopener">' + UI.icon('info') + '서버 만드는 방법</a></div>');
  }
  function rulesView(emails) {
    var text = Cloud.rulesText(emails);
    UI.modal({
      title: 'Firestore 보안 규칙', wide: true,
      html: '<p class="soft">Firebase 콘솔 → Firestore Database → 규칙 탭에 있던 내용을 모두 지우고 붙여 넣은 뒤 "게시"를 누르세요.</p>' +
        '<textarea class="input mono" readonly style="min-height:260px;font-size:12px">' + esc(text) + '</textarea>',
      actions: [{ label: '규칙 복사', icon: 'copy', onClick: function () { U.copy(text).then(function (ok) { UI.toast(ok ? '규칙을 복사했어요' : '복사하지 못했어요'); }); return false; } }, { label: '닫기', kind: 'primary' }]
    });
  }

  // ---------- 백업 (비밀번호로 암호화) ----------
  function backupModal() {
    UI.modal({
      title: '백업 파일 만들기',
      html: '<p class="soft">백업 파일에는 원생·보호자 정보가 모두 들어 있어요. 관장님이 정한 비밀번호로 잠가서 저장하고, 불러올 때 같은 비밀번호가 있어야 열려요.</p>' +
        '<div class="field"><label for="bkPw">백업 비밀번호 (8자 이상)</label><input class="input" id="bkPw" type="password" autocomplete="new-password" autofocus></div>' +
        '<div class="field"><label for="bkPw2">한 번 더</label><input class="input" id="bkPw2" type="password" autocomplete="new-password"></div>' +
        '<div class="notice-bar">' + UI.icon('alert') + '<span>비밀번호를 잊으면 누구도 백업을 열 수 없어요. 따로 적어서 안전한 곳에 보관하세요.</span></div>',
      actions: [{ label: '취소', kind: 'quiet' }, {
        label: '잠가서 저장', kind: 'primary', icon: 'lock', onClick: function (root, close) {
          var pw = root.querySelector('#bkPw').value, pw2 = root.querySelector('#bkPw2').value;
          if (pw.length < 8) { UI.toast('비밀번호는 8자 이상으로 정해 주세요'); return false; }
          if (pw !== pw2) { UI.toast('두 비밀번호가 서로 달라요'); return false; }
          U.encryptText(DB.exportJSON(), pw).then(function (out) {
            var name = '태권도관리_백업_' + U.today() + '.json';
            close();
            UI.toast(U.download(name, out, 'application/json') ? name + ' 저장을 시작했어요' : '이 화면에서는 파일을 저장할 수 없어요');
          }, function (e) { UI.toast(e.message); });
          return false;
        }
      }]
    });
  }
  function restoreFrom(fileName, text) {
    var obj;
    try { obj = JSON.parse(text); } catch (e) { UI.toast('백업 파일이 아니에요'); return; }
    function apply(json) {
      UI.confirm({ title: '백업 불러오기', message: '"' + fileName + '" 파일로 지금 데이터를 모두 바꿀까요?\n지금 데이터는 사라져요.', ok: '불러오기', danger: true }).then(function (ok) {
        if (!ok) return;
        try { DB.importJSON(json); UI.toast('백업을 불러왔어요'); App.nav('home'); }
        catch (e) { UI.toast('불러오지 못했어요: ' + e.message); }
      });
    }
    if (!U.isEncrypted(obj)) { apply(text); return; }
    UI.modal({
      title: '백업 비밀번호',
      html: '<p class="soft">이 백업 파일은 잠겨 있어요. 만들 때 정한 비밀번호를 입력해 주세요.</p>' +
        '<div class="field"><label for="rsPw">백업 비밀번호</label><input class="input" id="rsPw" type="password" autocomplete="off" autofocus></div>',
      actions: [{ label: '취소', kind: 'quiet' }, {
        label: '열기', kind: 'primary', onClick: function (root, close) {
          U.decryptText(obj, root.querySelector('#rsPw').value).then(function (json) { close(); apply(json); }, function (e) { UI.toast(e.message); });
          return false;
        }
      }]
    });
  }

  // 보관 기간(1년)이 지난 개인정보 정리
  function purgeModal() {
    var due = DB.sortStudents(DB.purgeDue()), apps = DB.oldApps();
    if (!due.length && !apps.length) { UI.toast('정리할 개인정보가 없어요'); return; }
    var sel = {};
    due.forEach(function (s) { sel[s.id] = true; });
    var html = '<p class="soft">보관 기간(1년)이 지난 개인정보예요. 정리하면 되돌릴 수 없으니, 필요하면 먼저 백업해 두세요.</p>';
    if (due.length) {
      html += '<div class="form-title">퇴원 후 1년이 지난 원생 ' + due.length + '명</div><div class="pick-list">' + due.map(function (s) {
        return '<label><input type="checkbox" data-id="' + esc(s.id) + '" checked><b>' + esc(s.name) + '</b><span class="sub">퇴원 ' + esc(U.fmtDate(s.leftAt)) + '</span></label>';
      }).join('') + '</div><p class="fine">이름, 생년월일, 사진, 보호자 연락처와 출석·체력측정·승급심사·신청서 기록을 지워요. 회비 금액 기록은 장부 보관을 위해 이름 없이 남아요.</p>';
    }
    if (apps.length) {
      html += '<div class="form-title">끝난 지 1년이 지난 행사 신청서 ' + apps.length + '건</div><p class="fine">답변, 메모, 보호자 성함, 서명을 지우고 신청했다는 기록만 남겨요.</p>';
    }
    UI.modal({
      title: '개인정보 정리', html: html,
      actions: [{ label: '취소', kind: 'quiet' }, {
        label: '정리하기', kind: 'danger', onClick: function () {
          var ids = Object.keys(sel).filter(function (k) { return sel[k]; });
          ids.forEach(function (id) { DB.purgeStudent(id); });
          if (apps.length) DB.purgeApps(apps);
          App.refresh();
          UI.toast('원생 ' + ids.length + '명' + (apps.length ? ', 신청서 ' + apps.length + '건' : '') + '의 개인정보를 정리했어요');
        }
      }],
      onMount: function (root) {
        root.addEventListener('change', function (e) {
          var id = e.target.getAttribute('data-id');
          if (id) sel[id] = e.target.checked;
        });
      }
    });
  }

  Views.admin.settings = {
    purge: purgeModal,
    render: function (el) {
      var st = DB.settings();
      var size = DB.estimateSize();
      var where = { cloud: '서버 (Firebase · 서울)', idb: '이 기기 (IndexedDB)', local: '이 기기 (브라우저 저장소)', memory: '임시 메모리 (창을 닫으면 사라짐)' }[DB.backend];
      var h = '<header class="page-head"><div><span class="eyebrow">' + esc(st.dojangName) + '</span><h1>설정</h1></div></header>';

      h += section('도장 정보', '', '<div class="form-grid">' +
        '<div class="field"><label for="sName">도장 이름</label><input class="input" id="sName" value="' + esc(st.dojangName) + '"></div>' +
        '<div class="field"><label for="sFee">기본 월 회비 (원)</label><input class="input num" id="sFee" inputmode="numeric" value="' + esc(st.monthlyFee) + '"></div>' +
        '<div class="field full"><label for="sAccount">회비 입금 계좌</label><input class="input" id="sAccount" value="' + esc(st.account) + '" placeholder="예: 국민은행 123456-01-123456 (예금주 홍길동)"><span class="hint">학부모 화면의 회비·참가비 안내에 함께 보여요.</span></div>' +
        '</div><div><button class="btn primary" type="button" data-act="save-info">저장</button></div>');

      h += section('반 (수련 시간)', '원생 등록과 출석부에서 쓰는 반 이름이에요', '<div class="stack sm">' + st.classes.map(function (c, i) {
        var n = DB.state.students.filter(function (s) { return s.className === c && s.status !== 'left'; }).length;
        return '<div class="hstack" style="flex-wrap:nowrap"><input class="input" data-cls="' + i + '" value="' + esc(c) + '" aria-label="반 이름"><span class="small muted nowrap num">' + n + '명</span>' +
          '<button class="icon-btn" type="button" data-act="del-class" data-i="' + i + '" aria-label="' + esc(c) + ' 삭제">' + UI.icon('trash') + '</button></div>';
      }).join('') + '</div><div class="hstack"><button class="btn" type="button" data-act="add-class">' + UI.icon('plus') + '반 추가</button><button class="btn primary" type="button" data-act="save-classes">반 이름 저장</button></div>');

      h += section('체력측정 항목', '항목을 바꿔도 지난 기록은 남아 있어요', '<div class="table-wrap"><table class="t"><thead><tr><th>항목 이름</th><th>그래프 이름</th><th>단위</th><th>좋은 기록</th><th></th></tr></thead><tbody>' +
        st.fitnessItems.map(function (it, i) {
          return '<tr><td><input class="input sm" data-fi="' + i + '" data-f="label" value="' + esc(it.label) + '" style="min-width:150px"></td>' +
            '<td><input class="input sm" data-fi="' + i + '" data-f="short" value="' + esc(it.short || '') + '" style="width:96px"></td>' +
            '<td><input class="input sm" data-fi="' + i + '" data-f="unit" value="' + esc(it.unit) + '" style="width:64px"></td>' +
            '<td><select class="input sm" data-fi="' + i + '" data-f="better">' + UI.options([{ value: 'high', label: '높을수록' }, { value: 'low', label: '짧을수록' }], it.better) + '</select></td>' +
            '<td><button class="icon-btn" type="button" data-act="del-item" data-i="' + i + '" aria-label="' + esc(it.label) + ' 삭제">' + UI.icon('trash') + '</button></td></tr>';
        }).join('') + '</tbody></table></div><div class="hstack"><button class="btn" type="button" data-act="add-item">' + UI.icon('plus') + '항목 추가</button><button class="btn primary" type="button" data-act="save-items">항목 저장</button></div>');

      var pv = st.privacy || {};
      var purgeN = DB.purgeDue().length + DB.oldApps().length;
      h += section('관리자 비밀번호', '관리자 화면에 들어오거나 출석 화면을 끌 때 써요',
        (st.adminPin.length < 6 ? '<div class="notice-bar">' + UI.icon('alert') + '<span>지금 비밀번호는 ' + st.adminPin.length + '자리예요. 6자리로 바꿔 주세요.</span></div>' : '') +
        '<div class="form-grid">' +
        '<div class="field"><label for="pCur">지금 비밀번호</label><input class="input mono" id="pCur" type="password" inputmode="numeric" maxlength="' + st.adminPin.length + '" autocomplete="off"></div><div></div>' +
        '<div class="field"><label for="pNew">새 비밀번호 (숫자 6자리)</label><input class="input mono" id="pNew" type="password" inputmode="numeric" maxlength="6" autocomplete="off"></div>' +
        '<div class="field"><label for="pNew2">한 번 더</label><input class="input mono" id="pNew2" type="password" inputmode="numeric" maxlength="6" autocomplete="off"></div>' +
        '</div><div><button class="btn primary" type="button" data-act="save-pin">비밀번호 바꾸기</button></div>' +
        '<hr class="form-sep"><div class="field" style="max-width:320px"><label for="sLock">자동 잠금</label><select class="input" id="sLock">' +
        UI.options([{ value: 5, label: '5분 동안 안 쓰면 잠금' }, { value: 10, label: '10분 동안 안 쓰면 잠금' }, { value: 30, label: '30분 동안 안 쓰면 잠금' }, { value: 0, label: '자동으로 잠그지 않음' }], +st.autoLockMin) +
        '</select><span class="hint">비밀번호를 5번 틀리면 5분 동안 잠겨요.</span></div>');

      h += section('개인정보 보호', '개인정보 처리방침과 보관 기간 관리',
        '<p class="soft">처리방침은 앱이 실제로 다루는 정보에 맞춰 자동으로 만들어져요. 학부모 화면, 로그인 화면, 참가신청서에서 볼 수 있어요.</p>' +
        '<div class="form-grid">' +
        '<div class="field"><label for="pvOfficer">개인정보 보호책임자</label><input class="input" id="pvOfficer" value="' + esc(pv.officer || '') + '" placeholder="예: 관장 홍길동"></div>' +
        '<div class="field"><label for="pvPhone">책임자 연락처</label><input class="input" id="pvPhone" type="tel" inputmode="numeric" value="' + esc(U.fmtPhone(pv.phone || '')) + '" placeholder="도장 전화 또는 휴대폰"></div>' +
        '<div class="field"><label for="pvEmail">이메일 (선택)</label><input class="input" id="pvEmail" type="email" value="' + esc(pv.email || '') + '"></div>' +
        '<div class="field"><label for="pvSince">처리방침 시행일</label><input class="input" id="pvSince" type="date" value="' + esc(pv.since || U.today()) + '"></div>' +
        '</div><div class="hstack"><button class="btn primary" type="button" data-act="save-privacy">저장</button><button class="btn" type="button" data-act="view-privacy">' + UI.icon('lock') + '처리방침 보기</button></div>' +
        '<hr class="form-sep"><div class="hstack"><span class="soft">보관 기간(퇴원·행사 종료 후 1년)이 지난 정보: <b>' + purgeN + '건</b></span>' +
        '<button class="btn" type="button" data-act="purge"' + (purgeN ? '' : ' disabled') + '>' + UI.icon('trash') + '정리하기</button></div>');

      h += section('출석 화면', '', '<label class="check"><input type="checkbox" id="sSound"' + (st.kioskSound !== false ? ' checked' : '') + '>출석할 때 "띵동" 소리 내기</label>' +
        (App.installPrompt ? '<div class="hstack"><button class="btn" type="button" data-act="install">' + UI.icon('tablet') + '이 기기 홈 화면에 앱 추가</button><span class="hint">도장 태블릿에서 주소창 없이 앱처럼 열려요.</span></div>' : ''));

      if (Cloud.enabled) h += cloudSection(st) + pushSection(st);
      else if (!Server.preset) h += serverSection();
      h += section('데이터', '저장 위치: ' + where + ' · 약 ' + (size / 1024 / 1024).toFixed(2) + 'MB',
        (window.Cloud && Cloud.enabled
          ? '<p class="soft">자료는 서버(서울)에 저장되고, 인터넷이 끊겨도 이 기기에 적어 두었다가 연결되면 자동으로 올라가요. 백업 파일은 만일을 위한 추가 보관용이에요. 비밀번호로 잠겨서 비밀번호 없이는 아무도 열 수 없어요.</p>'
          : '<p class="soft">1단계에서는 모든 정보가 <b>이 기기에만</b> 저장돼요. 기기를 바꾸거나 앱을 지우기 전에 꼭 백업 파일을 만들어 두세요. 백업 파일은 관장님이 정한 비밀번호로 잠겨서, 비밀번호 없이는 아무도 열 수 없어요.</p>') +
        '<div class="hstack"><button class="btn" type="button" data-act="backup">' + UI.icon('download') + '백업 파일 만들기</button>' +
        '<button class="btn" type="button" data-act="restore">' + UI.icon('upload') + '백업 불러오기</button><input type="file" accept=".json,application/json" hidden id="restoreFile"></div>' +
        '<hr class="form-sep">' +
        (DB.state.demo ? '<p class="soft">지금은 체험용 샘플 데이터예요. 실제 원생을 등록하기 전에 샘플을 지워 주세요. 도장 이름·반·비밀번호 설정은 그대로 남아요.</p>' : '') +
        '<div class="hstack">' + (DB.state.demo ? '<button class="btn primary" type="button" data-act="clear-demo">샘플 지우고 새로 시작</button>' : '') +
        '<button class="btn" type="button" data-act="reseed">샘플 데이터 다시 넣기</button>' +
        (DB.state.demo ? '' : '<button class="btn danger" type="button" data-act="wipe">모든 데이터 지우기</button>') + '</div>');

      h += section('앱 정보', '태권도 통합 관리 · 무료 배포판',
        '<p class="soft">이 앱은 무료로 나눠 드리는 프로그램이에요. 도장 자료는 각 도장이 만든 Firebase 서버(관장님 구글 계정)에만 저장되고, 앱을 만든 사람은 볼 수 없어요.</p>' +
        '<p class="fine">프로그램 오류로 생긴 손해는 책임질 수 없어요. 한 달에 한 번은 위 "백업 파일 만들기"로 백업해 두세요. 개인정보를 다루는 책임(보호책임자 지정, 동의서, 보관 기간 관리)은 각 도장에 있어요.</p>' +
        (Server.preset ? '' : '<div><a class="btn" href="manual.html" target="_blank" rel="noopener">' + UI.icon('info') + '사용설명서</a></div>'));

      el.innerHTML = h;

      el.querySelector('#sLock').onchange = function (e) {
        st.autoLockMin = +e.target.value;
        DB.save();
        UI.toast(st.autoLockMin ? st.autoLockMin + '분 동안 안 쓰면 잠가요' : '자동 잠금을 껐어요');
      };
      var sPush = el.querySelector('#sPush');
      if (sPush) sPush.onchange = function (e) {
        st.push = e.target.checked;
        DB.save();
        UI.toast(st.push ? '앱 푸시를 켰어요. 학부모님 앱에 "알림 켜기"가 보여요.' : '앱 푸시를 껐어요');
        App.refresh();
      };
      el.querySelector('#sSound').onchange = function (e) { st.kioskSound = e.target.checked; DB.save(); UI.toast(e.target.checked ? '출석 소리를 켰어요' : '출석 소리를 껐어요'); };
      var restoreFile = el.querySelector('#restoreFile');
      restoreFile.onchange = function () {
        var f = restoreFile.files && restoreFile.files[0];
        restoreFile.value = '';
        if (!f) return;
        var reader = new FileReader();
        reader.onload = function () { restoreFrom(f.name, reader.result); };
        reader.readAsText(f);
      };

      UI.bind(el, {
        'save-info': function () {
          var name = el.querySelector('#sName').value.trim();
          if (!name) { UI.toast('도장 이름을 입력해 주세요'); return; }
          st.dojangName = name;
          st.monthlyFee = +U.digits(el.querySelector('#sFee').value) || 0;
          st.account = el.querySelector('#sAccount').value.trim();
          DB.save();
          App.updateShell();
          UI.toast('도장 정보를 저장했어요');
        },
        'add-class': function () {
          var n = st.classes.length + 1;
          st.classes.push(n + '부');
          DB.save();
          App.refresh();
        },
        'save-classes': function () {
          var inputs = el.querySelectorAll('[data-cls]'), names = [];
          [].forEach.call(inputs, function (inp) { names.push(inp.value.trim()); });
          if (names.some(function (x) { return !x; })) { UI.toast('비어 있는 반 이름이 있어요'); return; }
          if (names.some(function (x, i) { return names.indexOf(x) !== i; })) { UI.toast('같은 이름의 반이 있어요'); return; }
          st.classes.forEach(function (old, i) { if (old !== names[i]) renameClass(old, names[i]); });
          st.classes = names;
          DB.save();
          App.refresh();
          UI.toast('반 이름을 저장했어요');
        },
        'del-class': function (b) {
          var i = +b.getAttribute('data-i'), c = st.classes[i];
          var n = DB.state.students.filter(function (s) { return s.className === c && s.status !== 'left'; }).length;
          if (n) { UI.toast(c + '에 원생 ' + n + '명이 있어요. 먼저 원생의 반을 바꿔 주세요.'); return; }
          st.classes.splice(i, 1);
          DB.save();
          App.refresh();
        },
        'add-item': function () {
          st.fitnessItems.push({ key: 'i' + U.uid(), label: '새 항목', short: '', unit: '회', better: 'high' });
          DB.save();
          App.refresh();
        },
        'save-items': function () {
          [].forEach.call(el.querySelectorAll('[data-fi]'), function (inp) {
            var it = st.fitnessItems[+inp.getAttribute('data-fi')];
            if (it) it[inp.getAttribute('data-f')] = inp.value.trim();
          });
          st.fitnessItems.forEach(function (it) { if (!it.label) it.label = '이름 없는 항목'; });
          DB.save();
          App.refresh();
          UI.toast('체력측정 항목을 저장했어요');
        },
        'del-item': function (b) {
          var i = +b.getAttribute('data-i'), it = st.fitnessItems[i];
          UI.confirm({ title: '항목 삭제', message: '"' + it.label + '" 항목을 지울까요?\n이미 입력한 기록은 저장소에 남지만 화면에는 보이지 않아요.', ok: '삭제', danger: true }).then(function (ok) {
            if (!ok) return;
            st.fitnessItems.splice(i, 1);
            DB.save();
            App.refresh();
          });
        },
        'save-pin': function () {
          var cur = el.querySelector('#pCur').value, nw = el.querySelector('#pNew').value, nw2 = el.querySelector('#pNew2').value;
          var r = App.checkAdminPin(cur);
          if (r !== true) { UI.toast(r); return; }
          var bad = U.pinProblem(nw, nw2);
          if (bad) { UI.toast(bad); return; }
          st.adminPin = nw;
          DB.save();
          UI.toast('관리자 비밀번호를 바꿨어요');
          App.refresh();
        },
        'save-privacy': function () {
          st.privacy = st.privacy || {};
          st.privacy.officer = el.querySelector('#pvOfficer').value.trim();
          st.privacy.phone = U.digits(el.querySelector('#pvPhone').value);
          st.privacy.email = el.querySelector('#pvEmail').value.trim();
          st.privacy.since = el.querySelector('#pvSince').value || U.today();
          DB.save();
          UI.toast('개인정보 보호책임자 정보를 저장했어요');
        },
        'view-privacy': function () { Parts.openPrivacy(); },
        purge: purgeModal,
        rules: function () { rulesView(st.adminEmails); },
        'add-email': function () {
          var v = el.querySelector('#newEmail').value.trim().toLowerCase();
          if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { UI.toast('이메일 주소를 확인해 주세요'); return; }
          st.adminEmails = (st.adminEmails || []).filter(function (e) { return e !== v; }).concat([v]);
          DB.save();
          App.refresh();
          rulesView(st.adminEmails);
        },
        'del-email': function (b) {
          var i = +b.getAttribute('data-i');
          if (st.adminEmails[i] === Cloud.email()) { UI.toast('지금 로그인한 이메일은 뺄 수 없어요'); return; }
          st.adminEmails.splice(i, 1);
          DB.save();
          App.refresh();
          rulesView(st.adminEmails);
        },
        'share-link': function () { Cloud.shareLinkModal(); },
        'push-on': function () { Cloud.pushToggle(true); },
        'push-off': function () { Cloud.pushToggle(false); },
        'save-pushkey': function () {
          var v = el.querySelector('#sPushKey').value.trim();
          if (v && !/^[A-Za-z0-9_-]{80,100}={0,2}$/.test(v)) { UI.toast('공개 키 모양이 맞지 않아요. "키 쌍" 값을 그대로 복사해 주세요.'); return; }
          st.pushKey = v;
          DB.save();
          UI.toast(v ? '웹 푸시 키를 저장했어요' : '기본 키를 써요');
        },
        connect: function () { Cloud.connectModal(); },
        install: function () { App.install(); },
        disconnect: function () {
          UI.confirm({ title: '서버 연결 해제', message: '이 기기에서 도장 서버(' + Cloud.projectId() + ') 연결을 풀까요?\n로그인과 이 기기에 저장된 자료 사본이 지워져요. 서버의 자료는 그대로 남아요.\n다시 쓰려면 연결 링크를 열거나 설정값을 붙여 넣으면 돼요.', ok: '연결 해제', danger: true }).then(function (ok) {
            if (ok) Cloud.disconnect();
          });
        },
        signout: function () {
          UI.confirm({ title: '로그아웃', message: '이 기기에서 관리자 계정을 로그아웃할까요?\n출석 화면으로도 쓸 수 없게 돼요.', ok: '로그아웃', danger: true }).then(function (ok) {
            if (ok) Cloud.signOut().then(function () { App.setSession(null); });
          });
        },
        backup: backupModal,
        restore: function () { restoreFile.click(); },
        'clear-demo': function () {
          UI.confirm({ title: '샘플 지우기', message: '샘플 원생 100명과 출석·회비·알림장 기록을 모두 지우고 빈 상태로 시작할까요?', ok: '지우고 시작', danger: true }).then(function (ok) {
            if (!ok) return;
            DB.reset(false);
            UI.toast('샘플을 지웠어요. 원생 등록부터 시작하세요.');
            App.nav('students');
          });
        },
        reseed: function () {
          UI.confirm({ title: '샘플 데이터 넣기', message: '지금 데이터를 모두 지우고 체험용 샘플(원생 100명)로 바꿀까요?\n설정(도장 이름·비밀번호)도 처음 값으로 돌아가요.', ok: '샘플로 바꾸기', danger: true }).then(function (ok) {
            if (!ok) return;
            DB.reset(true);
            UI.toast('샘플 데이터를 넣었어요');
            App.nav('home');
          });
        },
        wipe: function () {
          UI.confirm({ title: '모든 데이터 지우기', message: '원생, 출석, 회비, 체력측정, 알림장, 참가신청, 승급심사 기록을 모두 지울까요?\n되돌릴 수 없어요. 먼저 백업 파일을 만들어 두세요.', ok: '모두 지우기', danger: true }).then(function (ok) {
            if (!ok) return;
            DB.reset(false);
            UI.toast('모든 데이터를 지웠어요');
            App.nav('home');
          });
        }
      });
    }
  };
})();
