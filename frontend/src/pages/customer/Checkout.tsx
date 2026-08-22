import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, MapPin, CreditCard, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { calculateSubtotal, calculateDelivery, calculateTotal } from '../../utils/cartCalculations';
import './Checkout.css';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.email || '');

  const subtotal = calculateSubtotal(cartItems);
  const delivery = calculateDelivery(subtotal);
  const total = calculateTotal(subtotal, 0, delivery);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      setIsSubmitting(false);
      return;
    }

    const orderPayload = {
      customerName: customerName || 'Walk-in Customer',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      totalAmount: total,
      items: cartItems.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price
      }))
    };

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(orderPayload)
      });
      
      if (res.ok) {
        toast.success('Order placed successfully!');
        clearCart();
        navigate('/account/orders');
      } else {
        toast.error('Failed to place order.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>Complete your order</p>
      </div>

      <div className="checkout-container">
        <form onSubmit={handleSubmit} className="checkout-form-section">
          
          {/* Customer Info */}
          <div className="checkout-section">
            <h3 className="section-title">
              <User size={20} className="section-icon" />
              Customer Information
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="John Doe" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" required placeholder="john@example.com" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" required placeholder="08123456789" />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="checkout-section">
            <h3 className="section-title">
              <MapPin size={20} className="section-icon" />
              Delivery Address
            </h3>
            <div className="form-group">
              <label>Complete Address</label>
              <textarea rows={3} required placeholder="Street name, building, house number"></textarea>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>City</label>
                <input type="text" required placeholder="City name" />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input type="text" required placeholder="12345" />
              </div>
            </div>
            <div className="form-group">
              <label>Delivery Notes (Optional)</label>
              <input type="text" placeholder="e.g. Leave at the front gate" />
            </div>
          </div>

          {/* Payment Method */}
          <div className="checkout-section">
            <h3 className="section-title">
              <CreditCard size={20} className="section-icon" />
              Payment Method
            </h3>
            <div className="payment-options">
              <label className="payment-option">
                <input type="radio" name="payment" value="transfer" defaultChecked />
                <div className="option-content">
                  <span className="option-title">Bank Transfer</span>
                  <span className="option-desc">BCA, Mandiri, BNI, BRI</span>
                </div>
              </label>
              <label className="payment-option">
                <input type="radio" name="payment" value="ewallet" />
                <div className="option-content">
                  <span className="option-title">E-Wallet</span>
                  <span className="option-desc">GoPay, OVO, Dana, ShopeePay</span>
                </div>
              </label>
              <label className="payment-option">
                <input type="radio" name="payment" value="qris" />
                <div className="option-content">
                  <span className="option-title">QRIS</span>
                  <span className="option-desc">Pay with any supported app</span>
                </div>
              </label>
            </div>
          </div>

        </form>

        <div className="checkout-summary-section">
          <div className="summary-card">
            <h3>Order Summary</h3>
            
            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item.id} className="summary-item">
                  <span className="item-name">{item.quantity}x {item.name}</span>
                  <span className="item-price">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>Rp {delivery.toLocaleString('id-ID')}</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row total-row">
              <span>Total</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
            
            <button 
              className="btn btn-primary place-order-btn"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : (
                <>
                  <CheckCircle2 size={20} />
                  Place Order
                </>
              )}
            </button>
            <p className="secure-checkout-text">
              🔒 Secure encrypted checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
