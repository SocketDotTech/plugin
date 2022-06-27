import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tokens: null,
  sourceToken: null,
  destToken: null,
};

const tokensSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    setTokens: (state, action) => {
      state.tokens = action.payload;
    },
    setSourceToken: (state, action) => {
        state.sourceToken = action.payload
    },
    setDestToken: (state, action) => {
        state.destToken = action.payload
    }
  },
});

export default tokensSlice.reducer;
export const { setTokens, setSourceToken, setDestToken } = tokensSlice.actions;
