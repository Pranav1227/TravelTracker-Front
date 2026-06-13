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
  async ({ placeId, status }, { rejectWithValue }) => {
    try {
      const { data } = await API.post(`/visits/toggle/${placeId}`, { status });
      return data; // { added: true/false, visit, removed: true/false }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle visit');
    }
  }
);

export const logMemory = createAsyncThunk(
  'visits/logMemory',
  async ({ placeId, formData }, { rejectWithValue }) => {
    try {
      const { data } = await API.post(`/visits/${placeId}/memory`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload memory');
    }
  }
);

const visitSlice = createSlice({
  name: 'visits',
  initialState: {
    visits: [],
    stats: null,
    visitedIds: [],
    bucketListIds: [],
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
        state.visitedIds = action.payload.visitedIds || [];
        state.bucketListIds = action.payload.bucketListIds || [];
      })
      .addCase(toggleVisit.pending, (state, action) => {
        state.toggleLoading = action.meta.arg.placeId;
      })
      .addCase(toggleVisit.fulfilled, (state, action) => {
        state.toggleLoading = null;
        const { placeId, added, removed, updated, status } = action.payload;
        
        if (removed) {
          state.visitedIds = state.visitedIds.filter(id => id !== placeId);
          state.bucketListIds = state.bucketListIds.filter(id => id !== placeId);
        } else if (added || updated) {
          if (status === 'visited') {
            if (!state.visitedIds.includes(placeId)) state.visitedIds.push(placeId);
            state.bucketListIds = state.bucketListIds.filter(id => id !== placeId);
          } else if (status === 'bucketlist') {
            if (!state.bucketListIds.includes(placeId)) state.bucketListIds.push(placeId);
            state.visitedIds = state.visitedIds.filter(id => id !== placeId);
          }
        }
      })
      .addCase(toggleVisit.rejected, (state, action) => {
        state.toggleLoading = null;
        state.error = action.payload;
      })
      // Log Memory
      .addCase(logMemory.pending, (state, action) => {
        state.toggleLoading = action.meta.arg.placeId;
      })
      .addCase(logMemory.fulfilled, (state, action) => {
        state.toggleLoading = null;
        const index = state.visits.findIndex(v => v._id === action.payload._id);
        if (index !== -1) {
          state.visits[index] = action.payload;
        } else {
          state.visits.push(action.payload);
        }
      })
      .addCase(logMemory.rejected, (state, action) => {
        state.toggleLoading = null;
        state.error = action.payload;
      });
  },
});

export default visitSlice.reducer;
