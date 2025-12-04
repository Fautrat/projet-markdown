import { createSlice } from "@reduxjs/toolkit";

const imagesSlice = createSlice({
  name: "images",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    setImages(state, action) {
      state.items = action.payload;
      state.status = "succeeded";
    },
    addImageLocal(state, action) {
      state.items.push(action.payload);
    },
    updateImageLocal(state, action) {
      const updated = action.payload;
      const idx = state.items.findIndex((i) => i.id === updated.id);
      if (idx !== -1) state.items[idx] = updated;
    },
    removeImageLocal(state, action) {
      const id = action.payload;
      state.items = state.items.filter((i) => i.id !== id);
    },
    setLoading(state) {
      state.status = "loading";
    },
    setError(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const {
  setImages,
  addImageLocal,
  updateImageLocal,
  removeImageLocal,
  setLoading,
  setError,
} = imagesSlice.actions;

export default imagesSlice.reducer;
