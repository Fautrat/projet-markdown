import Image from "../../components/imageComponent/Image.jsx";
import Upload from "../../components/imageComponent/Upload.jsx";
import Library from "../../components/imageComponent/Library.jsx";

const route = {
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
};


export default route;