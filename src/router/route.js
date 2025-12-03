import { createBrowserRouter } from "react-router-dom";
import Image from '../components/ImageComponent/Image.jsx';
import Home from '../components/baseComponent/home.jsx';
import NotFound from '../components/baseComponent/notFound.jsx';
import Upload from '../components/ImageComponent/Upload.jsx';
import Library from '../components/ImageComponent/Library.jsx';
import Layout from '../components/Layout/Layout.jsx';

const routes = [
  {
    path: "/",
    Component: Layout,
    children: [
  {
    path: "home",
    Component: Home,
  },
  {
    path: "image",
    Component: Image,
    children: [
      {
        index: true,
        Component: Library,
      },
      {
        path: "upload",
        Component: Upload,
      },
      {
        path: "library",
        Component: Library,
      },
    ],
  },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  }
];

const router = createBrowserRouter(routes);

export default router;