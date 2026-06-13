import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

// Async Thunks
export const fetchBucketLists = createAsyncThunk(
  'bucketList/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/bucket-lists');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bucket lists');
    }
  }
);

export const fetchBucketListById = createAsyncThunk(
  'bucketList/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/bucket-lists/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bucket list');
    }
  }
);

export const createBucketList = createAsyncThunk(
  'bucketList/create',
  async (bucketListData, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/bucket-lists', bucketListData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create bucket list');
    }
  }
);

export const updateBucketList = createAsyncThunk(
  'bucketList/update',
  async ({ id, data: updateData }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/bucket-lists/${id}`, updateData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update bucket list');
    }
  }
);

export const deleteBucketList = createAsyncThunk(
  'bucketList/delete',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/bucket-lists/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete bucket list');
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'bucketList/toggleFavorite',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/bucket-lists/${id}/favorite`);
      return { id, isFavorite: data.isFavorite };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle favorite');
    }
  }
);

export const duplicateBucketList = createAsyncThunk(
  'bucketList/duplicate',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.post(`/bucket-lists/${id}/duplicate`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to duplicate bucket list');
    }
  }
);

export const togglePlaceVisited = createAsyncThunk(
  'bucketList/togglePlaceVisited',
  async ({ bucketListId, placeId }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/bucket-lists/${bucketListId}/places/${placeId}/visited`);
      return { bucketListId, placeId, isVisited: data.isVisited };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle place status');
    }
  }
);

const initialState = {
  lists: [],
  currentList: null,
  loading: false,
  detailLoading: false,
  error: null,
};

const bucketListSlice = createSlice({
  name: 'bucketList',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentList: (state) => {
      state.currentList = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchBucketLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBucketLists.fulfilled, (state, action) => {
        state.loading = false;
        state.lists = action.payload;
      })
      .addCase(fetchBucketLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch By ID
      .addCase(fetchBucketListById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchBucketListById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentList = action.payload;
      })
      .addCase(fetchBucketListById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createBucketList.fulfilled, (state, action) => {
        state.lists.unshift({ ...action.payload, totalPlaces: 0, visitedPlaces: 0 }); // optimistic default
      })
      // Update
      .addCase(updateBucketList.fulfilled, (state, action) => {
        const index = state.lists.findIndex(l => l._id === action.payload._id);
        if (index !== -1) {
          state.lists[index] = { ...state.lists[index], ...action.payload };
        }
        if (state.currentList?._id === action.payload._id) {
          state.currentList = { ...state.currentList, ...action.payload };
        }
      })
      // Delete
      .addCase(deleteBucketList.fulfilled, (state, action) => {
        state.lists = state.lists.filter(l => l._id !== action.payload);
      })
      // Toggle Favorite
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { id, isFavorite } = action.payload;
        const list = state.lists.find(l => l._id === id);
        if (list) list.isFavorite = isFavorite;
        if (state.currentList?._id === id) state.currentList.isFavorite = isFavorite;
      })
      // Duplicate
      .addCase(duplicateBucketList.fulfilled, (state, action) => {
        state.lists.unshift({ ...action.payload, totalPlaces: 0, visitedPlaces: 0 });
      })
      // Toggle Place Visited
      .addCase(togglePlaceVisited.fulfilled, (state, action) => {
        const { bucketListId, placeId, isVisited } = action.payload;
        if (state.currentList?._id === bucketListId && state.currentList.places) {
          const place = state.currentList.places.find(p => p.place._id === placeId);
          if (place) {
            place.isVisited = isVisited;
          }
        }
        // Also update lists stats optimally
        const listIndex = state.lists.findIndex(l => l._id === bucketListId);
        if (listIndex !== -1) {
          if (isVisited) {
            state.lists[listIndex].visitedPlaces += 1;
          } else {
            state.lists[listIndex].visitedPlaces -= 1;
          }
        }
      });
  },
});

export const { clearError, clearCurrentList } = bucketListSlice.actions;
export default bucketListSlice.reducer;
