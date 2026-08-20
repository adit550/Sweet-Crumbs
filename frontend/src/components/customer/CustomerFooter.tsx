import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import './CustomerFooter.css';

export const CustomerFooter: React.FC = () => {
  return (
    <footer className="customer-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand & Story */}
          <div className="footer-brand">
            <h2 className="footer-logo">Sweet Crumbs Bakery</h2>
            <p className="footer-story">
              Baked with passion and made with love. We bring you the freshest artisanal breads, 
              decadent cakes, and sweet treats crafted from premium ingredients every single day.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Instagram">IG</a>
              <a href="#" aria-label="Facebook">FB</a>
              <a href="#" aria-label="Twitter">TW</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Our Menu</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/offers">Special Offers</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div className="footer-links">
            <h3>Account</h3>
            <ul>
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Create Account</Link></li>
              <li><Link to="/account/orders">My Orders</Link></li>
              <li><Link to="/account/wishlist">Wishlist</Link></li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <ul className="contact-info">
              <li>
                <MapPin size={18} />
                <span>123 Baker Street, Sweet City, SC 12345</span>
              </li>
              <li>
                <Phone size={18} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li>
                <Mail size={18} />
                <span>hello@sweetcrumbs.com</span>
              </li>
            </ul>
            <div className="opening-hours">
              <h4>Opening Hours</h4>
              <p>Mon - Fri: 7:00 AM - 8:00 PM</p>
              <p>Sat - Sun: 8:00 AM - 9:00 PM</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Sweet Crumbs Bakery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
