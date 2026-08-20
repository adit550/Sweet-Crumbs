import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Modal } from '../components/Modal';
import './Categories.css';

interface Category {
  id: string;
  name: string;
  description: string;
  itemCount: number;
}

const initialCategories: Category[] = [
  { id: '1', name: 'Bread', description: 'Freshly baked daily breads including sourdough and baguette.', itemCount: 12 },
  { id: '2', name: 'Cake', description: 'Custom and whole cakes for special occasions.', itemCount: 4 },
  { id: '3', name: 'Pastry', description: 'Sweet and savory pastries, croissants, and danishes.', itemCount: 18 },
  { id: '4', name: 'Cookies', description: 'Assorted cookies, biscotti, and macarons.', itemCount: 8 },
  { id: '5', name: 'Donut', description: 'Classic glazed and filled donuts.', itemCount: 6 },
  { id: '6', name: 'Dessert', description: 'Puddings, tarts, and other sweet treats.', itemCount: 10 },
];

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Category, 'id'>>({
    name: '',
    description: '',
    itemCount: 0
  });

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', itemCount: 0 });
    setModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      itemCount: category.itemCount
    });
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      // Update
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...formData, id: c.id } : c));
    } else {
      // Create
      const newId = (categories.length > 0 ? Math.max(...categories.map(c => parseInt(c.id))) + 1 : 1).toString();
      setCategories([...categories, { ...formData, id: newId }]);
    }
    setModalOpen(false);
  };

  return (
    <div className="categories-page">
      <div className="page-header flex-between">
        <div>
          <h1>Category Management</h1>
          <p className="text-muted">Kelola kategori produk bakery Anda.</p>
        </div>
        <button className="primary-btn flex-center" style={{ gap: '8px' }} onClick={handleOpenAdd}>
          <Plus size={20} />
          Add Category
        </button>
      </div>

      <div className="card categories-card">
        <div className="table-responsive">
          <table className="categories-table">
            <thead>
              <tr>
                <th>Nama Kategori</th>
                <th>Deskripsi</th>
                <th>Jumlah Item</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="font-medium category-name-cell">{category.name}</td>
                  <td className="text-muted category-desc-cell">{category.description}</td>
                  <td>
                    <span className="item-count-badge">
                      {category.itemCount} items
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons text-right">
                      <button 
                        className="icon-button edit-btn" 
                        onClick={() => handleOpenEdit(category)}
                        title="Edit Kategori"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        className="icon-button delete-btn" 
                        onClick={() => handleDelete(category.id)}
                        title="Hapus Kategori"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && (
            <div className="empty-state">
              <p>Tidak ada kategori ditemukan.</p>
            </div>
          )}
        </div>
      </div>

      {/* CRUD MODAL */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
      >
        <form onSubmit={handleSubmit} className="crud-form">
          <div className="form-group">
            <label>Nama Kategori</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Pastry"
            />
          </div>
          
          <div className="form-group">
            <label>Deskripsi Kategori</label>
            <textarea 
              rows={3}
              required
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Penjelasan mengenai kategori ini..."
            ></textarea>
          </div>

          <div className="form-actions mt-4">
            <button type="button" className="secondary-btn" onClick={() => setModalOpen(false)}>Batal</button>
            <button type="submit" className="primary-btn">
              {editingCategory ? "Simpan Perubahan" : "Simpan Kategori"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
