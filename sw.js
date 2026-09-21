/* Service Worker: macht die App startbereit, auch wenn das Netz mal weg ist.
   Beim Aenderen von Dateien die VERSION hochzaehlen, damit alle die neue Fassung bekommen. */
const VERSION = 'schulverein-v5';
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

/* ---------- Benachrichtigungen ---------- */
self.addEventListener('push', ev => {
  let d = { titel: 'Schulverein', text: '', url: './' };
  try { d = Object.assign(d, ev.data.json()); }
  catch (e) { if (ev.data) d.text = ev.data.text(); }
  ev.waitUntil(self.registration.showNotification(d.titel, {
    body: d.text,
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    lang: 'de',
    data: { url: d.url }
  }));
});

self.addEventListener('notificationclick', ev => {
  ev.notification.close();
  const ziel = (ev.notification.data && ev.notification.data.url) || './';
  ev.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(fenster => {
      for (const f of fenster) if ('focus' in f) return f.focus();
      return self.clients.openWindow(ziel);
    })
  );
});
