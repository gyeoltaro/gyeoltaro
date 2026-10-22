/* 2단계 서버 설정
   Firebase 콘솔 → 프로젝트 설정 → 일반 → 내 앱(웹 앱)의 firebaseConfig 값을 아래 null 자리에 붙여 넣으세요.
   예) window.FIREBASE_CONFIG = { apiKey: "...", authDomain: "...", projectId: "...", storageBucket: "...", messagingSenderId: "...", appId: "..." };
   이 값은 비밀번호가 아니라 앱이 어느 Firebase 프로젝트를 쓰는지 알려 주는 주소예요. 실제 보호는 보안 규칙이 합니다.
   null 이면 1단계처럼 이 기기에만 저장합니다. */
window.FIREBASE_CONFIG = window.FIREBASE_CONFIG || null;
