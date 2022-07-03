import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sourceAmount: null,
  destAmount: null,
  isEnoughBalance: true,
};

const amountSlice = createSlice({
  name: "amount",
  initialState,
  reducers: {
    setSourceAmount: (state, action) => {
      state.sourceAmount = action.payload;
    },
    setIsEnoughBalance: (state, action) => {
      state.isEnoughBalance = action.payload;
    },
    setDestAmount: (state, action) => {
      state.destAmount = action.payload;
    },
  },
});

export default amountSlice.reducer;
export const { setSourceAmount, setDestAmount, setIsEnoughBalance } = amountSlice.actions;
