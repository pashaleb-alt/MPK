// Офлайн-запуск страницы простоев: онлайн берём свежую версию (ждём до 4 с), без связи — копию из памяти телефона.
// Действует только на этой странице (scope = папка prostoi/), на дашборд не влияет.
const CACHE = 'prostoi-v1';
const ROOT = new URL('./', self.registration.scope).href;
self.addEventListener('install', e => e.waitUntil((async () => {
  try { const c = await caches.open(CACHE); const r = await fetch(ROOT, {cache: 'reload'}); if (r.ok) await c.put(ROOT, r); } catch (_) {}
  self.skipWaiting();
})()));
self.addEventListener('activate', e => e.waitUntil((async () => {
  const ks = await caches.keys(); await Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)));
  await self.clients.claim();
})()));
self.addEventListener('fetch', e => {
  const req = e.request, u = new URL(req.url);
  if (req.method !== 'GET' || u.origin !== location.origin || req.mode !== 'navigate' || !u.href.startsWith(ROOT)) return;
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    try {
      const r = await Promise.race([fetch(req), new Promise((_, no) => setTimeout(() => no(new Error('timeout')), 4000))]);
      if (r && r.ok) c.put(ROOT, r.clone());
      return r;
    } catch (_) {
      return (await c.match(ROOT)) || Response.error();
    }
  })());
});
