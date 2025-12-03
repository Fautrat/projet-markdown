import Footer from '../baseComponent/footer.jsx';
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
           <Footer />
        </footer>
    </div>
  );
}
export default Layout;