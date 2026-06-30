import { configureStore } from '@reduxjs/toolkit';
import garageReducer from './garageSlice';
import winnersReducer from './winnersSlice';

export const store = configureStore({
  reducer: {
    garage: garageReducer,
    winners: winnersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
