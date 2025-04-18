import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../apiClient';
import { Alert } from 'react-native';

// Define the type for a single deal
export interface Deal {
  locationId: string;
  locationName: string;
  couponId: string;
  image: string;
  type: string;
  quantity: number;
  code: string;
  address: string;
  comboPrice: number;
  discountPercentage: number;
  startTime: string;
  endTime: string;
  startHour: number;
  endHour: number;
  discountValue: number;
  familyPackPrice: number;
  familyPackItems: string[];
  expirationDate: string;
  min: number;
  purchasedItems: string[]; // List of item names that must be purchased
  freeItems: string[];      // List of item names given for free
  comboItems: string[];     // List of item names included in a combo deal
}

// Define the type for the response structure
export interface DealsResponse {
  city: string;
  country: string;
  deals: Record<string, Deal[]>; // Deals categorized by type
}

// Define the slice state type
export interface DealsState {
  city: string;
  country: string;
  deals: Record<string, Deal[]>;
  loading: boolean;
  error: string | null;
}

// Initial state
export const initialState: DealsState = {
  city: '',
  country: '',
  deals: {},
  loading: false,
  error: null,
};

// Async thunk: Fetch deals by city
export interface FetchDealsByCityAndCountryArgs {
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
      console.log(error)
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
