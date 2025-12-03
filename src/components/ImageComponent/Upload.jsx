import { useState, useEffect } from "react";

function Upload() {

    const [db, setDb] = useState(null);
    const [image, setImage] = useState(null);

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
    request.onerror = () => {console.error("Db error", request.error);};

    }, []);

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImage({
                name: file.name,
                data: reader.result,
            });
        };
        reader.readAsDataURL(file);
    }

    function saveImage() {
        if (!db || !image) return;

        const tx = db.transaction("images", "readwrite");
        const store = tx.objectStore("images");

        store.add({
            id: Date.now(),
            name: image.name,
            data: image.data
        });

        tx.oncomplete = () => {alert("Image saved!");};
        tx.onerror = () => {console.error("Save error", tx.error);};

    }

    return (
        <div className="image-upload">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {image && <img src={image.data} alt={image.name} width="200" />}
        <button onClick={saveImage}>Save image</button>
        </div>
    );
}

export default Upload;
