const CACHE_NAME = 'gabarito-v1'; // Increment version if assets change significantly
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/config.js',
  // Add other essential assets here
  // Consider adding icons if needed offline:
  // '/icon-192.png',
  // '/icon-512.png'
];

// Install: Cache essential assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting()) // Activate worker immediately
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of open clients
  );
});

// Fetch: Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // console.log('[ServiceWorker] Fetch:', event.request.url);
  // Basic cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found, otherwise fetch from network
        return response || fetch(event.request).then(fetchResponse => {
            // Optional: Cache dynamically fetched resources if needed
            // Be careful what you cache here.
            // Example: Cache JS/CSS/Image files but not API calls
            /*
            if (fetchResponse.ok && /\.(js|css|png|jpg|jpeg|svg)$/.test(event.request.url)) {
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                });
            }
            */
           return fetchResponse;
        }).catch(error => {
            console.error('[ServiceWorker] Fetch failed:', error);
            // Optional: Return a fallback offline page if fetch fails
            // return caches.match('/offline.html');
        });
      })
  );
});