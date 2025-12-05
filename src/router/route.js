import { createBrowserRouter } from "react-router-dom";
import Home from '../components/baseComponent/home.jsx';
import NotFound from '../components/baseComponent/notFound.jsx';
import Layout from '../components/Layout/Layout.jsx';
import MarkdownPage from "../components/markdown/MarkdownPage.jsx";
import CustomBlock from "../components/blockComponent/CustomBlock.jsx";
import imageRoute from "./routes/imageRoute.js";
import BlockLibrary from "../components/blockComponent/BlockLibrary.jsx";
import Block from "../components/blockComponent/Block.jsx";

const routes = [
  {
    path: "/",
    Component: Layout,
    children: [
  {
    index: true,
    Component: Home,
  },
  {
    path: "home",
    Component: Home,
  },
  {
    path: "markdown",
    Component: MarkdownPage,
  },
  {
    path: "block",
    Component: Block,
    children: [
      {
        index: true,
        Component: BlockLibrary,
      },
      {
        path: "create",
        Component: CustomBlock,
      },
      {
        path: "library",
        Component: BlockLibrary,
      },
    ],
  },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
  imageRoute,

];

const router = createBrowserRouter(routes);

export default router;