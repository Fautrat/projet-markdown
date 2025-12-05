import { createSlice } from "@reduxjs/toolkit";

const blocksSlice = createSlice({
  name: "blocks",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    setBlocks(state, action) {
      state.items = action.payload;
      state.status = "succeeded";
    },
    addBlockLocal(state, action) {
      state.items.push(action.payload);
    },
    updateBlockLocal(state, action) {
      const updated = action.payload;
      const idx = state.items.findIndex((i) => i.id === updated.id);
      if (idx !== -1) state.items[idx] = updated;
    },
    removeBlockLocal(state, action) {
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
  setBlocks,
  addBlockLocal,
  updateBlockLocal,
  removeBlockLocal,
  setLoading,
  setError,
} = blocksSlice.actions;

export default blocksSlice.reducer;
