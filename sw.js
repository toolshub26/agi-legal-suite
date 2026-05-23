/* =========================================
AGI ULTRA PRO v18 ENTERPRISE SW 🚀
ULTIMATE FINAL STABLE PWA SYSTEM
FREE + PREMIUM CACHE FIXED
========================================= */

const CACHE_NAME =
"agi-ultra-v18-final-v10";

/* =========================================
STATIC FILES
========================================= */

const STATIC_ASSETS = [

"./",
"./index.html",
"./premium.html",
"./verify.html",
"./login.html",
"./signup.html",

"./manifest.json",

"./launchericon-48x48.png",
"./launchericon-72x72.png",
"./launchericon-96x96.png",
"./launchericon-144x144.png",
"./launchericon-192x192.png",
"./launchericon-512x512.png"

];

/* =========================================
INSTALL
========================================= */

self.addEventListener(
"install",
(event)=>{

event.waitUntil(

caches.open(CACHE_NAME)

.then((cache)=>{

return cache.addAll(
STATIC_ASSETS
);

})

.then(()=>{

return self.skipWaiting();

})

.catch((error)=>{

console.log(
"SW INSTALL ERROR:",
error
);

})

);

}
);

/* =========================================
ACTIVATE
========================================= */

self.addEventListener(
"activate",
(event)=>{

event.waitUntil(

caches.keys()

.then((keys)=>{

return Promise.all(

keys.map((key)=>{

if(key !== CACHE_NAME){

return caches.delete(key);

}

})

);

})

.then(()=>{

return self.clients.claim();

})

);

}
);

/* =========================================
FETCH
========================================= */

self.addEventListener(
"fetch",
(event)=>{

/* ONLY GET */

if(
event.request.method !== "GET"
){
return;
}

/* IGNORE CHROME EXTENSIONS */

if(
event.request.url.startsWith(
"chrome-extension://"
)
){
return;
}

event.respondWith(

caches.match(event.request)

.then((cachedResponse)=>{

/* =========================================
RETURN CACHE + UPDATE CACHE
========================================= */

if(cachedResponse){

fetch(event.request)

.then((freshResponse)=>{

if(
freshResponse &&
freshResponse.status === 200
){

caches.open(CACHE_NAME)

.then((cache)=>{

cache.put(
event.request,
freshResponse.clone()
);

});

}

})

.catch(()=>{});

return cachedResponse;

}

/* =========================================
NETWORK FETCH
========================================= */

return fetch(event.request)

.then((networkResponse)=>{

if(
!networkResponse ||
networkResponse.status !== 200 ||
networkResponse.type !== "basic"
){

return networkResponse;

}

const responseClone =
networkResponse.clone();

caches.open(CACHE_NAME)

.then((cache)=>{

cache.put(
event.request,
responseClone
);

});

return networkResponse;

})

.catch(()=>{

/* =========================================
OFFLINE FALLBACK
========================================= */

if(
event.request.headers
.get("accept")
.includes("text/html")
){

return caches.match(
"./index.html"
);

}

});

})

);

}
);

/* =========================================
CLEAR CACHE MESSAGE
========================================= */

self.addEventListener(
"message",
(event)=>{

if(
event.data === "CLEAR_CACHE"
){

caches.keys()

.then((keys)=>{

return Promise.all(

keys.map((key)=>{

return caches.delete(key);

})

);

})

.then(()=>{

console.log(
"ALL CACHE CLEARED 🚀"
);

});

}

});

/* =========================================
READY
========================================= */

console.log(
"AGI ULTRA FINAL PWA READY 🚀"
);
