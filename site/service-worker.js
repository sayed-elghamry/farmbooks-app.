const CACHE_NAME = 'ghamry-farm-app-v18';
const ASSETS_TO_CACHE = [
  './index.html',
  './daily-house.html',
  './layers.html',
  './duck-breeders.html',
  './duck-fattening.html',
  './turkey-breeders.html',
  './turkey-fattening.html',
  './chicken-breeders.html',
  './config.js',
  './gh-register.js',
  './domain-guard.js',
  './manifest.json',
  './manifest-dashboard.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './favicon-32.png'
];

// عند التثبيت: خزّن كل صفحات وأيقونات التطبيق للعمل بدون إنترنت
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// عند التفعيل: امسح أي نسخة قديمة من الكاش
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// استراتيجية: حاول تجيب من الإنترنت أولاً (عشان أي تحديث)، ولو فشل ارجع للكاش
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
