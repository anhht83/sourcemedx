import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { activityLogsService, GetAllParams } from '../../services/activity-logs.service';

interface ActivityLog {
  id: string;
  admin: {
    id: string;
    email: string;
  };
  entityType: 'ADMIN' | 'USER' | 'ROLE';
  activityType: 'CREATE' | 'UPDATE' | 'DELETE' | 'BLOCK' | 'UNBLOCK' | 'LOGIN' | 'LOGOUT';
  entityId: string;
  details: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

interface ActivityLogsState {
  logs: ActivityLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: ActivityLogsState = {
  logs: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  isLoading: false,
  error: null,
};

export const fetchActivityLogs = createAsyncThunk(
  'activityLogs/fetchAll',
  async (params: GetAllParams) => {
    return await activityLogsService.getAll(params);
  }
);

export const exportActivityLogs = createAsyncThunk(
  'activityLogs/export',
  async (params: Omit<GetAllParams, 'page' | 'limit'>) => {
    return await activityLogsService.exportLogs(params);
  }
);

const activityLogsSlice = createSlice({
  name: 'activityLogs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivityLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.logs = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch activity logs';
      });
  },
});

export default activityLogsSlice.reducer;
