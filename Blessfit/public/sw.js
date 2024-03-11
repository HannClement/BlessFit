importScripts('/src/js/idb.js');
importScripts('/src/js/utility.js');

var CACHE_STATIC_NAME = 'static-v18';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';
var STATIC_FILES = [
  // HTML
  '/',
  '/index.html',
  '/offline.html',
  // JS
  '/src/js/app.js',
  '/src/js/feed.js',  
  '/src/js/idb.js',
  '/src/js/promise.js',
  '/src/js/fetch.js',
  '/src/js/utility.js',
  '/manifest.json',
  // Images
  '/src/images/sponsor_paypal.png',
  '/src/images/sponsor_windows.png',
  '/src/images/sponsor_solana.png',
  '/src/images/sponsor_calvinklein.png',
  '/src/images/poster_gym.png',
  '/src/images/offline_panda.png',
  '/src/images/logo_gym.png',
  '/src/images/logo_attribute.png',
  // CSS
  '/src/css/indexDesign.css',
  '/src/css/offlineDesign.css',
  '/src/css/detailDesign.css',
  // Icons
  '/src/images/icons/arrow-right-circle.svg',
  '/src/images/icons/dot.svg',
  '/src/images/icons/icon-72x72.png',
  '/src/images/icons/icon-96x96.png',
  '/src/images/icons/icon-128x128.png',
  '/src/images/icons/icon-144x144.png',
  '/src/images/icons/icon-152x152.png',
  '/src/images/icons/icon-192x192.png',
  '/src/images/icons/icon-384x384.png',
  '/src/images/icons/icon-512x512.png',
  // Bootstrap
  '/src/bootstrap-5.2.3-dist/css/bootstrap.css',
  '/src/bootstrap-5.2.3-dist/js/bootstrap.js',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

self.addEventListener('install', function (event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function (cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll(STATIC_FILES);
      })
  )
});

self.addEventListener('activate', function (event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

function isInArray(string, array) {
  var cachePath;
  if (string.indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.e. NOT a CDN)
    console.log('matched ', string);
    cachePath = string.substring(self.origin.length); // take the part of the URL AFTER the domain (e.g. after localhost:8080)
  } else {
    cachePath = string; // store the full request (for CDNs)
  }
  return array.indexOf(cachePath) > -1;
}

self.addEventListener('fetch', function (event) {

  var url = 'https://ambwtes1clement-default-rtdb.firebaseio.com/trainings';
  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(fetch(event.request)
      .then(function (res) {
        var clonedRes = res.clone();
        clearAllData('trainings')
          .then(function () {
            return clonedRes.json();
          })
          .then(function (data) {
            for (var key in data) {
              writeData('trainings', data[key])
            }
          });
        return res;
      })
    );
  } else if (isInArray(event.request.url, STATIC_FILES)) {
    event.respondWith(
      caches.match(event.request)
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(function (response) {
          if (response) {
            return response;
          } else {
            return fetch(event.request)
              .then(function (res) {
                return caches.open(CACHE_DYNAMIC_NAME)
                  .then(function (cache) {
                    // trimCache(CACHE_DYNAMIC_NAME, 3);
                    cache.put(event.request.url, res.clone());
                    return res;
                  })
              })
              .catch(function (err) {
                return caches.open(CACHE_STATIC_NAME)
                  .then(function (cache) {
                    if (event.request.headers.get('accept').includes('text/html')) {
                      return cache.match('/offline.html');
                    }
                  });
              });
          }
        })
    );
  }
});