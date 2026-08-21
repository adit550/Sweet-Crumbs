import React, { useState, useEffect } from 'react';
import { KpiCard } from '../components/KpiCard';
import { Banknote, ShoppingBag, Package, Users, AlertTriangle } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { formatRupiah } from '../utils/formatCurrency';
import './Dashboard.css';

// Keep mock data for charts if API doesn't provide it yet
const revenueData = [
  { name: 'Mon', revenue: 4000000 },
  { name: 'Tue', revenue: 3000000 },
  { name: 'Wed', revenue: 2000000 },
  { name: 'Thu', revenue: 2780000 },
  { name: 'Fri', revenue: 5890000 },
  { name: 'Sat', revenue: 7390000 },
  { name: 'Sun', revenue: 6490000 },
];

const popularItems = [
  { name: 'Butter Croissant', sales: 420 },
  { name: 'Sourdough Loaf', sales: 380 },
  { name: 'Choc Chip Cookie', sales: 310 },
  { name: 'Baguette', sales: 250 },
  { name: 'Cinnamon Roll', sales: 210 },
];

const lowStockItems = [
  { name: 'Unsalted Butter', stock: 8, unit: 'kg' },
  { name: 'Whole Milk', stock: 8, unit: 'L' },
  { name: 'Vanilla Extract', stock: 50, unit: 'ml' },
];

export const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [merch, setMerch] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        const [ordersRes, merchRes] = await Promise.all([
          fetch('/api/orders', { headers }),
          fetch('/api/merch', { headers })
        ]);
        
        if (ordersRes.ok) setOrders(await ordersRes.json());
        if (merchRes.ok) setMerch(await merchRes.json());
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const recentOrders = orders.slice(0, 5); // top 5 most recent
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p className="text-muted">Welcome back, Chef! Here's what's happening today.</p>
        </div>
      </div>

      <div className="kpi-grid">
        <KpiCard 
          title="Total Produk" 
          value={merch.length.toString()} 
          icon={<Package size={24} />} 
          trend={0} 
          trendText="Active items"
          type="default"
        />
        <KpiCard 
          title="Total Pesanan" 
          value={orders.length.toString()} 
          icon={<ShoppingBag size={24} />} 
          trend={12} 
          trendText="vs yesterday"
          type="default"
        />
        <KpiCard 
          title="Total Customer" 
          value="1,429" 
          icon={<Users size={24} />} 
          trend={2.4} 
          trendText="this week"
          type="default"
        />
        <KpiCard 
          title="Total Pendapatan" 
          value={formatRupiah(totalRevenue)} 
          icon={<Banknote size={24} />} 
          trend={12.5} 
          trendText="vs yesterday"
          type="success"
        />
      </div>

      <div className="dashboard-charts">
        <div className="card chart-card">
          <div className="chart-header">
            <h3>Grafik Penjualan</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} 
                  tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(1)}jt`}
                />
                <Tooltip 
                  formatter={(val: any) => [formatRupiah(Number(val) || 0), 'Pendapatan']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card">
          <div className="chart-header">
            <h3>Produk Terlaris</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularItems} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-main)', fontSize: 12 }} width={120} />
                <Tooltip 
                  cursor={{ fill: 'rgba(139, 90, 43, 0.05)' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                />
                <Bar dataKey="sales" fill="var(--color-secondary)" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="dashboard-bottom-grid">
        <div className="card recent-orders-card">
          <div className="card-header flex-between">
            <h3>Pesanan Terbaru</h3>
          </div>
          <div className="table-responsive">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  // Ensure items are joined correctly
                  const itemsSummary = order.items && Array.isArray(order.items) 
                    ? order.items.map((i: any) => `${i.quantity}x ${i.productName}`).join(', ')
                    : (order.items || '-');
                    
                  return (
                    <tr key={order.id}>
                      <td className="font-medium">{order.id.substring(0, 8).toUpperCase()}</td>
                      <td>{order.customerName || order.customer}</td>
                      <td className="text-muted" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {itemsSummary}
                      </td>
                      <td className="font-medium" style={{ textAlign: 'right' }}>
                        {formatRupiah(order.totalAmount || order.total)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`status-badge status-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card low-stock-card">
          <div className="card-header flex-between" style={{ color: 'var(--color-danger)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} />
              Stok Bahan Menipis
            </h3>
          </div>
          <div className="low-stock-list">
            {lowStockItems.map((item, idx) => (
              <div key={idx} className="low-stock-item">
                <span className="font-medium">{item.name}</span>
                <span className="stock-warning">{item.stock} {item.unit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
