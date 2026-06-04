import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const fetchBadges = createAsyncThunk(
  'badges/fetchBadges',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/badges');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch badges');
    }
  }
);

export const createBadge = createAsyncThunk(
  'badges/createBadge',
  async (badgeData, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/badges', badgeData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create badge');
    }
  }
);

export const deleteBadge = createAsyncThunk(
  'badges/deleteBadge',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/badges/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete badge');
    }
  }
);

const badgeSlice = createSlice({
  name: 'badges',
  initialState: {
    badges: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBadges.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBadges.fulfilled, (state, action) => {
        state.loading = false;
        state.badges = action.payload;
      })
      .addCase(fetchBadges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBadge.fulfilled, (state, action) => {
        state.badges.push(action.payload);
      })
      .addCase(deleteBadge.fulfilled, (state, action) => {
        state.badges = state.badges.filter((b) => b._id !== action.payload);
      });
  },
});

export default badgeSlice.reducer;
