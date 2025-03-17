import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../apiClient';
import { Alert } from 'react-native';

// Define the type for a single deal
interface Deal {
  locationId: string;
  locationName: string;
  couponId: string;
  image: string;
  type: string;
  code: string;
  discountPercentage: number;
  discountValue: number;
  expirationDate: string;
}

// Define the type for the response structure
interface DealsResponse {
  city: string;
  country: string;
  deals: Record<string, Deal[]>; // Deals categorized by type
}

// Define the slice state type
interface DealsState {
  city: string;
  country: string;
  deals: Record<string, Deal[]>;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: DealsState = {
  city: '',
  country: '',
  deals: {},
  loading: false,
  error: null,
};

// Async thunk: Fetch deals by city
interface FetchDealsByCityAndCountryArgs {
  city: string;
  country: string;
}

export const fetchDealsByCityAndCountry = createAsyncThunk<DealsResponse, FetchDealsByCityAndCountryArgs>(
  'deals/fetchDealsByCityAndCountry',
  async ({ city, country }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<DealsResponse>(`deals/${city}/${country}`);
      return response.data;
    } catch (error: any) {
      if (error.response.status === 404) {
        Alert.alert('', error.response.data.message);
      }
      return rejectWithValue(error.response?.data || 'Failed to fetch deals');
    }
  }
);

// Deals slice
const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDealsByCityAndCountry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDealsByCityAndCountry.fulfilled, (state, action: PayloadAction<DealsResponse>) => {
        state.city = action.payload.city;
        state.country = action.payload.country;
        state.deals = action.payload.deals;
        state.loading = false;
      })
      .addCase(fetchDealsByCityAndCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dealsSlice.reducer;
