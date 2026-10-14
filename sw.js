// Офлайн-режим отключён (14.10.2026): на iPhone мешал переходам между вкладками. Этот файл снимает прежнюю регистрацию и чистит кэш.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil((async () => {
  const ks = await caches.keys(); await Promise.all(ks.map(k => caches.delete(k)));
  await self.registration.unregister();
  const cs = await self.clients.matchAll({type: "window"}); cs.forEach(c => { try { c.navigate(c.url) } catch (e) {} });
})()));
