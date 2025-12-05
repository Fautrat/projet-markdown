import { RouterProvider } from "react-router-dom";
import router from "./router/route.js";
import { Provider, useDispatch } from "react-redux";
import store from "./store/store.js";
import { useEffect, useState } from "react";
import { openDatabase } from "./database/dbManager.js";
import { getAllImages } from "./services/imageService.js";
import { setImages, setLoading, setError } from "./store/slices/imagesSlice.js.js";

function AppInitializer() {
  const [dbReady, setDbReady] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    async function init() {
      try {
        dispatch(setLoading());
        await openDatabase();
        // maintenant la DB est ouverte : récupère toutes les images
        const imgs = await getAllImages();
        dispatch(setImages(imgs || []));
        setDbReady(true);
      } catch (err) {
        console.error("Failed to open DB or fetch images:", err);
        dispatch(setError(err.toString()));
      }
    }

    init();
  }, [dispatch]);

  if (!dbReady) {
    return <div>Loading database...</div>;
  }

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <Provider store={store}>
      <AppInitializer />
    </Provider>
  );
}
