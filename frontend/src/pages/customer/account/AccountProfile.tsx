import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { User, Mail, Phone, Lock, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import './AccountProfile.css';

export const AccountProfile: React.FC = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Profile updated successfully');
    }, 1000);
  };

  return (
    <div className="account-profile">
      <div className="account-page-header">
        <h2>Profile Details</h2>
        <p>Manage your personal information and security.</p>
      </div>

      <div className="profile-container">
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h3 className="section-title">Personal Information</h3>
            
            <div className="form-group-with-icon">
              <label>Full Name</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input type="text" defaultValue={user?.name || ''} required />
              </div>
            </div>
            
            <div className="form-group-with-icon">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input type="email" defaultValue={user?.email || ''} required readOnly className="readonly-input" />
              </div>
              <small className="help-text">Email address cannot be changed.</small>
            </div>
            
            <div className="form-group-with-icon">
              <label>Phone Number</label>
              <div className="input-wrapper">
                <Phone size={18} className="input-icon" />
                <input type="tel" defaultValue="081234567890" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Change Password</h3>
            
            <div className="form-group-with-icon">
              <label>Current Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input type="password" placeholder="••••••••" />
              </div>
            </div>
            
            <div className="form-group-with-icon">
              <label>New Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input type="password" placeholder="••••••••" />
              </div>
            </div>
            
            <div className="form-group-with-icon">
              <label>Confirm New Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input type="password" placeholder="••••••••" />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary save-btn" disabled={isSubmitting}>
              <Save size={18} />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
