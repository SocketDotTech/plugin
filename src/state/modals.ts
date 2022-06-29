import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isTxModalOpen: false,
};

const modalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    setIsTxModalOpen: (state, action) => {
      state.isTxModalOpen = action.payload;
    },
  },
});

export default modalsSlice.reducer;
export const { setIsTxModalOpen } = modalsSlice.actions;
