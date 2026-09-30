// P4/SP4 Data Checker - service worker
// App files and limit files are fetched from the network first, so updates show up
// right away; the cached copy is used when offline.
const CACHE = "p4sp4-checker-v1";
const APP_FILES = ["./", "index.html", "manifest.webmanifest", "sample_data.csv",
                   "icons/icon.svg", "icons/icon-192.png", "icons/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(APP_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const isApp = url.origin === self.location.origin;
  const isLimit = url.hostname === "raw.githubusercontent.com";
  if (!isApp && !isLimit) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const key = isLimit ? url.href : req;   // ignore cache-mode differences for limit files
    try {
      const res = await fetch(req);
      if (res.ok) cache.put(key, res.clone());
      return res;
    } catch (err) {
      const hit = await cache.match(key, {ignoreSearch: true}) ||
                  (req.mode === "navigate" ? await cache.match("index.html") : null);
      if (hit) return hit;
      throw err;
    }
  })());
});
