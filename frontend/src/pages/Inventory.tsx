import React, { useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, AlertTriangle, Plus, Minus, SlidersHorizontal, Search } from 'lucide-react';
import { Modal } from '../components/Modal';
import './Inventory.css';

interface StockMovement {
  id: string;
  date: string;
  itemName: string;
  type: 'Stock In' | 'Stock Out' | 'Stock Adjustment';
  quantityChange: number;
  finalStock: number;
  unit: string;
  notes: string;
}

interface IngredientStock {
  name: string;
  stock: number;
  min: number;
  unit: string;
}

const ingredientsCatalog: Record<string, { unit: string; current: number }> = {
  'Tepung': { unit: 'kg', current: 125 },
  'Gula': { unit: 'kg', current: 45 },
  'Telur': { unit: 'pcs', current: 360 },
  'Butter': { unit: 'kg', current: 8 },
  'Cokelat': { unit: 'kg', current: 20 },
  'Susu': { unit: 'L', current: 22 },
};

const initialHistory: StockMovement[] = [
  { id: 'MOV-001', date: '2023-10-25 08:30', itemName: 'Tepung', type: 'Stock In', quantityChange: 50, finalStock: 125, unit: 'kg', notes: 'Pengiriman Supplier Pagi' },
  { id: 'MOV-002', date: '2023-10-25 09:15', itemName: 'Butter', type: 'Stock Out', quantityChange: -7, finalStock: 8, unit: 'kg', notes: 'Produksi Roti Croissant' },
  { id: 'MOV-003', date: '2023-10-24 14:00', itemName: 'Gula', type: 'Stock Adjustment', quantityChange: -2, finalStock: 45, unit: 'kg', notes: 'Koreksi tumpah saat penimbangan' },
  { id: 'MOV-004', date: '2023-10-24 10:00', itemName: 'Telur', type: 'Stock In', quantityChange: 120, finalStock: 360, unit: 'pcs', notes: 'Restock Telur Segar' },
  { id: 'MOV-005', date: '2023-10-24 07:45', itemName: 'Susu', type: 'Stock Out', quantityChange: -5, finalStock: 22, unit: 'L', notes: 'Adonan Donut & Cake' },
];

const lowStockItems: IngredientStock[] = [
  { name: 'Butter', stock: 8, min: 15, unit: 'kg' },
  { name: 'Cokelat', stock: 10, min: 10, unit: 'kg' },
];

export const Inventory: React.FC = () => {
  const [history, setHistory] = useState<StockMovement[]>(initialHistory);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'Stock In' | 'Stock Out' | 'Stock Adjustment'>('Stock In');

  // Form State
  const [selectedItem, setSelectedItem] = useState('Tepung');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');

  const handleOpenModal = (type: 'Stock In' | 'Stock Out' | 'Stock Adjustment') => {
    setModalType(type);
    setSelectedItem('Tepung');
    setQuantity('');
    setNotes('');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !quantity) return;

    const qty = parseFloat(quantity);
    let change = qty;
    if (modalType === 'Stock Out') {
      change = -Math.abs(qty);
    } else if (modalType === 'Stock Adjustment') {
      change = qty; // User can type negative or positive
    } else {
      change = Math.abs(qty);
    }
    
    const unit = ingredientsCatalog[selectedItem]?.unit || 'kg';
    const current = ingredientsCatalog[selectedItem]?.current || 100;
    const finalStock = current + change;

    const newMovement: StockMovement = {
      id: `MOV-${String(history.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      itemName: selectedItem,
      type: modalType,
      quantityChange: change,
      finalStock: Math.max(0, finalStock),
      unit: unit,
      notes: notes || (modalType === 'Stock In' ? 'Pemasukan Stok' : modalType === 'Stock Out' ? 'Pengeluaran Dapur' : 'Penyesuaian Fisik'),
    };

    setHistory([newMovement, ...history]);
    setModalOpen(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Stock In': return <ArrowDownCircle size={18} className="type-icon type-in" />;
      case 'Stock Out': return <ArrowUpCircle size={18} className="type-icon type-out" />;
      case 'Stock Adjustment': return <SlidersHorizontal size={18} className="type-icon type-adjust" />;
      default: return null;
    }
  };

  const filteredHistory = history.filter(mov => {
    const matchesSearch = mov.itemName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          mov.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          mov.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || mov.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="inventory-page">
      <div className="page-header flex-between">
        <div>
          <h1>Inventory & Stock Hub</h1>
          <p className="text-muted">Kelola stok masuk, stok keluar, dan catat penyesuaian bahan baku.</p>
        </div>
        <div className="header-actions-group">
          <button className="primary-btn flex-center" onClick={() => handleOpenModal('Stock In')} style={{ gap: '8px' }}>
            <Plus size={18} /> Stock In
          </button>
          <button className="danger-btn flex-center" onClick={() => handleOpenModal('Stock Out')} style={{ gap: '8px' }}>
            <Minus size={18} /> Stock Out
          </button>
          <button className="secondary-btn flex-center" onClick={() => handleOpenModal('Stock Adjustment')} style={{ gap: '8px' }}>
            <SlidersHorizontal size={18} /> Stock Adjustment
          </button>
        </div>
      </div>

      {/* LOW STOCK ALERT */}
      {lowStockItems.length > 0 && (
        <div className="alert-section card">
          <div className="alert-header">
            <div className="flex-center" style={{ gap: '8px' }}>
              <AlertTriangle size={20} className="alert-icon" />
              <h3>Low Stock Alert (Peringatan Stok Menipis)</h3>
            </div>
            <span className="alert-badge">{lowStockItems.length} Bahan Kritis</span>
          </div>
          <div className="alert-grid">
            {lowStockItems.map((item, idx) => (
              <div key={idx} className="alert-item">
                <span className="alert-item-name">{item.name}</span>
                <div className="alert-item-meta">
                  <span className="alert-item-stock">
                    Tersisa: <strong>{item.stock} {item.unit}</strong>
                  </span>
                  <span className="alert-item-min text-muted">
                    (Min: {item.min} {item.unit})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RIWAYAT STOK TABLE */}
      <div className="card history-card">
        <div className="card-header flex-between">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Cari bahan, ID, catatan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="type-filters flex-center" style={{ gap: '8px' }}>
            {['All', 'Stock In', 'Stock Out', 'Stock Adjustment'].map((tab) => (
              <button
                key={tab}
                className={`filter-chip ${filterType === tab ? 'active' : ''}`}
                onClick={() => setFilterType(tab)}
              >
                {tab === 'All' ? 'Semua Riwayat' : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="table-responsive">
          <table className="history-table">
            <thead>
              <tr>
                <th>ID & Tanggal</th>
                <th>Nama Bahan</th>
                <th>Tipe Pergerakan</th>
                <th>Perubahan Stok</th>
                <th>Stok Akhir</th>
                <th>Catatan / Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((mov) => (
                <tr key={mov.id}>
                  <td>
                    <div className="font-medium">{mov.id}</div>
                    <div className="text-muted text-sm">{mov.date}</div>
                  </td>
                  <td className="font-medium">{mov.itemName}</td>
                  <td>
                    <div className={`type-badge type-badge-${mov.type.toLowerCase().replace(/\s+/g, '-')}`}>
                      {getTypeIcon(mov.type)}
                      <span>{mov.type}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`change-value ${mov.quantityChange > 0 ? 'positive' : mov.quantityChange < 0 ? 'negative' : 'neutral'}`}>
                      {mov.quantityChange > 0 ? `+${mov.quantityChange}` : mov.quantityChange} {mov.unit}
                    </span>
                  </td>
                  <td className="font-medium">{mov.finalStock} {mov.unit}</td>
                  <td className="text-muted text-sm notes-cell">{mov.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredHistory.length === 0 && (
            <div className="empty-state">
              <p>Tidak ada riwayat pergerakan stok ditemukan.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL STOCK MOVEMENT */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={`Catat ${modalType}`}
      >
        <form className="crud-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Pilih Bahan Baku</label>
            <select 
              value={selectedItem} 
              onChange={(e) => setSelectedItem(e.target.value)}
              required
            >
              {Object.keys(ingredientsCatalog).map(name => (
                <option key={name} value={name}>
                  {name} (Satuan: {ingredientsCatalog[name].unit})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>
              {modalType === 'Stock In' && 'Jumlah Masuk (Penambahan)'}
              {modalType === 'Stock Out' && 'Jumlah Keluar (Pengurangan)'}
              {modalType === 'Stock Adjustment' && 'Jumlah Penyesuaian (+ atau -)'}
              {` (${ingredientsCatalog[selectedItem]?.unit || 'kg'})`}
            </label>
            <input 
              type="number" 
              step="0.1"
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)} 
              placeholder={modalType === 'Stock Adjustment' ? 'Misal: -2 atau 5' : 'Misal: 10'}
              required 
            />
          </div>

          <div className="form-group">
            <label>Catatan / Alasan</label>
            <textarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Contoh: Pengiriman dari supplier, pemakaian harian, selisih timbangan..."
              rows={3}
            />
          </div>

          <div className="form-actions mt-4">
            <button type="button" className="secondary-btn" onClick={() => setModalOpen(false)}>Batal</button>
            <button 
              type="submit" 
              className={modalType === 'Stock Out' ? 'danger-btn' : 'primary-btn'}
            >
              Simpan {modalType}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
