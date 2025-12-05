import { Outlet,NavLink } from 'react-router-dom';
function Image() {

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

