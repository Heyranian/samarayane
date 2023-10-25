// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from '@/features/loading/loadingSlice'

const store = configureStore({
    reducer: {
        loading: loadingReducer,
        // Add other reducers here if needed
    },
});

export default store;
