import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './CustomerProductCard.css';

interface CustomerProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  imageUrl: string;
}

export const CustomerProductCard: React.FC<CustomerProductCardProps> = ({
  id,
  name,
  category,
  price,
  rating,
  imageUrl
}) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isWished = isInWishlist(id);

  const handleAddToCart = () => {
    addToCart({ id, name, category, price, imageUrl });
    toast.success(`${name} added to cart!`);
  };

  const handleToggleWishlist = () => {
    toggleWishlist({ id, name, category, price, imageUrl });
    if (!isWished) {
      toast.success(`${name} added to wishlist!`);
    } else {
      toast.success(`${name} removed from wishlist!`);
    }
  };

  return (
    <div className="customer-product-card">
      <div className="product-image-container">
        <img 
          src={imageUrl} 
          alt={name} 
          className="product-image" 
          loading="lazy" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/fcf9f5/8b5a2b?text=Sweet+Crumbs';
          }}
        />
        <button 
          className={`wishlist-btn ${isWished ? 'active' : ''}`} 
          aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={handleToggleWishlist}
        >
          <Heart size={20} fill={isWished ? 'currentColor' : 'none'} className={isWished ? 'text-danger' : ''} />
        </button>
      </div>
      
      <div className="product-info">
        <div className="product-category">{category}</div>
        <h3 className="product-name">
          <Link to={`/product/${id}`}>{name}</Link>
        </h3>
        
        <div className="product-rating">
          <Star size={14} className="star-icon" fill="currentColor" />
          <span>{rating.toFixed(1)}</span>
        </div>
        
        <div className="product-footer">
          <span className="product-price">Rp {price.toLocaleString('id-ID')}</span>
          <button className="add-to-cart-btn" aria-label="Add to cart" onClick={handleAddToCart}>
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
