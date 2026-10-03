# 🏦 Apex Bank - Single User Transaction CRUD System

A full-stack banking transaction manager featuring **Full CRUD** (Create, Read, Update, Delete) and rich **User Behavior Simulation**. Built with **React** (frontend), **Redux Toolkit + RTK Query** for server-state fetching and caching, and **Node.js Express** (backend).

---

## 🚀 Quick Start Guide

Both servers are currently configured and can be run with:

### 1. Start the Backend Server (Port 5000)
```bash
cd Server
node index.js
# Or with auto-reload:
npm run dev
```

### 2. Start the Frontend Client (Port 5173)
```bash
cd Client
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🌟 Key Features & User Behaviors

### 1. Single User Context
- **Account Holder:** Alex Rivera
- **Account:** Premier Checking (`•••• 5821`)
- **Real-Time Balance Calculation:** Available balance updates dynamically whenever income, expenses, or transfers are recorded or edited.

### 2. Variety of User Behaviors Simulated
The application provides **1-Click Behavior Simulation buttons** and seed data illustrating real-world banking patterns:
- ☕ **Habitual Small Debits:** Daily morning espresso ($4.85)
- 🛒 **Essential Groceries:** Supermarket grocery runs ($94.20)
- 💼 **Freelance Payouts:** Secondary side-hustle consulting checks (+$550.00)
- 🏠 **Recurring Housing & Utilities:** Monthly rent ($1,450.00) & power bills ($86.40)
- 🔄 **P2P Transfers:** Venmo/Zelle dinner splits (-$42.00) and internal savings deposits (-$600.00)
- ⏳ **Pending Holds:** Mobile check deposits awaiting bank clearance (+$320.00 hold)
- ⚠️ **Fraud / Security Alerts:** Unusual overseas card swipes ($650.00 flagged for cardholder review)
- 📊 **Spending Breakdown by Category:** Visual percentage bars analyzing where money is going.

### 3. Full CRUD Capabilities
| Action | HTTP Method | Route | Description |
|---|---|---|---|
| **Create** | `POST` | `/api/transactions` | Add custom transactions via the modal or quick behavior presets |
| **Read** | `GET` | `/api/transactions` | Retrieve all transactions with search, filter, and sorting |
| **Read Detail** | `GET` | `/api/transactions/:id` | Retrieve one transaction for the prefetched details view |
| **Read Summary**| `GET` | `/api/transactions/summary`| Calculate balance, total income, expenses, holds, and alerts |
| **Update** | `PUT` | `/api/transactions/:id` | Edit any details, settle pending holds, or resolve fraud flags |
| **Delete** | `DELETE`| `/api/transactions/:id` | Remove entries with in-app confirmation and recalculate ledger |
| **Reset / Seed**| `POST` | `/api/transactions/seed` | Reset back to initial diverse demo data at any time |

---

## 📁 Project Architecture

```
Redux ToolKit/
├── Server/
│   ├── index.js             # Express REST API, in-memory store, validation, seed data
│   └── package.json         # express, cors
└── Client/
    ├── vite.config.js       # Proxy configured for `/api` -> `http://localhost:5000`
    └── src/
        ├── components/
        │   ├── Navbar.jsx            # Header, user badge, and reset trigger
        │   ├── AccountOverview.jsx   # Card, balance, income/expense cards, alerts
        │   ├── CategoryInsights.jsx  # Spending category breakdown bars
        │   ├── BehaviorShortcuts.jsx # 1-click behavior simulation pills
        │   ├── FilterBar.jsx         # Search, type pills, status, category, sorting
        │   ├── TransactionList.jsx   # Activity ledger with status & action buttons
        │   ├── TransactionModal.jsx  # Create / Edit modal with form validation
        │   └── Toast.jsx             # Non-intrusive feedback toast notifications
        ├── app/
        │   └── store.js              # configureStore and RTK Query middleware
        ├── features/
        │   ├── transactions/
        │   │   └── transactionsApi.js # RTK Query endpoints, cache tags, CRUD hooks
        │   └── ui/
        │       └── uiSlice.js        # Redux slice for filters and toast state
        ├── hooks/
        │   └── useDebouncedValue.js  # Debounces search before querying
        ├── App.jsx          # Main state coordination and data flow
        ├── index.css        # Clean, modern fintech styling system
        └── main.jsx         # Application entry point and Redux Provider
```

## 🎓 Learning Redux Toolkit and RTK Query

The client uses Redux Toolkit (`@reduxjs/toolkit`) for both app state and server state. RTK Query is Redux Toolkit's data-fetching and caching library—there is no separate "Redux Query" package.

### How the pieces fit together

1. `src/app/store.js` calls `configureStore`, registers the UI slice and RTK Query reducer, and adds RTK Query's middleware. `setupListeners` enables focus/reconnect refetch behavior.
2. `src/features/transactions/transactionsApi.js` defines the API with `createApi` and `fetchBaseQuery`. Each `builder.query` reads server data; each `builder.mutation` changes it. The generated React hooks are used directly by `App.jsx`.
3. `providesTags` labels cached transaction lists and the summary. A successful create, update, delete, or reset `invalidatesTags`; RTK Query then refetches active queries instead of requiring manual `loadData()` calls.
4. `src/features/ui/uiSlice.js` uses `createSlice` for client-only state (filters and notifications). It deliberately does not duplicate transactions or account data in another reducer.
5. `App.jsx` uses `useSelector`/`useDispatch` for UI state and generated RTK Query hooks for remote state. Calling `.unwrap()` on mutation triggers gives normal `try`/`catch` error handling.
6. Search is debounced before it becomes a query argument, preventing one HTTP request per keystroke while RTK Query caches results by the full filter argument.

### Follow the CRUD flow

- Read and filter: `useGetTransactionsQuery(filters)` → `GET /api/transactions`
- Read account metrics: `useGetSummaryQuery()` → `GET /api/transactions/summary`
- Create: `useCreateTransactionMutation()` → `POST /api/transactions`
- Update/status change: `useUpdateTransactionMutation()` → `PUT /api/transactions/:id`
- Delete: `useDeleteTransactionMutation()` → `DELETE /api/transactions/:id`
- Reset demo data: `useResetSeedTransactionsMutation()` → `POST /api/transactions/seed`

Read `Client/src/features/transactions/transactionsApi.js` alongside the `use*Query` and `use*Mutation` calls in `Client/src/App.jsx` to see the request-to-cache-to-UI lifecycle.

## RTK Query Concepts Demonstrated

### Queries

`useGetTransactionsQuery(transactionFilters)` subscribes the component to the `getTransactions` endpoint and fetches matching transactions. RTK Query provides the cached result and loading/error state to the UI.

### Cache

RTK Query stores results by endpoint and serialized query arguments. For example, `getTransactions` with a search term and `getTransactions` with a status filter are distinct cache entries. Components using the same endpoint and arguments can share the cached result.

### Tags

- `providesTags` associates cached data with tags, including individual transaction IDs and the transaction-list tag.
- `invalidatesTags` marks matching cached data stale after successful mutations. Active queries that provided those tags refetch automatically.

### Normal mutation flow

```text
Mutation
   ↓
invalidateTags
   ↓
active query refetches
   ↓
updated UI
```

### Optimistic update

Editing a transaction applies its changes to the current filtered `getTransactions` cache entry using `updateQueryData` before awaiting the request. On failure, the patch is undone and the mutation caller displays an error toast.

```text
Mutation
   ↓
updateQueryData
   ↓
UI updates immediately
   ↓
API succeeds → keep
API fails → rollback
```

### Pessimistic update

Quick status changes use the same update mutation but wait for `queryFulfilled` before applying the server-confirmed transaction to the current list cache.

```text
Mutation
   ↓
wait for server
   ↓
updateQueryData
   ↓
UI updates
```

### Prefetching

Hovering over or focusing a transaction in the list dispatches `transactionsApi.util.prefetch` for `getTransaction`, with `ifOlderThan: 60`. Opening the transaction details subscribes with `useGetTransactionQuery`; fresh prefetched data can be displayed immediately, and fresh cached data is not unnecessarily requested again.

```text
User intent detected
   ↓
prefetch()
   ↓
cache populated
   ↓
actual query can reuse cached data
```
