var CACHE_NAME = 'Mycache';
var urlsToCache = [
    './',
    './index.html',
    './restaurant.html',
    '/data/',
    '/css/' ];

self.addEventListener('install', function(event) {
    // install stage
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener("activate", e => {
    console.log("service worker is active");
    e.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames
          .filter(function(cacheName) {
             if (cacheName != CACHE_NAME) return true;
           })
            .map(function(cacheName) {
              return caches.delete(cacheName);
            })
        );
      })
    );
  });

//in the fetch event, block some network request
self.addEventListener('fetch', e => {
    console.log('service worker: Fetching');
    e.respondWith(
      fetch(e.request)
      .then(res => {
      const resClone = res.clone();
      caches
      .open(CACHE_NAME)
      .then(cache => {
        cache.put(e.request, resClone)
      })
      return res;
    }).catch(err => caches.match(e.request).then(res => res))
    
    )
  })