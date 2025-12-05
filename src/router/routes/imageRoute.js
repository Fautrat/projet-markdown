import Image from "../../components/ImageComponent/Image.jsx";
import Upload from "../../components/imageComponent/Upload.jsx";
import Library from "../../components/ImageComponent/Library.jsx";

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