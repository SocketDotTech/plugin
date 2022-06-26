import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allNetworks: null,
};

const networksSlice = createSlice({
  name: "networks",
  initialState,
  reducers: {
    setNetworks: (state, action) => {
      state.allNetworks = action.payload;
    },
  },
});

export default networksSlice.reducer;
export const { setNetworks } = networksSlice.actions;
