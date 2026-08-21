import React, { useState } from 'react';
import { Plus, Eye, Trash2, ShoppingCart, Clock, CheckCircle, Search } from 'lucide-react';
import { Modal } from '../components/Modal';
import { formatRupiah } from '../utils/formatCurrency';
import './Orders.css';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  customerName: string;
  date: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Baking' | 'Ready' | 'Completed' | 'Cancelled';
}

const customerOptions = [
  'Alice Smith',
  'Bob Jones',
  'Charlie Davis',
  'Diana Ross',
  'Ethan Hunt',
  'Walk-in Customer (Pelanggan Langsung)'
];



export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // New Order Form State
  const [customer, setCustomer] = useState('Walk-in Customer (Pelanggan Langsung)');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([{ productId: 'p1', productName: 'Butter Croissant', quantity: 1, unitPrice: 35000 }]);

  const handleAddItem = () => {
    setOrderItems([...orderItems, { productId: '', productName: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (orderItems.length === 1) return;
    const newItems = [...orderItems];
    newItems.splice(index, 1);
    setOrderItems(newItems);
  };

  const handleItemChange = (index: number, productId: string) => {
    const product = availableProducts.find(p => p.id === productId);
    if (product) {
      const newItems = [...orderItems];
      newItems[index] = {
        ...newItems[index],
        productId: product.id,
        productName: product.name,
        unitPrice: product.price
      };
      setOrderItems(newItems);
    }
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const newItems = [...orderItems];
    newItems[index].quantity = Math.max(1, isNaN(quantity) ? 1 : quantity);
    setOrderItems(newItems);
  };

  // Fetch initial data
  React.useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch('/api/orders', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        alert('Gagal mengambil data pesanan.');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Terjadi kesalahan jaringan saat mengambil pesanan.');
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/merch');
      if (res.ok) {
        const data = await res.json();
        setAvailableProducts(data);
      } else {
        alert('Gagal mengambil data produk.');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Terjadi kesalahan jaringan saat mengambil produk.');
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty rows
    const validItems = orderItems.filter(item => item.productId !== '');
    if (validItems.length === 0) return alert('Silakan pilih setidaknya satu produk untuk pesanan.');

    const newOrderData = {
      customerName: customer,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      items: validItems,
      totalAmount: calculateTotal(),
    };

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(newOrderData)
      });
      if (res.ok) {
        const createdOrder = await res.json();
        setOrders([createdOrder, ...orders]);
        setModalOpen(false);
        // Reset form
        setCustomer('Walk-in Customer (Pelanggan Langsung)');
        setOrderItems([{ productId: 'p1', productName: 'Butter Croissant', quantity: 1, unitPrice: 35000 }]);
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Gagal membuat pesanan: ${errorData.error || 'Server error'}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Terjadi kesalahan jaringan saat membuat pesanan.');
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(orders.map(o => o.id === orderId ? updatedOrder : o));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(updatedOrder);
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Gagal mengupdate status: ${errorData.error || 'Server error'}`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Terjadi kesalahan jaringan saat mengupdate status.');
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const res = await fetch(`/api/orders/${id}`, {
          method: 'DELETE',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          setOrders(orders.filter(o => o.id !== id));
          if (viewModalOpen && selectedOrder?.id === id) {
            setViewModalOpen(false);
          }
        } else {
          const errorData = await res.json().catch(() => ({}));
          alert(`Gagal menghapus pesanan: ${errorData.error || 'Server error'}`);
        }
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Terjadi kesalahan jaringan saat menghapus pesanan.');
      }
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="orders-page">
      <div className="page-header flex-between">
        <div>
          <h1>Order Management</h1>
          <p className="text-muted">Buat pesanan baru, pantau rincian item, dan update status proses pesanan.</p>
        </div>
        <button className="primary-btn flex-center" onClick={() => setModalOpen(true)} style={{ gap: '8px' }}>
          <Plus size={20} />
          Membuat Pesanan
        </button>
      </div>

      <div className="orders-summary-grid">
        <div className="card summary-card">
          <div className="summary-icon bg-blue"><ShoppingCart size={24} /></div>
          <div className="summary-info">
            <h3>{orders.length}</h3>
            <p className="text-muted">Total Pesanan</p>
          </div>
        </div>
        <div className="card summary-card">
          <div className="summary-icon bg-yellow"><Clock size={24} /></div>
          <div className="summary-info">
            <h3>{orders.filter(o => o.status === 'Pending' || o.status === 'Baking').length}</h3>
            <p className="text-muted">Dalam Proses</p>
          </div>
        </div>
        <div className="card summary-card">
          <div className="summary-icon bg-green"><CheckCircle size={24} /></div>
          <div className="summary-info">
            <h3>{orders.filter(o => o.status === 'Completed' || o.status === 'Ready').length}</h3>
            <p className="text-muted">Siap / Selesai</p>
          </div>
        </div>
      </div>

      <div className="card orders-list-card">
        <div className="card-header flex-between">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Cari ID pesanan, nama pelanggan, status..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-muted text-sm">
            Total {filteredOrders.length} pesanan ditemukan
          </div>
        </div>

        <div className="table-responsive">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID Pesanan & Tanggal</th>
                <th>Nama Pelanggan</th>
                <th>Jumlah Item</th>
                <th>Total Harga</th>
                <th>Status Order</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>
                    <div className="font-medium">{order.id}</div>
                    <div className="text-muted text-sm">{order.date}</div>
                  </td>
                  <td className="font-medium">{order.customerName}</td>
                  <td className="text-muted">
                    {order.items.reduce((sum, it) => sum + it.quantity, 0)} pcs ({order.items.length} jenis)
                  </td>
                  <td className="font-medium text-success">{formatRupiah(order.totalAmount)}</td>
                  <td>
                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons text-right">
                      <button className="icon-button view-btn" onClick={() => handleViewOrder(order)} title="Lihat Detail Pesanan">
                        <Eye size={18} />
                      </button>
                      <button className="icon-button delete-btn" onClick={() => handleDeleteOrder(order.id)} title="Hapus Pesanan">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="empty-state">
              <p>Tidak ada pesanan yang sesuai dengan pencarian.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL MEMBUAT PESANAN */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Membuat Pesanan Baru">
        <form className="order-form" onSubmit={handleCreateOrder}>
          <div className="form-group">
            <label>Pilih Pelanggan (Customer)</label>
            <select value={customer} onChange={(e) => setCustomer(e.target.value)}>
              {customerOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="order-items-section">
            <label className="section-label">Detail Item & Quantity</label>
            {orderItems.map((item, idx) => (
              <div key={idx} className="item-row">
                <select 
                  className="product-select"
                  value={item.productId} 
                  onChange={(e) => handleItemChange(idx, e.target.value)}
                  required
                >
                  <option value="" disabled>Pilih Produk Roti / Kue...</option>
                  {availableProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({formatRupiah(p.price)})</option>
                  ))}
                </select>
                <div className="qty-control-wrapper">
                  <input 
                    type="number" 
                    className="qty-input"
                    min="1" 
                    value={item.quantity} 
                    onChange={(e) => handleQuantityChange(idx, parseInt(e.target.value))}
                    title="Quantity"
                  />
                  <span className="qty-unit-label">pcs</span>
                </div>
                <div className="item-total font-medium">
                  {formatRupiah(item.quantity * item.unitPrice)}
                </div>
                <button 
                  type="button" 
                  className="remove-item-btn" 
                  onClick={() => handleRemoveItem(idx)}
                  disabled={orderItems.length === 1}
                  title="Hapus baris item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button type="button" className="add-item-btn" onClick={handleAddItem}>
              + Tambah Item Lainnya
            </button>
          </div>

          <div className="order-summary-box">
            <div className="flex-between">
              <span className="font-medium">Total Harga Keseluruhan:</span>
              <span className="total-price">{formatRupiah(calculateTotal())}</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-btn" onClick={() => setModalOpen(false)}>Batal</button>
            <button type="submit" className="primary-btn">Simpan Pesanan</button>
          </div>
        </form>
      </Modal>

      {/* MODAL DETAIL PESANAN & STATUS ORDER */}
      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title={`Detail Pesanan: ${selectedOrder?.id}`}>
        {selectedOrder && (
          <div className="order-details">
            <div className="detail-header flex-between">
              <div>
                <h3>{selectedOrder.customerName}</h3>
                <p className="text-muted">Tanggal: {selectedOrder.date}</p>
              </div>
              <span className={`status-badge status-${selectedOrder.status.toLowerCase()}`}>
                {selectedOrder.status}
              </span>
            </div>

            <div className="detail-items list-group">
              <div className="list-group-title font-medium text-muted">Rincian Item (Quantity & Subtotal):</div>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="list-group-item flex-between">
                  <div className="item-info">
                    <span className="item-qty font-bold">{item.quantity}x</span>
                    <span className="item-name">{item.productName}</span>
                    <span className="text-muted text-sm">(@ {formatRupiah(item.unitPrice)})</span>
                  </div>
                  <span className="item-price font-medium">{formatRupiah(item.quantity * item.unitPrice)}</span>
                </div>
              ))}
            </div>

            <div className="detail-total flex-between">
              <span className="font-bold">Total Harga</span>
              <span className="total-amount">{formatRupiah(selectedOrder.totalAmount)}</span>
            </div>

            <div className="status-updater">
              <label className="font-medium">Ubah Status Order:</label>
              <div className="status-buttons">
                {['Pending', 'Baking', 'Ready', 'Completed'].map(status => (
                  <button 
                    key={status}
                    className={`status-btn status-btn-${status.toLowerCase()} ${selectedOrder.status === status ? 'active' : ''}`}
                    onClick={() => handleStatusChange(selectedOrder.id, status as Order['status'])}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
