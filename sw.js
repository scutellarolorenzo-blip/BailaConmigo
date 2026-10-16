const CACHE_NAME = 'bailaconmigo-v1.0.4'; // <--- MODIFICA QUESTO NUMERO QUANDO AGGIORNI L'APP

const ASSETS_TO_CACHE = [
    './',
    './index.html'
];

// Installazione del Service Worker
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Attivazione e pulizia delle vecchie cache
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Gestione delle richieste (Network first, fallback alla cache)
self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request)
            .then((response) => {
                return response;
            })
            .catch(() => {
                return caches.match(e.request);
            })
    );
});