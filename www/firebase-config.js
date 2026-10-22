/* 서버(Firebase) 연결 정하기
   도장마다 자기 Firebase 프로젝트를 써요. 앱 주소는 모든 도장이 같고, 어느 도장 서버에 붙을지는 기기마다 기억합니다.
   - 도장이 보낸 연결 링크(?s=프로젝트ID.API키.앱ID)로 열면 그 서버를 이 기기에 기억해요.
   - 관장님은 앱에서 Firebase 설정값을 붙여 넣어 연결할 수도 있어요.
   - 연결한 서버가 없으면 1단계처럼 이 기기에만 저장하는 체험 모드로 열려요.
   이 값들은 비밀번호가 아니라 어느 프로젝트를 쓰는지 알려 주는 주소예요. 실제 보호는 보안 규칙이 합니다.
   미리보기·테스트처럼 앞에서 window.FIREBASE_CONFIG 를 정해 두면(false 는 체험 모드) 그 값을 그대로 씁니다. */
(function () {
  'use strict';
  var KEY = 'tkd-server-v1';
  var Server = window.Server = {
    preset: window.FIREBASE_CONFIG !== undefined,
    pending: null, // 링크의 서버가 지금 연결된 서버와 다를 때, 바꿀지 시작 화면에서 물어봐요
    // 연결 링크의 s 값 → 설정값. 모양이 맞지 않으면 null
    parse: function (s) {
      var m = /^([a-z][a-z0-9-]{4,29})\.(AIza[0-9A-Za-z_-]{35})\.(1:(\d+):web:[0-9a-f]+)$/.exec(String(s || '').trim());
      if (!m) return null;
      return { apiKey: m[2], authDomain: m[1] + '.firebaseapp.com', projectId: m[1], messagingSenderId: m[4], appId: m[3] };
    },
    param: function (c) { return c && c.projectId && c.apiKey && c.appId ? c.projectId + '.' + c.apiKey + '.' + c.appId : null; },
    // Firebase 콘솔에서 복사한 firebaseConfig 글이나 연결 링크에서 설정값을 찾아요
    fromText: function (text) {
      text = String(text || '');
      var q = /[?&]s=([^&\s#]+)/.exec(text);
      if (q) return Server.parse(decodeURIComponent(q[1]));
      function pick(k) { var m = new RegExp(k + '["\']?\\s*:\\s*["\']([^"\']+)["\']').exec(text); return m ? m[1].trim() : ''; }
      return Server.parse(pick('projectId') + '.' + pick('apiKey') + '.' + pick('appId'));
    },
    saved: function () { try { return Server.parse(localStorage.getItem(KEY)); } catch (e) { return null; } },
    save: function (c) { try { localStorage.setItem(KEY, Server.param(c)); return true; } catch (e) { return false; } },
    forget: function () { try { localStorage.removeItem(KEY); } catch (e) {} }
  };
  if (Server.preset) return;
  var link = null;
  try { link = Server.parse(new URLSearchParams(location.search).get('s')); } catch (e) {}
  var saved = Server.saved();
  if (link && (!saved || link.projectId === saved.projectId)) { Server.save(link); saved = link; }
  else if (link) Server.pending = link;
  window.FIREBASE_CONFIG = saved || null;
})();
