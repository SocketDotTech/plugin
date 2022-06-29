import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedRoute: null,
};

const selectedRouteSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {
    setSelectedRoute: (state, action) => {
      state.selectedRoute = action.payload;
    },
  },
});

export default selectedRouteSlice.reducer;
export const { setSelectedRoute } = selectedRouteSlice.actions;
