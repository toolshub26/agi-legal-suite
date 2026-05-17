/* =========================================
   AGI ULTRA PRO v18 AI 🚀
   ULTIMATE ENTERPRISE SERVICE WORKER
========================================= */

/* =========================================
   CACHE VERSION
========================================= */

const CACHE_VERSION = "v18.0.1";

const CACHE_NAME =
`agi-ultra-${CACHE_VERSION}`;

/* =========================================
   STATIC FILES
========================================= */

const STATIC_ASSETS = [

"/",

"index.html",
"premium.html",
"admin.html",
"dashboard.html",
"verify.html",
"offline.html",

"style.css",
"script.js",
"manifest.json",

"icon-72.png",
"icon-96.png",
"icon-128.png",
"icon-144.png",
"icon-152.png",
"icon-192.png",
"icon-384.png",
"icon-512.png",

/* CDN CACHE */

"https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js",

"https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js",

"https://cdn.jsdelivr.net/npm/signature_pad@4.0.0/dist/signature_pad.umd.min.js",

"https://cdn.jsdelivr.net/npm/tesseract.js@2/dist/tesseract.min.js",

"https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"

];

/* =========================================
   INSTALL
========================================= */

self.addEventListener(
"install",
event=>{

console.log(
"🚀 Service Worker Installing..."
);

event.waitUntil(

caches.open(CACHE_NAME)
.then(cache=>{

console.log(
"📦 Caching Static Assets"
);

return cache.addAll(
STATIC_ASSETS
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
event=>{

console.log(
"✅ Service Worker Activated"
);

event.waitUntil(

caches.keys()
.then(keys=>{

return Promise.all(

keys.map(key=>{

if(
key !== CACHE_NAME
){

console.log(
"🗑 Removing Old Cache:",
key
);

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
event=>{

/* =========================================
   IGNORE FIREBASE
========================================= */

if(

event.request.url.includes(
"firebase"
)

){

return;

}

/* =========================================
   IMAGE CACHE STRATEGY
========================================= */

if(
event.request.destination ===
"image"
){

event.respondWith(

caches.match(event.request)
.then(response=>{

return (

response ||

fetch(event.request)
.then(networkResponse=>{

return caches.open(
CACHE_NAME
)
.then(cache=>{

cache.put(
event.request,
networkResponse.clone()
);

return networkResponse;

});

})

);

})

);

return;

}

/* =========================================
   NORMAL CACHE STRATEGY
========================================= */

event.respondWith(

caches.match(
event.request
)
.then(response=>{

if(response){

console.log(
"⚡ Cache Hit:",
event.request.url
);

return response;

}

return fetch(
event.request
)
.then(networkResponse=>{

if(
!networkResponse ||
networkResponse.status !== 200
){

return networkResponse;

}

const responseClone =
networkResponse.clone();

caches.open(CACHE_NAME)
.then(cache=>{

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
event.request.mode ===
"navigate"
){

return caches.match(
"offline.html"
);

}

});

})

);

}
);

/* =========================================
   PUSH NOTIFICATION
========================================= */

self.addEventListener(
"push",
event=>{

let data = {

title:
"AGI ULTRA PRO 🚀",

body:
"New Legal Notification",

icon:
"icon-192.png",

badge:
"icon-96.png"

};

if(event.data){

data =
event.data.json();

}

event.waitUntil(

self.registration.showNotification(

data.title,

{

body:data.body,

icon:data.icon,

badge:data.badge,

vibrate:[
200,
100,
200
],

data:{
url:"index.html"
},

actions:[

{
action:"open",
title:"Open App"
},

{
action:"close",
title:"Dismiss"
}

]

}

)

);

}
);

/* =========================================
   NOTIFICATION CLICK
========================================= */

self.addEventListener(
"notificationclick",
event=>{

event.notification.close();

if(
event.action === "close"
){

return;

}

event.waitUntil(

clients.openWindow(
event.notification.data.url
)

);

}
);

/* =========================================
   BACKGROUND SYNC
========================================= */

self.addEventListener(
"sync",
event=>{

if(
event.tag ===
"sync-affidavits"
){

event.waitUntil(

(async()=>{

console.log(
"🔄 Background Sync Running"
);

})()

);

}

}
);

/* =========================================
   MESSAGE LISTENER
========================================= */

self.addEventListener(
"message",
event=>{

if(
event.data &&
event.data.type ===
"SKIP_WAITING"
){

self.skipWaiting();

}

/* =========================================
   CLEAR CACHE
========================================= */

if(
event.data &&
event.data.type ===
"CLEAR_CACHE"
){

caches.keys()
.then(keys=>{

keys.forEach(key=>{

caches.delete(key);

});

});

}

}
);

/* =========================================
   UPDATE NOTIFY
========================================= */

async function notifyClientsAboutUpdate(){

const clientsList =
await clients.matchAll({
includeUncontrolled:true
});

clientsList.forEach(client=>{

client.postMessage({

type:"NEW_VERSION",
version:CACHE_VERSION

});

});

}

/* =========================================
   PERIODIC CACHE CLEAN
========================================= */

async function clearOldCaches(){

const keys =
await caches.keys();

for(const key of keys){

if(
key !== CACHE_NAME
){

await caches.delete(key);

console.log(
"🧹 Old Cache Removed:",
key
);

}

}

}

/* =========================================
   PERIODIC CLEANUP
========================================= */

setInterval(()=>{

clearOldCaches();

},86400000);

/* =========================================
   ONLINE / OFFLINE EVENTS
========================================= */

self.addEventListener(
"online",
()=>{

console.log(
"🌐 Back Online"
);

}
);

self.addEventListener(
"offline",
()=>{

console.log(
"📴 Offline Mode"
);

}
);

/* =========================================
   CACHE STORAGE INFO
========================================= */

async function cacheSizeEstimate(){

const keys =
await caches.keys();

console.log(
"📦 Total Caches:",
keys.length
);

}

cacheSizeEstimate();

/* =========================================
   READY
========================================= */

console.log(
"✅ AGI ULTRA PRO v18 SERVICE WORKER READY"
);
