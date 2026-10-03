import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiTrash2, FiX } from 'react-icons/fi';
import AccountOverview from './components/AccountOverview';
import BehaviorShortcuts from './components/BehaviorShortcuts';
import CategoryInsights from './components/CategoryInsights';
import FilterBar from './components/FilterBar';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import TransactionList from './components/TransactionList';
import TransactionModal from './components/TransactionModal';
import {
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useGetSummaryQuery,
  useGetTransactionsQuery,
  useResetSeedTransactionsMutation,
  useUpdateTransactionMutation,
} from './features/transactions/transactionsApi';
import {
  addToast,
  removeToast,
  resetFilters,
  selectFilters,
  selectToasts,
  setFilter,
} from './features/ui/uiSlice';
import { useDebouncedValue } from './hooks/useDebouncedValue';
import { getApiErrorMessage } from './utils/apiError';

export default function App() {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const toasts = useSelector(selectToasts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const debouncedSearch = useDebouncedValue(filters.search, 300);

  const transactionFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch],
  );
  const {
    data: transactions = [],
    error: transactionsError,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
  } = useGetTransactionsQuery(transactionFilters, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const {
    data: summary = null,
    error: summaryError,
    refetch: refetchSummary,
  } = useGetSummaryQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [createTransaction, { isLoading: isCreating }] = useCreateTransactionMutation();
  const [updateTransaction, { isLoading: isUpdating }] = useUpdateTransactionMutation();
  const [deleteTransaction, { isLoading: isDeleting }] = useDeleteTransactionMutation();
  const [resetSeedTransactions, { isLoading: isResetting }] =
    useResetSeedTransactionsMutation();
  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    if (!resetSuccess) return undefined;
    const timeoutId = window.setTimeout(() => setResetSuccess(false), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [resetSuccess]);

  const notify = (message, type = 'info') => {
    dispatch(addToast({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      message,
      type,
    }));
  };

  const dismissToast = useCallback(
    (id) => dispatch(removeToast(id)),
    [dispatch],
  );

  const handleFilterChange = (key, value) => {
    dispatch(setFilter({ key, value }));
  };

  const handleOpenCreateModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleSubmitTransaction = async (formData) => {
    try {
      if (editingTransaction) {
        await updateTransaction({ id: editingTransaction.id, changes: formData }).unwrap();
        notify(`Updated "${formData.title}" successfully`, 'success');
      } else {
        await createTransaction(formData).unwrap();
        notify(`Recorded "${formData.title}" ($${formData.amount})`, 'success');
      }
      setIsModalOpen(false);
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to save transaction'), 'error');
    }
  };

  const handlePromptDelete = (id, title) => {
    setDeletingTransaction({ id, title });
  };

  const handleConfirmDelete = async () => {
    if (!deletingTransaction) return;
    try {
      await deleteTransaction(deletingTransaction.id).unwrap();
      notify(`Transaction "${deletingTransaction.title}" deleted`, 'info');
      setDeletingTransaction(null);
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to delete transaction'), 'error');
    }
  };

  const handleQuickStatusChange = async (id, status) => {
    try {
      await updateTransaction({ id, changes: { status } }).unwrap();
      notify(`Marked transaction as ${status}`, 'success');
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to update transaction status'), 'error');
    }
  };

  const handleTriggerBehavior = async (presetData) => {
    try {
      await createTransaction(presetData).unwrap();
      notify(`Simulated: ${presetData.title} ($${presetData.amount})`, 'success');
    } catch (error) {
      notify(getApiErrorMessage(error, 'Simulation failed'), 'error');
    }
  };

  const handleResetData = async () => {
    setResetSuccess(false);
    try {
      await resetSeedTransactions().unwrap();
      dispatch(resetFilters());
      setResetSuccess(true);
      notify('Restored default demo records (11 seed transactions, balance: $7,709.77)', 'success');
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to reset demo data'), 'error');
    }
  };

  return (
    <div className="app-container">
      <Navbar
        onOpenNewModal={handleOpenCreateModal}
        onResetData={handleResetData}
        isResetting={isResetting}
        resetSuccess={resetSuccess}
      />

      {summaryError && (
        <div className="data-error-banner" role="alert">
          <span>Account summary unavailable: {getApiErrorMessage(summaryError)}</span>
          <button type="button" className="btn-swiss-secondary" onClick={refetchSummary}>
            Retry
          </button>
        </div>
      )}

      <AccountOverview
        summary={summary}
        onFilterStatus={(status) => handleFilterChange('status', status)}
      />
      <CategoryInsights summary={summary} />
      <BehaviorShortcuts onTriggerBehavior={handleTriggerBehavior} isAdding={isCreating} />
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={() => dispatch(resetFilters())}
      />

      {transactionsError && transactions.length > 0 && (
        <div className="data-error-banner" role="alert">
          <span>Could not refresh transactions: {getApiErrorMessage(transactionsError)}</span>
          <button type="button" className="btn-swiss-secondary" onClick={refetchTransactions}>
            Retry
          </button>
        </div>
      )}
      <TransactionList
        transactions={transactions}
        isLoading={isLoadingTransactions}
        error={transactionsError && transactions.length === 0
          ? getApiErrorMessage(transactionsError)
          : null}
        onRetry={refetchTransactions}
        onEdit={handleOpenEditModal}
        onDelete={handlePromptDelete}
        onQuickStatusChange={handleQuickStatusChange}
      />

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitTransaction}
        initialData={editingTransaction}
        isSaving={isSaving}
      />

      {deletingTransaction && (
        <div
          className="modal-backdrop"
          onClick={() => !isDeleting && setDeletingTransaction(null)}
        >
          <div
            className="swiss-modal"
            style={{ maxWidth: '440px' }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header-line">
              <div>
                <div className="swiss-label" style={{ color: 'var(--swiss-red)' }}>
                  Destructive Action
                </div>
                <h3>Delete Transaction Record</h3>
              </div>
              <button
                type="button"
                className="btn-icon-minimal"
                onClick={() => setDeletingTransaction(null)}
                disabled={isDeleting}
                aria-label="Close delete confirmation"
              >
                <FiX />
              </button>
            </div>
            <div className="modal-form-body">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Are you sure you want to permanently remove this record from the journal:
              </p>
              <div style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-hairline)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-xs)',
                fontWeight: 600,
                color: 'var(--text-black)',
                fontSize: '0.9rem',
              }}>
                {deletingTransaction.title}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                Account balance and cash flow will be recalculated automatically upon deletion.
              </p>
            </div>
            <div className="modal-footer-line">
              <button
                type="button"
                className="btn-swiss-secondary"
                onClick={() => setDeletingTransaction(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-swiss-primary"
                style={{ background: 'var(--swiss-red)', borderColor: 'var(--swiss-red)' }}
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                <FiTrash2 /> {isDeleting ? 'Deleting...' : 'Confirm Deletion'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
