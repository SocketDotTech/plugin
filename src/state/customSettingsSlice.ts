import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sourceNetworks: null,
  destNetworks: null,
  defaultSourceNetwork: 137,
  defaultDestNetwork: 1,
  sourceTokens: null,
  destTokens: null,
  defaultSourceToken: null,
  defaultDestToken: null,
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
    setCustomSourceTokens: (state, action) => {
      state.sourceTokens = action.payload
    }, 
    setCustomDestTokens: (state, action) => {
      state.destTokens = action.payload
    },
    setDefaultSourceToken: (state, action) => {
      state.defaultSourceToken = action.payload
    },
    setDefaultDestToken: (state, action) => {
      state.defaultDestToken = action.payload
    }
  },
});

export default customSettingsSlice.reducer;
export const {
  setCustomSourceNetworks,
  setCustomDestNetworks,
  setDefaultSourceNetwork,
  setDefaultDestNetwork,
  setCustomSourceTokens,
  setCustomDestTokens,
  setDefaultSourceToken,
  setDefaultDestToken
} = customSettingsSlice.actions;


// Note - Custom token list is not set here. Check out hooks/useTokenLists.ts