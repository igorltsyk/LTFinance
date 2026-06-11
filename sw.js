const CACHE_NAME = 'ltfinance-v16';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.png',
  '/css/variables.css',
  '/css/global.css',
  '/css/utilities.css',
  '/css/components.css',
  '/js/app.js',
  '/js/router.js',
  '/js/store.js',
  '/js/supabase.js',
  '/js/utils/formatters.js',
  '/js/views/login.js',
  '/js/views/dashboard.js',
  '/js/views/historico.js',
  '/js/views/investimentos.js',
  '/js/views/perfil.js',
  '/js/views/add.js',
  '/js/views/cartoes.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch(err => console.log('Erro no cache:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    // Estratégia Network First (tenta pegar da rede, se falhar cai pro cache)
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
