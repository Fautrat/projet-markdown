import { RouterProvider } from "react-router-dom";
import router from "./router/route.js";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { useEffect, useState } from "react";
import { openDatabase } from "./database/dbManager.js";

function AppInitializer() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    openDatabase()
      .then(() => setDbReady(true))
      .catch((err) => {
        console.error("Failed to open DB:", err);
      });
  }, []);

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
