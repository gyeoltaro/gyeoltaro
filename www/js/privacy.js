/* 개인정보 처리방침과 참가신청서 동의 문구
   개인정보보호위원회 '개인정보 처리방침 작성지침'의 항목 순서를 따릅니다. 내용은 앱이 실제로 다루는 정보에 맞춰 만들어집니다. */
(function () {
  'use strict';
  var esc = U.esc;

  // 참가신청서에서 받는 항목 (행사 설정에 따라 달라짐)
  function appItems(ev) {
    var items = ['참가자 이름', '반'];
    if (ev.choiceLabel) items.push(ev.choiceLabel);
    if (ev.askLabel) items.push(ev.askLabel);
    return items.concat(['전하실 말씀', '보호자 성함', '서명']).join(', ');
  }
  Parts.appConsentInfo = function (ev) {
    return {
      purpose: (ev.title || '행사') + ' 참가 신청 접수 및 진행',
      items: appItems(ev),
      period: '행사 종료 후 1년'
    };
  };
  function rowsTable(rows) {
    return '<table class="consent-t"><tbody>' + rows.map(function (r) {
      return '<tr><th scope="row">' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td></tr>';
    }).join('') + '</tbody></table>';
  }
  Parts.consentTable = function (ev) {
    var c = Parts.appConsentInfo(ev);
    return rowsTable([['목적', c.purpose], ['항목', c.items], ['보유 기간', c.period]]);
  };
  Parts.thirdPartyTable = function (tp) {
    return rowsTable([['받는 곳', tp.to || '-'], ['목적', tp.purpose || '-'], ['항목', tp.items || '-'], ['보유 기간', tp.period || '-']]);
  };

  Parts.privacyPolicy = function () {
    var st = DB.settings(), pv = st.privacy || {};
    var name = st.dojangName;
    var since = pv.since || U.today();
    var officer = pv.officer || '관장 (설정에서 이름을 입력해 주세요)';
    var tpEvents = DB.state.events.filter(function (e) { return e.thirdParty && e.thirdParty.to; });
    function h3(t) { return '<h3>' + esc(t) + '</h3>'; }
    function p(t) { return '<p>' + esc(t) + '</p>'; }
    function ul(list) { return '<ul>' + list.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; }
    function table(head, rows) {
      return '<div class="table-wrap"><table class="t"><thead><tr>' + head.map(function (x) { return '<th>' + esc(x) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        rows.map(function (r) { return '<tr>' + r.map(function (x) { return '<td class="wrap">' + esc(x) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
    }

    var h = '<div class="policy">';
    h += p(name + '(이하 "도장")은 「개인정보 보호법」에 따라 원생과 보호자의 개인정보를 보호하고, 이와 관련한 고충을 신속하게 처리하기 위해 다음과 같이 개인정보 처리방침을 정해 공개합니다.');

    h += h3('1. 개인정보의 처리 목적');
    h += p('도장은 다음 목적을 위해서만 개인정보를 처리하며, 목적이 바뀌면 미리 알리고 필요한 경우 다시 동의를 받습니다.');
    h += ul([
      '원생 등록과 관리: 수련반 배정, 출석 확인, 수련 중 안전 관리',
      '회비 관리: 회비·심사비·대회비 등의 납부 확인',
      '수련 기록 관리: 체력측정과 승급심사 결과의 기록과 안내',
      '보호자 소통: 알림장 발송, 보호자 답글 확인',
      '대회·행사 참가 신청: 신청 접수, 참가자 명단 작성, 주최 측 접수(제3자 제공에 동의한 경우에 한함)'
    ]);

    h += h3('2. 처리하는 개인정보 항목');
    h += table(['구분', '항목'], [
      ['원생 (필수)', '이름, 생년월일, 반, 급수, 출석번호'],
      ['원생 (선택)', '성별, 학교'],
      ['사진 (선택 동의)', '원생 사진: 원생 확인, 승급심사 결과증·알림장 게시'],
      ['보호자 (필수)', '이름, 관계, 휴대폰 번호'],
      ['이용 중 생기는 정보', '출석 시각, 회비 납부 내역, 체력측정 기록, 승급심사 점수와 평가, 알림장 읽음 여부와 답글'],
      ['참가신청서', '행사별 선택 항목(참가 부문 등), 추가 질문 답변(체중, 티셔츠 사이즈 등), 전하실 말씀, 보호자 성함, 동의 여부, 서명'],
      ['민감정보 (선택 동의)', '수련 중 안전을 위해 보호자가 별도로 동의하고 알려 준 건강 관련 사항(알레르기, 질환 등)']
    ]);

    h += h3('3. 만 14세 미만 아동의 개인정보');
    h += p('도장은 만 14세 미만 원생의 개인정보를 처리할 때 법정대리인(보호자)의 동의를 받습니다. 동의를 확인하기 위해 보호자의 이름과 연락처를 함께 받습니다.');
    h += p('동의는 종이 대신 전자 동의서로 받습니다. 도장에서 보호자가 직접 동의서를 읽고 서명하거나, 학부모 앱에서 동의한 경우에는 도장이 보호자 휴대폰으로 동의 확인 문자를 보내 법정대리인의 동의임을 확인합니다. 만 14세 이상 원생은 본인의 동의도 함께 받습니다.');
    h += p('필수 항목과 선택 항목(사진, 건강 정보)은 나눠서 동의를 받으며, 선택 항목에 동의하지 않아도 수련에는 불이익이 없습니다.');

    h += h3('4. 개인정보의 처리 및 보유 기간');
    h += table(['정보', '보유 기간'], [
      ['원생·보호자 정보와 수련 기록', '재원 기간 동안, 퇴원 후 1년이 지나면 파기'],
      ['참가신청서 (답변, 서명 등)', '행사 종료 후 1년이 지나면 파기'],
      ['회비 납부 금액 기록', '장부 보관을 위해 퇴원 1년 후 이름 등을 지운 상태로 5년 보관 후 파기']
    ]);

    h += h3('5. 개인정보의 파기 절차 및 방법');
    h += p('보유 기간이 지난 개인정보는 관리자 화면의 "개인정보 정리" 기능으로 지체 없이 파기합니다. 전자 파일은 복구할 수 없는 방법으로 지우고, 종이 서류는 분쇄하거나 소각합니다.');

    h += h3('6. 개인정보의 제3자 제공');
    h += p('도장은 원생의 개인정보를 제3자에게 제공하지 않습니다. 다만 대회 등 행사 참가를 위해 주최 측에 접수해야 하는 경우, 참가신청서에서 받는 곳·목적·항목·보유 기간을 알리고 보호자의 별도 동의를 받은 경우에만 제공합니다.');
    if (tpEvents.length) {
      h += table(['행사', '받는 곳', '목적', '항목', '받는 곳의 보유 기간'], tpEvents.map(function (e) {
        var t = e.thirdParty;
        return [e.title, t.to, t.purpose, t.items, t.period];
      }));
    }

    h += h3('7. 개인정보 처리의 위탁과 국외 이전');
    if (pv.cloud || (window.Cloud && Cloud.enabled)) {
      h += p('도장은 앱 운영을 위해 다음과 같이 개인정보 처리 업무를 위탁합니다. 수탁자와 맺은 데이터 처리 약관에 따라 개인정보를 안전하게 관리하도록 감독합니다.');
      h += table(['수탁자', '위탁 업무', '보관 위치'], [
        ['Google LLC (Firebase Cloud Firestore)', '원생·보호자 정보와 수련 기록 보관', '대한민국 서울 (asia-northeast3)'],
        ['Google LLC (Firebase Authentication)', '관리자 로그인, 학부모 기기 연결 확인', 'Google 데이터센터']
      ]);
      h += p('학부모 기기 연결에는 이름·전화번호 없이 임의로 만든 식별번호만 쓰입니다. 관리자(관장·사범) 로그인 이메일은 로그인 처리를 위해 미국 등에 있는 Google 데이터센터에서 처리될 수 있습니다. 원생과 보호자의 개인정보는 서울 리전에 보관합니다.');
    } else {
      h += p('도장은 개인정보 처리 업무를 외부에 위탁하지 않으며, 국외로 이전하지 않습니다. 모든 정보는 도장이 관리하는 기기 안에만 저장됩니다.');
    }

    h += h3('8. 정보주체와 법정대리인의 권리와 행사 방법');
    h += p('원생과 보호자는 언제든지 개인정보의 열람, 정정, 삭제, 처리 정지와 동의 철회를 요구할 수 있습니다. 선택 항목(사진, 건강 정보) 동의는 학부모 앱의 메뉴 → 개인정보 동의 내역에서 바로 철회할 수 있고, 그 밖의 요청은 아래 개인정보 보호책임자에게 전화, 알림장 답글, 방문으로 하시면 지체 없이 처리합니다.');

    h += h3('9. 개인정보의 안전성 확보 조치');
    h += ul([
      '관리자 화면은 6자리 비밀번호로 잠그고, 5번 틀리면 일정 시간 잠기며, 쓰지 않으면 자동으로 잠깁니다.',
      '학부모는 자기 자녀의 정보만 볼 수 있습니다.',
      '출석 화면에서는 출석번호를 누른 원생의 이름과 띠만 잠깐 보여 줍니다.',
      '보유 기간이 지난 정보는 정기적으로 정리합니다.',
      '백업 파일은 관리자가 정한 비밀번호로 암호화(AES-256)해서 만듭니다.'
    ]);

    h += h3('10. 자동으로 수집하는 정보');
    h += p('앱은 로그인 상태를 유지하기 위해 기기 저장소를 사용합니다. 광고나 이용 행태 추적을 위한 정보는 수집하지 않습니다.');

    h += h3('11. 개인정보 보호책임자');
    h += table(['구분', '내용'], [
      ['성명', officer],
      ['연락처', pv.phone ? U.fmtPhone(pv.phone) : '-'],
      ['이메일', pv.email || '-']
    ]);

    h += h3('12. 권익 침해 구제 방법');
    h += p('개인정보 침해에 대한 상담이나 신고는 아래 기관에 문의할 수 있습니다.');
    h += ul([
      '개인정보분쟁조정위원회: 1833-6972 (www.kopico.go.kr)',
      '개인정보침해신고센터: 118 (privacy.kisa.or.kr)',
      '대검찰청: 1301 (www.spo.go.kr)',
      '경찰청: 182 (ecrm.police.go.kr)'
    ]);

    h += h3('13. 개인정보 처리방침의 변경');
    h += p('이 개인정보 처리방침은 ' + U.fmtLong(since).replace(/ \S+요일$/, '') + '부터 적용됩니다. 내용이 바뀌면 앱과 알림장으로 알려 드립니다.');
    h += '</div>';
    return h;
  };

  Parts.openPrivacy = function () {
    UI.modal({ title: DB.settings().dojangName + ' 개인정보 처리방침', wide: true, html: Parts.privacyPolicy(), actions: [{ label: '닫기', kind: 'primary' }] });
  };
})();
