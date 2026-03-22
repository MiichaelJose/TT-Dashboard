import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    companyId: string | null;
    role: "owner" | "agent" | null;
  } | null;
  loading: boolean;
  error: string | null;
  isContextLoaded: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isContextLoaded: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setContextLoaded: (state, action: PayloadAction<boolean>) => {
      state.isContextLoaded = action.payload;
    },
    setUser: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCompanyContext: (state, action: PayloadAction<{ companyId: string, role: "owner" | "agent" }>) => {
      if (state.user) {
        state.user.companyId = action.payload.companyId;
        state.user.role = action.payload.role;
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.isContextLoaded = false;
    },
  },
});

export const { setLoading, setContextLoaded, setUser, setCompanyContext, setError, clearUser } = authSlice.actions;
export default authSlice.reducer;
