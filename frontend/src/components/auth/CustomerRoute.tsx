import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const CustomerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isCustomer, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading-state">Loading...</div>;
  }

  if (!isAuthenticated) {
    toast.error('Please login to continue.');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isCustomer) {
    // Admin trying to access customer private page
    toast.error('Access Denied: Admin cannot access customer private pages.');
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};
