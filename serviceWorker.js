async function addResourcesToCache(resources) {
  const cache = await caches.open("v1")
  await cache.addAll(resources)
}

async function putInCache(request, response) {
  const cache = await caches.open("v1");
  await cache.put(request, response);
}

async function respondWithCachedContent(event) {
  const matches = await caches.match(event.request)

  if (matches) return matches

  const responseFromNetwork = await fetch(event.request);
  putInCache(event.request, responseFromNetwork.clone());
  return responseFromNetwork;
}

self.addEventListener("install", event => {
  event.waitUntil(
    addResourcesToCache([
      "/index.html",
      "/js/script.js",
      "/js/returnArrayOfPanelValues.js",
      "/style.css",
      "/images/bg-stars.svg",
      "/images/download.svg",
      "/images/pattern-hills.svg",
    ])
  )
})

self.addEventListener("fetch", event => {
  event.respondWith(respondWithCachedContent(event))
})