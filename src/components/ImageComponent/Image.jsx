import { Outlet,NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Image() {

    const [db, setDb] = useState(null);

    useEffect(() => {
        const request = indexedDB.open("IndexedDB", 1);

        request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("images")) {
            db.createObjectStore("images", { keyPath: "id" });
        }
        };

        request.onsuccess = () => {
        console.log("DB WORKING");
        setDb(request.result);
        };

        request.onerror = () => {
        console.error("DB FAILED", request.error);
        };

    }, []);

    if (!db) return <p>Loading</p>;

    return (
        <div className="container py-4">
            <div className="d-flex gap-3 mb-4">
                <NavLink to="/image/library" className={({ isActive }) => "btn btn-outline-primary" + (isActive ? " active" : "")}>📚 Library</NavLink>
                <NavLink to="/image/upload" className={({ isActive }) => "btn btn-outline-success" + (isActive ? " active" : "")}>⬆️ Upload</NavLink>
            </div>
            <div className="card shadow-sm p-3">
                <Outlet />
            </div>
        </div>
    );
}

export default Image




