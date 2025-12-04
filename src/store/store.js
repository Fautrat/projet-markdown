import { configureStore } from "@reduxjs/toolkit";
import imagesReducer from "./slices/ImagesSlice.js";

const store = configureStore({
  reducer: {
    images: imagesReducer,
  },
});

export default store;
