import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  devProps: {
    width: 400,
    responsiveWidth: false,
    sourceNetworks: null,
  },
};

const devPropsSlice = createSlice({
  name: "devProps",
  initialState,
  reducers: {
    setDevProps: (state, action) => {
      state.devProps = action.payload;
    },
  },
});

export default devPropsSlice.reducer;
export const { setDevProps } = devPropsSlice.actions;
