import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sourceNetworks: null,
  destNetworks: null,
  defaultSourceNetwork: 137,
  defaultDestNetwork: 1,
  allSourceTokens: null,
  allDestTokens: null,
};

const customSettingsSlice = createSlice({
  name: "customSettings",
  initialState,
  reducers: {
    setCustomSourceNetworks: (state, action) => {
      state.sourceNetworks = action.payload;
    },
    setCustomDestNetworks: (state, action) => {
      state.destNetworks = action.payload;
    },
    setDefaultSourceNetwork: (state, action) => {
      state.defaultSourceNetwork = action.payload;
    },
    setDefaultDestNetwork: (state, action) => {
      state.defaultDestNetwork = action.payload
    },
    setSourceTokens: (state, action) => {
      state.allSourceTokens = action.payload
    }, 
    setDestTokens: (state, action) => {
      state.allDestTokens = action.payload
    }
  },
});

export default customSettingsSlice.reducer;
export const {
  setCustomSourceNetworks,
  setCustomDestNetworks,
  setDefaultSourceNetwork,
  setDefaultDestNetwork,
  setSourceTokens,
  setDestTokens
} = customSettingsSlice.actions;
