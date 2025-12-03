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


  function HandleDelete(id) {
    if (!db) return;
    const tx = db.transaction("images", "readwrite");
    const store = tx.objectStore("images");
    store.delete(id);
    tx.oncomplete = () => {
      setImages(images.filter(img => img.id !== id));
    };
  }

  function HandleEdit(id) {
    const newName = prompt("Enter new image name:");
    if (!newName || !db) return;

    const tx = db.transaction("images", "readwrite");
    const store = tx.objectStore("images");
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
        const img = getRequest.result;
        img.name = newName;
        store.put(img);
    };
    tx.oncomplete = () => {
        setImages(images.map(img => img.id === id ? { ...img, name: newName } : img));
    }
  }

  return (
    <div className="image-library container py-4">
        <h1 className="mb-4">Image Library</h1>
        <div className="row">
            {images.map(img => (
            <div key={img.id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                <img src={img.data} alt={`Image ${img.id}`} className="card-img-top" />
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{img.name}</h5>
                    <div className="mt-auto d-flex justify-content-between">
                    <button className="btn btn-sm btn-warning" onClick={() => HandleEdit(img.id)}>
                        ✏️ Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => HandleDelete(img.id)}>
                        🗑️ Delete
                    </button>
                    </div>
                </div>
                </div>
            </div>
            ))}
        </div>
    </div>
  );
}

export default Library;
