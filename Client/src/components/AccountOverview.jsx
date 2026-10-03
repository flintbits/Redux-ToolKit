import React from 'react';
import {
  FiArrowDownLeft,
  FiArrowUpRight,
  FiRepeat,
  FiAlertTriangle,
  FiClock,
  FiChevronRight
} from 'react-icons/fi';

export default function AccountOverview({ summary, onFilterStatus }) {
  if (!summary) return null;

  const {
    currentBalance = 0,
    totalIncome = 0,
    totalExpense = 0,
    netSavings = 0,
    pendingCount = 0,
    flaggedCount = 0,
    accountHolder = 'Alex Rivera',
    accountNumber = '•••• 5821',
    accountType = 'Premier Checking'
  } = summary;

  const fmt = (val) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(val);

  return (
    <div>
      {/* Swiss Alerts System */}
      {(flaggedCount > 0 || pendingCount > 0) && (
        <div className="swiss-alerts">
          {flaggedCount > 0 && (
            <div className="swiss-alert-bar flagged">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <FiAlertTriangle style={{ color: 'var(--swiss-red)', fontSize: '1.1rem' }} />
                <span>
                  <strong>Security Flag:</strong> {flaggedCount} irregular charge(s) detected. Cardholder review required.
                </span>
              </div>
              <button
                type="button"
                className="btn-swiss-secondary"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                onClick={() => onFilterStatus('flagged')}
              >
                Inspect Flags <FiChevronRight />
              </button>
            </div>
          )}

          {pendingCount > 0 && (
            <div className="swiss-alert-bar pending">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <FiClock style={{ color: 'var(--color-pending)', fontSize: '1.1rem' }} />
                <span>
                  <strong>Clearing Queue:</strong> {pendingCount} transaction(s) pending interbank settlement.
                </span>
              </div>
              <button
                type="button"
                className="btn-swiss-secondary"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                onClick={() => onFilterStatus('pending')}
              >
                View Pending <FiChevronRight />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Swiss Metrics Grid */}
      <div className="overview-grid">
        {/* Main Bank Card */}
        <div className="swiss-account-card">
          <div className="swiss-card-meta">
            <span className="swiss-label">{accountType}</span>
            <span className="mono-num" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              CH-93 0070
            </span>
          </div>

          <div className="swiss-balance-display">
            <div className="swiss-label" style={{ marginBottom: '0.35rem' }}>Available Balance</div>
            <div className="swiss-balance-val mono-num">{fmt(currentBalance)}</div>
          </div>

          <div className="swiss-card-footer">
            <span style={{ fontWeight: 600 }}>{accountHolder}</span>
            <span className="mono-num" style={{ letterSpacing: '0.05em' }}>{accountNumber}</span>
          </div>
        </div>

        {/* Settled Income */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="swiss-label">Inflow (Income)</span>
            <div className="metric-icon-wrap" style={{ color: 'var(--color-income)' }}>
              <FiArrowDownLeft />
            </div>
          </div>
          <div>
            <div className="metric-val mono-num" style={{ color: 'var(--color-income)' }}>
              +{fmt(totalIncome)}
            </div>
            <div className="metric-sub">Payroll & credits cleared</div>
          </div>
        </div>

        {/* Spending / Debits */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="swiss-label">Outflow (Debits)</span>
            <div className="metric-icon-wrap" style={{ color: 'var(--text-black)' }}>
              <FiArrowUpRight />
            </div>
          </div>
          <div>
            <div className="metric-val mono-num" style={{ color: 'var(--text-black)' }}>
              -{fmt(totalExpense)}
            </div>
            <div className="metric-sub">Purchases & debits</div>
          </div>
        </div>

        {/* Net Flow */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="swiss-label">Net Liquidity</span>
            <div className="metric-icon-wrap" style={{ color: 'var(--color-transfer)' }}>
              <FiRepeat />
            </div>
          </div>
          <div>
            <div
              className="metric-val mono-num"
              style={{ color: netSavings >= 0 ? 'var(--text-black)' : 'var(--swiss-red)' }}
            >
              {fmt(netSavings)}
            </div>
            <div className="metric-sub">Settled net differential</div>
          </div>
        </div>
      </div>
    </div>
  );
}
