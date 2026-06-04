import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import placeReducer from './slices/placeSlice';
import visitReducer from './slices/visitSlice';
import hiddenGemReducer from './slices/hiddenGemSlice';
import badgeReducer from './slices/badgeSlice';
import adminReducer from './slices/adminSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    places: placeReducer,
    visits: visitReducer,
    hiddenGems: hiddenGemReducer,
    badges: badgeReducer,
    admin: adminReducer,
  },
});

export default store;
