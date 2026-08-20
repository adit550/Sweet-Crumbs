import React from 'react';
import { MapPin, Plus, Edit2, Trash2 } from 'lucide-react';
import './AccountProfile.css'; // Reusing profile styles for simplicity

export const AccountAddresses: React.FC = () => {
  return (
    <div className="account-addresses">
      <div className="account-page-header">
        <h2>My Addresses</h2>
        <p>Manage your delivery addresses.</p>
      </div>
      
      <div className="addresses-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
        <div style={{ border: '1px solid var(--color-primary)', padding: '24px', borderRadius: '16px', background: 'var(--color-warning-bg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary-dark)' }}>
              <MapPin size={18} /> Home (Default)
            </h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="icon-btn" style={{ width: '32px', height: '32px' }}><Edit2 size={16} /></button>
              <button className="icon-btn" style={{ width: '32px', height: '32px', color: '#e63946' }}><Trash2 size={16} /></button>
            </div>
          </div>
          <p style={{ color: 'var(--color-text-main)', margin: 0, lineHeight: '1.5' }}>
            John Doe<br/>
            081234567890<br/>
            123 Baker Street, Sweet City, SC 12345
          </p>
        </div>
        
        <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderStyle: 'dashed' }}>
          <Plus size={18} /> Add New Address
        </button>
      </div>
    </div>
  );
};
