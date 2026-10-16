
const CACHE_NAME = 'bailaconmigo-v1.1.1';


self.addEventListener('install', (e) => {
    self.skipWaiting();
});

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

// Gestione richieste: Network First per evitare blocchi di versione
self.addEventListener('fetch', (e) => {
    // Non interceptare le chiamate a Supabase o esterne
    if (e.request.url.includes('supabase.co')) return;

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