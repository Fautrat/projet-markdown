import { configureStore } from "@reduxjs/toolkit";
import imagesReducer from "./slices/imagesSlice.js";

const store = configureStore({
  reducer: {
    images: imagesReducer,
  },
});

export default store;
