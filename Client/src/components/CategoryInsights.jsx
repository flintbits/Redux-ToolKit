import React from 'react';
import { FiPieChart } from 'react-icons/fi';

export default function CategoryInsights({ summary }) {
  if (!summary || !summary.categoryBreakdown) return null;

  const breakdown = summary.categoryBreakdown;
  const categories = Object.keys(breakdown);
  const total = summary.totalExpense || 1;

  if (categories.length === 0) return null;

  const sortedCategories = categories
    .map(name => ({
      name,
      amount: breakdown[name],
      percentage: Math.round((breakdown[name] / total) * 100)
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="insights-card">
      <div className="insights-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <FiPieChart style={{ color: 'var(--text-secondary)' }} />
          <span className="swiss-label" style={{ color: 'var(--text-black)', fontSize: '0.75rem' }}>
            Capital Allocation by Category
          </span>
        </div>
        <span className="mono-num" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Gross Debits: <strong>${summary.totalExpense.toLocaleString()}</strong>
        </span>
      </div>

      <div className="insights-grid">
        {sortedCategories.map(cat => (
          <div key={cat.name} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-black)' }}>{cat.name}</span>
              <span className="mono-num" style={{ color: 'var(--text-secondary)' }}>
                ${cat.amount.toFixed(2)} · {cat.percentage}%
              </span>
            </div>
            <div className="insight-track">
              <div
                className="insight-bar"
                style={{ width: `${cat.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
