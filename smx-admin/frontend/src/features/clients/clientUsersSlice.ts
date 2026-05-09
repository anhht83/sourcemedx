import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User, UserRole } from '../../types/auth';
import { clientUsersService } from '../../services/client-users.service';

interface ClientUsersState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
}

interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  company: string;
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  company?: string;
  role?: UserRole;
}

const initialState: ClientUsersState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
};

export const fetchClientUsers = createAsyncThunk('clientUsers/fetchAll', async () => {
  return await clientUsersService.getAll();
});

export const fetchClientUserById = createAsyncThunk('clientUsers/fetchById', async (id: string) => {
  return await clientUsersService.getById(id);
});

export const createClientUser = createAsyncThunk(
  'clientUsers/create',
  async (data: CreateUserData) => {
    return await clientUsersService.create(data);
  }
);

export const updateClientUser = createAsyncThunk(
  'clientUsers/update',
  async ({ id, data }: { id: string; data: UpdateUserData }) => {
    return await clientUsersService.update(id, data);
  }
);

export const deleteClientUser = createAsyncThunk('clientUsers/delete', async (id: string) => {
  await clientUsersService.delete(id);
  return id;
});

export const toggleClientUserBlock = createAsyncThunk(
  'clientUsers/toggleBlock',
  async (id: string) => {
    return await clientUsersService.toggleBlock(id);
  }
);

const clientUsersSlice = createSlice({
  name: 'clientUsers',
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
      .addCase(fetchClientUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClientUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchClientUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch client users';
      })
      // Fetch user by ID
      .addCase(fetchClientUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })
      // Create user
      .addCase(createClientUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createClientUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.push(action.payload);
      })
      .addCase(createClientUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create user';
      })
      // Update user
      .addCase(updateClientUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateClientUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(updateClientUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update user';
      })
      // Delete user
      .addCase(deleteClientUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteClientUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
      })
      .addCase(deleteClientUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete user';
      })
      // Toggle user block status
      .addCase(toggleClientUserBlock.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleClientUserBlock.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(toggleClientUserBlock.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to toggle user block status';
      });
  },
});

export const { clearError, clearSelectedUser } = clientUsersSlice.actions;
export default clientUsersSlice.reducer;
