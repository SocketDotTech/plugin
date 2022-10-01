import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isTxModalOpen: false,
  isSettingsModalOpen: false,
  activeRoute: null,
  execute: null,
  error: null,
};

const modalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    setIsTxModalOpen: (state, action) => {
      state.isTxModalOpen = action.payload;
    },
    setIsSettingsModalOpen: (state, action) => {
      state.isSettingsModalOpen = action.payload;
    },
    setActiveRoute: (state, action) => {
      state.activeRoute = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export default modalsSlice.reducer;
export const {
  setIsTxModalOpen,
  setIsSettingsModalOpen,
  setActiveRoute,
  setError,
} = modalsSlice.actions;
