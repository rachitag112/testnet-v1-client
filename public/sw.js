/* This service worker is designer by SARWANG JAIN (https://github.com/jainsarwang), any misuse of this file or code is not allowed, COnnect with SARWANG for any help in the GITHUB */
importScripts(
	"https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

const CACHE_NAME = "gearfi-v1.0.0",
    main_url = "/",
	preCacheDocs = {
		customBookBundle: main_url + "assets/images/offlineBookBundle.png"
	},


self.addEventListener('install', function(event) {
	event.waitUntil((() => {
		/*pre cache important docs*/
		caches.open(CACHE_NAME).then(function(cache){
			for(i in preCacheDocs) {
				cache.add(new Request(preCacheDocs[i], {cache: 'reload'}));
			}
		})
	})());
});

self.addEventListener('activate', function(event) {
	event.waitUntil((function(){
		caches.keys().then(function(cacheNames){
			return Promise.all(
				cacheNames.map(function(cache) {
					if(cache !== CACHE_NAME){
						return caches.delete(cache)
					}
				})
			);
		})
	})());

	event.waitUntil((() => {clients.claim()})());
})

self.addEventListener('fetch', function(e) {
	e.respondWith(
		caches.open(CACHE_NAME).then(async (cache) => {
			// ====== serve from cache
			var serveFromCache = [
				[	// show these files directly from cache
					main_url+'assets/images/',
					main_url+'assets/js/',
					main_url+'assets/css/',
				],
				isServefromCache = false
			];

			serveFromCache[0].forEach(function(path){
				//checking url (if or not to cache)
				if(e.request.url.match(path) !== null && e.request.method.toLowerCase() != "post" && e.request.method.toLowerCase() != "head" ){
					serveFromCache.isServefromCache = true;
					return;
				}
			});

			var result;

			if(serveFromCache.isServefromCache) {
				// show data from cache
				
				let res = await cache.match(e.request)
				if(typeof res != "undefined"){
					result = res;
				}
			}

			// network fetch
			return result || fetch(e.request).then(function(res){
				if(res.status != 200 || e.request.method.toLowerCase() == 'post'){
					return res;
				}

				/*storing to cache*/
				cache.put(e.request,res.clone());
				return res;


			}).catch(async function(err){
				if(e.request.method.toLowerCase() == 'post'){
					return;
				}

				//network error so we serve from cache
				return cache.match(e.request).then(function(res){
					return res;
				});
			});

		}).catch((err) => {
			console.log('Cache Error: ',err);
		})
	);
});
