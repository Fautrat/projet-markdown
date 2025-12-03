import { NavLink } from "react-router-dom";

function NavBar() {
    return (
        <nav>
        <ul>
            <li>
            <NavLink to="/">Home</NavLink>
            </li>
            <li>
            <NavLink to="/image">Image</NavLink>
            </li>
            <li>
            <NavLink to="/markdown">Markdown</NavLink>
            </li>
        </ul>
        </nav>
    );
}
export default NavBar;