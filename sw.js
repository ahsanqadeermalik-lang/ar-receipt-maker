const CACHE = 'al-rehman-v2';
const FILES = ['./', './index.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const r = e.request;
  // Only handle this app's own files. Never touch Supabase or any other site, so login data is never cached.
  if (r.method !== 'GET' || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(ch => ch.put(r, c)); return res; }).catch(() => caches.match(r)));
});
