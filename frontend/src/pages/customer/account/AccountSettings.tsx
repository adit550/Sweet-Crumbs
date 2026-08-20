import React from 'react';
import { Bell, Shield } from 'lucide-react';
import './AccountProfile.css';

export const AccountSettings: React.FC = () => {
  return (
    <div className="account-settings">
      <div className="account-page-header">
        <h2>Settings</h2>
        <p>Manage your account preferences and notifications.</p>
      </div>
      
      <div className="profile-container">
        <div className="form-section">
          <h3 className="section-title">
            <Bell size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
            Notification Preferences
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }} />
              <div>
                <strong style={{ display: 'block', color: 'var(--color-text-main)' }}>Order Updates</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Get notified about your order status</span>
              </div>
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }} />
              <div>
                <strong style={{ display: 'block', color: 'var(--color-text-main)' }}>Promotional Offers</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Receive special discounts and offers</span>
              </div>
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }} />
              <div>
                <strong style={{ display: 'block', color: 'var(--color-text-main)' }}>New Products</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Be the first to know about new baked goods</span>
              </div>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">
            <Shield size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
            Privacy
          </h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>
            We take your privacy seriously. You can request to delete your account and all associated data.
          </p>
          <button className="btn" style={{ color: '#e63946', borderColor: '#e63946', background: '#fcebeb' }}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};
