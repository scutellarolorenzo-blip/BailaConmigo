const CACHE_NAME = 'bailaconmigo-v1.3.7';

// Installazione immediata della nuova versione
self.addEventListener('install', (e) => {
    self.skipWaiting();
});

// Attivazione e pulizia immediata delle vecchie cache
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

// Gestione delle richieste di rete
self.addEventListener('fetch', (e) => {
    // Non intercettare mai le chiamate esterne o a Supabase (Database e Storage)
    if (e.request.url.includes('supabase.co') || !e.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Gestisci solo richieste GET per evitare errori con upload o invio dati
    if (e.request.method !== 'GET') {
        return;
    }

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