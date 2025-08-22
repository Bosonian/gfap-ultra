// Service Worker for Stroke Triage Assistant PWA
const VERSION = '2.2.0-' + Date.now(); // Add timestamp for cache busting
const CACHE_NAME = 'stroke-triage-v' + VERSION;
const STATIC_CACHE = 'stroke-triage-static-v' + VERSION;
const DYNAMIC_CACHE = 'stroke-triage-dynamic-v' + VERSION;

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  // Add generated assets during install
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker version:', VERSION);
  
  // Skip waiting immediately to activate new version
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('[SW] Static files cached successfully');
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip non-cacheable requests - comprehensive filtering
  if (url.includes('/api/') || 
      url.includes('googleapis.com') || 
      url.includes('openrouteservice.org') ||
      url.includes('cloudfunctions.net') ||
      url.startsWith('chrome-extension://') ||
      url.startsWith('moz-extension://') ||
      url.startsWith('safari-extension://') ||
      url.startsWith('chrome://') ||
      url.startsWith('about:') ||
      url.includes('extension') ||
      url.includes('executor.js')) {
    console.log('[SW] Skipping non-cacheable request:', url);
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[SW] Serving from cache:', request.url);
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache if response is not ok
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              console.log('[SW] Not caching response:', request.url, 'Status:', networkResponse?.status);
              return networkResponse;
            }
            
            // Additional check to avoid caching problematic URLs
            if (request.url.includes('extension') || request.url.includes('executor')) {
              console.log('[SW] Skipping cache for extension resource:', request.url);
              return networkResponse;
            }
            
            // Clone the response
            const responseClone = networkResponse.clone();
            
            // Add to dynamic cache with error handling
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                console.log('[SW] Caching dynamic resource:', request.url);
                return cache.put(request, responseClone);
              })
              .catch((error) => {
                console.warn('[SW] Failed to cache resource:', request.url, error);
              });
            
            return networkResponse;
          })
          .catch((error) => {
            console.error('[SW] Fetch failed:', error);
            
            // Return offline fallback for HTML pages
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }
            
            throw error;
          });
      })
  );
});

// Background sync for offline API calls (if needed)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-assessment-data') {
    event.waitUntil(
      // Could implement offline assessment data sync here
      Promise.resolve()
    );
  }
});

// Push notification handler (for future use)
self.addEventListener('push', (event) => {
  console.log('[SW] Push message received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-96x96.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Stroke Triage Assistant', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});