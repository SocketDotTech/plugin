import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allNetworks: null,
  sourceChainId: 137,
  destChainId: 1,
};

const networksSlice = createSlice({
  name: "networks",
  initialState,
  reducers: {
    setNetworks: (state, action) => {
      state.allNetworks = action.payload;
    },
    setSourceChain: (state, action) => {
      state.sourceChainId = action.payload;
    },
    setDestChain: (state, action) => {
      state.destChainId = action.payload;
    },
  },
});

export default networksSlice.reducer;
export const { setNetworks, setSourceChain, setDestChain } =
  networksSlice.actions;
