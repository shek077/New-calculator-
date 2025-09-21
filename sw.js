const CACHE_NAME = 'mintcalc-v2'; // Version bumped to ensure update
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/manifest.json'
  // Icon paths removed as they are now embedded in the manifest
];

// Install the service worker and cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Force the waiting service worker to become the active service worker.
});

// Clean up old caches on activation
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // If this cache name is not in our whitelist, delete it.
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


// Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache - fetch from network
        return fetch(event.request);
      }
    )
  );
});