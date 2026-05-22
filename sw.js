/* =========================================
AGI ULTRA PRO v18 ENTERPRISE SW 🚀
FINAL PWA + CACHE FIX
========================================= */

const CACHE_NAME =
"agi-ultra-v18-enterprise-v2";

const STATIC_ASSETS = [

"./",
"./index.html",
"./manifest.json",

"./launchericon-48x48.png",
"./launchericon-72x72.png",
"./launchericon-96x96.png",
"./launchericon-144x144.png",
"./launchericon-192x192.png",
"./launchericon-512x512.png"

];

/* INSTALL */

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

);

self.skipWaiting();

}
);

/* ACTIVATE */

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

/* FETCH */

self.addEventListener(
"fetch",
(event)=>{

if(
event.request.method !== "GET"
){
return;
}

event.respondWith(

fetch(event.request)

.then((response)=>{

const responseClone =
response.clone();

caches.open(CACHE_NAME)
.then((cache)=>{

cache.put(
event.request,
responseClone
);

});

return response;

})

.catch(()=>{

return caches.match(
event.request
)

.then((cached)=>{

return cached ||
caches.match(
"./index.html"
);

});

})

);

}
);

/* MESSAGE */

self.addEventListener(
"message",
(event)=>{

if(
event.data === "CLEAR_CACHE"
){

caches.keys()
.then((keys)=>{

keys.forEach((key)=>{

caches.delete(key);

});

});

}

});
