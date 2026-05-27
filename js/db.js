// js/db.js - Complete IndexedDB wrapper for AGI Legal Pro
// Stores: affidavits, drafts, media (photos/signatures)

let db = null;

export async function initDB() {
  if (db) return db;
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("AGI_Legal_Pro", 5);
    
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      // Store for affidavit history
      if (!db.objectStoreNames.contains("affidavits")) {
        db.createObjectStore("affidavits", { keyPath: "id" });
      }
      // Store for auto-save drafts
      if (!db.objectStoreNames.contains("drafts")) {
        db.createObjectStore("drafts", { keyPath: "id" });
      }
      // Store for photos and signatures
      if (!db.objectStoreNames.contains("media")) {
        db.createObjectStore("media", { keyPath: "id" });
      }
    };
    
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    request.onerror = () => reject(request.error);
  });
}

// ========== AFFIDAVITS (history) ==========
export async function saveAffidavit(affidavit) {
  const database = await initDB();
  const tx = database.transaction("affidavits", "readwrite");
  tx.objectStore("affidavits").put(affidavit);
  return tx.complete;
}

export async function getAllAffidavits() {
  const database = await initDB();
  const tx = database.transaction("affidavits", "readonly");
  const store = tx.objectStore("affidavits");
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

// ========== DRAFTS (auto-save) ==========
export async function saveDraft(id, data) {
  const database = await initDB();
  const tx = database.transaction("drafts", "readwrite");
  tx.objectStore("drafts").put({ id, data, timestamp: Date.now() });
  return tx.complete;
}

export async function loadDraft(id) {
  const database = await initDB();
  const tx = database.transaction("drafts", "readonly");
  const store = tx.objectStore("drafts");
  return new Promise((resolve, reject) => {
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result ? req.result.data : null);
    req.onerror = () => reject(req.error);
  });
}

// ========== MEDIA (photos, signatures) ==========
export async function saveMedia(id, type, dataURL) {
  const database = await initDB();
  const tx = database.transaction("media", "readwrite");
  tx.objectStore("media").put({ id, type, dataURL, timestamp: Date.now() });
  return tx.complete;
}

export async function loadMedia(id) {
  const database = await initDB();
  const tx = database.transaction("media", "readonly");
  const store = tx.objectStore("media");
  return new Promise((resolve, reject) => {
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result ? req.result.dataURL : null);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteMedia(id) {
  const database = await initDB();
  const tx = database.transaction("media", "readwrite");
  tx.objectStore("media").delete(id);
  return tx.complete;
}
