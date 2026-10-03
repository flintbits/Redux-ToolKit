import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const CATEGORIES = [
  'All',
  'Salary',
  'Freelance',
  'Groceries',
  'Dining',
  'Housing',
  'Utilities',
  'Shopping',
  'Entertainment',
  'Transfer',
  'Gift',
  'Health',
  'Other'
];

export default function FilterBar({
  filters,
  onFilterChange,
  onResetFilters
}) {
  const isFiltered = filters.search || filters.type !== 'all' || filters.category !== 'all' || filters.status !== 'all';

  return (
    <div className="controls-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Search Input */}
        <div className="search-input-wrap">
          <FiSearch className="search-icon-inside" />
          <input
            type="text"
            className="swiss-input"
            placeholder="Search ledger by title, payee, or memo..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>

        {/* Sort and Clear */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <select
            className="swiss-select"
            value={`${filters.sortBy}-${filters.order}`}
            onChange={(e) => {
              const [sortBy, order] = e.target.value.split('-');
              onFilterChange('sortBy', sortBy);
              onFilterChange('order', order);
            }}
          >
            <option value="date-desc">Chronological (Newest)</option>
            <option value="date-asc">Chronological (Oldest)</option>
            <option value="amount-desc">Value (High → Low)</option>
            <option value="amount-asc">Value (Low → High)</option>
          </select>

          {isFiltered && (
            <button
              type="button"
              className="btn-swiss-secondary"
              style={{ padding: '0.55rem 0.75rem', fontSize: '0.775rem' }}
              onClick={onResetFilters}
            >
              <FiX /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Filter Row with Swiss Pills */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid var(--border-hairline)' }}>
        <div className="filter-pills-row">
          {[
            { key: 'all', label: 'All Entries' },
            { key: 'expense', label: 'Debits' },
            { key: 'income', label: 'Inflows' },
            { key: 'transfer', label: 'Transfers' },
          ].map((typeItem) => (
            <button
              key={typeItem.key}
              type="button"
              className={`swiss-pill ${filters.type === typeItem.key ? 'active' : ''}`}
              onClick={() => onFilterChange('type', typeItem.key)}
            >
              {typeItem.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <select
            className="swiss-select"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="all">All States</option>
            <option value="completed">Settled Only</option>
            <option value="pending">Holds Only</option>
            <option value="flagged">Flagged Only</option>
          </select>

          <select
            className="swiss-select"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat === 'All' ? 'all' : cat}>
                {cat === 'All' ? 'All Sectors' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
