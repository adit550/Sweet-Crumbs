import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CustomerProductCard } from '../../components/customer/CustomerProductCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import './Menu.css';



export const Menu: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [maxPrice, setMaxPrice] = useState<number>(Infinity);

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);

  // Derived available maximum price from all original products
  const availableMaxPrice = products.length > 0 
    ? Math.max(...products.map(p => Number(p.price))) 
    : 100000;

  // Sync maxPrice with availableMaxPrice once products are loaded if it's still Infinity
  useEffect(() => {
    if (products.length > 0 && maxPrice === Infinity) {
      setMaxPrice(availableMaxPrice);
    }
  }, [products, availableMaxPrice]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/merch');
      if (res.ok) {
        const data = await res.json();
        const mappedData = data.map((item: any) => ({
          ...item,
          rating: 4.5, // Dummy rating since backend doesn't have it
          imageUrl: item.imageUrl || 'https://placehold.co/200x200/fcf9f5/8b5a2b?text=Image'
        }));
        setProducts(mappedData);

        // Derive categories
        const catSet = new Set<string>();
        mappedData.forEach((p: any) => {
          if (p.category) catSet.add(p.category);
        });
        setCategories(['All', ...Array.from(catSet)]);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
      setActiveCategory('All');
    }
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = Number(product.price) <= maxPrice;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const contentRef = React.useRef<HTMLDivElement>(null);
  const [lockedHeight, setLockedHeight] = useState<number>(0);

  // Merekam tinggi maksimal area konten agar tidak pernah menyusut (mencegah jump layout)
  useEffect(() => {
    if (contentRef.current) {
      const currentHeight = contentRef.current.offsetHeight;
      if (currentHeight > lockedHeight) {
        setLockedHeight(currentHeight);
      }
    }
  }, [filteredProducts, lockedHeight]);

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>Our Menu</h1>
        <p>Discover our freshly baked selection, crafted with premium ingredients.</p>
      </div>

      <div className="menu-container">
        {/* Sidebar Filters */}
        <aside className="menu-sidebar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className="filter-section">
            <h3><Filter size={18} /> Categories</h3>
            <ul className="category-list">
              {categories.map(category => (
                <li key={category}>
                  <button 
                    className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                    {category !== 'All' && <span className="count">
                      ({products.filter(p => p.category === category).length})
                    </span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-section">
            <h3><SlidersHorizontal size={18} /> Price Range</h3>
            {/* Price filter */}
            <div className="price-filter">
              <input 
                type="range" 
                min="0" 
                max={availableMaxPrice} 
                step="5000"
                className="range-slider" 
                value={maxPrice === Infinity ? availableMaxPrice : maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
              <div className="price-labels">
                <span>Rp 0</span>
                <span>Rp {((maxPrice === Infinity ? availableMaxPrice : maxPrice) / 1000).toFixed(0)}k</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div 
          className="menu-content" 
          ref={contentRef}
          style={{ minHeight: lockedHeight > 0 ? `${lockedHeight}px` : undefined }}
        >
          <div className="menu-results-header">
            <span>Showing {filteredProducts.length} results</span>
            <div className="sort-dropdown">
              <select>
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Highest Rated</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="menu-grid">
              {filteredProducts.map(product => (
                <CustomerProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="no-results" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters.</p>
              <button className="btn btn-outline" onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
                setSearchParams({});
                setMaxPrice(availableMaxPrice);
              }}>Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

