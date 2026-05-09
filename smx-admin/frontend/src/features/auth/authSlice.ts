import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LoginCredentials, AdminProfile } from '../../types/auth';
import { authService } from '../../services/auth.service';

interface AuthState {
  token: string | null;
  user: AdminProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessions: Session[];
  isLoadingSessions: boolean;
  sessionsError: string | null;
}

interface Session {
  id: string;
  userAgent: string;
  ipAddress: string;
  createdAt: string;
  expiresAt: string;
}

const initialState: AuthState = {
  token: authService.getToken(),
  user: null,
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,
  sessions: [],
  isLoadingSessions: false,
  sessionsError: null,
};

export const login = createAsyncThunk('auth/login', async (credentials: LoginCredentials) => {
  const response = await authService.login(credentials);
  const user = await authService.getCurrentUser();
  return { ...response, user };
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async () => {
  const user = await authService.getCurrentUser();
  return user;
});

export const refreshToken = createAsyncThunk('auth/refreshToken', async () => {
  const response = await authService.refreshToken();
  return response;
});

export const getSessions = createAsyncThunk('auth/getSessions', async () => {
  const sessions = await authService.getSessions();
  return sessions;
});

export const revokeSession = createAsyncThunk('auth/revokeSession', async (tokenId: string) => {
  await authService.revokeSession(tokenId);
  return tokenId;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.access_token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.sessions = [];
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.access_token;
      })
      .addCase(getSessions.pending, (state) => {
        state.isLoadingSessions = true;
        state.sessionsError = null;
      })
      .addCase(getSessions.fulfilled, (state, action) => {
        state.isLoadingSessions = false;
        state.sessions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getSessions.rejected, (state, action) => {
        state.isLoadingSessions = false;
        state.sessionsError = action.error.message || 'Failed to fetch sessions';
      })
      .addCase(revokeSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.filter((session) => session.id !== action.payload);
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
