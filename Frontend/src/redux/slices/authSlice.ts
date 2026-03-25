import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { UpgradeStatus } from "../../types/upgrade-status.enum";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  applyingupgrade: UpgradeStatus;
  rejectedAt?: string | null;
  reapplyAt?: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ user: User }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;

export default authSlice.reducer;