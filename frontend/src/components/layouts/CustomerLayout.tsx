import React from 'react';
import { Outlet } from 'react-router-dom';
import { CustomerNavbar } from './CustomerNavbar';
import { CustomerFooter } from '../customer/CustomerFooter';

export const CustomerLayout: React.FC = () => {
  return (
    <div className="customer-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fcfaf8' }}>
      <CustomerNavbar />
      <main className="customer-content" style={{ flex: 1 }}>
        <Outlet />
      </main>
      <CustomerFooter />
    </div>
  );
};
