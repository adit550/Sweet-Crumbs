import React from 'react';
import { Package, Search, Filter, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import './AccountOrders.css';

// useAuth removed because filtering is done by backend

export const AccountOrders: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // user removed
  const [orders, setOrders] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch('/api/orders', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        // Backend now filters orders for customer, so we don't strictly need to filter, 
        // but it's safe to keep it or just setOrders(data)
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  if (id) {
    const order = orders.find(o => o.id === id);
    if (!order) {
      return (
        <div className="account-orders">
          <div className="account-page-header">
            <h2>Order Not Found</h2>
            <button className="btn btn-outline" onClick={() => navigate('/account/orders')}>
              <ArrowLeft size={18} /> Back to Orders
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="account-orders">
        <div className="account-page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="icon-btn" onClick={() => navigate('/account/orders')} aria-label="Back to orders">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2>Order Details #{order.id}</h2>
            <p>Placed on {order.date}</p>
          </div>
        </div>

        <div className="order-detail-card" style={{ background: 'var(--white)', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 20px rgba(139, 90, 43, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-dark)' }}>Status</h3>
              <span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-dark)' }}>Total Amount</h3>
              <strong style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>Rp {order.totalAmount.toLocaleString('id-ID')}</strong>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={20} className="text-primary" /> Items Ordered
            </h3>
            <div style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>
              {order.items.map((it: any) => (
                <div key={it.id}>{it.quantity}x {it.productName}</div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '1.5rem', background: 'var(--background)', borderRadius: '0.5rem' }}>
            <div>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-dark)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment Method</h4>
              <p style={{ color: 'var(--text-light)' }}>-</p>
            </div>
            <div>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-dark)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Delivery Address</h4>
              <p style={{ color: 'var(--text-light)' }}>-</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-orders">
      <div className="account-page-header">
        <h2>My Orders</h2>
        <p>View and track your recent orders.</p>
      </div>

      <div className="orders-controls">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search orders by ID..." />
        </div>
        <button className="btn btn-outline filter-btn">
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className="orders-list">
        {orders.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
            No orders found.
          </div>
        )}
        {orders.map((order) => (
          <div key={order.id} className="order-list-card">
            <div className="order-card-header">
              <div className="order-meta">
                <span className="order-id">#{order.id.slice(0, 8)}</span>
                <span className="order-date">{order.date}</span>
              </div>
              <span className={`status-badge status-${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
            
            <div className="order-card-body">
              <div className="order-details">
                <Package size={20} className="icon-muted" />
                <span className="order-items">{order.items.map((it:any) => it.quantity + 'x ' + it.productName).join(', ')}</span>
              </div>
              <div className="order-price">
                Total: <strong>Rp {order.totalAmount.toLocaleString('id-ID')}</strong>
              </div>
            </div>
            
            <div className="order-card-footer">
              <button className="btn btn-outline">Reorder</button>
              <button className="btn btn-primary" onClick={() => navigate(`/account/orders/${order.id}`)}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
