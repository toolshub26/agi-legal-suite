/* =========================================
AGI ULTRA PRO v18 SERVICE WORKER
FINAL PWA FIX 🚀
========================================= */

const CACHE_NAME = "agi-ultra-v18-final";

const urlsToCache = [

"./",
"./index.html",
"./style.css",
"./script.js",
"./manifest.json",

"./launchericon-48x48.png",
"./launchericon-72x72.png",
"./launchericon-96x96.png",
"./launchericon-144x144.png",
"./launchericon-192x192.png",
"./launchericon-512x512.png"

];

/* INSTALL */

self.addEventListener("install",(event)=>{

event.waitUntil(

caches.open(CACHE_NAME)
.then((cache)=>{

return cache.addAll(urlsToCache);

})

);

self.skipWaiting();

});

/* ACTIVATE */

self.addEventListener("activate",(event)=>{

event.waitUntil(

caches.keys().then((keys)=>{

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

});

/* FETCH */

self.addEventListener("fetch",(event)=>{

event.respondWith(

caches.match(event.request)
.then((response)=>{

if(response){

return response;

}

return fetch(event.request)
.then((networkResponse)=>{

return networkResponse;

})
.catch(()=>{

return caches.match("./index.html");

});

})

);

});
