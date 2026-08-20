import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, ChevronDown, LogOut, Package, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './CustomerNavbar.css';

export const CustomerNavbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { cartTotalItems } = useCart();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="customer-navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          Sweet Crumbs <span>Bakery</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/about">About</Link>
          <Link to="/offers">Offers</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="nav-actions">
          {showSearch ? (
            <form 
              className="navbar-search-form" 
              onSubmit={(e) => { 
                e.preventDefault(); 
                if (searchQuery.trim()) {
                  navigate(`/menu?q=${encodeURIComponent(searchQuery)}`); 
                  setShowSearch(false);
                }
              }}
            >
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus 
              />
              <button type="button" className="close-search-btn" onClick={() => setShowSearch(false)}>&times;</button>
            </form>
          ) : (
            <button className="icon-btn" title="Search" onClick={() => setShowSearch(true)}>
              <Search size={20} />
            </button>
          )}
          
          <Link to="/cart" className="icon-btn cart-btn" title="Cart">
            <ShoppingCart size={20} />
            {cartTotalItems > 0 && <span className="cart-badge">{cartTotalItems}</span>}
          </Link>
          
          {isAuthenticated ? (
            <div className="user-dropdown-container" 
                 onMouseEnter={() => setShowDropdown(true)}
                 onMouseLeave={() => setShowDropdown(false)}>
              <div className="user-dropdown-trigger">
                <div className="user-avatar">
                  <User size={18} />
                </div>
                <span className="user-name">Hi, {user?.name || 'Customer'}</span>
                <ChevronDown size={14} className="dropdown-arrow" />
              </div>
              
              {showDropdown && (
                <div className="user-dropdown-menu">
                  <Link to="/account" className="dropdown-item">
                    <User size={16} />
                    <span>My Account</span>
                  </Link>
                  <Link to="/account/orders" className="dropdown-item">
                    <Package size={16} />
                    <span>My Orders</span>
                  </Link>
                  <Link to="/account/wishlist" className="dropdown-item">
                    <Heart size={16} />
                    <span>Wishlist</span>
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item text-danger">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-btn">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
};
