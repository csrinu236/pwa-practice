self.addEventListener('install', (e) => {
  console.log('[Service Worker] installing Service Worker', e);
});
self.addEventListener('activate', (e) => {
  console.log('[Service Worker] activating Service Worker', e);
  return self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  console.log('[Service Worker] Service Worker fetching...', e);
  e.respondWith(fetch(e.request));
});
