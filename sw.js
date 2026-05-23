/* =========================================
AGI ULTRA PRO v18 ENTERPRISE SW 🚀
FINAL STABLE PWA + OFFLINE SYSTEM
========================================= */

const CACHE_NAME =
"agi-ultra-v18-enterprise-v3";

/* =========================================
FILES TO CACHE
========================================= */

const STATIC_ASSETS = [

"./",
"./index.html",
"./premium.html",
"./dashboard.html",
"./verify.html",
"./login.html",
"./signup.html",

"./manifest.json",
"./firebase.js",
"./style.css",

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

.catch((error)=>{

console.log(
"Cache Install Error:",
error
);

})

);

self.skipWaiting();

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

);

self.clients.claim();

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

if(cachedResponse){

return cachedResponse;

}

return fetch(event.request)

.then((networkResponse)=>{

/* INVALID RESPONSE */

if(
!networkResponse ||
networkResponse.status !== 200 ||
networkResponse.type !== "basic"
){

return networkResponse;

}

/* SAVE CACHE */

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

/* FALLBACK */

if(
event.request.headers.get("accept")
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

});

}

});

/* =========================================
END
========================================= */

console.log(
"AGI ULTRA PWA READY 🚀"
);
