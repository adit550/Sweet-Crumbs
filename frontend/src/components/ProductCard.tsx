import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { formatRupiah } from '../utils/formatCurrency';
import './ProductCard.css';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

interface ProductCardProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  const statusClass = product.status === 'In Stock' 
    ? 'status-in-stock' 
    : product.status === 'Low Stock' 
      ? 'status-low-stock' 
      : 'status-out-of-stock';

  return (
    <div className="card product-card">
      <div className="product-image-container">
        <img src={product.imageUrl} alt={product.name} className="product-image" />
        <span className={`product-status-badge ${statusClass}`}>
          {product.status}
        </span>
      </div>
      
      <div className="product-details">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-footer">
          <div className="product-price">{formatRupiah(product.price)}</div>
          <div className="product-stock text-muted">Stock: {product.stock}</div>
        </div>
      </div>

      <div className="product-actions">
        <button 
          className="icon-button edit-btn" 
          onClick={() => onEdit(product.id)}
          title="Edit Product"
        >
          <Edit size={16} />
        </button>
        <button 
          className="icon-button delete-btn" 
          onClick={() => onDelete(product.id)}
          title="Delete Product"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
