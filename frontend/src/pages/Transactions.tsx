import React, { useState } from 'react';
import { CreditCard, Wallet, Smartphone, Banknote, Search, CheckCircle, Clock } from 'lucide-react';
import { Modal } from '../components/Modal';
import { formatRupiah } from '../utils/formatCurrency';
import './Transactions.css';

interface Transaction {
  id: string;
  orderId: string;
  customerName: string;
  date: string;
  amount: number;
  method: 'Cash' | 'QRIS' | 'Debit' | 'E-wallet' | 'Pending';
  status: 'Paid' | 'Unpaid' | 'Refunded';
}

const initialTransactions: Transaction[] = [
  { id: 'TRX-001', orderId: '#ORD-001', customerName: 'Alice Smith', date: '2023-10-25 10:35', amount: 90000, method: 'QRIS', status: 'Paid' },
  { id: 'TRX-002', orderId: '#ORD-002', customerName: 'Bob Jones', date: '2023-10-25 11:15', amount: 45000, method: 'Pending', status: 'Unpaid' },
  { id: 'TRX-003', orderId: '#ORD-003', customerName: 'Charlie Davis', date: '2023-10-25 09:05', amount: 240000, method: 'Cash', status: 'Paid' },
  { id: 'TRX-004', orderId: '#ORD-004', customerName: 'Walk-in Customer', date: '2023-10-25 12:00', amount: 155000, method: 'Debit', status: 'Paid' },
  { id: 'TRX-005', orderId: '#ORD-005', customerName: 'Walk-in Customer', date: '2023-10-25 12:30', amount: 80000, method: 'E-wallet', status: 'Paid' },
];

export const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Payment Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'QRIS' | 'Debit' | 'E-wallet'>('Cash');

  const filteredTransactions = transactions.filter(t => 
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenPayment = (trx: Transaction) => {
    setSelectedTrx(trx);
    setPaymentMethod('Cash');
    setModalOpen(true);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrx) return;

    setTransactions(transactions.map(t => 
      t.id === selectedTrx.id ? { ...t, status: 'Paid', method: paymentMethod } : t
    ));
    setModalOpen(false);
  };

  const getMethodIcon = (method: string) => {
    switch(method) {
      case 'Cash': return <Banknote size={16} />;
      case 'QRIS': return <Smartphone size={16} />;
      case 'Debit': return <CreditCard size={16} />;
      case 'E-wallet': return <Wallet size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const totalRevenue = transactions.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = transactions.filter(t => t.status === 'Unpaid').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="transactions-page">
      <div className="page-header">
        <div>
          <h1>Transaction Log</h1>
          <p className="text-muted">Monitor payments, track revenue, and process pending bills.</p>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="card metric-card">
          <div className="metric-icon bg-green"><Banknote size={24} /></div>
          <div>
            <p className="text-muted">Total Revenue Today</p>
            <h3>{formatRupiah(totalRevenue)}</h3>
          </div>
        </div>
        <div className="card metric-card">
          <div className="metric-icon bg-yellow"><Clock size={24} /></div>
          <div>
            <p className="text-muted">Pending Payments</p>
            <h3>{formatRupiah(pendingAmount)}</h3>
          </div>
        </div>
        <div className="card metric-card">
          <div className="metric-icon bg-blue"><CreditCard size={24} /></div>
          <div>
            <p className="text-muted">Total Transactions</p>
            <h3>{transactions.filter(t => t.status === 'Paid').length}</h3>
          </div>
        </div>
      </div>

      <div className="card transactions-card">
        <div className="card-header flex-between">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by ID, Order, or Customer..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-muted text-sm">
            {filteredTransactions.length} records found
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Transaction Details</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(trx => (
                <tr key={trx.id}>
                  <td>
                    <div className="font-medium">{trx.id}</div>
                    <div className="text-muted text-sm">Ref: {trx.orderId} • {trx.date}</div>
                  </td>
                  <td className="font-medium">{trx.customerName}</td>
                  <td className="font-medium amount-cell">{formatRupiah(trx.amount)}</td>
                  <td>
                    <div className="method-badge">
                      {getMethodIcon(trx.method)}
                      <span>{trx.method}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status-${trx.status.toLowerCase()}`}>
                      {trx.status === 'Paid' && <CheckCircle size={14} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />}
                      {trx.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons text-right">
                      {trx.status === 'Unpaid' ? (
                        <button className="primary-btn small-btn" onClick={() => handleOpenPayment(trx)}>
                          Process Payment
                        </button>
                      ) : (
                        <button className="secondary-btn small-btn" disabled>
                          Receipt
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div className="empty-state">
              <p>No transactions found.</p>
            </div>
          )}
        </div>
      </div>

      {/* PROCESS PAYMENT MODAL */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Process Payment">
        {selectedTrx && (
          <form className="payment-form" onSubmit={handleProcessPayment}>
            <div className="payment-summary card bg-light">
              <div className="flex-between mb-2">
                <span className="text-muted">Order Ref:</span>
                <span className="font-medium">{selectedTrx.orderId}</span>
              </div>
              <div className="flex-between mb-2">
                <span className="text-muted">Customer:</span>
                <span className="font-medium">{selectedTrx.customerName}</span>
              </div>
              <div className="flex-between amount-due mt-3 pt-3 border-top">
                <span>Amount Due:</span>
                <span className="total-price">{formatRupiah(selectedTrx.amount)}</span>
              </div>
            </div>

            <div className="form-group mt-4">
              <label>Select Payment Method</label>
              <div className="payment-methods-grid">
                {(['Cash', 'QRIS', 'Debit', 'E-wallet'] as const).map(method => (
                  <div 
                    key={method} 
                    className={`payment-method-card ${paymentMethod === method ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod(method)}
                  >
                    {getMethodIcon(method)}
                    <span>{method}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-actions mt-4">
              <button type="button" className="secondary-btn" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="primary-btn w-full">Confirm Payment</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
