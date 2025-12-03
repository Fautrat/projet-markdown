import { useEffect, useState } from 'react';

function Library() {
  const [db, setDb] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const request = indexedDB.open("IndexedDB", 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (db.objectStoreNames.contains("images")) {
        db.deleteObjectStore("images");
      }
      db.createObjectStore("images", {
        keyPath: "id",
        autoIncrement: true
      });
    };

    request.onsuccess = () => { setDb(request.result); };
    request.onerror = () => { console.error("Db error", request.error); };
  }, []);

  useEffect(() => {
    if (!db) return;

    const transaction = db.transaction("images", "readonly");
    const store = transaction.objectStore("images");
    const request = store.getAll();

    request.onsuccess = () => {
      setImages(request.result);
    };
    request.onerror = () => {
      console.error("Error fetching images", request.error);
    };
  }, [db]);

  return (
    <div className="image-library">
      <h1>Image Library</h1>
      <div className="images">
        {images.map(img => (
          <div key={img.id}>
            <h3>{img.name}</h3>
            <img src={img.data} alt={`Image ${img.id}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Library;
