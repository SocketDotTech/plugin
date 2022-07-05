import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  txDetails: JSON.parse(localStorage.getItem("txData")) ?? {}
};

const txDetailsSlice = createSlice({
  name: "txData",
  initialState,
  reducers: {
    setTxDetails: (state, action) => {
      const prevTxDetails = JSON.parse(localStorage.getItem("txData")) ?? {};
      const prevTxDetailsAccount = prevTxDetails[action.payload.account];

      // // create account key if doesn't exist
      if(!prevTxDetailsAccount) prevTxDetails[action.payload.account] = {};
      const prevTxDetailsRouteId = prevTxDetails[action.payload.account][action.payload.routeId];

      // // create route Id key if it doesn't exist
      if(prevTxDetailsRouteId){
        prevTxDetails[action.payload.account] = {
          ...prevTxDetails[action.payload.account],
          [action.payload.routeId]: {
            ...prevTxDetailsRouteId,
            [action.payload.stepIndex]: action.payload.value
          }                                                                                                                           
        }
      } else {
        prevTxDetails[action.payload.account] = {
          ...prevTxDetails[action.payload.account],
          [action.payload.routeId]: {
            [action.payload.stepIndex]: action.payload.value
          }
        }
      }

      localStorage.setItem("txData", JSON.stringify(prevTxDetails));
      Object.assign(state.txDetails, prevTxDetails);
    },
  },
});

export default txDetailsSlice.reducer;
export const { setTxDetails } = txDetailsSlice.actions;
