import React from 'react';
import { FiPlus, FiRotateCw, FiCheck } from 'react-icons/fi';

export default function Navbar({ onOpenNewModal, onResetData, isResetting, resetSuccess }) {
  return (
    <header className="swiss-header">
      <div className="swiss-brand">
        <div className="swiss-cross-box" title="Swiss Design Precision">
          +
        </div>
        <div>
          <div className="swiss-title">Kontor</div>
          <div className="swiss-subtitle">Private Banking & Ledger</div>
        </div>
      </div>

      <div className="swiss-header-actions">
        <button
          type="button"
          className="btn-swiss-secondary"
          onClick={onResetData}
          disabled={isResetting}
          title="Restore standard behavioral seed records"
          style={resetSuccess ? { borderColor: '#10b981', color: '#047857', background: '#ecfdf5' } : {}}
        >
          {resetSuccess ? (
            <>
              <FiCheck style={{ color: '#047857' }} />
              <span>Reset Complete!</span>
            </>
          ) : (
            <>
              <FiRotateCw style={{ animation: isResetting ? 'spin 0.75s linear infinite' : 'none' }} />
              <span>{isResetting ? 'Resetting...' : 'Reset Demo'}</span>
            </>
          )}
        </button>

        <button
          type="button"
          className="btn-swiss-primary"
          onClick={onOpenNewModal}
        >
          <FiPlus />
          <span>New Entry</span>
        </button>

        <div className="user-badge-minimal">
          <div className="user-avatar-initials">AR</div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-black)' }}>Alex Rivera</div>
            <div className="swiss-label" style={{ fontSize: '0.65rem' }}>Acct •••• 5821</div>
          </div>
        </div>
      </div>
    </header>
  );
}
