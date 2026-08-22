import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { calculateSubtotal, calculateDelivery, calculateTotal } from '../../utils/cartCalculations';
import './Cart.css';

export const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const removeItem = (id: string) => {
    removeFromCart(id);
  };

  const subtotal = calculateSubtotal(cartItems);
  const discount = 0; // Or calculate based on promo code
  const delivery = calculateDelivery(subtotal);
  const total = calculateTotal(subtotal, discount, delivery);

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Your Shopping Cart</h1>
        <p>Review your items before checkout.</p>
      </div>

      {cartItems.length > 0 ? (
        <div className="cart-container">
          <div className="cart-items-section">
            <div className="cart-items-header">
              <div className="col-product">Product</div>
              <div className="col-price">Price</div>
              <div className="col-quantity">Quantity</div>
              <div className="col-total">Subtotal</div>
              <div className="col-action"></div>
            </div>
            
            <div className="cart-items-list">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="col-product">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="item-image" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/200x200/fcf9f5/8b5a2b?text=SC';
                      }}
                    />
                    <div className="item-details">
                      <span className="item-category">{item.category}</span>
                      <Link to={`/product/${item.id}`} className="item-name">{item.name}</Link>
                    </div>
                  </div>
                  <div className="col-price">Rp {item.price.toLocaleString('id-ID')}</div>
                  <div className="col-quantity">
                    <div className="qty-control">
                      <button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease"><Minus size={14}/></button>
                      <input type="text" value={item.quantity} readOnly />
                      <button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase"><Plus size={14}/></button>
                    </div>
                  </div>
                  <div className="col-total font-semibold">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </div>
                  <div className="col-action">
                    <button className="remove-btn" onClick={() => removeItem(item.id)} aria-label="Remove item">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-actions">
              <Link to="/menu" className="btn btn-outline">Continue Shopping</Link>
            </div>
          </div>

          <div className="cart-summary-section">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              
              <div className="summary-row">
                <span>Discount</span>
                <span className="text-success">- Rp {discount.toLocaleString('id-ID')}</span>
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
                className="btn btn-primary checkout-btn"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-cart">
          <ShoppingCart size={64} className="empty-icon" />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any sweet treats yet.</p>
          <Link to="/menu" className="btn btn-primary">Start Shopping</Link>
        </div>
      )}
    </div>
  );
};
