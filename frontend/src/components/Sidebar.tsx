import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Settings,
  Croissant,
  Tags,
  Wheat,
  ClipboardList,
  Wallet,
  BarChart3,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { path: '/admin/orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
  { path: '/admin/transactions', label: 'Transactions', icon: <Wallet size={20} /> },
  { path: '/admin/reports', label: 'Reports', icon: <BarChart3 size={20} /> },
  { path: '/admin/inventory', label: 'Inventory Hub', icon: <ClipboardList size={20} /> },
  { path: '/admin/products', label: 'Products', icon: <Package size={20} /> },
  { path: '/admin/categories', label: 'Categories', icon: <Tags size={20} /> },
  { path: '/admin/ingredients', label: 'Ingredients', icon: <Wheat size={20} /> },
  { path: '/admin/customers', label: 'Customers', icon: <Users size={20} /> },
  { path: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> },
];

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <Croissant size={32} color="var(--color-primary)" />
          <h2>Sweet Crumbs</h2>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="nav-item" style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left', color: '#ef4444' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
