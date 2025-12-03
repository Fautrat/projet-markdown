import { Outlet,NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavBar from '../baseComponent/NavBar.jsx';

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
    <div>
        <div style={{display: 'flex', gap: '20px'}}>
            <NavLink to="/image/library">Library</NavLink>
            <NavLink to="/image/upload">Upload</NavLink>
            </div>
            <div>
            <Outlet />
        </div>
    </div>
  )
}

export default Image




