import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Modal } from '../components/Modal';
import { formatRupiah } from '../utils/formatCurrency';
import './Products.css';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  status: 'Tersedia' | 'Habis' | 'Draft';
}

const initialProducts: Product[] = [
  { id: '1', name: 'Butter Croissant', category: 'Pastry', price: 35000, stock: 45, description: 'Classic buttery French pastry.', status: 'Tersedia' },
  { id: '2', name: 'Sourdough Loaf', category: 'Bread', price: 45000, stock: 12, description: 'Freshly baked artisan sourdough.', status: 'Tersedia' },
  { id: '3', name: 'Chocolate Chip Cookie', category: 'Cookie', price: 20000, stock: 0, description: 'Soft and chewy with dark chocolate chips.', status: 'Habis' },
  { id: '4', name: 'Almond Croissant', category: 'Pastry', price: 38000, stock: 28, description: 'Croissant filled with sweet almond paste.', status: 'Tersedia' },
];

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    category: 'Bread',
    price: 0,
    stock: 0,
    description: '',
    status: 'Tersedia'
  });

  const categories = ['Bread', 'Pastry', 'Cookie', 'Muffin', 'Cake'];

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({ name: '', category: 'Bread', price: 0, stock: 0, description: '', status: 'Tersedia' });
    setModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description,
      status: product.status
    });
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      // Update
      setProducts(products.map(p => p.id === editingProduct.id ? { ...formData, id: p.id } : p));
    } else {
      // Create
      const newId = (products.length > 0 ? Math.max(...products.map(p => parseInt(p.id))) + 1 : 1).toString();
      setProducts([...products, { ...formData, id: newId }]);
    }
    setModalOpen(false);
  };

  return (
    <div className="products-page">
      <div className="page-header flex-between">
        <div>
          <h1>Product Management</h1>
          <p className="text-muted">Kelola katalog produk, harga, dan stok.</p>
        </div>
        <button className="primary-btn flex-center" style={{ gap: '8px' }} onClick={handleOpenAdd}>
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="card products-card">
        <div className="card-header flex-between">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Cari nama atau kategori..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-muted text-sm">
            Total {filteredProducts.length} produk
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="products-table">
            <thead>
              <tr>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Status</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-muted text-sm truncate-text" style={{ maxWidth: '250px' }}>{product.description}</div>
                  </td>
                  <td>
                    <span className="category-chip">{product.category}</span>
                  </td>
                  <td className="font-medium">{formatRupiah(product.price)}</td>
                  <td>
                    <span className={`stock-text ${product.stock < 10 ? 'low-stock' : ''}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${product.status.toLowerCase()}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons text-right">
                      <button className="icon-btn edit-btn" onClick={() => handleOpenEdit(product)} title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="icon-btn delete-btn" onClick={() => handleDelete(product.id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="empty-state">
              <p>Tidak ada produk ditemukan.</p>
            </div>
          )}
        </div>
      </div>

      {/* CRUD MODAL */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
      >
        <form onSubmit={handleSubmit} className="crud-form">
          <div className="form-group">
            <label>Nama Produk</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Croissant"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Kategori</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Status Tersedia</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as Product['status']})}
              >
                <option value="Tersedia">Tersedia</option>
                <option value="Habis">Habis</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Harga (Rp)</label>
              <input 
                type="number" 
                step="500"
                min="0"
                required
                value={formData.price}
                onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="form-group">
              <label>Stok Awal</label>
              <input 
                type="number" 
                min="0"
                required
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Deskripsi</label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Penjelasan singkat mengenai produk ini..."
            ></textarea>
          </div>

          <div className="form-actions mt-4">
            <button type="button" className="secondary-btn" onClick={() => setModalOpen(false)}>Batal</button>
            <button type="submit" className="primary-btn">
              {editingProduct ? "Simpan Perubahan" : "Simpan Produk"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
