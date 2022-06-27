import { configureStore } from "@reduxjs/toolkit";
import networksReducer from "./networksSlice";
import devPropsReducer from "./devPropsSlice";
import tokensReducer from "./tokensSlice";
import amountReducer from "./amountSlice";
import quotesReducer from "./quotesSlice";

const store = configureStore({
  reducer: {
    networks: networksReducer,
    devProps: devPropsReducer,
    tokens: tokensReducer,
    amount: amountReducer,
    quotes: quotesReducer
  },
});

export default store;
