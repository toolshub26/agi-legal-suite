/* =========================================
AGI ULTRA PRO v18 SERVICE WORKER
========================================= */

const CACHE_NAME = "agi-ultra-v18";

const urlsToCache = [

"/agi-legal-suite/",
"/agi-legal-suite/index.html",
"/agi-legal-suite/style.css",
"/agi-legal-suite/script.js",
"/agi-legal-suite/manifest.json"

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

return response || fetch(event.request);

})

);

});
