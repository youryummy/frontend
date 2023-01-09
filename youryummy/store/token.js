import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setState: (state, action) => {
      Object.entries(action.payload ?? state).forEach(([key, value]) => {
        if (!action.payload) delete state[key];
        else state[key] = value;
      });
    }
  }
});

export const { setState } = loginSlice.actions;
export default loginSlice.reducer;
