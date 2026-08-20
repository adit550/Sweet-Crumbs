import React from 'react';
import { Link } from 'react-router-dom';
import { CustomerProductCard } from '../../components/customer/CustomerProductCard';
import { ArrowRight, Star } from 'lucide-react';
import './Home.css';

import butterCroissantImg from '../../assets/products/butter_croissant.jpg';
import chocolateCakeImg from '../../assets/products/chocolate_cake.jpg';
import cinnamonRollImg from '../../assets/products/cinnamon_roll.jpg';
import sourdoughLoafImg from '../../assets/products/sourdough_loaf.jpg';
import donutsImg from '../../assets/products/donuts.jpg';

const MOCK_BEST_SELLERS = [
  {
    id: '1',
    name: 'Butter Croissant',
    category: 'Pastries',
    price: 25000,
    rating: 4.8,
    imageUrl: butterCroissantImg
  },
  {
    id: '2',
    name: 'Chocolate Cake',
    category: 'Cakes',
    price: 250000,
    rating: 4.9,
    imageUrl: chocolateCakeImg
  },
  {
    id: '3',
    name: 'Strawberry Cheesecake',
    category: 'Desserts',
    price: 45000,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Cinnamon Roll',
    category: 'Bread',
    price: 30000,
    rating: 4.6,
    imageUrl: cinnamonRollImg
  }
];

const CATEGORIES = [
  { name: 'Bread', image: sourdoughLoafImg },
  { name: 'Cakes', image: chocolateCakeImg },
  { name: 'Pastries', image: butterCroissantImg },
  { name: 'Donuts', image: donutsImg },
];

export const Home: React.FC = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Freshly Baked, Made With Love</h1>
          <p>Delicious breads, cakes, pastries, and sweet treats freshly baked every day.</p>
          <div className="hero-buttons">
            <Link to="/menu" className="btn btn-primary">
              Explore Menu
            </Link>
            <Link to="/menu" className="btn btn-outline">
              Order Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Explore Our Menu</h2>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map((cat, index) => (
            <Link to={`/menu?category=${cat.name}`} key={index} className="category-card">
              <div className="category-image">
                <img src={cat.image} alt={cat.name} loading="lazy" />
              </div>
              <div className="category-title">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bestsellers-section">
        <div className="section-header flex-between">
          <h2>Our Best Sellers</h2>
          <Link to="/menu" className="view-all-link">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="products-grid">
          {MOCK_BEST_SELLERS.map((product) => (
            <CustomerProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* Special Offer */}
      <section className="promo-section">
        <div className="promo-content">
          <div className="promo-badge">Limited Time</div>
          <h2>Sweet Treats, Special Price</h2>
          <p>Get 20% OFF selected bakery favorites when you order online today.</p>
          <Link to="/offers" className="btn btn-primary">Shop Now</Link>
        </div>
        <div className="promo-image">
          <img src="https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?q=80&w=800&auto=format&fit=crop" alt="Special Offer" />
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-image">
          <img src="https://images.unsplash.com/photo-1556217477-d325251ece38?q=80&w=800&auto=format&fit=crop" alt="Baking process" />
        </div>
        <div className="about-content">
          <h2>Baked With Passion</h2>
          <p>
            For over a decade, Sweet Crumbs Bakery has been crafting the finest artisanal baked goods in the heart of the city. 
            We believe that every great day starts with a great pastry.
          </p>
          <ul className="about-highlights">
            <li>✨ Fresh Ingredients</li>
            <li>👐 Handmade Daily</li>
            <li>🏆 Premium Quality</li>
            <li>🔥 Freshly Baked</li>
          </ul>
          <Link to="/about" className="btn btn-outline">Learn More</Link>
        </div>
      </section>

      {/* Reviews */}
      <section className="reviews-section">
        <div className="section-header">
          <h2>What Our Customers Say</h2>
        </div>
        <div className="reviews-grid">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="review-card">
              <div className="review-rating">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} className="star-icon" fill="currentColor" />)}
              </div>
              <p className="review-text">"Absolutely the best croissants I've ever had! They are always fresh, flaky, and buttery. Highly recommend Sweet Crumbs Bakery."</p>
              <div className="review-author">
                <div className="author-avatar">SC</div>
                <div className="author-info">
                  <span className="author-name">Sarah C.</span>
                  <span className="author-type">Verified Customer</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
