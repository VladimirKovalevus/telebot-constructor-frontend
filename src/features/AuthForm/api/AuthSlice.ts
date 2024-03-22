import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state: AuthState, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
      console.log(state.isAuthenticated);
    },
  },
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;
