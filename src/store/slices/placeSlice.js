import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const fetchPlaces = createAsyncThunk(
  'places/fetchPlaces',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/places', { params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch places');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'places/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/places/categories');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const fetchCountries = createAsyncThunk(
  'places/fetchCountries',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/places/countries');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch countries');
    }
  }
);

export const createPlace = createAsyncThunk(
  'places/createPlace',
  async (placeData, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/places', placeData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create place');
    }
  }
);

export const updatePlace = createAsyncThunk(
  'places/updatePlace',
  async ({ id, ...placeData }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/places/${id}`, placeData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update place');
    }
  }
);

export const deletePlace = createAsyncThunk(
  'places/deletePlace',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/places/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete place');
    }
  }
);

const placeSlice = createSlice({
  name: 'places',
  initialState: {
    places: [],
    categories: {},
    countries: [],
    total: 0,
    page: 1,
    pages: 1,
    loading: false,
    error: null,
  },
  reducers: {
    clearPlaceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaces.fulfilled, (state, action) => {
        state.loading = false;
        state.places = action.payload.places;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchPlaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.countries = action.payload;
      })
      .addCase(createPlace.fulfilled, (state, action) => {
        state.places.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updatePlace.fulfilled, (state, action) => {
        const idx = state.places.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.places[idx] = action.payload;
      })
      .addCase(deletePlace.fulfilled, (state, action) => {
        state.places = state.places.filter((p) => p._id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { clearPlaceError } = placeSlice.actions;
export default placeSlice.reducer;
