import React from 'react';
import {
  FiCoffee,
  FiShoppingCart,
  FiBriefcase,
  FiSend,
  FiClock,
  FiAlertOctagon,
  FiPlus
} from 'react-icons/fi';

const BEHAVIOR_PRESETS = [
  {
    id: 'coffee',
    icon: <FiCoffee />,
    title: 'Daily Espresso',
    sub: 'Habitual debit ($4.85)',
    data: {
      title: 'Artisan Espresso Bar',
      amount: 4.85,
      type: 'expense',
      category: 'Dining',
      status: 'completed',
      recipient: 'Artisan Coffee Roasters',
      paymentMethod: 'Debit Card',
      notes: 'Morning habitual coffee swipe'
    }
  },
  {
    id: 'groceries',
    icon: <FiShoppingCart />,
    title: 'Supermarket',
    sub: 'Weekly grocery ($94.20)',
    data: {
      title: 'Trader Joe\'s Grocery Haul',
      amount: 94.20,
      type: 'expense',
      category: 'Groceries',
      status: 'completed',
      recipient: 'Trader Joe\'s',
      paymentMethod: 'Debit Card',
      notes: 'Weekly fresh groceries'
    }
  },
  {
    id: 'freelance',
    icon: <FiBriefcase />,
    title: 'Client Invoice',
    sub: 'Consulting inflow (+$550)',
    data: {
      title: 'Consulting Milestone Payout',
      amount: 550.00,
      type: 'income',
      category: 'Freelance',
      status: 'completed',
      recipient: 'Apex Digital Labs',
      paymentMethod: 'Wire',
      notes: 'Frontend architecture consulting'
    }
  },
  {
    id: 'transfer',
    icon: <FiSend />,
    title: 'P2P Transfer',
    sub: 'Peer bill split ($42.00)',
    data: {
      title: 'Venmo: Dinner Split with Sam',
      amount: 42.00,
      type: 'transfer',
      category: 'Transfer',
      status: 'completed',
      recipient: 'Sam K. (@samk)',
      paymentMethod: 'ACH Transfer',
      notes: 'Shared sushi dinner split'
    }
  },
  {
    id: 'check_deposit',
    icon: <FiClock />,
    title: 'Check Deposit',
    sub: 'Pending clearing (+$320)',
    data: {
      title: 'Client Reimbursement Check',
      amount: 320.00,
      type: 'income',
      category: 'Other',
      status: 'pending',
      recipient: 'Mobile Check Capture',
      paymentMethod: 'Mobile Check Deposit',
      notes: 'Awaiting bank clearance hold release'
    }
  },
  {
    id: 'suspicious',
    icon: <FiAlertOctagon style={{ color: 'var(--swiss-red)' }} />,
    title: 'Foreign Swipe',
    sub: 'Flagged fraud ($650)',
    data: {
      title: 'Unauthorized Luxury Goods - Paris FR',
      amount: 650.00,
      type: 'expense',
      category: 'Shopping',
      status: 'flagged',
      recipient: 'Galeries Lafayette FR',
      paymentMethod: 'Debit Card',
      notes: 'FLAGGED: Geolocation mismatch. Needs cardholder verification'
    }
  }
];

export default function BehaviorShortcuts({ onTriggerBehavior, isAdding }) {
  return (
    <div className="behavior-section">
      <div className="behavior-header">
        <div className="behavior-header-left">
          <span className="behavior-headline">Behavior Patterns</span>
          <span className="behavior-badge-pill">1-Click Fast Injection</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Select a pattern to simulate real-world cardholder behavior
        </span>
      </div>

      <div className="behavior-grid">
        {BEHAVIOR_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className="behavior-btn"
            onClick={() => onTriggerBehavior(preset.data)}
            disabled={isAdding}
          >
            <div className="behavior-btn-top">
              <span style={{ fontSize: '1.1rem', display: 'flex' }}>
                {preset.icon}
              </span>
              <FiPlus style={{ opacity: 0.4, fontSize: '0.85rem' }} />
            </div>
            <div>
              <div className="behavior-btn-title">{preset.title}</div>
              <div className="behavior-btn-sub mono-num">{preset.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
