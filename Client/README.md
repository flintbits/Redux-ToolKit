# Kontor Client

React client for the transaction dashboard. The backend runs on port `5000`; Vite proxies `/api` requests to it while the development client runs on port `5173`.

```powershell
npm install
npm run dev
```

## Redux data flow

- `src/app/store.js` configures Redux Toolkit's store, registers the RTK Query reducer and middleware, and enables browser-focus/network-reconnect listeners.
- `src/features/transactions/transactionsApi.js` owns HTTP requests and server-state caching. RTK Query generates the `useGet*Query` and `use*Mutation` hooks used in the UI.
- Mutations invalidate transaction-list and summary tags. Active queries refetch automatically, so components do not maintain duplicate copies of server data or manually reload after writes.
- `src/features/ui/uiSlice.js` owns client-only state: filters and toast notifications. `useSelector` reads that state, and `useDispatch` sends slice actions.
- Search uses `src/hooks/useDebouncedValue.js` to avoid issuing a request for each typed character.

Start with the API endpoints and their `providesTags`/`invalidatesTags` in `src/features/transactions/transactionsApi.js`, then follow their generated hooks in `src/App.jsx`.

## Commands

```powershell
npm run lint
npm run build
```
