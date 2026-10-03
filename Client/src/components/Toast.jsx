import { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => onDismiss(toast.id), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [toast.id, onDismiss]);

  return (
    <div className={`swiss-toast ${toast.type === 'error' ? 'error' : ''}`}>
      <span style={{ fontSize: '1rem', display: 'flex' }}>
        {toast.type === 'success' && <FiCheckCircle style={{ color: '#4ade80' }} />}
        {toast.type === 'error' && <FiAlertCircle />}
        {toast.type === 'info' && <FiInfo style={{ color: '#93c5fd' }} />}
      </span>
      <span style={{ fontWeight: 500 }}>{toast.message}</span>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.6)',
          cursor: 'pointer',
          marginLeft: '0.5rem',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <FiX />
      </button>
    </div>
  );
}

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
