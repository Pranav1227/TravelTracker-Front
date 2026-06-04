import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const fetchMyVisits = createAsyncThunk(
  'visits/fetchMyVisits',
  async (category, { rejectWithValue }) => {
    try {
      const params = category ? { category } : {};
      const { data } = await API.get('/visits', { params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch visits');
    }
  }
);

export const fetchExplorationStats = createAsyncThunk(
  'visits/fetchExplorationStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/visits/stats');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

export const fetchVisitedIds = createAsyncThunk(
  'visits/fetchVisitedIds',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/visits/ids');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch visited IDs');
    }
  }
);

export const toggleVisit = createAsyncThunk(
  'visits/toggleVisit',
  async ({ placeId, notes = '' }, { rejectWithValue }) => {
    try {
      const { data } = await API.post(`/visits/toggle/${placeId}`, { notes });
      return { placeId, ...data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle visit');
    }
  }
);

const visitSlice = createSlice({
  name: 'visits',
  initialState: {
    visits: [],
    stats: null,
    visitedIds: [],
    loading: false,
    statsLoading: false,
    toggleLoading: null, // stores placeId being toggled
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyVisits.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyVisits.fulfilled, (state, action) => {
        state.loading = false;
        state.visits = action.payload;
      })
      .addCase(fetchMyVisits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchExplorationStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchExplorationStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchExplorationStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchVisitedIds.fulfilled, (state, action) => {
        state.visitedIds = action.payload;
      })
      .addCase(toggleVisit.pending, (state, action) => {
        state.toggleLoading = action.meta.arg.placeId;
      })
      .addCase(toggleVisit.fulfilled, (state, action) => {
        state.toggleLoading = null;
        const { placeId, visited } = action.payload;
        if (visited) {
          state.visitedIds.push(placeId);
        } else {
          state.visitedIds = state.visitedIds.filter((id) => id !== placeId);
        }
      })
      .addCase(toggleVisit.rejected, (state, action) => {
        state.toggleLoading = null;
        state.error = action.payload;
      });
  },
});

export default visitSlice.reducer;
