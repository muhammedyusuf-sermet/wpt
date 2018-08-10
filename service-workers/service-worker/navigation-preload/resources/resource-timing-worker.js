self.addEventListener('activate', event => {
    event.waitUntil(self.registration.navigationPreload.enable());
  });

self.addEventListener('fetch', event => {
    let headers;
    event.respondWith(
      event.preloadResponse
          .then(response => {
            headers = response.headers;
            // Consume response body to make sure that the performance timeline
            // has the entry for this request.
            return response.text();
          })
          .then(_ =>
            new Response(
              JSON.stringify({
                decodedBodySize: headers.get('X-Decoded-Body-Size'),
                encodedBodySize: headers.get('X-Encoded-Body-Size'),
                timingEntries: performance.getEntriesByName(event.request.url)
              }),
              {headers: {'Content-Type': 'text/html'}})));
  });
