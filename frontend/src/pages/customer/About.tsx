import React from 'react';

export const About: React.FC = () => {
  return (
    <div style={{ padding: '80px 24px', textAlign: 'center', minHeight: '60vh' }}>
      <h1 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--color-primary)', marginBottom: '24px', fontSize: '3rem' }}>About Us</h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
        Sweet Crumbs Bakery is dedicated to bringing you the freshest and most delicious baked goods. 
        Our passion for baking shines through in every pastry, cake, and bread we create.
      </p>
    </div>
  );
};
