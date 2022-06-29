import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allQuotes: null,
  selectedRoute: null,
  sortPref: 'output',
};

const quotesSlice = createSlice({
  name: "quotes",
  initialState,
  reducers: {
    setQuotes: (state, action) => {
        state.allQuotes = action.payload
    },
    setSelectedRoute: (state, action) => {
      state.selectedRoute = action.payload
    },
    setSortPref: (state, action) => {
      state.sortPref = action.payload
    }
  },
});

export default quotesSlice.reducer;
export const { setQuotes, setSelectedRoute, setSortPref } = quotesSlice.actions;
