// public/sw.js
// Um service worker básico apenas para passar nas exigências do PWA do Android
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass-through simples, não faz cache, mas valida o PWA
  event.respondWith(fetch(event.request));
});