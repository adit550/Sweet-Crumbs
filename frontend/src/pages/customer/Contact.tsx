import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div style={{ padding: '80px 24px', minHeight: '60vh', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--color-primary)', marginBottom: '16px', fontSize: '3rem' }}>Contact Us</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem' }}>
          We'd love to hear from you! Reach out for custom orders, catering, or any questions.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        <div style={{ background: 'white', padding: '32px', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
          <MapPin size={32} style={{ color: 'var(--color-caramel)', marginBottom: '16px' }} />
          <h3 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--color-primary)', marginBottom: '8px' }}>Visit Us</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>123 Baker Street<br/>Sweet City, SC 12345</p>
        </div>
        <div style={{ background: 'white', padding: '32px', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
          <Phone size={32} style={{ color: 'var(--color-caramel)', marginBottom: '16px' }} />
          <h3 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--color-primary)', marginBottom: '8px' }}>Call Us</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>+1 (555) 123-4567</p>
        </div>
        <div style={{ background: 'white', padding: '32px', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
          <Mail size={32} style={{ color: 'var(--color-caramel)', marginBottom: '16px' }} />
          <h3 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--color-primary)', marginBottom: '8px' }}>Email Us</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>hello@sweetcrumbs.com</p>
        </div>
      </div>
    </div>
  );
};
