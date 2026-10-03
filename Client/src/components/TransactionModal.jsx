import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const CATEGORIES = [
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

const PAYMENT_METHODS = [
  'Debit Card',
  'Direct Deposit',
  'ACH Transfer',
  'Wire',
  'Mobile Check Deposit',
  'Cash'
];

export default function TransactionModal({ isOpen, onClose, onSubmit, initialData = null, isSaving }) {
  const isEdit = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Dining',
    recipient: '',
    paymentMethod: 'Debit Card',
    status: 'completed',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount !== undefined ? initialData.amount.toString() : '',
        type: initialData.type || 'expense',
        category: initialData.category || 'Dining',
        recipient: initialData.recipient || '',
        paymentMethod: initialData.paymentMethod || 'Debit Card',
        status: initialData.status || 'completed',
        date: initialData.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0],
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        category: 'Dining',
        recipient: '',
        paymentMethod: 'Debit Card',
        status: 'completed',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('A title or counterparty description is required.');
      return;
    }

    const parsedAmount = parseFloat(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be a positive number greater than 0.');
      return;
    }

    onSubmit({
      ...formData,
      amount: parsedAmount
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="swiss-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-line">
          <div>
            <div className="swiss-label" style={{ fontSize: '0.65rem' }}>Ledger Record</div>
            <h3>{isEdit ? 'Edit Transaction' : 'Create Transaction'}</h3>
          </div>
          <button
            type="button"
            className="btn-icon-minimal"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-form-body">
            {error && (
              <div style={{
                background: 'var(--swiss-red-light)',
                border: '1px solid #fecdd3',
                color: 'var(--swiss-red)',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.8rem',
                fontWeight: 500
              }}>
                {error}
              </div>
            )}

            {/* Title */}
            <div className="form-field">
              <label htmlFor="title">Description / Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Zurich Supermarket, TechCorp Dividend"
                value={formData.title}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            {/* Amount and Type */}
            <div className="form-cols-2">
              <div className="form-field">
                <label htmlFor="amount">Amount ($) *</label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className="mono-num"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="type">Transaction Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="expense">Debit (Expense)</option>
                  <option value="income">Credit (Income)</option>
                  <option value="transfer">Internal Transfer</option>
                </select>
              </div>
            </div>

            {/* Category and Status */}
            <div className="form-cols-2">
              <div className="form-field">
                <label htmlFor="category">Category Sector</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="status">Clearing State</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="completed">Settled</option>
                  <option value="pending">Clearing Hold</option>
                  <option value="flagged">Flagged Alert</option>
                </select>
              </div>
            </div>

            {/* Recipient & Payment Method */}
            <div className="form-cols-2">
              <div className="form-field">
                <label htmlFor="recipient">Payee / Merchant</label>
                <input
                  id="recipient"
                  name="recipient"
                  type="text"
                  placeholder="e.g. Skyline Corp"
                  value={formData.recipient}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="paymentMethod">Payment Rail</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  {PAYMENT_METHODS.map(pm => (
                    <option key={pm} value={pm}>{pm}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div className="form-field">
              <label htmlFor="date">Posting Date</label>
              <input
                id="date"
                name="date"
                type="date"
                className="mono-num"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            {/* Notes */}
            <div className="form-field">
              <label htmlFor="notes">Reference Memo (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                rows="2"
                placeholder="Audit notes, references, or billing codes..."
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className="modal-footer-line">
            <button
              type="button"
              className="btn-swiss-secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-swiss-primary"
              disabled={isSaving}
            >
              {isSaving ? 'Registering...' : (isEdit ? 'Save Changes' : 'Confirm Entry')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
