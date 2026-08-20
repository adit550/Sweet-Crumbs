import React from 'react';
import { CustomerProductCard } from '../../../components/customer/CustomerProductCard';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../../context/WishlistContext';
import './AccountWishlist.css';

export const AccountWishlist: React.FC = () => {
  const { wishlistItems } = useWishlist();

  return (
    <div className="account-wishlist">
      <div className="account-page-header">
        <h2>My Wishlist</h2>
        <p>Products you've saved for later.</p>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="wishlist-grid">
          {wishlistItems.map((product) => (
            <div key={product.id} className="wishlist-item-wrapper">
              <CustomerProductCard {...product} rating={4.8} />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Heart size={48} className="empty-icon" />
          <h3>Your wishlist is empty</h3>
          <p>Explore our menu to find your new favorite treats.</p>
        </div>
      )}
    </div>
  );
};
