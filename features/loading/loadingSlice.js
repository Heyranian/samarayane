// src/features/loading/loadingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = false;

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    startLoading: (state) => true,
    stopLoading: (state) => false,
  },
});

export const { startLoading, stopLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
