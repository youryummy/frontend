import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogged: null,
};

export const googleLoginSlice = createSlice({
  name: "googleLogin",
  initialState,
  reducers: {
    setState: (state, action) => {
      state.isLogged = action.payload;
    },
  },
});

export const { setState } = googleLoginSlice.actions;
export default googleLoginSlice.reducer;
