import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, Heart, MapPin, User, Settings } from 'lucide-react';
import './CustomerAccountLayout.css';

export const CustomerAccountLayout: React.FC = () => {
  return (
    <div className="customer-account-page">
      <div className="account-container">
        
        {/* Account Sidebar */}
        <aside className="account-sidebar">
          <div className="sidebar-header">
            <h3>My Account</h3>
          </div>
          <nav className="account-nav">
            <NavLink to="/account" end className={({ isActive }) => `account-nav-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} />
              Overview
            </NavLink>
            <NavLink to="/account/orders" className={({ isActive }) => `account-nav-link ${isActive ? 'active' : ''}`}>
              <Package size={18} />
              My Orders
            </NavLink>
            <NavLink to="/account/wishlist" className={({ isActive }) => `account-nav-link ${isActive ? 'active' : ''}`}>
              <Heart size={18} />
              Wishlist
            </NavLink>
            <NavLink to="/account/addresses" className={({ isActive }) => `account-nav-link ${isActive ? 'active' : ''}`}>
              <MapPin size={18} />
              Addresses
            </NavLink>
            <NavLink to="/account/profile" className={({ isActive }) => `account-nav-link ${isActive ? 'active' : ''}`}>
              <User size={18} />
              Profile Details
            </NavLink>
            <NavLink to="/account/settings" className={({ isActive }) => `account-nav-link ${isActive ? 'active' : ''}`}>
              <Settings size={18} />
              Settings
            </NavLink>
          </nav>
        </aside>

        {/* Account Content Area */}
        <main className="account-content">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
};
