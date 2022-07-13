import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tokenList: null,
  sourceToken: null,
  destToken: null,
};

const tokensSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    setTokenList: (state, action) => {
      state.tokenList = action.payload;
    },
    setSourceToken: (state, action) => {
      state.sourceToken = action.payload;
    },
    setDestToken: (state, action) => {
      state.destToken = action.payload;
    },
  },
});

export default tokensSlice.reducer;
export const { setTokenList, setSourceToken, setDestToken } = tokensSlice.actions;
