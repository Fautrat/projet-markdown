import { openDatabase } from "../database/dbManager.js";

export async function addImage(data) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("images", "readwrite");
    const store = tx.objectStore("images");

    console.log("Adding image data:", data);
    const request = store.add(data);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);

  });
}

export async function getAllImages() {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("images", "readonly");
    const store = tx.objectStore("images");

    const request = store.getAll();
    console.log("Getting all images from DB");

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteImage(id) {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("images", "readwrite");
        const store = tx.objectStore("images");
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function updateImage(id, updatedData) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("images", "readwrite");
    const store = tx.objectStore("images");

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
