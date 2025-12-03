import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav style={{ backgroundColor: "#0d6efd" }} className="navbar navbar-dark">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">MonApp</NavLink>
        <ul className="navbar-nav d-flex flex-row ms-auto">
          <li className="nav-item me-3">
            <NavLink to="/markdown" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>Markdown</NavLink>
          </li>
          <li className="nav-item me-3">
            <NavLink to="/image" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>Image</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>Home</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
