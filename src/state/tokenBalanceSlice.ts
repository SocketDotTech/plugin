import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sourceTokenBalance: null,
  destTokenBalance: null,
};

const tokenBalanceSlice = createSlice({
  name: "tokenBalance",
  initialState,
  reducers: {
    setSourceTokenBalance: (state, action) => {
      state.sourceTokenBalance = action.payload;
    },
    setDestTokenBalance: (state, action) => {
      state.destTokenBalance = action.payload;
    },
  },
});

export default tokenBalanceSlice.reducer;
export const { setSourceTokenBalance, setDestTokenBalance } =
  tokenBalanceSlice.actions;
