self.addEventListener('install', function (event) {
  // console.log('[Service Worker] Instalando Service Worker...', event);
});

self.addEventListener('activate', function (event) {
  // console.log('[Service Worker] Ativando Service Worker ...', event);
  return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  // console.log('[Service Worker] Procurando algo...', event);
  event.respondWith(fetch(event.request));
});