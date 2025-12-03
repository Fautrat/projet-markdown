import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import './App.css'
import Image from './components/ImageComponent/Image.jsx'
import Home from './components/baseComponent/home.jsx'

function App() {

  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/image">Novak Image</Link>
          </li>
          <li>
            <Link to="/home">Novak Home</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/image" element={<Image />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
