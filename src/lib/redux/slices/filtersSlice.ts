import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FiltersState {
  dateRange: {
    start: string | null;
    end: string | null;
  };
  selectedOperatorId: string | null;
  status: 'all' | 'open' | 'resolved' | 'pending';
}

const initialState: FiltersState = {
  dateRange: { start: null, end: null },
  selectedOperatorId: null,
  status: 'all',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<{start: string | null, end: string | null}>) => {
      state.dateRange = action.payload;
    },
    setSelectedOperator: (state, action: PayloadAction<string | null>) => {
      state.selectedOperatorId = action.payload;
    },
    setStatus: (state, action: PayloadAction<FiltersState['status']>) => {
      state.status = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const { setDateRange, setSelectedOperator, setStatus, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
