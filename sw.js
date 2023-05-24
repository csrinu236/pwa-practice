self.addEventListener('install', (e) => {
  console.log('[Service Worker] installing Service Worker', e);
  // don't offload this task and go to bottom first cache
  // all these pages and then go for activating service worker
  e.waitUntil(
    caches.open('static').then((cache) => {
      console.log('[Service Worker] Pre caching app shell');
      cache.add('/index.html');
      cache.add('/main.css');
      cache.add('/app.js');
    })
  );
});
self.addEventListener('activate', (e) => {
  console.log('[Service Worker] activating Service Worker', e);
  return self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  console.log('[Service Worker] Service Worker fetching...', e);
  e.respondWith(
    caches.match(e.request).then((resp) => {
      if (resp) {
        return resp;
      } else {
        return fetch(e.request)
          .then((fetchResp) => {
            return caches.open('dynamic').then((cache) => {
              cache.put(e.request.url, fetchResp.clone());
              return fetchResp;
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
  );
});
