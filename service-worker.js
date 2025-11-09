const CACHE_NAME = 'iceking-comprobante-v1';
const urlsToCache = [
    // Archivo principal de la aplicación
    '/comprobante_hielo.html',
    // Archivo de configuración PWA
    '/manifest.json',
    // Iconos de la aplicación
    '/icon-192x192.png',
    '/icon-512x512.png',
    // Librerías externas esenciales para el funcionamiento
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Evento de Instalación: Cacha los archivos esenciales
self.addEventListener('install', event => {
    // Asegura que el Service Worker no se active hasta que todos los archivos estén en caché
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache and adding files');
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento de Fetch: Intercepta peticiones para servir archivos desde el caché
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si el archivo está en caché, lo devolvemos
                if (response) {
                    return response;
                }
                // Si no está en caché, hacemos la solicitud normal a la red
                return fetch(event.request);
            })
    );
});

// Evento de Activación: Limpia cachés antiguos para asegurar que la app esté actualizada
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
