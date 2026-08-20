import React from 'react';
import { Link } from 'react-router-dom';

export const Offers: React.FC = () => {
  return (
    <div style={{ padding: '80px 24px', textAlign: 'center', minHeight: '60vh' }}>
      <h1 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--color-primary)', marginBottom: '24px', fontSize: '3rem' }}>Special Offers</h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 40px' }}>
        Discover our latest promotions and sweetest deals. 
        Treat yourself to more for less!
      </p>
      
      <div style={{ background: 'var(--color-primary)', color: 'white', padding: '40px', borderRadius: '16px', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: '"Playfair Display", serif', marginBottom: '16px', fontSize: '2rem' }}>Weekend Special</h2>
        <p style={{ marginBottom: '24px', fontSize: '1.1rem' }}>Get 20% off on all whole cakes this weekend. Use code <strong>CAKE20</strong> at checkout!</p>
        <Link to="/menu" className="btn btn-outline" style={{ borderColor: 'white', color: 'white', background: 'transparent' }}>Shop Now</Link>
      </div>
    </div>
  );
};
