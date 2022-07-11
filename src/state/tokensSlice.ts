import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tokens: null,
  allSourceTokens: null,
  allDestTokens: null,
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
    setAllSourceTokens: (state, action) => {
      state.allSourceTokens = action.payload
    },
    setAllDestTokens: (state, action) => {
      state.allDestTokens = action.payload
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
export const { setTokens, setAllSourceTokens, setAllDestTokens, setSourceToken, setDestToken } = tokensSlice.actions;
