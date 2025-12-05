import { openDatabase } from "../database/dbManager.js";

export async function addBlock(data) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("blocks", "readwrite");
    const store = tx.objectStore("blocks");

    console.log("Adding block data:", data);
    const request = store.add(data);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);

  });
}

export async function getAllBlocks() {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("blocks", "readonly");
    const store = tx.objectStore("blocks");

    const request = store.getAll();
    console.log("Getting all blocks from DB");

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteBlock(id) {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("blocks", "readwrite");
        const store = tx.objectStore("blocks");
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function updateBlock(id, updatedData) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("blocks", "readwrite");
    const store = tx.objectStore("blocks");

    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const record = getRequest.result;
      if (!record) {
        reject(new Error("Record not found"));
        return;
      }

      const updatedRecord = { ...record, ...updatedData };
      const putRequest = store.put(updatedRecord);

      putRequest.onsuccess = () => resolve(updatedRecord);
      putRequest.onerror = () => reject(putRequest.error);
    };

    getRequest.onerror = () => reject(getRequest.error);
  });
}
