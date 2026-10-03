import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { transactionsApi } from '../features/transactions/transactionsApi';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(transactionsApi.middleware),
});

// Enables refetchOnFocus and refetchOnReconnect for RTK Query subscriptions.
setupListeners(store.dispatch);
