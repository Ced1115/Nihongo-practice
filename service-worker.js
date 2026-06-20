// ══════════════════════════════════════════════════════════════════
//  SERVICE WORKER — caches the app shell for offline use, and
//  opportunistically caches KanjiVG stroke SVGs as you encounter them.
// ══════════════════════════════════════════════════════════════════
const CACHE_NAME = 'hiragana-app-v1';
const STROKE_CACHE_NAME = 'hiragana-strokes-v1';

// Everything needed to run the app with no network at all
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/data.js',
  './js/storage.js',
  './js/strokes.js',
  './js/drawpad.js',
  './js/selection.js',
  './js/flashcards.js',
  './js/typing.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== STROKE_CACHE_NAME)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // KanjiVG stroke SVGs: try network first (fresh data), fall back to cache
  // (so once you've viewed a character's stroke order, it's available offline)
  if (url.hostname === 'cdn.jsdelivr.net' && url.pathname.includes('kanjivg')) {
    event.respondWith(
      fetch(event.request)
        .then(resp => {
          const clone = resp.clone();
          caches.open(STROKE_CACHE_NAME).then(cache => cache.put(event.request, clone));
          return resp;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Google Fonts: cache-first is fine, fonts don't change
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
    return;
  }

  // App shell: cache-first, network fallback
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(resp => {
        // Cache same-origin GET responses for next time
        if (event.request.method === 'GET' && url.origin === self.location.origin) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return resp;
      });
    }).catch(() => caches.match('./index.html'))
  );
});
