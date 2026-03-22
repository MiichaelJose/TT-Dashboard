import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './slices/authSlice';
import filtersReducer from './slices/filtersSlice';
import { tomTicketApi } from './slices/tomTicketApi';

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      filters: filtersReducer,
      [tomTicketApi.reducerPath]: tomTicketApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(tomTicketApi.middleware),
  });
  
  // enable listener behavior for the store (for refetchOnFocus/refetchOnReconnect)
  setupListeners(store.dispatch);

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
