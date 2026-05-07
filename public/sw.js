// Service Worker for caching static assets
const CACHE_NAME = 'onehourstudy-v1';
const STATIC_CACHE_NAME = 'onehourstudy-static-v1';

// Assets to cache on install (only cacheable URLs)
const STATIC_ASSETS = [
  '/',
  '/styles/fontawesome-custom.css',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS.filter(Boolean));
    }).catch((err) => {
      console.error('[Service Worker] Cache install failed:', err);
    })
  );
  self.skipWaiting(); // Activate immediately
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME;
          })
          .map((cacheName) => {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  return self.clients.claim(); // Take control of all pages
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Cache strategy: Cache First for static assets
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/styles/') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|woff|woff2|ttf|eot)$/i)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[Service Worker] Serving from cache:', request.url);
          return cachedResponse;
        }

        return fetch(request).then((response) => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(STATIC_CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
            console.log('[Service Worker] Cached:', request.url);
          });

          return response;
        }).catch((error) => {
          console.error('[Service Worker] Fetch failed:', error);
          // Return offline fallback if available
          if (request.destination === 'image') {
            return new Response('Offline', { status: 503 });
          }
          throw error;
        });
      })
    );
  } else {
    // Network First for HTML pages
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Return offline page if available
            return caches.match('/').then((offlinePage) => {
              return offlinePage || new Response('Offline', { status: 503 });
            });
          });
        })
    );
  }
});``

// Message event - handle cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

