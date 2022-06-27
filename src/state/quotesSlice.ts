import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allQuotes: null
};

const quotesSlice = createSlice({
  name: "quotes",
  initialState,
  reducers: {
    setQuotes: (state, action) => {
        state.allQuotes = action.payload
    }
  },
});

export default quotesSlice.reducer;
export const { setQuotes } = quotesSlice.actions;
