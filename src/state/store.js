import { configureStore } from "@reduxjs/toolkit";
import networksReducer from "./networksSlice";
import devPropsReducer from "./devPropsSlice";
import tokensReducer from "./tokensSlice";
import amountReducer from "./amountSlice";
import quotesReducer from "./quotesSlice";
import selectedRouteReducer from "./selectedRouteSlice";
import txDetailsReducer from "./txDetails"
import modalsReducer from "./modals"

const store = configureStore({
  reducer: {
    networks: networksReducer,
    devProps: devPropsReducer,
    tokens: tokensReducer,
    amount: amountReducer,
    quotes: quotesReducer,
    routes: selectedRouteReducer,
    txDetails: txDetailsReducer,
    modals: modalsReducer
  },
});

export default store;
