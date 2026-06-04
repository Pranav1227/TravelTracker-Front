import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const submitHiddenGem = createAsyncThunk(
  'hiddenGems/submit',
  async (gemData, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/hidden-gems', gemData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit hidden gem');
    }
  }
);

export const fetchMyGems = createAsyncThunk(
  'hiddenGems/fetchMyGems',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/hidden-gems/my');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your gems');
    }
  }
);

export const fetchAllGems = createAsyncThunk(
  'hiddenGems/fetchAllGems',
  async (status, { rejectWithValue }) => {
    try {
      const params = status ? { status } : {};
      const { data } = await API.get('/hidden-gems', { params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch gems');
    }
  }
);

export const verifyGem = createAsyncThunk(
  'hiddenGems/verifyGem',
  async ({ id, status, adminNotes, badgeId }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/hidden-gems/${id}/verify`, {
        status,
        adminNotes,
        badgeId,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify gem');
    }
  }
);

const hiddenGemSlice = createSlice({
  name: 'hiddenGems',
  initialState: {
    myGems: [],
    allGems: [],
    loading: false,
    submitLoading: false,
    verifyLoading: null,
    error: null,
  },
  reducers: {
    clearGemError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitHiddenGem.pending, (state) => {
        state.submitLoading = true;
        state.error = null;
      })
      .addCase(submitHiddenGem.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.myGems.unshift(action.payload);
      })
      .addCase(submitHiddenGem.rejected, (state, action) => {
        state.submitLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyGems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyGems.fulfilled, (state, action) => {
        state.loading = false;
        state.myGems = action.payload;
      })
      .addCase(fetchMyGems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllGems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllGems.fulfilled, (state, action) => {
        state.loading = false;
        state.allGems = action.payload;
      })
      .addCase(fetchAllGems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyGem.pending, (state, action) => {
        state.verifyLoading = action.meta.arg.id;
      })
      .addCase(verifyGem.fulfilled, (state, action) => {
        state.verifyLoading = null;
        const idx = state.allGems.findIndex((g) => g._id === action.payload._id);
        if (idx !== -1) state.allGems[idx] = action.payload;
      })
      .addCase(verifyGem.rejected, (state, action) => {
        state.verifyLoading = null;
        state.error = action.payload;
      });
  },
});

export const { clearGemError } = hiddenGemSlice.actions;
export default hiddenGemSlice.reducer;
