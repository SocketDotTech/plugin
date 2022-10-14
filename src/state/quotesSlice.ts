import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allQuotes: null,
  bestRoute: null,
  sortPref: "output",
  refuelEnabled: false,
  swapSlippage: Number(
    typeof window !== "undefined"
      ? localStorage.getItem("swapSlippage") ?? 1
      : 1
  ),
  singleTxOnly:
    typeof window !== undefined
      ? localStorage.getItem("singleTxOnly") === "true" ?? false
      : false,
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
    setSwapSlippage: (state, action) => {
      state.swapSlippage = action.payload;
    },
    setSingleTxOnly: (state, action) => {
      state.singleTxOnly = action.payload;
    },
  },
});

export default quotesSlice.reducer;
export const {
  setQuotes,
  setBestRoute,
  setSortPref,
  enableRefuel,
  setSwapSlippage,
  setSingleTxOnly,
} = quotesSlice.actions;
