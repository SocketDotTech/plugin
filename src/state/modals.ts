import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isTxModalOpen: false,
  activeRoute: null,
  execute: null,
};

const modalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    setIsTxModalOpen: (state, action) => {
      state.isTxModalOpen = action.payload;
    },
    setActiveRoute: (state, action) => {
      state.activeRoute = action.payload
    },
    setExecute: (state, action) => {
      state.execute = action.payload
    }
  },
});

export default modalsSlice.reducer;
export const { setIsTxModalOpen, setActiveRoute, setExecute} = modalsSlice.actions;
