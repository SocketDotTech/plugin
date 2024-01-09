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
  sameChainSwapsEnabled: false,
  includeBridges: null,
  excludeBridges: null,
  singleTxOnly: false,
  apiKey: null,
  feeParams: null,
  hideIntegratorFee: false,
  initialAmount: null,
  zpHide: false,
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
      state.defaultDestNetwork = action.payload;
    },
    setCustomSourceTokens: (state, action) => {
      state.sourceTokens = action.payload;
    },
    setCustomDestTokens: (state, action) => {
      state.destTokens = action.payload;
    },
    setDefaultSourceToken: (state, action) => {
      state.defaultSourceToken = action.payload;
    },
    setDefaultDestToken: (state, action) => {
      state.defaultDestToken = action.payload;
    },
    setSameChainSwaps: (state, action) => {
      state.sameChainSwapsEnabled = action.payload;
    },
    setIncludeBridges: (state, action) => {
      state.includeBridges = action.payload;
    },
    setExludeBridges: (state, action) => {
      state.excludeBridges = action.payload;
    },
    setSingleTxOnly: (state, action) => {
      state.singleTxOnly = action.payload;
    },
    setApiKey: (state, action) => {
      state.apiKey = action.payload
    },
    setFeeParams: (state, action) => {
      state.feeParams = action.payload
    },
    setHideIntegratorFee: (state, action) => {
      state.hideIntegratorFee = action.payload
    },
    setInitialAmount: (state, action) => {
      state.initialAmount = action.payload
    },
    setZpHide: (state, action) => {
      state.zpHide = action.payload
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
  setDefaultDestToken,
  setSameChainSwaps,
  setIncludeBridges,
  setExludeBridges,
  setSingleTxOnly,
  setApiKey,
  setFeeParams,
  setHideIntegratorFee,
  setInitialAmount,
  setZpHide
} = customSettingsSlice.actions;

// Note - Custom token list is not set here. Check out hooks/useTokenLists.ts
