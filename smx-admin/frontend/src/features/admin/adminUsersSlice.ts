import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminUsersService } from '../../services/admin-users.service';

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  roleName: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminUsersState {
  users: AdminUser[];
  selectedUser: AdminUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminUsersState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
};

export const fetchAdminUsers = createAsyncThunk('adminUsers/fetchAll', async () => {
  return await adminUsersService.getAll();
});

export const fetchAdminUserById = createAsyncThunk('adminUsers/fetchById', async (id: string) => {
  return await adminUsersService.getById(id);
});

export const createAdminUser = createAsyncThunk(
  'adminUsers/create',
  async (data: Parameters<typeof adminUsersService.create>[0]) => {
    return await adminUsersService.create(data);
  }
);

export const updateAdminUser = createAsyncThunk(
  'adminUsers/update',
  async ({ id, data }: { id: string; data: Parameters<typeof adminUsersService.update>[1] }) => {
    return await adminUsersService.update(id, data);
  }
);

export const deleteAdminUser = createAsyncThunk('adminUsers/delete', async (id: string) => {
  await adminUsersService.delete(id);
  return id;
});

export const toggleAdminUserBlock = createAsyncThunk(
  'adminUsers/toggleBlock',
  async (id: string) => {
    return await adminUsersService.toggleBlock(id);
  }
);

const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchAdminUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = Array.isArray(action.payload)
          ? action.payload.map((user) => ({
              ...user,
              roleName: user.role?.name || 'Unknown',
            }))
          : [];
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch admin users';
      })
      // Fetch user by ID
      .addCase(fetchAdminUserById.fulfilled, (state, action) => {
        state.selectedUser = {
          ...action.payload,
          roleName: action.payload.role?.name || 'Unknown',
        };
      })
      // Create user
      .addCase(createAdminUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAdminUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.push({
          ...action.payload,
          roleName: action.payload.role?.name || 'Unknown',
        });
      })
      .addCase(createAdminUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create admin user';
      })
      // Update user
      .addCase(updateAdminUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAdminUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedUser = {
          ...action.payload,
          roleName: action.payload.role?.name || 'Unknown',
        };
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = updatedUser;
        }
      })
      .addCase(updateAdminUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update admin user';
      })
      // Delete user
      .addCase(deleteAdminUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAdminUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
      })
      .addCase(deleteAdminUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete admin user';
      })
      // Toggle user block status
      .addCase(toggleAdminUserBlock.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleAdminUserBlock.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedUser = {
          ...action.payload,
          roleName: action.payload.role?.name || 'Unknown',
        };
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = updatedUser;
        }
      })
      .addCase(toggleAdminUserBlock.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to toggle admin user block status';
      });
  },
});

export const { clearError, clearSelectedUser } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;
