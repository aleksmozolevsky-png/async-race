import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '../api/api';
import type { Winner, Car } from '../types';

export interface WinnerWithCar extends Winner {
  car: Car;
}

interface WinnersState {
  winners: WinnerWithCar[];
  totalCount: number;
  currentPage: number;
  sort: 'id' | 'wins' | 'time';
  order: 'ASC' | 'DESC';
  loading: boolean;
  error: string | null;
}

const initialState: WinnersState = {
  winners: [],
  totalCount: 0,
  currentPage: 1,
  sort: 'id',
  order: 'ASC',
  loading: false,
  error: null,
};

export const fetchWinnersThunk = createAsyncThunk(
  'winners/fetchWinners',
  async (_, { getState }) => {
    const { winners: state } = getState() as { winners: WinnersState };
    const data = await api.getWinners({
      page: state.currentPage,
      sort: state.sort,
      order: state.order,
    });

    const extendedWinners = await Promise.all(
      data.winners.map(async (winner) => {
        const car = await api
          .getCar(winner.id)
          .catch(() => ({ id: winner.id, name: 'Unknown Car', color: '#000000' }));
        return { ...winner, car };
      })
    );

    return { winners: extendedWinners, totalCount: data.totalCount };
  }
);

export const saveWinnerThunk = createAsyncThunk(
  'winners/saveWinner',
  async ({ id, time }: { id: number; time: number }, { dispatch }) => {
    try {
      const existingWinner = await api.getWinner(id);
      const updatedWins = existingWinner.wins + 1;
      const updatedTime = Number(Math.min(existingWinner.time, time).toFixed(2));

      await api.updateWinner(id, { wins: updatedWins, time: updatedTime });
    } catch {
      await api.createWinner({ id, wins: 1, time });
    }
    dispatch(fetchWinnersThunk());
  }
);

const winnersSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {
    setWinnersPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSorting: (state, action: PayloadAction<'wins' | 'time'>) => {
      if (state.sort === action.payload) {
        state.order = state.order === 'ASC' ? 'DESC' : 'ASC';
      } else {
        state.sort = action.payload;
        state.order = 'ASC';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWinnersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWinnersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.winners = action.payload.winners;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchWinnersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load winners';
      });
  },
});

export const { setWinnersPage, setSorting } = winnersSlice.actions;
export default winnersSlice.reducer;
