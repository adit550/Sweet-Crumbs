import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Heart, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import './AccountOverview.css';

export const AccountOverview: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="account-overview">
      <div className="account-page-header">
        <h2>Welcome back, {user?.name || 'Customer'}!</h2>
        <p>Here's what's happening with your account and orders.</p>
      </div>

      <div className="summary-cards-grid">
        <div className="account-summary-card">
          <div className="card-icon pending">
            <Clock size={24} />
          </div>
          <div className="card-info">
            <span className="card-value">2</span>
            <span className="card-label">Pending Orders</span>
          </div>
        </div>
        
        <div className="account-summary-card">
          <div className="card-icon total">
            <Package size={24} />
          </div>
          <div className="card-info">
            <span className="card-value">24</span>
            <span className="card-label">Total Orders</span>
          </div>
        </div>
        
        <div className="account-summary-card">
          <div className="card-icon wishlist">
            <Heart size={24} />
          </div>
          <div className="card-info">
            <span className="card-value">8</span>
            <span className="card-label">Wishlist Items</span>
          </div>
        </div>
      </div>

      <div className="current-order-section">
        <div className="section-title-row">
          <h3>Your Current Order</h3>
        </div>
        
        <div className="current-order-card">
          <div className="order-header-info">
            <div className="order-id">
              Order <span className="highlight">#ORD-1024</span>
            </div>
            <div className="order-status-badge preparing">
              Preparing
            </div>
          </div>
          
          <div className="order-items-preview">
            <p>1x Chocolate Cake (Slice), 2x Butter Croissant</p>
            <p className="order-total">Total: <strong>Rp 95.000</strong></p>
          </div>
          
          <div className="order-progress">
            <div className="progress-step completed">Placed</div>
            <div className="progress-line completed"></div>
            <div className="progress-step completed">Confirmed</div>
            <div className="progress-line active"></div>
            <div className="progress-step active">Preparing</div>
            <div className="progress-line"></div>
            <div className="progress-step">Ready</div>
          </div>
          
          <div className="order-actions">
            <Link to="/account/orders/ORD-1024" className="btn btn-primary">
              View Details <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Special Promotion */}
      <div className="account-promo-banner">
        <div className="promo-text">
          <h3>A Sweet Treat Just For You</h3>
          <p>Get 15% OFF your next order with code <strong>SWEET15</strong>.</p>
        </div>
        <Link to="/menu" className="btn btn-outline">Shop Now</Link>
      </div>
    </div>
  );
};
