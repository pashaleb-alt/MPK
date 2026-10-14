// Показатели МПК: сначала сеть (данные всегда свежие), при отсутствии связи — последняя сохранённая версия.
const CACHE = "mpk-v2";
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(resp => { const c = resp.clone(); caches.open(CACHE).then(ch => ch.put(r, c)).catch(() => {}); return resp; }).catch(() => caches.match(r).then(m => m || caches.match("/MPK/"))));
});
