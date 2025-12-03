import { RouterProvider } from "react-router-dom";
import router from "./router/route.js";

export default function App() {

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
