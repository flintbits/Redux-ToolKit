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
    getTransaction: builder.query({
      query: (id) => `/transactions/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (transaction) => (
        transaction ? [{ type: 'Transaction', id: transaction.id }] : []
      ),
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
      async onQueryStarted(
        { id, changes, queryArgs, updateStrategy = 'optimistic' },
        { dispatch, queryFulfilled },
      ) {
        const updateCachedTransaction = (transaction) => {
          dispatch(
            transactionsApi.util.updateQueryData(
              'getTransactions',
              queryArgs,
              (draft) => {
                const cachedTransaction = draft.find((item) => item.id === id);
                if (cachedTransaction) Object.assign(cachedTransaction, transaction);
              },
            ),
          );
        };

        if (updateStrategy === 'pessimistic') {
          try {
            const { data: updatedTransaction } = await queryFulfilled;
            updateCachedTransaction(updatedTransaction);
          } catch {
            // The mutation caller reports the error; no cache patch was applied.
          }
          return;
        }

        const patchResult = dispatch(
          transactionsApi.util.updateQueryData(
            'getTransactions',
            queryArgs,
            (draft) => {
              const cachedTransaction = draft.find((item) => item.id === id);
              if (cachedTransaction) Object.assign(cachedTransaction, changes);
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
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
  useGetTransactionQuery,
  useGetSummaryQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useResetSeedTransactionsMutation,
} = transactionsApi;
