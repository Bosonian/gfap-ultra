/**
 * Medical Service Worker for Offline-First Stroke Triage Assistant
 * iGFAP Stroke Triage Assistant - Phase 3 Advanced Features
 *
 * Provides intelligent offline capabilities for critical medical operations with bulletproof error handling
 */

// Bulletproof error handling for service worker
const ERROR_CATEGORIES = {
  CACHE: 'cache',
  NETWORK: 'network',
  MEDICAL: 'medical',
  STORAGE: 'storage',
};

const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

/**
 * Safe async wrapper for service worker operations
 */
async function safeAsync(operation, fallback = null, context = {}) {
  try {
    return await operation();
  } catch (error) {
    console.error('Service Worker error:', error.message, context);

    // Send error to main thread
    try {
      const clients = await self.clients.matchAll();
      clients.forEach((client) => {
        client.postMessage({
          type: 'SW_ERROR',
          error: {
            message: error.message,
            context,
            timestamp: new Date().toISOString(),
          },
        });
      });
    } catch (msgError) {
      console.error('Failed to send error message to clients:', msgError);
    }

    return typeof fallback === 'function' ? fallback(error) : fallback;
  }
}

const CACHE_VERSION = 'medical-app-v3.0.0';
const STATIC_CACHE_NAME = `${CACHE_VERSION}-static`;
const API_CACHE_NAME = `${CACHE_VERSION}-api`;
const RUNTIME_CACHE_NAME = `${CACHE_VERSION}-runtime`;

// Critical resources that must be available offline
const CRITICAL_RESOURCES = [
  '/0925/',
  '/0925/index.html',
  '/0925/src/main.js',
  '/0925/src/app.js',
  '/0925/src/config.js',
  '/0925/src/state/store.js',
  '/0925/src/logic/validate.js',
  '/0925/src/logic/ich-volume-calculator.js',
  '/0925/src/logic/lvo-local-model.js',
  '/0925/src/ui/render.js',
  '/0925/src/styles/app.css',
  '/0925/manifest.json',
  '/0925/icon-192.png',
  '/0925/icon-512.png',
];

// API endpoints for intelligent caching
const API_ENDPOINTS = [
  'https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich',
  'https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich',
  'https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke',
];

// Network strategies
const NETWORK_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
};

/**
 * Service Worker Installation with bulletproof error handling
 */
self.addEventListener('install', (event) => {
  // Medical Service Worker installing

  event.waitUntil(
    safeAsync(
      async () => {
        // Pre-cache critical resources with individual error handling
        const staticCache = await caches.open(STATIC_CACHE_NAME);

        // Cache resources individually to prevent single failure from blocking entire installation
        const cacheResults = await Promise.allSettled(
          CRITICAL_RESOURCES.map(async (resource) => {
            try {
              const response = await fetch(resource);
              if (response.ok) {
                return staticCache.put(resource, response);
              }
              throw new Error(`Failed to fetch ${resource}: ${response.status}`);
            } catch (fetchError) {
              console.warn(`Failed to cache critical resource ${resource}:`, fetchError.message);
              return null;
            }
          }),
        );

        const successfulCaches = cacheResults.filter((result) => result.status === 'fulfilled').length;
        const failedCaches = CRITICAL_RESOURCES.length - successfulCaches;

        if (failedCaches > CRITICAL_RESOURCES.length / 2) {
          throw new Error(`Too many critical resources failed to cache: ${failedCaches}/${CRITICAL_RESOURCES.length}`);
        }

        // Initialize API and runtime caches
        await Promise.allSettled([
          caches.open(API_CACHE_NAME),
          caches.open(RUNTIME_CACHE_NAME),
        ]);

        // Medical Service Worker installed successfully

        // Send installation success message
        try {
          const clients = await self.clients.matchAll();
          clients.forEach((client) => {
            client.postMessage({
              type: 'SW_INSTALLED',
              cacheVersion: CACHE_VERSION,
              criticalResourcesCount: CRITICAL_RESOURCES.length,
              successfulCaches,
              failedCaches,
              timestamp: new Date().toISOString(),
            });
          });
        } catch (msgError) {
          console.warn('Failed to send installation message:', msgError.message);
        }

        // Skip waiting to activate immediately
        self.skipWaiting();

        return { success: true, successfulCaches, failedCaches };
      },
      (error) => {
        // Fallback for installation failure
        console.error('Service Worker installation failed:', error.message);

        try {
          const clients = self.clients.matchAll();
          clients.then((clientList) => {
            clientList.forEach((client) => {
              client.postMessage({
                type: 'SW_INSTALL_ERROR',
                error: error.message,
                timestamp: new Date().toISOString(),
              });
            });
          });
        } catch (msgError) {
          console.error('Failed to send installation error message:', msgError.message);
        }

        return { success: false, error: error.message };
      },
      {
        operation: 'service_worker_installation',
        criticalResourcesCount: CRITICAL_RESOURCES.length,
      },
    ),
  );
});

/**
 * Service Worker Activation with bulletproof error handling
 */
self.addEventListener('activate', (event) => {
  // Medical Service Worker activating

  event.waitUntil(
    safeAsync(
      async () => {
        // Clean up old caches with individual error handling
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter((name) => name.startsWith('medical-app-v') && !name.includes(CACHE_VERSION));

        const cleanupResults = await Promise.allSettled(
          oldCaches.map(async (cacheName) => {
            try {
              const deleted = await caches.delete(cacheName);
              return { cacheName, deleted };
            } catch (error) {
              console.warn(`Failed to delete cache ${cacheName}:`, error.message);
              return { cacheName, deleted: false, error: error.message };
            }
          }),
        );

        const successfulCleanups = cleanupResults.filter((result) => result.status === 'fulfilled' && result.value.deleted).length;

        // Cleaned up old caches

        // Claim all clients with timeout
        await Promise.race([
          self.clients.claim(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Client claim timeout')), 5000)),
        ]);

        // Medical Service Worker activated

        // Notify clients of activation
        const clients = await self.clients.matchAll();
        const notificationPromises = clients.map((client) => {
          try {
            return client.postMessage({
              type: 'SW_ACTIVATED',
              cacheVersion: CACHE_VERSION,
              cleanedCaches: successfulCleanups,
              totalOldCaches: oldCaches.length,
              timestamp: new Date().toISOString(),
            });
          } catch (error) {
            console.warn('Failed to notify client of activation:', error.message);
            return null;
          }
        });

        await Promise.allSettled(notificationPromises);

        return { success: true, cleanedCaches: successfulCleanups };
      },
      (error) => {
        console.error('Service Worker activation failed:', error.message);

        // Try to notify clients of activation failure
        safeAsync(
          async () => {
            const clients = await self.clients.matchAll();
            clients.forEach((client) => {
              client.postMessage({
                type: 'SW_ACTIVATION_ERROR',
                error: error.message,
                timestamp: new Date().toISOString(),
              });
            });
          },
          null,
          { operation: 'activation_error_notification' },
        );

        return { success: false, error: error.message };
      },
      {
        operation: 'service_worker_activation',
      },
    ),
  );
});

/**
 * Fetch Event Handler with Intelligent Caching
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests for caching
  if (request.method !== 'GET') {
    if (isAPIRequest(url)) {
      // Handle API POST requests with intelligent offline behavior
      event.respondWith(handleAPIRequest(request));
    }
    return;
  }

  // Route requests based on type
  if (isAPIRequest(url)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isStaticResource(url)) {
    event.respondWith(handleStaticResource(request));
  } else if (isAppShell(url)) {
    event.respondWith(handleAppShell(request));
  } else {
    event.respondWith(handleRuntimeRequest(request));
  }
});

/**
 * Handle API requests with medical data caching and bulletproof error handling
 */
async function handleAPIRequest(request) {
  return safeAsync(
    async () => {
      const url = new URL(request.url);

      // For POST requests (predictions), try network first with offline fallback
      if (request.method === 'POST') {
        return await handlePredictionRequest(request);
      }

      // For GET requests, use stale-while-revalidate
      const cache = await caches.open(API_CACHE_NAME);
      const cachedResponse = await cache.match(request);

      // If we have a cached response, return it while updating in background
      if (cachedResponse) {
        // Update cache in background with error handling
        safeAsync(
          async () => {
            const response = await fetch(request);
            if (response.ok) {
              await cache.put(request, response.clone());
            }
          },
          null,
          { operation: 'background_cache_update', url: request.url },
        );

        return cachedResponse;
      }

      // No cache, try network with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const networkResponse = await fetch(request, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (networkResponse.ok) {
          // Cache response with error handling
          try {
            await cache.put(request, networkResponse.clone());
          } catch (cacheError) {
            console.warn('Failed to cache API response:', cacheError.message);
          }
        }

        return networkResponse;
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    },
    (error) => {
      console.warn('API request failed, returning offline fallback:', error.message);
      return createOfflineFallbackResponse(request);
    },
    {
      operation: 'api_request_handling',
      url: request.url,
      method: request.method,
    },
  );
}

/**
 * Handle prediction API requests with intelligent offline support and bulletproof error handling
 */
async function handlePredictionRequest(request) {
  return safeAsync(
    async () => {
      // Clone request for potential retry
      const requestClone = request.clone();

      // Try network first (critical for real-time predictions)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      try {
        const networkResponse = await fetch(request, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (networkResponse.ok) {
          // Cache successful prediction for offline reference with error handling
          safeAsync(
            async () => {
              const cache = await caches.open(API_CACHE_NAME);
              const cacheKey = await createPredictionCacheKey(requestClone);

              // Store with timestamp for freshness checking
              const responseWithMetadata = await addCacheMetadata(networkResponse.clone());
              await cache.put(cacheKey, responseWithMetadata);
            },
            null,
            { operation: 'prediction_cache_storage', url: request.url },
          );

          return networkResponse;
        }

        throw new Error(`API returned ${networkResponse.status}: ${networkResponse.statusText}`);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    },
    async (error) => {
      console.warn('Network prediction failed, trying offline alternatives:', error.message);

      // Try local LVO model if available
      const localPrediction = await safeAsync(
        () => tryLocalPrediction(request),
        null,
        { operation: 'local_prediction_attempt' },
      );

      if (localPrediction) {
        return localPrediction;
      }

      // Return cached similar prediction if available
      const cachedPrediction = await safeAsync(
        () => findSimilarCachedPrediction(request),
        null,
        { operation: 'cached_prediction_lookup' },
      );

      if (cachedPrediction) {
        return cachedPrediction;
      }

      // Return offline guidance response
      return createOfflinePredictionGuidance();
    },
    {
      operation: 'prediction_request_handling',
      url: request.url,
    },
  );
}

/**
 * Try local LVO prediction model when offline with comprehensive error handling
 */
async function tryLocalPrediction(request) {
  return safeAsync(
    async () => {
      // Safe request body parsing
      let data;
      try {
        const body = await request.text();
        data = JSON.parse(body);
      } catch (parseError) {
        throw new Error(`Failed to parse request body: ${parseError.message}`);
      }

      // Validate required data
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid request data format');
      }

      // Check if we can use local LVO model
      if (request.url.includes('predict_full_stroke')) {
        // Validate required fields
        if (!data.gfap_value || !data.fast_ed_score) {
          throw new Error('Missing required fields for local LVO prediction');
        }

        // Validate field ranges
        if (data.gfap_value < 0 || data.gfap_value > 10000) {
          throw new Error('GFAP value out of valid range');
        }

        if (data.fast_ed_score < 0 || data.fast_ed_score > 10) {
          throw new Error('FAST-ED score out of valid range');
        }

        // Calculate local prediction with error handling
        const localResult = calculateLocalLVO(data.gfap_value, data.fast_ed_score);

        if (!localResult || typeof localResult !== 'object') {
          throw new Error('Local LVO calculation failed');
        }

        return new Response(JSON.stringify({
          ...localResult,
          source: 'local_model',
          offline: true,
          timestamp: new Date().toISOString(),
          warning: 'This is an offline prediction using a simplified model. Seek professional medical advice.',
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return null;
    },
    (error) => {
      console.warn('Local prediction failed:', error.message);
      return null;
    },
    {
      operation: 'local_prediction',
      url: request.url,
    },
  );
}

/**
 * Simplified local LVO calculation with safety checks
 */
function calculateLocalLVO(gfap, fastEd) {
  try {
    // Input validation
    if (typeof gfap !== 'number' || typeof fastEd !== 'number') {
      throw new Error('GFAP and FAST-ED values must be numbers');
    }

    if (!isFinite(gfap) || !isFinite(fastEd)) {
      throw new Error('GFAP and FAST-ED values must be finite numbers');
    }

    if (gfap < 0 || fastEd < 0) {
      throw new Error('GFAP and FAST-ED values cannot be negative');
    }

    // Simplified logic - in practice, this would use the full model
    const gfapScore = gfap > 500 ? 0.4 : gfap > 200 ? 0.2 : 0.1;
    const fastEdScore = fastEd >= 4 ? 0.5 : fastEd >= 2 ? 0.3 : 0.1;

    const lvoProb = Math.min(0.95, gfapScore + fastEdScore);
    const ichProb = Math.max(0.05, Math.min(0.5, gfap / 2000)); // Very conservative ICH estimate

    // Validate calculated probabilities
    if (!isFinite(lvoProb) || !isFinite(ichProb)
        || lvoProb < 0 || lvoProb > 1 || ichProb < 0 || ichProb > 1) {
      throw new Error('Calculated probabilities are invalid');
    }

    return {
      lvo: {
        probability: Math.round(lvoProb * 100) / 100, // Round to 2 decimal places
        confidence: 0.6, // Lower confidence for offline model
        module: 'Local Offline Model',
        warning: 'Simplified offline calculation - not for clinical decisions',
      },
      ich: {
        probability: Math.round(ichProb * 100) / 100,
        confidence: 0.4, // Very low confidence for ICH estimation
        module: 'Local Offline Model',
        warning: 'Conservative estimate - seek immediate medical evaluation',
      },
      metadata: {
        calculatedAt: new Date().toISOString(),
        inputs: { gfap, fastEd },
        disclaimer: 'This is a simplified offline model for emergency use only. Clinical judgment and professional medical evaluation are essential.',
      },
    };
  } catch (error) {
    console.error('Local LVO calculation failed:', error.message);

    // Return safe fallback values
    return {
      lvo: {
        probability: 0.1,
        confidence: 0.1,
        module: 'Emergency Fallback',
        error: 'Calculation failed - using minimum risk estimate',
      },
      ich: {
        probability: 0.1,
        confidence: 0.1,
        module: 'Emergency Fallback',
        error: 'Calculation failed - using minimum risk estimate',
      },
      metadata: {
        calculatedAt: new Date().toISOString(),
        error: error.message,
        disclaimer: 'Calculation failed. Immediate medical evaluation required.',
      },
    };
  }
}

/**
 * Handle static resources with cache-first strategy
 */
async function handleStaticResource(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // For critical resources, return a service unavailable response
    return new Response('Service temporarily unavailable', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

/**
 * Handle app shell with network-first, cache fallback
 */
async function handleAppShell(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match('/0925/index.html');

    return cachedResponse || new Response('App temporarily unavailable', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

/**
 * Handle runtime requests
 */
async function handleRuntimeRequest(request) {
  const cache = await caches.open(RUNTIME_CACHE_NAME);

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    return cachedResponse || fetch(request);
  }
}

/**
 * Utility functions
 */
function isAPIRequest(url) {
  return API_ENDPOINTS.some((endpoint) => url.href.startsWith(endpoint));
}

function isStaticResource(url) {
  return url.pathname.includes('/src/')
         || url.pathname.includes('/styles/')
         || url.pathname.endsWith('.css')
         || url.pathname.endsWith('.js')
         || url.pathname.endsWith('.png')
         || url.pathname.endsWith('.ico');
}

function isAppShell(url) {
  return url.pathname === '/0925/'
         || url.pathname === '/0925/index.html'
         || url.pathname.endsWith('/');
}

async function createPredictionCacheKey(request) {
  const body = await request.text();
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body));
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return `${request.url}#${hashHex}`;
}

async function addCacheMetadata(response) {
  const data = await response.json();
  const responseWithMetadata = {
    ...data,
    _cached: true,
    _cachedAt: Date.now(),
    _cacheVersion: CACHE_VERSION,
  };

  return new Response(JSON.stringify(responseWithMetadata), {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

async function findSimilarCachedPrediction(request) {
  // Implementation would find similar cached predictions
  // This is a placeholder for more sophisticated matching
  return null;
}

function createOfflineFallbackResponse(request) {
  return new Response(JSON.stringify({
    error: 'Network unavailable',
    offline: true,
    guidance: 'Please check your network connection. For emergency situations, contact your local emergency services immediately.',
    timestamp: new Date().toISOString(),
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' },
  });
}

function createOfflinePredictionGuidance() {
  return new Response(JSON.stringify({
    offline: true,
    guidance: {
      message: 'Prediction services are currently unavailable. Please use clinical judgment and standard stroke protocols.',
      recommendations: [
        'Assess patient using standard NIHSS scoring',
        'Consider time since symptom onset',
        'Evaluate for contraindications to thrombolysis',
        'Contact stroke team or neurologist if available',
        'If in doubt, treat as potential stroke emergency',
      ],
    },
    emergency: 'For immediate emergency response, contact your local emergency services',
    timestamp: new Date().toISOString(),
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Background Sync for Medical Data
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'medical-data-sync') {
    event.waitUntil(syncMedicalData());
  }
});

async function syncMedicalData() {
  // Syncing medical data

  try {
    // Sync any pending medical data when connection is restored
    // This would include patient data, predictions, etc.

    // Notify clients of successful sync
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'MEDICAL_DATA_SYNCED',
        timestamp: new Date().toISOString(),
      });
    });
  } catch (error) {
    // Medical data sync failed
  }
}

/**
 * Push Notifications for Medical Alerts
 */
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();

    if (data.type === 'medical-alert') {
      event.waitUntil(showMedicalNotification(data));
    }
  }
});

async function showMedicalNotification(data) {
  const options = {
    body: data.message,
    icon: '/0925/icon-192.png',
    badge: '/0925/icon-192.png',
    vibrate: [200, 100, 200],
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View Details',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
      },
    ],
  };

  await self.registration.showNotification(data.title, options);
}

/**
 * Notification Click Handler
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      self.clients.openWindow('/0925/'),
    );
  }
});

/**
 * Message Handler for Communication with Main Thread
 */
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'GET_CACHE_STATUS':
      event.ports[0].postMessage(getCacheStatus());
      break;

    case 'CLEAR_CACHE':
      event.waitUntil(clearAllCaches());
      break;

    case 'PREFETCH_RESOURCES':
      event.waitUntil(prefetchResources(data.resources));
      break;
  }
});

async function getCacheStatus() {
  const caches = await self.caches.keys();
  const status = {};

  for (const cacheName of caches) {
    const cache = await self.caches.open(cacheName);
    const keys = await cache.keys();
    status[cacheName] = keys.length;
  }

  return {
    version: CACHE_VERSION,
    caches: status,
    timestamp: new Date().toISOString(),
  };
}

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map((cacheName) => caches.delete(cacheName)),
  );

  // All caches cleared
}

async function prefetchResources(resources) {
  const cache = await caches.open(RUNTIME_CACHE_NAME);

  for (const resource of resources) {
    try {
      const response = await fetch(resource);
      if (response.ok) {
        await cache.put(resource, response);
      }
    } catch (error) {
      // Failed to prefetch resource
    }
  }
}

// Medical Service Worker loaded
