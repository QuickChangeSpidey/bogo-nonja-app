import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL as API_URL } from '../apiClient';

const API_BASE_URL = `${API_URL}/locations/query/:search`;

// 🔹 Async Action to Fetch Locations Based on Search Query
export const searchLocations = createAsyncThunk(
  'locations/searchLocations',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/locations/search/${query}`);
      return response.data.results; // Extract only results from API response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

const locationsSlice = createSlice({
  name: 'locations',
  initialState: {
    locations: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.locations = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload;
      })
      .addCase(searchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearchResults } = locationsSlice.actions;
export default locationsSlice.reducer;
