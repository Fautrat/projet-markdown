import { configureStore } from "@reduxjs/toolkit";
import imagesReducer from "./slices/imagesSlice.js.js";
import blocksReducer from "./slices/blockSlice.js";


const store = configureStore({
  reducer: {
    images: imagesReducer,
    blocks: blocksReducer,
  },
});

export default store;
