// db.js - IndexedDB for media storage (photos, signatures)
let db = null;

export async function openDB() {
  if (db) return db;
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("AGI_Ultra_Pro", 2);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("media")) {
        db.createObjectStore("media", { keyPath: "id" });
      }
    };
    request.onsuccess = () => { db = request.result; resolve(db); };
    request.onerror = () => reject(request.error);
  });
}

export async function saveMedia(id, type, data) {
  const database = await openDB();
  const tx = database.transaction("media", "readwrite");
  tx.objectStore("media").put({ id, type, data, timestamp: Date.now() });
}

export async function loadMedia(id) {
  const database = await openDB();
  const tx = database.transaction("media", "readonly");
  return new Promise((resolve) => {
    const req = tx.objectStore("media").get(id);
    req.onsuccess = () => resolve(req.result ? req.result.data : null);
    req.onerror = () => resolve(null);
  });
}

export async function deleteMedia(id) {
  const database = await openDB();
  const tx = database.transaction("media", "readwrite");
  tx.objectStore("media").delete(id);
}
