import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allQuotes: null,
  bestRoute: null,
  sortPref: 'output',
};

const quotesSlice = createSlice({
  name: "quotes",
  initialState,
  reducers: {
    setQuotes: (state, action) => {
        state.allQuotes = action.payload
    },
    setBestRoute: (state, action) => {
      state.bestRoute = action.payload
    },
    setSortPref: (state, action) => {
      state.sortPref = action.payload
    }
  },
});

export default quotesSlice.reducer;
export const { setQuotes, setBestRoute, setSortPref } = quotesSlice.actions;
