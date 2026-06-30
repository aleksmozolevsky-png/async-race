import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '../api/api';
import { fetchWinnersThunk } from './winnersSlice';
import type { Car, CarCreateParams } from '../types';

export type RaceStatus = 'ready' | 'racing' | 'finished';

interface GarageState {
  cars: Car[];
  totalCount: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  selectedCar: Car | null;
  raceStatus: RaceStatus;
  winnerName: string | null;
  winnerTime: number | null;
}

const initialState: GarageState = {
  cars: [],
  totalCount: 0,
  currentPage: 1,
  loading: false,
  error: null,
  selectedCar: null,
  raceStatus: 'ready',
  winnerName: null,
  winnerTime: null,
};

export const fetchCars = createAsyncThunk<{ items: Car[]; count: number }, number>(
  'garage/fetchCars',
  async (page: number) => api.getCars(page)
);

export const removeCarThunk = createAsyncThunk(
  'garage/removeCar',
  async (id: number, { dispatch, getState }) => {
    await api.deleteCar(id);
    const state = getState() as { garage: GarageState };
    dispatch(fetchCars(state.garage.currentPage));
  }
);

export const createCarThunk = createAsyncThunk(
  'garage/createCar',
  async (car: CarCreateParams, { dispatch, getState }) => {
    await api.createCar(car);
    const state = getState() as { garage: GarageState };
    dispatch(fetchCars(state.garage.currentPage));
  }
);

export const updateCarThunk = createAsyncThunk(
  'garage/updateCar',
  async ({ id, car }: { id: number; car: CarCreateParams }, { dispatch, getState }) => {
    await api.updateCar(id, car);
    const state = getState() as { garage: GarageState };
    dispatch(fetchCars(state.garage.currentPage));
  }
);

export const generateCarsThunk = createAsyncThunk(
  'garage/generateCars',
  async (_, { dispatch, getState }) => {
    const brands = [
      'Tesla',
      'BMW',
      'Audi',
      'Mercedes',
      'Opel',
      'Lada',
      'Toyota',
      'Ford',
      'Nissan',
      'Kia',
    ];
    const models = [
      'Model S',
      'X5',
      'A6',
      'S-Class',
      'Astra',
      'Vesta',
      'Camry',
      'Focus',
      'Leaf',
      'Rio',
    ];

    for (let i = 0; i < 100; i += 10) {
      const batch = Array.from({ length: 10 }).map(() => {
        const name = `${brands[Math.floor(Math.random() * brands.length)]} ${models[Math.floor(Math.random() * models.length)]}`;
        const color = `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, '0')}`;
        return api.createCar({ name, color }).catch(() => null);
      });
      await Promise.all(batch);
    }
    const state = getState() as { garage: GarageState };
    dispatch(fetchCars(state.garage.currentPage));
  }
);

export const saveWinnerThunk = createAsyncThunk(
  'garage/saveWinner',
  async ({ id, time }: { id: number; time: number }, { dispatch, getState }) => {
    const state = getState() as { garage: GarageState };
    const currentCars = state.garage.cars;
    const thisCar = currentCars.find((c) => c.id === id);

    if (state.garage.winnerName !== thisCar?.name) {
      return;
    }
    const allWinners = await api.getAllWinnersRaw();
    const existingWinner = allWinners.find((w) => w.id === id);

    if (existingWinner) {
      await api.updateWinner(id, {
        wins: existingWinner.wins + 1,
        time: Number(Math.min(existingWinner.time, time).toFixed(2)),
      });
    } else {
      await api.createWinner({ id, wins: 1, time });
    }
    dispatch(fetchWinnersThunk());
  }
);

const garageSlice = createSlice({
  name: 'garage',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    selectCar: (state, action: PayloadAction<Car | null>) => {
      state.selectedCar = action.payload;
    },
    startRace: (state) => {
      state.raceStatus = 'racing';
      state.winnerName = null;
      state.winnerTime = null;
    },
    resetRace: (state) => {
      state.raceStatus = 'ready';
      state.winnerName = null;
      state.winnerTime = null;
    },
    setRaceWinner(state, action: PayloadAction<{ id: number; name: string; time: number }>) {
      if (!state.winnerName && state.raceStatus === 'racing') {
        state.winnerName = action.payload.name;
        state.winnerTime = action.payload.time;
        state.raceStatus = 'finished';
      }
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
        state.cars = action.payload.items;
        state.totalCount = action.payload.count;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cars';
      });
  },
});

export const { setPage, selectCar, startRace, resetRace, setRaceWinner } = garageSlice.actions;

export const handleCarFinishThunk = createAsyncThunk(
  'garage/handleCarFinish',
  async (
    { id, name, time }: { id: number; name: string; time: number },
    { dispatch, getState }
  ) => {
    const state = getState() as { garage: GarageState };
    if (!state.garage.winnerName && state.garage.raceStatus === 'racing') {
      dispatch(setRaceWinner({ id, name, time }));
      const allWinners = await api.getAllWinnersRaw();
      const existingWinner = allWinners.find((w: { id: number }) => w.id === id);

      if (existingWinner) {
        const updatedWins = existingWinner.wins + 1;
        const updatedTime = Number(Math.min(existingWinner.time, time).toFixed(2));

        await api.updateWinner(id, {
          wins: updatedWins,
          time: updatedTime,
        });
      } else {
        await api.createWinner({
          id,
          wins: 1,
          time,
        });
      }
      dispatch(fetchWinnersThunk());
    }
  }
);

export default garageSlice.reducer;