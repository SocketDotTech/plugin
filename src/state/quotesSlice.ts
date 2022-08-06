import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allQuotes: null,
  bestRoute: null,
  sortPref: "output",
  refuelEnabled: false,
};

const quotesSlice = createSlice({
  name: "quotes",
  initialState,
  reducers: {
    setQuotes: (state, action) => {
      state.allQuotes = action.payload;
    },
    setBestRoute: (state, action) => {
      state.bestRoute = action.payload;
    },
    setSortPref: (state, action) => {
      state.sortPref = action.payload;
    },
    enableRefuel: (state, action) => {
      state.refuelEnabled = action.payload;
    },
  },
});

export default quotesSlice.reducer;
export const { setQuotes, setBestRoute, setSortPref, enableRefuel } =
  quotesSlice.actions;
