import NavBar from '../baseComponent/NavBar.jsx';
import { Outlet } from 'react-router-dom';


function Layout() {
  return (
    <div>
        <header>
          <NavBar />
        </header>
        <main>
          <Outlet />
        </main>
        <footer>
            <p>© 2024 Novak Application</p>
        </footer>
    </div>
  );
}
export default Layout;