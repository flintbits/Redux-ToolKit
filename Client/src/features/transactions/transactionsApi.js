import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const invalidateTransactionData = (result, error) => (
  error
    ? []
    : [{ type: 'Transaction', id: 'LIST' }, 'Summary']
);

export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Transaction', 'Summary'],
  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: (filters = {}) => ({
        url: '/transactions',
        params: Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value && value !== 'all'),
        ),
      }),
      transformResponse: (response) => response.data,
      providesTags: (transactions = []) => [
        ...transactions.map(({ id }) => ({ type: 'Transaction', id })),
        { type: 'Transaction', id: 'LIST' },
      ],
    }),
    getSummary: builder.query({
      query: () => '/transactions/summary',
      transformResponse: (response) => response.data,
      providesTags: ['Summary'],
    }),
    createTransaction: builder.mutation({
      query: (transaction) => ({
        url: '/transactions',
        method: 'POST',
        body: transaction,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: invalidateTransactionData,
    }),
    updateTransaction: builder.mutation({
      query: ({ id, changes }) => ({
        url: `/transactions/${id}`,
        method: 'PUT',
        body: changes,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { id }) => (
        error
          ? []
          : [
            { type: 'Transaction', id },
            { type: 'Transaction', id: 'LIST' },
            'Summary',
          ]
      ),
    }),
    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, id) => (
        error
          ? []
          : [
            { type: 'Transaction', id },
            { type: 'Transaction', id: 'LIST' },
            'Summary',
          ]
      ),
    }),
    resetSeedTransactions: builder.mutation({
      query: () => ({
        url: '/transactions/seed',
        method: 'POST',
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: invalidateTransactionData,
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetSummaryQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useResetSeedTransactionsMutation,
} = transactionsApi;
