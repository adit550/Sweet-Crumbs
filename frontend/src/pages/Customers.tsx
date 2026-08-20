import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Mail, Phone, ShoppingBag } from 'lucide-react';
import { Modal } from '../components/Modal';
import { formatRupiah } from '../utils/formatCurrency';
import './Customers.css';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalTransactions: number;
  totalSpent: number;
}

const initialCustomers: Customer[] = [
  { id: 'CUST-001', name: 'Alice Smith', email: 'alice@example.com', phone: '0812-3456-7890', totalTransactions: 12, totalSpent: 1450000 },
  { id: 'CUST-002', name: 'Bob Jones', email: 'bob.j@example.com', phone: '0856-1234-5678', totalTransactions: 3, totalSpent: 280000 },
  { id: 'CUST-003', name: 'Charlie Davis', email: 'charlie.d@example.com', phone: '0811-9876-5432', totalTransactions: 25, totalSpent: 4500000 },
  { id: 'CUST-004', name: 'Diana Ross', email: 'diana.r@example.com', phone: '0813-5555-1234', totalTransactions: 1, totalSpent: 550000 },
  { id: 'CUST-005', name: 'Ethan Hunt', email: 'ethan.h@example.com', phone: '0822-4444-9999', totalTransactions: 8, totalSpent: 1100000 },
];

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    totalTransactions: 0,
    totalSpent: 0
  });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingId(customer.id);
      setFormData({ 
        name: customer.name, 
        email: customer.email, 
        phone: customer.phone,
        totalTransactions: customer.totalTransactions,
        totalSpent: customer.totalSpent
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', email: '', phone: '', totalTransactions: 0, totalSpent: 0 });
    }
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingId) {
      setCustomers(customers.map(c => 
        c.id === editingId ? { ...c, ...formData } : c
      ));
    } else {
      const newCustomer: Customer = {
        id: `CUST-00${customers.length + 1}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        totalTransactions: Number(formData.totalTransactions) || 0,
        totalSpent: Number(formData.totalSpent) || 0,
      };
      setCustomers([...customers, newCustomer]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus customer ini?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  return (
    <div className="customers-page">
      <div className="page-header flex-between">
        <div>
          <h1>Customer Management</h1>
          <p className="text-muted">Kelola basis data pelanggan dan riwayat transaksi mereka.</p>
        </div>
        <button className="primary-btn flex-center" onClick={() => handleOpenModal()} style={{ gap: '8px' }}>
          <Plus size={20} />
          Add Customer
        </button>
      </div>

      <div className="card customers-card">
        <div className="card-header flex-between">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Cari nama, email, atau nomor HP..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-muted text-sm">
            Total {filteredCustomers.length} pelanggan terdaftar
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Nama Pelanggan</th>
                <th>Kontak (Email & HP)</th>
                <th>Frekuensi Pesanan</th>
                <th>Total Transaksi</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="customer-details-cell">
                      <div className="customer-avatar">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium customer-name">{customer.name}</div>
                        <div className="text-muted text-sm">{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info-cell">
                      {customer.email && (
                        <div className="contact-item">
                          <Mail size={14} className="text-muted" />
                          <span>{customer.email}</span>
                        </div>
                      )}
                      {customer.phone && (
                        <div className="contact-item">
                          <Phone size={14} className="text-muted" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="transactions-badge">
                      <ShoppingBag size={14} />
                      {customer.totalTransactions} Transaksi
                    </div>
                  </td>
                  <td className="font-medium text-success">
                    {formatRupiah(customer.totalSpent)}
                  </td>
                  <td>
                    <div className="action-buttons text-right">
                      <button 
                        className="icon-button edit-btn" 
                        onClick={() => handleOpenModal(customer)}
                        title="Edit Customer"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        className="icon-button delete-btn" 
                        onClick={() => handleDelete(customer.id)}
                        title="Hapus Customer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && (
            <div className="empty-state">
              <p>Tidak ada data customer yang cocok.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL CRUD CUSTOMER */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={editingId ? 'Edit Customer' : 'Tambah Customer Baru'}
      >
        <form className="crud-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Lengkap *</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              placeholder="Contoh: Alice Smith"
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Alamat Email</label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              placeholder="Contoh: alice@example.com"
            />
          </div>

          <div className="form-group">
            <label>Nomor HP / WhatsApp</label>
            <input 
              type="tel" 
              value={formData.phone} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              placeholder="Contoh: 0812-3456-7890"
            />
          </div>

          {editingId && (
            <div className="form-row">
              <div className="form-group">
                <label>Jumlah Transaksi</label>
                <input 
                  type="number" 
                  min="0"
                  value={formData.totalTransactions} 
                  onChange={(e) => setFormData({...formData, totalTransactions: parseInt(e.target.value) || 0})} 
                />
              </div>
              <div className="form-group">
                <label>Total Transaksi (Rp)</label>
                <input 
                  type="number" 
                  step="1000"
                  min="0"
                  value={formData.totalSpent} 
                  onChange={(e) => setFormData({...formData, totalSpent: parseFloat(e.target.value) || 0})} 
                />
              </div>
            </div>
          )}

          <div className="form-actions mt-4">
            <button type="button" className="secondary-btn" onClick={() => setModalOpen(false)}>Batal</button>
            <button type="submit" className="primary-btn">{editingId ? 'Simpan Perubahan' : 'Simpan Customer'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
