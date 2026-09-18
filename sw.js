/* Service Worker: macht die App startbereit, auch wenn das Netz mal weg ist.
   Beim Aenderen von Dateien die VERSION hochzaehlen, damit alle die neue Fassung bekommen. */
const VERSION = 'schulverein-v2';
const DATEIEN = ['./', 'index.html', 'app.css', 'app.js', 'inhalte.json', 'recht.html', 'logo.png', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', ev => {
  ev.waitUntil(caches.open(VERSION).then(c => c.addAll(DATEIEN)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', ev => {
  ev.waitUntil(
    caches.keys()
      .then(namen => Promise.all(namen.filter(n => n !== VERSION).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

/* Inhalte immer zuerst aus dem Netz holen, damit Aenderungen sofort ankommen.
   Klappt das nicht, kommt die gespeicherte Fassung. */
self.addEventListener('fetch', ev => {
  if (ev.request.method !== 'GET') return;
  ev.respondWith(
    fetch(ev.request)
      .then(antwort => {
        const kopie = antwort.clone();
        caches.open(VERSION).then(c => c.put(ev.request, kopie)).catch(() => {});
        return antwort;
      })
      .catch(() => caches.match(ev.request).then(treffer => treffer || caches.match('index.html')))
  );
});
