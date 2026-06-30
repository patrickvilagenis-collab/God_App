/* Service worker: cachea el "shell" para que Alma abra rápido y offline.
   Las respuestas de la IA siempre van a la red (nunca se cachean). */
const CACHE = "alma-v9";
const SHELL = ["./", "index.html", "app.js", "manifest.webmanifest", "icon.png", "icon-192.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  // nunca cachear llamadas a la IA
  if (url.pathname.includes("/api/") || url.hostname.includes("anthropic.com")) return;
  if (e.request.method !== "GET") return;
  // RED PRIMERO: siempre intentamos la versión más reciente; la caché es solo
  // respaldo cuando no hay conexión. Así las actualizaciones se ven al instante.
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(e.request).then(hit => hit || caches.match("index.html")))
  );
});
