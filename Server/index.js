const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory data store for transactions
let transactions = [];

// Helper to generate IDs
const generateId = () => `txn_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

// Diverse seed data representing different realistic user behaviors
const getInitialTransactions = () => [
  {
    id: 'txn_101',
    title: 'Monthly Salary - TechCorp Inc',
    amount: 4250.00,
    type: 'income',
    category: 'Salary',
    status: 'completed',
    recipient: 'Employer - TechCorp',
    paymentMethod: 'Direct Deposit',
    date: '2026-09-01',
    notes: 'Primary monthly engineering salary direct deposit'
  },
  {
    id: 'txn_102',
    title: 'Whole Foods Market Groceries',
    amount: 142.60,
    type: 'expense',
    category: 'Groceries',
    status: 'completed',
    recipient: 'Whole Foods Market',
    paymentMethod: 'Debit Card',
    date: '2026-09-03',
    notes: 'Weekly fresh groceries and pantry restocking'
  },
  {
    id: 'txn_103',
    title: 'Blue Bottle Coffee & Pastry',
    amount: 9.75,
    type: 'expense',
    category: 'Dining',
    status: 'completed',
    recipient: 'Blue Bottle Coffee',
    paymentMethod: 'Debit Card',
    date: '2026-09-05',
    notes: 'Morning coffee before team sprint planning'
  },
  {
    id: 'txn_104',
    title: 'Apartment Monthly Rent',
    amount: 1450.00,
    type: 'expense',
    category: 'Housing',
    status: 'completed',
    recipient: 'Skyline Properties LLC',
    paymentMethod: 'ACH Transfer',
    date: '2026-09-05',
    notes: 'September apartment rent auto-debit'
  },
  {
    id: 'txn_105',
    title: 'Transfer to Emergency High-Yield Savings',
    amount: 600.00,
    type: 'transfer',
    category: 'Transfer',
    status: 'completed',
    recipient: 'Marcus HYSA ••••8812',
    paymentMethod: 'Internal Transfer',
    date: '2026-09-08',
    notes: 'Monthly automated emergency fund contribution'
  },
  {
    id: 'txn_106',
    title: 'Freelance UI/UX Consultation',
    amount: 850.00,
    type: 'income',
    category: 'Freelance',
    status: 'completed',
    recipient: 'Starlight Media Studios',
    paymentMethod: 'Wire',
    date: '2026-09-12',
    notes: 'Milestone 2 deliverable payment'
  },
  {
    id: 'txn_107',
    title: 'Netflix & Spotify Subscriptions',
    amount: 32.98,
    type: 'expense',
    category: 'Entertainment',
    status: 'completed',
    recipient: 'Digital Media Services',
    paymentMethod: 'Debit Card',
    date: '2026-09-14',
    notes: 'Monthly recurring entertainment subscriptions'
  },
  {
    id: 'txn_108',
    title: 'Electric & Gas Utility Bill',
    amount: 86.40,
    type: 'expense',
    category: 'Utilities',
    status: 'completed',
    recipient: 'City Power & Light',
    paymentMethod: 'ACH Transfer',
    date: '2026-09-18',
    notes: 'August power consumption'
  },
  {
    id: 'txn_109',
    title: 'Mobile Check Deposit (Birthday Gift)',
    amount: 150.00,
    type: 'income',
    category: 'Gift',
    status: 'pending',
    recipient: 'Family Check',
    paymentMethod: 'Mobile Check Deposit',
    date: '2026-09-24',
    notes: 'Check processing - clearing within 1-2 business days'
  },
  {
    id: 'txn_110',
    title: 'Unrecognized Electronics Purchase in Tokyo',
    amount: 849.99,
    type: 'expense',
    category: 'Shopping',
    status: 'flagged',
    recipient: 'Akihabara Tech Store JP',
    paymentMethod: 'Debit Card',
    date: '2026-09-25',
    notes: 'FLAGGED: Unusual foreign transaction detected by fraud prevention system'
  },
  {
    id: 'txn_111',
    title: 'Dinner with Team at Trattoria',
    amount: 68.50,
    type: 'expense',
    category: 'Dining',
    status: 'completed',
    recipient: 'Trattoria Roma',
    paymentMethod: 'Debit Card',
    date: '2026-09-25',
    notes: 'Dinner with coworkers'
  }
];

// Seed on startup
transactions = getInitialTransactions();

// --- ROUTES ---

// 1. Get transactions with filtering, searching, and sorting
app.get('/api/transactions', (req, res) => {
  let { search, type, category, status, sortBy = 'date', order = 'desc' } = req.query;

  let results = [...transactions];

  // Search filter
  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    results = results.filter(t => 
      t.title.toLowerCase().includes(q) ||
      (t.recipient && t.recipient.toLowerCase().includes(q)) ||
      (t.notes && t.notes.toLowerCase().includes(q)) ||
      t.category.toLowerCase().includes(q)
    );
  }

  // Type filter
  if (type && type !== 'all') {
    results = results.filter(t => t.type === type);
  }

  // Category filter
  if (category && category !== 'all') {
    results = results.filter(t => t.category === category);
  }

  // Status filter
  if (status && status !== 'all') {
    results = results.filter(t => t.status === status);
  }

  // Sorting
  results.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === 'amount') {
      return order === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
    if (sortBy === 'date') {
      return order === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
    }
    // String sort fallback
    valA = (valA || '').toString().toLowerCase();
    valB = (valB || '').toString().toLowerCase();
    return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  res.json({
    success: true,
    total: results.length,
    data: results
  });
});

// 2. Get user account metrics & summary
app.get('/api/transactions/summary', (req, res) => {
  // Baseline initial checking balance
  const initialBase = 5000.00;

  let totalIncome = 0;
  let totalExpense = 0;
  let totalTransfers = 0;
  let pendingCount = 0;
  let flaggedCount = 0;

  const categoryBreakdown = {};

  transactions.forEach(t => {
    const amt = Number(t.amount) || 0;

    if (t.status === 'flagged') {
      flaggedCount++;
    }
    if (t.status === 'pending') {
      pendingCount++;
    }

    // Only count completed or pending towards active cash flow analysis
    if (t.type === 'income' && t.status === 'completed') {
      totalIncome += amt;
    } else if (t.type === 'expense' && t.status === 'completed') {
      totalExpense += amt;
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + amt;
    } else if (t.type === 'transfer' && t.status === 'completed') {
      totalTransfers += amt;
    }
  });

  const currentBalance = initialBase + totalIncome - totalExpense - totalTransfers;
  const netSavings = totalIncome - totalExpense;

  res.json({
    success: true,
    data: {
      accountHolder: 'Alex Rivera',
      accountNumber: '•••• 5821',
      accountType: 'Premier Checking',
      currentBalance: parseFloat(currentBalance.toFixed(2)),
      totalIncome: parseFloat(totalIncome.toFixed(2)),
      totalExpense: parseFloat(totalExpense.toFixed(2)),
      totalTransfers: parseFloat(totalTransfers.toFixed(2)),
      netSavings: parseFloat(netSavings.toFixed(2)),
      pendingCount,
      flaggedCount,
      totalTransactions: transactions.length,
      categoryBreakdown
    }
  });
});

// 3. Get single transaction by ID
app.get('/api/transactions/:id', (req, res) => {
  const transaction = transactions.find(t => t.id === req.params.id);
  if (!transaction) {
    return res.status(404).json({ success: false, error: 'Transaction not found' });
  }
  res.json({ success: true, data: transaction });
});

// 4. Create new transaction
app.post('/api/transactions', (req, res) => {
  const { title, amount, type, category, status, recipient, paymentMethod, date, notes } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ success: false, error: 'Transaction title is required' });
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ success: false, error: 'Amount must be a positive number' });
  }

  if (!['income', 'expense', 'transfer'].includes(type)) {
    return res.status(400).json({ success: false, error: 'Type must be income, expense, or transfer' });
  }

  const newTransaction = {
    id: generateId(),
    title: title.trim(),
    amount: parsedAmount,
    type,
    category: category || 'Other',
    status: status || 'completed',
    recipient: recipient ? recipient.trim() : (type === 'income' ? 'Direct Source' : 'Merchant'),
    paymentMethod: paymentMethod || 'Debit Card',
    date: date || new Date().toISOString().split('T')[0],
    notes: notes ? notes.trim() : ''
  };

  transactions.unshift(newTransaction);

  res.status(201).json({
    success: true,
    message: 'Transaction created successfully',
    data: newTransaction
  });
});

// 5. Update transaction
app.put('/api/transactions/:id', (req, res) => {
  const index = transactions.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Transaction not found' });
  }

  const { title, amount, type, category, status, recipient, paymentMethod, date, notes } = req.body;

  if (amount !== undefined) {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ success: false, error: 'Amount must be a positive number' });
    }
    transactions[index].amount = parsedAmount;
  }

  if (title !== undefined && title.trim() !== '') {
    transactions[index].title = title.trim();
  }
  if (type !== undefined && ['income', 'expense', 'transfer'].includes(type)) {
    transactions[index].type = type;
  }
  if (category !== undefined) transactions[index].category = category;
  if (status !== undefined && ['completed', 'pending', 'flagged'].includes(status)) {
    transactions[index].status = status;
  }
  if (recipient !== undefined) transactions[index].recipient = recipient;
  if (paymentMethod !== undefined) transactions[index].paymentMethod = paymentMethod;
  if (date !== undefined) transactions[index].date = date;
  if (notes !== undefined) transactions[index].notes = notes;

  res.json({
    success: true,
    message: 'Transaction updated successfully',
    data: transactions[index]
  });
});

// 6. Delete transaction
app.delete('/api/transactions/:id', (req, res) => {
  const index = transactions.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Transaction not found' });
  }

  const deleted = transactions.splice(index, 1)[0];
  res.json({
    success: true,
    message: 'Transaction deleted successfully',
    data: deleted
  });
});

// 7. Seed / Reset transactions to initial diverse state
app.post('/api/transactions/seed', (req, res) => {
  transactions = getInitialTransactions();
  res.json({
    success: true,
    message: 'Transactions reset to initial varied user behavior demo data',
    data: transactions
  });
});

app.listen(PORT, () => {
  console.log(`🏦 Bank API Server running on http://localhost:${PORT}`);
});
