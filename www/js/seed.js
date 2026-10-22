/* 체험용 샘플 데이터 (원생 100명). 설정 > 데이터에서 지우고 실제 원생을 등록하면 됩니다. */
(function () {
  'use strict';

  function rng(seed) {
    return function () {
      seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var SUR = '김이박최정강조윤장임한오서신권황안송류홍'.split('');
  var BOY = ['서준', '하준', '도윤', '시우', '은우', '지호', '예준', '유준', '주원', '이준', '민준', '건우', '우진', '선우', '연우', '현우', '준우', '지훈', '로운', '이안', '도현', '승우', '시윤', '준서', '은호', '태윤', '지환', '윤우', '정우', '하람'];
  var GIRL = ['서윤', '하윤', '지우', '서아', '하은', '지유', '수아', '아린', '윤서', '채원', '지안', '시아', '다은', '예린', '하린', '소율', '나은', '유나', '예은', '서연', '은서', '지원', '민서', '수빈', '이서', '서하', '지아', '아윤', '채아', '소윤'];
  var MOM = ['민지', '수진', '지영', '현정', '은영', '미영', '혜진', '선영', '지현', '윤정', '소영', '정은', '유진', '예진', '보라', '다혜'];
  var DAD = ['성민', '준호', '동현', '재원', '상우', '민석', '현수', '태호', '진우', '영민'];
  var SCHOOL_E = ['햇살초', '한빛초', '푸른숲초', '새솔초'];
  var SCHOOL_M = ['새솔중', '한빛중'];
  var MEMOS = ['땅콩 알레르기 있음', '차량 이용 (하원)', '겨루기 대회 준비 중', '시범단', '수줍음이 많아요. 칭찬 많이 해주세요', '천식 있음, 무리한 달리기 주의'];

  var Seed = {};

  Seed.fill = function (st) {
    var R = rng(20261022);
    function pick(a) { return a[Math.floor(R() * a.length)]; }
    function int(lo, hi) { return lo + Math.floor(R() * (hi - lo + 1)); }
    function noise(span) { return (R() + R() + R() - 1.5) / 1.5 * span; }

    var today = U.today(), ym = U.ym(), now = new Date();
    var nowMin = now.getHours() * 60 + now.getMinutes();
    var cy = now.getFullYear();
    var classes = st.settings.classes;
    var usedNames = {}, usedPhones = {}, pins = {};

    function phone() {
      var p;
      do { p = '010-' + int(2000, 9899) + '-' + int(1000, 9999); } while (usedPhones[p]);
      usedPhones[p] = 1;
      return p;
    }
    function pin() {
      var p;
      do { p = String(int(0, 9999)); while (p.length < 4) p = '0' + p; } while (pins[p] || DB.trivialPin(p));
      pins[p] = 1;
      return p;
    }
    function classMinutes(c) {
      var m = /(\d{1,2}):(\d{2})/.exec(c || '');
      return m ? (+m[1]) * 60 + (+m[2]) : 16 * 60;
    }
    function timeNear(c) {
      var t = classMinutes(c) - 15 + int(0, 18);
      return U.pad(Math.floor(t / 60)) + ':' + U.pad(t % 60);
    }

    // ---------- 원생 ----------
    var AGES = [6, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 12, 12, 13, 14];
    var students = [];
    for (var i = 0; i < 100; i++) {
      var girl = R() < 0.42;
      var sur = pick(SUR), given, name;
      if (i === 1) { sur = students[0].name.charAt(0); girl = !students[0]._girl; }
      do { given = pick(girl ? GIRL : BOY); name = sur + given; } while (usedNames[name]);
      usedNames[name] = 1;

      var age = i === 0 ? 9 : i === 1 ? 7 : pick(AGES);
      var birth = (cy - age) + '-' + U.pad(int(1, 12)) + '-' + U.pad(int(1, 28));
      var cls = age <= 7 ? classes[0]
        : age <= 9 ? (R() < 0.5 ? classes[1] : classes[2])
        : age <= 11 ? (R() < 0.5 ? classes[2] : classes[3])
        : classes[4];
      var tenure = int(0, Math.min(46, (age - 5) * 12));
      if (i === 0) tenure = 26;
      var gi = Math.min(Math.floor(tenure / 3.6), 10);
      var join = U.addMonths(ym, -tenure) + '-' + U.pad(int(1, 27));
      if (join > today) join = today;

      var guardians = [];
      var momPhone;
      if (i === 1) {
        guardians = students[0].guardians.map(function (g) { return { name: g.name, relation: g.relation, phone: g.phone }; });
      } else {
        momPhone = phone();
        guardians.push({ name: pick(SUR) + pick(MOM), relation: '어머니', phone: momPhone });
        if (R() < 0.35) guardians.push({ name: sur + pick(DAD), relation: '아버지', phone: phone() });
      }

      var s = {
        id: U.uid() + i, name: name, gender: girl ? 'F' : 'M', birth: birth,
        school: age >= 13 ? pick(SCHOOL_M) : age >= 7 ? pick(SCHOOL_E) : '',
        grade: DB.GRADES[gi], className: cls, pin: pin(), guardians: guardians,
        joinDate: join, status: i >= 97 ? (i === 99 ? 'left' : 'paused') : 'active',
        fee: null, memo: R() < 0.12 ? pick(MEMOS) : '', photo: null, createdAt: Date.now() - (100 - i) * 1000,
        _girl: girl, _p: 0.55 + R() * 0.4
      };
      if (i === 0) s._p = 0.9;
      if (i === 1) s.memo = '형제 할인 (' + students[0].name + ')';
      students.push(s);
    }
    students[1].fee = 130000;
    // 1주일 넘게 안 나온 원생 몇 명
    var awayIdx = [12, 27, 41, 58, 73, 86];
    awayIdx.forEach(function (k) { students[k]._away = int(8, 16); });

    // ---------- 출석 (최근 5주, 평일) ----------
    var att = {};
    for (var d = -35; d <= 0; d++) {
      var date = U.addDays(today, d), dow = U.dow(date);
      if (dow === 0 || dow === 6) continue;
      students.forEach(function (s) {
        if (s.status === 'left') return;
        if (s.status === 'paused' && d > -18) return;
        if (s.joinDate > date) return;
        if (s._away && d > -s._away) return;
        if (R() >= s._p) return;
        var t = timeNear(s.className);
        if (d === 0) {
          var mins = (+t.slice(0, 2)) * 60 + (+t.slice(3));
          if (mins > nowMin) return;
        }
        (att[date] || (att[date] = {}))[s.id] = { t: t, by: R() < 0.06 ? 'admin' : 'kiosk' };
      });
    }
    st.attendance = att;

    // ---------- 회비 (지난 2달 + 이번 달) ----------
    var payments = [];
    var dayNow = now.getDate();
    [-2, -1, 0].forEach(function (off) {
      var m = U.addMonths(ym, off), end = U.monthEnd(m);
      students.forEach(function (s, idx) {
        if (s.status === 'left') return;
        if (s.status === 'paused' && off === 0) return;
        if (s.joinDate > end) return;
        var prob = off < 0 ? 0.97 : (dayNow >= 10 ? 0.74 : 0.42);
        if (idx === 0 && off === 0) prob = 1;
        if (idx === 1 && off === 0) prob = 0;
        if (R() >= prob) return;
        var lastDay = off < 0 ? 12 : Math.max(1, Math.min(dayNow, 12));
        payments.push({
          id: U.uid() + 'p' + payments.length, studentId: s.id, category: '월회비', month: m,
          amount: s.fee != null ? s.fee : st.settings.monthlyFee,
          paidAt: m + '-' + U.pad(int(1, lastDay)), method: pick(['계좌이체', '계좌이체', '카드', '카드', '현금']),
          memo: '', createdAt: Date.now()
        });
      });
    });

    // ---------- 체력측정 (2회) ----------
    function weekday(ymd) { while (U.dow(ymd) === 0 || U.dow(ymd) === 6) ymd = U.addDays(ymd, -1); return ymd; }
    var d1 = weekday(U.addDays(today, -63)), d2 = weekday(U.addDays(today, -14));
    var fitness = [];
    students.forEach(function (s, idx) {
      if (s.status === 'left') return;
      if (idx > 1 && R() < 0.14) return;
      var a = U.age(s.birth, d1) - 6, boy = s.gender === 'M' ? 1 : 0;
      var base = {
        jump: 92 + a * 12 + boy * 6 + noise(16),
        situp: 13 + a * 3.4 + noise(6),
        rope: 32 + a * 11 + noise(16),
        flex: 6 + (1 - boy) * 3 + noise(6),
        shuttle: 14.6 - a * 0.48 - boy * 0.2 + noise(1.1),
        squat: 26 + a * 2.8 + noise(6)
      };
      function rec(date, v) {
        return {
          id: U.uid() + 'f' + fitness.length, studentId: s.id, date: date, memo: '',
          values: {
            jump: Math.round(v.jump), situp: Math.max(3, Math.round(v.situp)), rope: Math.max(5, Math.round(v.rope)),
            flex: U.round(v.flex, 1), shuttle: U.round(Math.max(9.4, v.shuttle), 1), squat: Math.max(8, Math.round(v.squat))
          }
        };
      }
      if (s.joinDate <= d1) fitness.push(rec(d1, base));
      if (s.joinDate <= d2) {
        var up = 1.03 + R() * 0.08;
        fitness.push(rec(d2, {
          jump: base.jump * up, situp: base.situp * up, rope: base.rope * (up + 0.04),
          flex: base.flex + R() * 2.2 - 0.4, shuttle: base.shuttle - (0.15 + R() * 0.45), squat: base.squat * up
        }));
      }
    });

    // ---------- 승급심사 ----------
    var exams = [];
    var lastExam = weekday(U.addDays(today, -52));
    var examPool = students.filter(function (s, idx) { return s.status === 'active' && (idx === 0 || R() < 0.24); });
    examPool.forEach(function (s, k) {
      var items = {}, skill = 6.2 + R() * 3.2;
      DB.EXAM_ITEMS.forEach(function (key) { items[key] = U.round(U.clamp(skill + noise(1.6), 3, 10), 1); });
      if (k % 9 === 4) DB.EXAM_ITEMS.forEach(function (key) { items[key] = U.round(U.clamp(items[key] - 2.4, 2, 10), 1); });
      var x = { id: U.uid() + 'x' + k, studentId: s.id, examDate: lastExam, gradeAt: s.grade, items: items, scored: true, comment: '', promoted: false };
      var score = DB.examScore(x);
      if (score >= DB.PASS_SCORE) {
        var gi = DB.GRADES.indexOf(s.grade);
        if (gi > 0 && gi <= 10) { x.gradeAt = DB.GRADES[gi - 1]; x.promoted = true; }
        x.comment = score >= 88 ? '기본기가 아주 탄탄합니다. 다음 심사까지 겨루기 스텝을 더 연습해 봐요.' : '꾸준히 노력한 모습이 보였어요. 품새 동작을 더 크게 해 봅시다.';
      } else {
        x.comment = '조금만 더 연습하면 충분히 합격할 수 있어요. 다음 심사에 다시 도전해요.';
      }
      exams.push(x);
    });

    // ---------- 참가신청 ----------
    var ev1 = {
      id: U.uid() + 'e1', kind: '대회', title: '제12회 구청장배 태권도 대회', date: U.addDays(today, 24), time: '09:00',
      place: '구민체육관 (주차 가능)', fee: 50000, deadline: U.addDays(today, 10), target: { type: 'all' },
      choiceLabel: '참가 부문', choices: ['품새', '겨루기', '품새+겨루기'], askLabel: '체중 (kg)',
      description: '초등부·중등부 품새, 겨루기 개인전입니다.\n도장 단체 버스로 함께 이동하며 점심 도시락을 준비해 주세요.\n대회 전 2주 동안 토요일 특별 훈련이 있습니다.',
      consent: '위 대회에 자녀의 참가를 신청합니다. 대회 중 안전 수칙을 지키며, 경기 중 발생할 수 있는 경미한 부상에 대해 안내받았습니다.',
      thirdParty: { to: '구 태권도협회 (대회 주최)', purpose: '대회 참가 접수 및 경기 진행', items: '이름, 생년월일, 성별, 소속 도장, 체급(체중)', period: '대회 종료 후 주최 측 기준에 따라 파기' },
      closed: false, createdAt: Date.now() - 86400000 * 4
    };
    var ev2 = {
      id: U.uid() + 'e2', kind: '승급심사', title: U.fmtM(U.addMonths(ym, 1)) + ' 정기 승급심사', date: U.addDays(today, 30), time: '15:00',
      place: '도장 본관 수련장', fee: 30000, deadline: U.addDays(today, 20), target: { type: 'all' },
      choiceLabel: '', choices: [], askLabel: '',
      description: '심사 항목: 품새, 발차기, 겨루기, 격파, 체력(스쿼트·점핑잭), 인성(감사노트).\n심사 당일 도복과 띠를 꼭 챙겨 주세요.',
      consent: '위 승급심사에 자녀의 응시를 신청합니다.',
      closed: false, createdAt: Date.now() - 86400000 * 3
    };
    var ev3 = {
      id: U.uid() + 'e3', kind: '캠프', title: '겨울방학 태권도 캠프', date: U.addDays(today, 70), time: '10:00',
      place: '청소년수련원', fee: 120000, deadline: U.addDays(today, 50), target: { type: 'class', classes: [classes[1], classes[2], classes[3]] },
      choiceLabel: '참가 일정', choices: ['1박 2일', '당일 참가'], askLabel: '티셔츠 사이즈',
      description: '레크리에이션, 담력 훈련, 시범 공연이 있는 겨울 캠프입니다.\n세부 일정은 신청자에게 따로 안내드립니다.',
      consent: '위 캠프에 자녀의 참가를 신청하며, 단체 생활 규칙을 지키도록 지도하겠습니다.',
      closed: false, createdAt: Date.now() - 86400000 * 1
    };
    var ev4 = {
      id: U.uid() + 'e4', kind: '행사', title: '가을 체육대회', date: U.addDays(today, -20), time: '10:00',
      place: '근린공원 운동장', fee: 10000, deadline: U.addDays(today, -27), target: { type: 'all' },
      choiceLabel: '', choices: [], askLabel: '', description: '가족과 함께하는 체육대회입니다.',
      consent: '위 행사에 자녀의 참가를 신청합니다.', closed: true, createdAt: Date.now() - 86400000 * 40
    };
    var events = [ev1, ev2, ev3, ev4];
    var apps = [];
    function apply(ev, s, extra) {
      var a = {
        id: U.uid() + 'a' + apps.length, eventId: ev.id, studentId: s.id,
        choice: ev.choices.length ? pick(ev.choices) : '', answer: '', memo: '',
        guardianName: s.guardians[0] ? s.guardians[0].name : '', agreed: true, signature: null,
        submittedAt: Date.now() - int(1, 72) * 3600000, status: '접수', paymentId: null, seen: true, by: 'parent'
      };
      a.consents = { privacy: a.submittedAt, third: ev.thirdParty ? a.submittedAt : null, event: a.submittedAt };
      if (ev.askLabel.indexOf('체중') >= 0) a.answer = String(Math.round(18 + (U.age(s.birth) - 6) * 3.2 + noise(4)));
      if (ev.askLabel.indexOf('사이즈') >= 0) a.answer = pick(['120', '130', '140', '150']);
      Object.keys(extra || {}).forEach(function (k) { a[k] = extra[k]; });
      apps.push(a);
      return a;
    }
    var act = students.filter(function (s) { return s.status === 'active'; });
    apply(ev1, students[0], { choice: '품새', answer: '29' });
    act.forEach(function (s, idx) {
      var age = U.age(s.birth);
      if (idx > 1 && age >= 8 && R() < 0.2) apply(ev1, s);
      if (idx > 1 && R() < 0.26) apply(ev2, s);
      if (idx > 1 && DB.eventVisible(ev3, s) && R() < 0.1) apply(ev3, s);
      if (R() < 0.45) apply(ev4, s, { status: '확정', submittedAt: Date.now() - 86400000 * 30 });
    });
    apps.filter(function (a) { return a.eventId === ev1.id; }).slice(-3).forEach(function (a) { a.seen = false; });
    apps.filter(function (a) { return a.eventId === ev3.id; }).slice(-1).forEach(function (a) { a.seen = false; });
    // 참가비 납부
    apps.forEach(function (a) {
      var ev = a.eventId === ev1.id ? ev1 : a.eventId === ev4.id ? ev4 : null;
      if (!ev || (ev === ev1 && R() < 0.5)) return;
      var paidAt = ev === ev4 ? U.addDays(ev4.date, -int(8, 14)) : U.addDays(today, -int(0, 3));
      var p = {
        id: U.uid() + 'q' + payments.length, studentId: a.studentId, category: ev === ev1 ? '대회비' : '행사비',
        month: paidAt.slice(0, 7), amount: ev.fee, paidAt: paidAt, method: '계좌이체', memo: ev.title,
        ref: a.id, createdAt: Date.now()
      };
      payments.push(p);
      a.paymentId = p.id;
      if (ev === ev1) a.status = '확정';
    });
    // 다음 승급심사 신청자 → 채점 전 심사표
    apps.filter(function (a) { return a.eventId === ev2.id; }).forEach(function (a, k) {
      var s = students.filter(function (x) { return x.id === a.studentId; })[0];
      exams.push({ id: U.uid() + 'y' + k, studentId: s.id, examDate: ev2.date, gradeAt: s.grade, items: DB.zeroItems(), scored: false, comment: '', promoted: false, eventId: ev2.id });
    });
    // 용품 판매
    [3, 18, 44].forEach(function (k, n) {
      payments.push({ id: U.uid() + 'g' + n, studentId: students[k].id, category: '용품', month: ym, amount: n === 0 ? 45000 : 18000, paidAt: U.addDays(today, -n * 2), method: '카드', memo: n === 0 ? '도복 (140)' : '겨루기 보호대', createdAt: Date.now() });
    });

    // ---------- 알림장 ----------
    function reads(list, ratio) {
      var r = {};
      list.forEach(function (s) { if (R() < ratio) r[s.id] = Date.now() - int(1, 60) * 3600000; });
      return r;
    }
    var all = act;
    var s0 = students[0];
    // 받침이 있으면 '서준이', 없으면 '서아'
    var given0 = s0.name.slice(1), last0 = given0.charCodeAt(given0.length - 1);
    var nick0 = last0 >= 0xAC00 && (last0 - 0xAC00) % 28 ? given0 + '이' : given0;
    var notices = [
      {
        id: U.uid() + 'n1', title: ev2.title + ' 안내', pinned: true, image: null,
        body: '안녕하세요, ' + st.settings.dojangName + '입니다.\n\n' + U.fmtMD(ev2.date) + ' 오후 3시에 정기 승급심사가 있습니다.\n심사비는 30,000원이며 참가신청 메뉴에서 신청해 주세요.\n\n심사 전까지 매일 품새 연습을 하고, 감사노트도 빠짐없이 써 오도록 지도 부탁드립니다.',
        target: { type: 'all' }, createdAt: Date.now() - 86400000 * 3, reads: {}, replies: []
      },
      {
        id: U.uid() + 'n2', title: U.fmtM(ym) + ' 회비 납부 안내', pinned: false, image: null,
        body: U.fmtM(ym) + ' 회비 납부 기간입니다. (매월 10일까지)\n\n월 회비: ' + U.won(st.settings.monthlyFee) + '\n형제 할인은 원생 정보에 반영되어 있습니다.\n\n이미 납부하신 분은 이 안내를 넘기셔도 됩니다. 감사합니다.',
        target: { type: 'all' }, createdAt: U.parse(ym + '-01').getTime() + 9 * 3600000, reads: {}, replies: []
      },
      {
        id: U.uid() + 'n3', title: ev1.title + ' 참가 신청', pinned: false, image: null,
        body: ev1.title + '에 참가할 수련생을 모집합니다.\n\n일시: ' + U.fmtMD(ev1.date) + ' 오전 9시\n장소: ' + ev1.place + '\n참가비: 50,000원\n신청 마감: ' + U.fmtMD(ev1.deadline) + '\n\n참가신청 메뉴에서 신청서를 작성해 주세요.',
        target: { type: 'all' }, createdAt: Date.now() - 86400000 * 4 + 3600000, reads: {}, replies: []
      },
      {
        id: U.uid() + 'n4', title: '1부 수련 시간 안내', pinned: false, image: null,
        body: '다음 주부터 1부 수련이 14:00에서 14:10으로 10분 늦게 시작합니다.\n유치부 하원 시간에 맞춘 변경입니다. 참고 부탁드립니다.',
        target: { type: 'class', classes: [classes[0]] }, createdAt: Date.now() - 86400000 * 6, reads: {}, replies: []
      },
      {
        id: U.uid() + 'n5', title: nick0 + '의 오늘 수련 이야기', pinned: false, image: null,
        body: '어머님, 오늘 ' + nick0 + '가 태극 4장을 처음으로 끝까지 틀리지 않고 해냈어요!\n동생들 앞에서 시범도 보여줬는데 아주 의젓했습니다.\n집에서도 많이 칭찬해 주세요.',
        target: { type: 'students', studentIds: [s0.id] }, createdAt: Date.now() - 86400000 * 1 + 7200000, reads: {}, replies: []
      }
    ];
    notices[0].reads = reads(all, 0.64);
    notices[1].reads = reads(all, 0.82);
    notices[2].reads = reads(all, 0.5);
    notices[3].reads = reads(all.filter(function (s) { return s.className === classes[0]; }), 0.7);
    notices[0].reads[s0.id] = Date.now() - 86400000 * 2;
    notices[1].reads[s0.id] = Date.now() - 86400000 * 9;
    delete notices[2].reads[s0.id];
    var rs = all.slice(5, 9);
    notices[0].replies = [
      { id: U.uid() + 'r1', studentId: rs[0].id, body: '확인했습니다. 열심히 연습시킬게요!', at: Date.now() - 86400000 * 2, seen: true },
      { id: U.uid() + 'r2', studentId: rs[1].id, body: '심사 당일 조금 늦을 수도 있는데 괜찮을까요?', at: Date.now() - 3600000 * 5, seen: false }
    ];
    notices[1].replies = [
      { id: U.uid() + 'r3', studentId: rs[2].id, body: '이번 달은 15일에 납부해도 될까요?', at: Date.now() - 3600000 * 20, seen: false }
    ];
    notices[4].replies = [];

    // 보호자 동의: 대부분 받은 상태, 몇 명은 아직 받지 않은 상태 (체험용 원생 0·1번은 학부모 앱 첫 화면에서 동의)
    students.forEach(function (s, idx) {
      if (idx < 2 || idx % 13 === 5 || s.status === 'left') return;
      var g = s.guardians[0], at = U.parse(s.joinDate).getTime() + 10 * 3600000;
      var byApp = R() < 0.35, health = /알레르기|천식/.test(s.memo);
      s.consent = {
        v: 1, at: at, by: byApp ? 'app' : 'in-person', guardianName: g.name, relation: g.relation, phone: U.digits(g.phone),
        required: true, photo: R() < 0.82, health: health, self: U.age(s.birth) >= 14 ? true : null, signature: null,
        smsSentAt: byApp && idx % 17 !== 3 ? at + 3600000 : null
      };
    });
    students.forEach(function (s) { delete s._girl; delete s._p; delete s._away; });
    st.ledgerStart = U.addMonths(ym, -2);
    // 퇴원한 지 1년이 넘은 원생 (개인정보 정리 기능 체험용)
    var leftDay = new Date(); leftDay.setMonth(leftDay.getMonth() - 14);
    students[99].leftAt = U.ymd(leftDay);
    st.students = students;
    st.payments = payments;
    st.fitness = fitness;
    st.exams = exams;
    st.events = events;
    st.applications = apps;
    st.notices = notices;
  };

  window.Seed = Seed;
})();
