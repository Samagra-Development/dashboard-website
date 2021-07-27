importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');

const baseUrl = location.origin;
if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);
} else {
    console.log(`Boo! Workbox didn't load 😬`);
}

workbox.routing.registerRoute(
    new RegExp(`^${baseUrl}/`),
    workbox.strategies.networkFirst()
)

workbox.routing.registerRoute(
    /\.(?:js|css|html)$/,
    workbox.strategies.networkFirst(),
)

// workbox.routing.registerRoute(
//     new RegExp(`^${baseUrl}/school-dashboard/`),
//     workbox.strategies.networkFirst()
// )

// workbox.routing.registerRoute(
//     new RegExp(`^${baseUrl}/block-dashboard/`),
//     workbox.strategies.networkFirst()
// )

workbox.router.registerRoute('https://fonts.googleapis.com/(.*)',
  workbox.strategies.cacheFirst({
    cacheName: 'googleapis',
    cacheExpiration: {
      maxEntries: 30
    },
    cacheableResponse: {statuses: [0, 200]}
  })
);

workbox.router.registerRoute(/\.(?:png|gif|jpg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'images-cache'
  })
);

workbox.routing.registerRoute(
    new RegExp(`^${baseUrl}/data.json`),
    workbox.strategies.cacheFirst()
)