import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isTxModalOpen: false,
  isSettingsModalOpen: false,
  activeRoute: null, // @salil-naik, ideally this should be together with selectedRoute state
  execute: null,
  error: null,
  isOpRewardModalOpen: false,
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
    setIsOpRewardModalOpen: (state, action) => {
      state.isOpRewardModalOpen = action.payload;
    },
  },
});

export default modalsSlice.reducer;
export const {
  setIsTxModalOpen,
  setIsSettingsModalOpen,
  setActiveRoute,
  setError,
  setIsOpRewardModalOpen
} = modalsSlice.actions;
