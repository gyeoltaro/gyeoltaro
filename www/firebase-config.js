/* 2단계 서버 설정 (Firebase 프로젝트: awoolimtkd)
   Firebase 콘솔 → 프로젝트 설정 → 일반 → 내 앱(웹 앱)의 firebaseConfig 값입니다.
   이 값은 비밀번호가 아니라 앱이 어느 Firebase 프로젝트를 쓰는지 알려 주는 주소예요. 실제 보호는 보안 규칙이 합니다.
   미리보기·테스트처럼 앞에서 window.FIREBASE_CONFIG 를 false 로 정해 두면 1단계처럼 이 기기에만 저장합니다. */
if (window.FIREBASE_CONFIG === undefined) {
  window.FIREBASE_CONFIG = {
    apiKey: 'AIzaSyA3wHF3Mhysd9yG7pp_KSzuWE8HynvfwV0',
    authDomain: 'awoolimtkd.firebaseapp.com',
    projectId: 'awoolimtkd',
    storageBucket: 'awoolimtkd.firebasestorage.app',
    messagingSenderId: '999702798233',
    appId: '1:999702798233:web:975011848cb9d821d97d08'
  };
}
