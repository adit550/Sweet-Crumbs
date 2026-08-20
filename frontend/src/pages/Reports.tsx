import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, ShoppingBag, Banknote } from 'lucide-react';
import { formatRupiah } from '../utils/formatCurrency';
import './Reports.css';

// --- Dummy Data ---
const dailyData = [
  { name: 'Mon', revenue: 1200000, orders: 15 },
  { name: 'Tue', revenue: 1800000, orders: 22 },
  { name: 'Wed', revenue: 1500000, orders: 18 },
  { name: 'Thu', revenue: 2100000, orders: 26 },
  { name: 'Fri', revenue: 3500000, orders: 40 },
  { name: 'Sat', revenue: 4200000, orders: 45 },
  { name: 'Sun', revenue: 3800000, orders: 42 },
];

const weeklyData = [
  { name: 'Week 1', revenue: 12000000, orders: 140 },
  { name: 'Week 2', revenue: 13500000, orders: 155 },
  { name: 'Week 3', revenue: 11000000, orders: 130 },
  { name: 'Week 4', revenue: 18100000, orders: 208 },
];

const monthlyData = [
  { name: 'Jan', revenue: 52000000, orders: 610 },
  { name: 'Feb', revenue: 58000000, orders: 650 },
  { name: 'Mar', revenue: 49000000, orders: 580 },
  { name: 'Apr', revenue: 61000000, orders: 690 },
  { name: 'May', revenue: 72000000, orders: 810 },
  { name: 'Jun', revenue: 75000000, orders: 850 },
];

const topProducts = [
  { name: 'Butter Croissant', value: 400 },
  { name: 'Sourdough Loaf', value: 300 },
  { name: 'Chocolate Cookie', value: 250 },
  { name: 'Almond Croissant', value: 150 },
  { name: 'Baguette', value: 100 },
];

const COLORS = ['#8B5A2B', '#A0522D', '#CD853F', '#DEB887', '#D2B48C'];

export const Reports: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');

  const getChartData = () => {
    if (timeframe === 'Daily') return dailyData;
    if (timeframe === 'Weekly') return weeklyData;
    return monthlyData;
  };

  const chartData = getChartData();
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = chartData.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="reports-page">
      <div className="page-header flex-between">
        <div>
          <h1>Sales Report & Analytics</h1>
          <p className="text-muted">Analyze your bakery's performance over time.</p>
        </div>
        
        <div className="timeframe-tabs">
          {['Daily', 'Weekly', 'Monthly'].map(tab => (
            <button 
              key={tab}
              className={`tab-btn ${timeframe === tab ? 'active' : ''}`}
              onClick={() => setTimeframe(tab as 'Daily' | 'Weekly' | 'Monthly')}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="metrics-grid">
        <div className="card metric-card">
          <div className="metric-icon bg-green"><Banknote size={24} /></div>
          <div>
            <p className="text-muted">Total Revenue ({timeframe})</p>
            <h3>{formatRupiah(totalRevenue)}</h3>
          </div>
        </div>
        <div className="card metric-card">
          <div className="metric-icon bg-blue"><ShoppingBag size={24} /></div>
          <div>
            <p className="text-muted">Total Orders ({timeframe})</p>
            <h3>{totalOrders}</h3>
          </div>
        </div>
        <div className="card metric-card">
          <div className="metric-icon bg-yellow"><TrendingUp size={24} /></div>
          <div>
            <p className="text-muted">Average Order Value</p>
            <h3>{formatRupiah(avgOrderValue)}</h3>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="card revenue-chart-card">
          <div className="card-header">
            <h3>Revenue Trend</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(value) => value >= 1000000 ? `Rp ${(value/1000000).toFixed(1)}jt` : `Rp ${(value/1000).toFixed(0)}rb`} 
                />
                <Tooltip 
                  cursor={{fill: 'rgba(139, 90, 43, 0.05)'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [formatRupiah(Number(value) || 0), 'Revenue']}
                />
                <Bar dataKey="revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card top-products-card">
          <div className="card-header">
            <h3>Top Selling Products</h3>
          </div>
          <div className="chart-wrapper pie-chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProducts}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {topProducts.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value} sold`, 'Quantity']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
