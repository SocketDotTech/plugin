import { configureStore } from "@reduxjs/toolkit";
import networksReducer from "./networksSlice";

const store = configureStore({
  reducer: {
    networks: networksReducer,
  },
});

export default store;
