const PREFIX = "V1";

const assets = [
  "/",
  "/index.html",
  "/offline.html",
  "/style.css",
  "/offline.css",
  "/app.js",
  "/images",
  "/images/france_flag.png",
];

//ajout fichiers en cache
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(PREFIX).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
});



self.addEventListener("install", () => {
  self.skipWaiting();
})

self.addEventListener("activate", (activeEvent) => {
  clients.claim();
  activeEvent.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (!key.includes(PREFIX)) {
            return caches.delete(key)
          }
        })
      );
    })()
  )
});
  


