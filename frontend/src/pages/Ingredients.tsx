import React, { useState } from 'react';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { Modal } from '../components/Modal';
import './Ingredients.css';

interface Ingredient {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minStock: number;
}

const initialIngredients: Ingredient[] = [
  { id: '1', name: 'Tepung', unit: 'kg', currentStock: 125, minStock: 50 },
  { id: '2', name: 'Gula', unit: 'kg', currentStock: 45, minStock: 20 },
  { id: '3', name: 'Telur', unit: 'pcs', currentStock: 360, minStock: 200 },
  { id: '4', name: 'Butter', unit: 'kg', currentStock: 8, minStock: 15 },
  { id: '5', name: 'Cokelat', unit: 'kg', currentStock: 20, minStock: 10 },
  { id: '6', name: 'Susu', unit: 'L', currentStock: 22, minStock: 10 },
];

export const Ingredients: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Ingredient, 'id'>>({
    name: '',
    unit: 'kg',
    currentStock: 0,
    minStock: 0
  });

  const handleOpenAdd = () => {
    setEditingIngredient(null);
    setFormData({ name: '', unit: 'kg', currentStock: 0, minStock: 0 });
    setModalOpen(true);
  };

  const handleOpenEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setFormData({
      name: ingredient.name,
      unit: ingredient.unit,
      currentStock: ingredient.currentStock,
      minStock: ingredient.minStock
    });
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus bahan baku ini?')) {
      setIngredients(ingredients.filter(i => i.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIngredient) {
      // Update
      setIngredients(ingredients.map(i => i.id === editingIngredient.id ? { ...formData, id: i.id } : i));
    } else {
      // Create
      const newId = (ingredients.length > 0 ? Math.max(...ingredients.map(i => parseInt(i.id))) + 1 : 1).toString();
      setIngredients([...ingredients, { ...formData, id: newId }]);
    }
    setModalOpen(false);
  };

  const getStatus = (current: number, min: number) => {
    if (current === 0) return { label: 'Out of Stock', class: 'status-danger' };
    if (current <= min) return { label: 'Low Stock', class: 'status-warning' };
    return { label: 'In Stock', class: 'status-success' };
  };

  return (
    <div className="ingredients-page">
      <div className="page-header flex-between">
        <div>
          <h1>Ingredient Management</h1>
          <p className="text-muted">Monitor dan kelola inventaris bahan baku Anda.</p>
        </div>
        <button className="primary-btn flex-center" style={{ gap: '8px' }} onClick={handleOpenAdd}>
          <Plus size={20} />
          Add Ingredient
        </button>
      </div>

      <div className="card ingredients-card">
        <div className="table-responsive">
          <table className="ingredients-table">
            <thead>
              <tr>
                <th>Nama Bahan Baku</th>
                <th>Stok Saat Ini</th>
                <th>Stok Minimum</th>
                <th>Status</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ingredient) => {
                const status = getStatus(ingredient.currentStock, ingredient.minStock);
                return (
                  <tr key={ingredient.id}>
                    <td className="font-medium ingredient-name-cell">{ingredient.name}</td>
                    <td>
                      <span className="stock-value">{ingredient.currentStock}</span> 
                      <span className="text-muted text-sm"> {ingredient.unit}</span>
                    </td>
                    <td>
                      <span className="text-muted">{ingredient.minStock} {ingredient.unit}</span>
                    </td>
                    <td>
                      <div className={`status-badge-inline ${status.class}`}>
                        {status.class === 'status-warning' || status.class === 'status-danger' ? (
                          <AlertCircle size={14} className="status-icon" />
                        ) : null}
                        {status.label}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons text-right">
                        <button 
                          className="icon-button edit-btn" 
                          onClick={() => handleOpenEdit(ingredient)}
                          title="Edit Bahan Baku"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          className="icon-button delete-btn" 
                          onClick={() => handleDelete(ingredient.id)}
                          title="Hapus Bahan Baku"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {ingredients.length === 0 && (
            <div className="empty-state">
              <p>Tidak ada bahan baku ditemukan.</p>
            </div>
          )}
        </div>
      </div>

      {/* CRUD MODAL */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={editingIngredient ? "Edit Bahan Baku" : "Tambah Bahan Baku Baru"}
      >
        <form onSubmit={handleSubmit} className="crud-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nama Bahan Baku</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Tepung Terigu"
              />
            </div>
            <div className="form-group">
              <label>Satuan (Unit)</label>
              <select 
                value={formData.unit}
                onChange={e => setFormData({...formData, unit: e.target.value})}
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="g">Gram (g)</option>
                <option value="L">Liter (L)</option>
                <option value="ml">Mililiter (ml)</option>
                <option value="pcs">Pieces (pcs)</option>
              </select>
            </div>
          </div>
          
          <div className="form-row mt-3">
            <div className="form-group">
              <label>Stok Saat Ini</label>
              <input 
                type="number" 
                min="0"
                step="0.1"
                required
                value={formData.currentStock}
                onChange={e => setFormData({...formData, currentStock: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="form-group">
              <label>Batas Stok Minimum (Peringatan)</label>
              <input 
                type="number" 
                min="0"
                step="0.1"
                required
                value={formData.minStock}
                onChange={e => setFormData({...formData, minStock: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>

          <div className="form-actions mt-4">
            <button type="button" className="secondary-btn" onClick={() => setModalOpen(false)}>Batal</button>
            <button type="submit" className="primary-btn">
              {editingIngredient ? "Simpan Perubahan" : "Simpan Bahan Baku"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
