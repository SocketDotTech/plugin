import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sourceAmount: null,
  destAmount: null,
};

const amountSlice = createSlice({
  name: "amount",
  initialState,
  reducers: {
    setSourceAmount: (state, action) => {
      state.sourceAmount = action.payload;
    },
    setDestAmount: (state, action) => {
      state.destAmount = action.payload;
    },
  },
});

export default amountSlice.reducer;
export const { setSourceAmount, setDestAmount } = amountSlice.actions;
