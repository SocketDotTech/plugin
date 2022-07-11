import { configureStore } from "@reduxjs/toolkit";
import networksReducer from "./networksSlice";
import customSettingsReducer from "./customSettingsSlice";
import tokensReducer from "./tokensSlice";
import amountReducer from "./amountSlice";
import quotesReducer from "./quotesSlice";
import selectedRouteReducer from "./selectedRouteSlice";
import txDetailsReducer from "./txDetails"
import modalsReducer from "./modals"

const store = configureStore({
  reducer: {
    networks: networksReducer,
    tokens: tokensReducer,
    amount: amountReducer,
    quotes: quotesReducer,
    routes: selectedRouteReducer,
    txDetails: txDetailsReducer,
    modals: modalsReducer,
    customSettings: customSettingsReducer
  },
});

export default store;
