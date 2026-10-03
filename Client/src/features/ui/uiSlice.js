import { createSlice } from '@reduxjs/toolkit';

export const DEFAULT_FILTERS = {
  search: '',
  type: 'all',
  category: 'all',
  status: 'all',
  sortBy: 'date',
  order: 'desc',
};

const initialState = {
  filters: { ...DEFAULT_FILTERS },
  toasts: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setFilter(state, action) {
      const { key, value } = action.payload;
      if (Object.hasOwn(DEFAULT_FILTERS, key)) {
        state.filters[key] = value;
      }
    },
    resetFilters(state) {
      state.filters = { ...DEFAULT_FILTERS };
    },
    addToast(state, action) {
      state.toasts.push(action.payload);
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
  },
});

export const { addToast, removeToast, resetFilters, setFilter } = uiSlice.actions;
export const selectFilters = (state) => state.ui.filters;
export const selectToasts = (state) => state.ui.toasts;

export default uiSlice.reducer;
