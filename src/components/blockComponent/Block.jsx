 import { Outlet,NavLink } from 'react-router-dom';
function Block() {

    return (
        <div className="container py-4">
            <div className="d-flex gap-3 mb-4">
                <NavLink to="/block/library" className={({ isActive }) => "btn btn-outline-primary" + (isActive ? " active" : "")}>📚 Library</NavLink>
                <NavLink to="/block/create" className={({ isActive }) => "btn btn-outline-success" + (isActive ? " active" : "")}>⬆️ Creation</NavLink>
            </div>
            <div className="card shadow-sm p-3">
                <Outlet />
            </div>
        </div>
    );
}

export default Block

 