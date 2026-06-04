import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/admin/dashboard');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard');
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/admin/users');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const changeUserRole = createAsyncThunk(
  'admin/changeUserRole',
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/admin/users/${id}/role`, { role });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change role');
    }
  }
);

export const awardBadge = createAsyncThunk(
  'admin/awardBadge',
  async ({ userId, badgeId }, { rejectWithValue }) => {
    try {
      const { data } = await API.post(`/admin/users/${userId}/badge`, { badgeId });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to award badge');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    dashboardStats: null,
    users: [],
    loading: false,
    usersLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.usersLoading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload;
      })
      .addCase(changeUserRole.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u._id === action.payload._id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(awardBadge.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u._id === action.payload._id);
        if (idx !== -1) state.users[idx] = action.payload;
      });
  },
});

export default adminSlice.reducer;
