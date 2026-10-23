/* 앱 화면 파일을 기기에 보관해 두었다가 인터넷이 끊겼을 때도 다시 열 수 있게 합니다.
   인터넷이 되면 항상 새 파일을 먼저 받아서, 앱을 고치면 바로 반영돼요. 원생 자료는 여기에 저장하지 않아요(서버 자료는 Firebase가 따로 보관). */
var CACHE = 'tkd-app-v1';
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then(function (res) {
    if (res.ok) {
      var copy = res.clone();
      e.waitUntil(caches.open(CACHE).then(function (c) { return c.put(req, copy); }));
    }
    return res;
  }).catch(function () {
    return caches.match(req, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      if (req.mode === 'navigate') return caches.match('./', { ignoreSearch: true }).then(function (r) { return r || Response.error(); });
      return Response.error();
    });
  }));
});

// 앱 푸시: 서버(functions/)가 보낸 알림을 보여 줘요. 알림 내용은 {title, body, tag} 이고 아이 이름은 들어 있지 않아요.
self.addEventListener('push', function (e) {
  var d = {};
  try { var j = e.data ? e.data.json() : {}; d = j.data || j.notification || j; } catch (err) {}
  e.waitUntil(self.registration.showNotification(d.title || '태권도 관리', {
    body: d.body || '', icon: 'icons/icon-192.png', tag: d.tag || undefined, renotify: !!d.tag, lang: 'ko'
  }));
});
// 알림을 누르면 열려 있는 앱으로 가고, 없으면 새로 열어요
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) if ('focus' in list[i]) return list[i].focus();
    return self.clients.openWindow(self.registration.scope);
  }));
});
