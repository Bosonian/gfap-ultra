// A simple version number for your cache
const CACHE_VERSION = 'v2.3.6'; 
const CACHE_NAME = `igfap-cache-${CACHE_VERSION}`;

// List of essential files for the app shell to work offline
const APP_SHELL_URLS = [
  './',
  './index.html'
];

// Install event: cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.startsWith('igfap-cache-') && name !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Message event: listen for a 'skipWaiting' message from the page
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Fetch event: serve from cache, falling back to network
self.addEventListener('fetch', event => {
    // For local model files and app shell, use a cache-first strategy.
    if (APP_SHELL_URLS.some(url => event.request.url.endsWith(url)) || 
        event.request.url.includes('.onnx') || 
        event.request.url.includes('.json')) {
        
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request).then(networkResponse => {
                    // Optional: Clone and cache the response for next time
                    let responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                    return networkResponse;
                });
            })
        );
    } else {
        // For all other requests (like external fonts, etc.), let the browser handle it.
        return;
    }
});
