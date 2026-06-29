import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '../api/api';
import type { Car } from '../types';

// Asynchronous action for loading machines
export const fetchCars = createAsyncThunk(
  'garage/fetchCars',
  async (page: number) => {
    const response = await api.getCars(page);
    return response;
  }
);

interface GarageState {
  cars: Car[];
  totalCount: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: GarageState = {
  cars: [],
  totalCount: 0,
  currentPage: 1,
  loading: false,
  error: null,
};

const garageSlice = createSlice({
  name: 'garage',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = action.payload.cars;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(removeCarThunk.pending, (state) => { state.loading = true; });
  },
});

export const { setPage } = garageSlice.actions;
export default garageSlice.reducer;

export const removeCarThunk = createAsyncThunk(
  'garage/removeCar',
  async (id: number, { dispatch, getState }) => {
    await api.deleteCar(id);
    const state = getState() as { garage: GarageState };
    dispatch(fetchCars(state.garage.currentPage));
  }
);