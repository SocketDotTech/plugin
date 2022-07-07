import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isTxModalOpen: false,
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
    setActiveRoute: (state, action) => {
      state.activeRoute = action.payload
    },
    setExecute: (state, action) => {
      state.execute = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  },
});

export default modalsSlice.reducer;
export const { setIsTxModalOpen, setActiveRoute, setExecute, setError} = modalsSlice.actions;
