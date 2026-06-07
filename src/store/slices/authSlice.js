import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

// Get user from localStorage
let userInfo = null;
try {
  const storedUser = localStorage.getItem('userInfo');
  if (storedUser) {
    userInfo = JSON.parse(storedUser);
  }
} catch (error) {
  localStorage.removeItem('userInfo');
}

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/auth/register', { name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/auth/profile');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const { data } = await API.put('/auth/profile', profileData);
      // Update localStorage with new info
      let stored = null;
      try {
        const storedStr = localStorage.getItem('userInfo');
        if (storedStr) {
          stored = JSON.parse(storedStr);
        }
      } catch (error) {
        // If parsing fails, ignore and treat as empty
      }
      const updated = { ...stored, ...data };
      localStorage.setItem('userInfo', JSON.stringify(updated));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userInfo,
    loading: false,
    error: null,
    profileLoading: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem('userInfo');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.profileLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(getProfile.rejected, (state) => {
        state.profileLoading = false;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
