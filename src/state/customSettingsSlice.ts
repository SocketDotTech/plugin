import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sourceNetworks: null,
  destNetworks: null,
  sourceTokens: null,
  destTokens: null,
};

const customSettingsSlice = createSlice({
  name: "customSettings",
  initialState,
  reducers: {
    setCustomSourceNetworks: (state, action) => {
      state.sourceNetworks = action.payload;
    },
    setCustomDestNetworks: (state, action) => {
      state.destNetworks = action.payload
    }
  },
});

export default customSettingsSlice.reducer;
export const { setCustomSourceNetworks, setCustomDestNetworks } = customSettingsSlice.actions;
