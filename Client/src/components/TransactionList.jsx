import {
  FiDollarSign,
  FiBriefcase,
  FiShoppingBag,
  FiCoffee,
  FiHome,
  FiZap,
  FiTag,
  FiFilm,
  FiRepeat,
  FiGift,
  FiActivity,
  FiFileText,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiCheckCircle
} from 'react-icons/fi';

// Category icon mapping using react-icons
const CATEGORY_ICONS = {
  Salary: <FiDollarSign />,
  Freelance: <FiBriefcase />,
  Groceries: <FiShoppingBag />,
  Dining: <FiCoffee />,
  Housing: <FiHome />,
  Utilities: <FiZap />,
  Shopping: <FiTag />,
  Entertainment: <FiFilm />,
  Transfer: <FiRepeat />,
  Gift: <FiGift />,
  Health: <FiActivity />,
  Other: <FiFileText />
};

export default function TransactionList({
  transactions,
  isLoading,
  error,
  onRetry,
  onEdit,
  onView,
  onPrefetch,
  onDelete,
  onQuickStatusChange
}) {
  if (isLoading) {
    return (
      <div className="ledger-card">
        <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p className="swiss-label">Synchronizing Bank Records...</p>
        </div>
      </div>
    );
  }

  if (error && (!transactions || transactions.length === 0)) {
    return (
      <div className="ledger-card" role="alert">
        <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p className="swiss-label" style={{ marginBottom: '0.75rem', color: 'var(--swiss-red)' }}>
            Could Not Load Bank Records
          </p>
          <p style={{ fontSize: '0.825rem', marginBottom: '1rem' }}>{error}</p>
          <button type="button" className="btn-swiss-secondary" onClick={onRetry}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="ledger-card">
        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div className="swiss-label" style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-black)' }}>
            No Matching Records Found
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Adjust your search query or create a new journal entry.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ledger-card">
      <div className="ledger-header">
        <span className="swiss-label" style={{ color: 'var(--text-black)' }}>Journal Entries</span>
        <span className="mono-num" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          {transactions.length} record{transactions.length === 1 ? '' : 's'} registered
        </span>
      </div>
      <div className="rtk-concepts-note">
        RTK Query demo: cache invalidation · optimistic + pessimistic updates · detail prefetch
      </div>

      <div>
        {transactions.map((t) => {
          const icon = CATEGORY_ICONS[t.category] || <FiFileText />;
          const formattedDate = new Date(t.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });

          const formattedAmount = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
          }).format(t.amount);

          return (
            <div
              key={t.id}
              className="ledger-row"
              onMouseEnter={() => onPrefetch(t.id)}
              onFocus={() => onPrefetch(t.id)}
            >
              {/* Left Column: Icon and Info */}
              <div className="ledger-left">
                <div className="ledger-icon-box" title={t.category}>
                  {icon}
                </div>

                <div className="ledger-info">
                  <div className="ledger-title-line">
                    <button
                      type="button"
                      className="ledger-title ledger-title-button"
                      onClick={() => onView(t)}
                    >
                      {t.title}
                    </button>
                    <span className={`badge-tag ${t.status}`}>
                      {t.status === 'completed' && 'Settled'}
                      {t.status === 'pending' && 'Hold'}
                      {t.status === 'flagged' && 'Flagged'}
                    </span>
                  </div>

                  <div className="ledger-sub-line">
                    <span className="mono-num">{formattedDate}</span>
                    <span>·</span>
                    <span>{t.recipient || t.category}</span>
                    <span>·</span>
                    <span>{t.paymentMethod}</span>
                  </div>

                  {t.notes && (
                    <div className="ledger-notes">
                      Memo: {t.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Amount & Action Buttons */}
              <div className="ledger-right">
                <div className="ledger-amount-block">
                  <div
                    className={`ledger-amount mono-num ${
                      t.type === 'income'
                        ? 'amount-pos'
                        : t.type === 'expense'
                        ? 'amount-neg'
                        : 'amount-transfer'
                    }`}
                  >
                    {t.type === 'income' ? `+${formattedAmount}` : t.type === 'expense' ? `-${formattedAmount}` : formattedAmount}
                  </div>
                  <div className="swiss-label" style={{ fontSize: '0.65rem' }}>
                    {t.type}
                  </div>
                </div>

                <div className="ledger-actions">
                  {/* Quick Status Resolve Buttons */}
                  {t.status === 'flagged' && (
                    <button
                      type="button"
                      className="btn-swiss-secondary"
                      style={{ padding: '0.3rem 0.55rem', fontSize: '0.725rem' }}
                      title="Clear flag and settle"
                      onClick={() => onQuickStatusChange(t.id, 'completed')}
                    >
                      <FiCheck /> Resolve
                    </button>
                  )}
                  {t.status === 'pending' && (
                    <button
                      type="button"
                      className="btn-swiss-secondary"
                      style={{ padding: '0.3rem 0.55rem', fontSize: '0.725rem' }}
                      title="Clear hold and settle"
                      onClick={() => onQuickStatusChange(t.id, 'completed')}
                    >
                      <FiCheckCircle /> Clear
                    </button>
                  )}

                  {/* Edit Button */}
                  <button
                    type="button"
                    className="btn-icon-minimal"
                    title="Edit entry"
                    onClick={() => onEdit(t)}
                  >
                    <FiEdit2 />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    className="btn-icon-minimal delete"
                    title="Delete entry"
                    onClick={() => onDelete(t.id, t.title)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
