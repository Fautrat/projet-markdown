let dbInstance = null;

export function openDatabase() {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open("MarkdownDB", 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (db.objectStoreNames.contains("images")) {
        db.deleteObjectStore("images");
      }

      db.createObjectStore("images", {
        keyPath: "id",
        autoIncrement: true,
      });

      db.createObjectStore("blocks", {
        keyPath: "id",
        autoIncrement: true,
      });

      db.createObjectStore("files", {
        keyPath: "id",
        autoIncrement: true,
      });
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
      console.log("Database opened successfully");
    };

    request.onerror = () => reject(request.error);
  });
}

export function getDB() {
    console.log("Getting DB instance",dbInstance);
  return dbInstance;
}
