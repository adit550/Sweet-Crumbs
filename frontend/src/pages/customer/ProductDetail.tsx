import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, Minus, Plus, ShoppingCart, Truck, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { CustomerProductCard } from '../../components/customer/CustomerProductCard';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductDetail.css';

import butterCroissantImg from '../../assets/products/butter_croissant.jpg';
import chocolateCakeImg from '../../assets/products/chocolate_cake.jpg';

const MOCK_PRODUCTS_DB: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Butter Croissant',
    category: 'Pastries',
    price: 25000,
    rating: 4.8,
    reviews: 124,
    description: 'Our signature butter croissant is baked fresh every morning. Made with 100% French AOP butter, each bite offers a perfect shatter of delicate, flaky layers revealing a soft, honeycomb interior. Perfectly golden and irresistibly aromatic.',
    ingredients: 'Wheat Flour, French AOP Butter, Water, Sugar, Yeast, Salt, Milk, Eggs',
    availability: 'In Stock',
    imageUrl: butterCroissantImg
  },
  '2': {
    id: '2',
    name: 'Chocolate Cake',
    category: 'Cakes',
    price: 250000,
    rating: 4.9,
    reviews: 86,
    description: 'Decadent, rich, and intensely chocolatey. This multi-layered chocolate cake is made with premium Belgian dark chocolate and covered in a silky smooth ganache. A true delight for chocolate lovers.',
    ingredients: 'Flour, Belgian Dark Chocolate, Cocoa Powder, Butter, Sugar, Eggs, Milk, Vanilla Extract',
    availability: 'In Stock',
    imageUrl: chocolateCakeImg
  }
};

const SUGGESTIONS = [
  { id: '2', name: 'Chocolate Cake', category: 'Cakes', price: 250000, rating: 4.9, imageUrl: chocolateCakeImg },
  { id: '1', name: 'Butter Croissant', category: 'Pastries', price: 25000, rating: 4.8, imageUrl: butterCroissantImg },
  { id: '6', name: 'Glazed Donut', category: 'Donuts', price: 15000, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600&auto=format&fit=crop' }
];

export const ProductDetail: React.FC = () => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  // Fallback to product '1' if ID is missing or invalid
  const productData = id && MOCK_PRODUCTS_DB[id] ? MOCK_PRODUCTS_DB[id] : MOCK_PRODUCTS_DB['1'];
  
  const isWished = isInWishlist(productData.id);

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => q > 1 ? q - 1 : 1);

  const handleAddToCart = () => {
    for(let i=0; i<quantity; i++) {
      addToCart({
        id: productData.id,
        name: productData.name,
        category: productData.category,
        price: productData.price,
        imageUrl: productData.imageUrl
      });
    }
    toast.success(`${quantity}x ${productData.name} added to cart!`);
    setQuantity(1);
  };

  const handleToggleWishlist = () => {
    toggleWishlist({ 
      id: productData.id, 
      name: productData.name, 
      category: productData.category, 
      price: productData.price, 
      imageUrl: productData.imageUrl 
    });
    if (!isWished) {
      toast.success(`${productData.name} added to wishlist!`);
    } else {
      toast.success(`${productData.name} removed from wishlist!`);
    }
  };

  return (
    <div className="product-detail-page">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span className="separator">/</span>
        <Link to={`/menu?category=${productData.category}`}>{productData.category}</Link>
        <span className="separator">/</span>
        <span className="current">{productData.name}</span>
      </div>

      <div className="product-detail-container">
        {/* Left: Image */}
        <div className="product-image-section">
          <div className="main-image">
            <img 
              src={productData.imageUrl} 
              alt={productData.name} 
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/800x800/fcf9f5/8b5a2b?text=Sweet+Crumbs';
              }}
            />
          </div>
        </div>

        {/* Right: Info */}
        <div className="product-info-section">
          <div className="product-meta">
            <span className="category-tag">{productData.category}</span>
            <span className={`status-tag ${productData.availability === 'In Stock' ? 'in-stock' : ''}`}>
              {productData.availability}
            </span>
          </div>

          <h1 className="product-title">{productData.name}</h1>
          
          <div className="product-rating-reviews">
            <div className="stars">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={18} className="star-icon" fill={star <= Math.floor(productData.rating) ? 'currentColor' : 'none'} />
              ))}
            </div>
            <span className="rating-score">{productData.rating}</span>
            <span className="review-count">({productData.reviews} reviews)</span>
          </div>

          <div className="product-price-large">
            Rp {productData.price.toLocaleString('id-ID')}
          </div>

          <p className="product-description">{productData.description}</p>

          <div className="product-features">
            <div className="feature">
              <Clock size={20} />
              <span>Baked fresh daily</span>
            </div>
            <div className="feature">
              <Truck size={20} />
              <span>Delivery available</span>
            </div>
          </div>

          <div className="add-to-cart-section">
            <div className="quantity-selector">
              <button onClick={decrement} aria-label="Decrease quantity"><Minus size={18} /></button>
              <input type="number" value={quantity} readOnly />
              <button onClick={increment} aria-label="Increase quantity"><Plus size={18} /></button>
            </div>
            
            <button className="btn btn-primary add-btn" onClick={handleAddToCart}>
              <ShoppingCart size={20} />
              Add to Cart
            </button>
            
            <button 
              className={`btn wishlist-btn-large ${isWished ? 'active' : ''}`} 
              aria-label={isWished ? 'Remove from Wishlist' : 'Add to Wishlist'}
              onClick={handleToggleWishlist}
            >
              <Heart size={24} fill={isWished ? 'currentColor' : 'none'} className={isWished ? 'text-danger' : ''} />
            </button>
          </div>

          <button className="btn btn-primary buy-now-btn">Buy Now</button>

          <div className="ingredients-section">
            <h3>Ingredients</h3>
            <p>{productData.ingredients}</p>
          </div>
        </div>
      </div>

      {/* Suggested Products */}
      <section className="suggestions-section">
        <h2 className="section-title">You May Also Like</h2>
        <div className="suggestions-grid">
          {SUGGESTIONS.map(product => (
            <CustomerProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>
    </div>
  );
};
