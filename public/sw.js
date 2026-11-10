/*
 * Deal Desk service worker. It keeps the app's own files on the phone so the calculator opens with a weak or no
 * signal. It never stores anything the buyer typed, and it never touches /api/ (car lookups, AI) or other sites.
 *
 *  - Hashed build files, fonts, the 3D car and icons: cache first, they never change under the same name.
 *  - Pages: network first, so a new version arrives at once; the last copy is used when offline.
 *  - Anything else: left to the browser.
 */
const VERSION = "dd-v1";
const PAGES = `${VERSION}-pages`;
const FILES = `${VERSION}-files`;
const STATIC = /^\/(_next\/static\/|models\/|icons\/|fonts\/)/;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PAGES)
      .then((cache) => Promise.allSettled(["/offline", "/deal"].map((u) => cache.add(u))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  // The page lists the files it has already loaded, so the first visit works offline too.
  if (event.data?.type !== "cache-urls") return;
  const urls = (event.data.urls || []).filter((u) => {
    try {
      const url = new URL(u, self.location.origin);
      return url.origin === self.location.origin && STATIC.test(url.pathname);
    } catch {
      return false;
    }
  });
  event.waitUntil(caches.open(FILES).then((cache) => Promise.allSettled(urls.map((u) => cache.add(u)))));
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  if (STATIC.test(url.pathname)) {
    event.respondWith(
      caches.open(FILES).then(async (cache) => {
        const hit = await cache.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      }),
    );
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) caches.open(PAGES).then((cache) => cache.put(req, res.clone()));
          return res;
        })
        .catch(async () => {
          const cache = await caches.open(PAGES);
          return (await cache.match(req, { ignoreSearch: true })) || (await cache.match("/offline")) || Response.error();
        }),
    );
  }
});
