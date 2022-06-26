import { configureStore } from "@reduxjs/toolkit";
import networksReducer from "./networksSlice";
import devPropsReducer from "./devPropsSlice";

const store = configureStore({
  reducer: {
    networks: networksReducer,
    devProps: devPropsReducer
  },
});

export default store;
