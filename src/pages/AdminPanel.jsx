import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './AdminPanel.css';

const AdminPanel = ({ categories, sarees }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [newCatName, setNewCatName] = useState('');
  
  const [newSaree, setNewSaree] = useState({
    name: '',
    price: '',
    category_id: '',
    stock: 1,
    imageFile: null
  });
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Authorization check
  if (!user || user.email !== 'karanshirur22@gmail.com') {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Unauthorized</h2>
        <p>You do not have permission to view this page.</p>
        <button onClick={() => navigate('/')} className="btn-primary" style={{ width: 'auto', padding: '10px 20px' }}>Return to Shop</button>
      </div>
    );
  }

  // --- Handlers ---
  
  const handleUpdateStock = async (id, currentStock) => {
    const newStock = prompt("Enter new stock amount:", currentStock);
    if (newStock === null || isNaN(newStock) || newStock < 0) return;
    
    const { error } = await supabase
      .from('sarees')
      .update({ stock: parseInt(newStock) })
      .eq('id', id);
      
    if (error) alert("Error updating stock: " + error.message);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setLoading(true);
    const { error } = await supabase
      .from('categories')
      .insert([{ name: newCatName }]);
    
    if (error) alert("Error adding category: " + error.message);
    else setNewCatName('');
    setLoading(false);
  };

  const handleAddSaree = async (e) => {
    e.preventDefault();
    if (!newSaree.name || !newSaree.price || !newSaree.category_id || !newSaree.imageFile) {
      alert("Please fill all fields and select an image.");
      return;
    }
    
    setUploading(true);
    try {
      // 1. Upload Image to Supabase Storage
      const fileExt = newSaree.imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('saree_images')
        .upload(filePath, newSaree.imageFile);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('saree_images')
        .getPublicUrl(filePath);

      // 3. Insert into Database
      const { error: dbError } = await supabase
        .from('sarees')
        .insert([{
          name: newSaree.name,
          price: parseFloat(newSaree.price),
          category_id: newSaree.category_id,
          stock: parseInt(newSaree.stock),
          image_url: publicUrl
        }]);

      if (dbError) throw dbError;
      
      alert("Saree added successfully!");
      setNewSaree({ name: '', price: '', category_id: '', stock: 1, imageFile: null });
    } catch (error) {
      alert("Error adding saree: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Rootlooms Admin Dashboard</h2>
          <button onClick={() => navigate('/')} className="btn-primary" style={{ width: 'auto', padding: '8px 16px', background: '#333' }}>
            Back to Store
          </button>
        </div>
      </header>

      <div className="container admin-grid">
        {/* Left Column: Forms */}
        <div className="admin-sidebar">
          <div className="admin-card">
            <h3>Add New Category</h3>
            <form onSubmit={handleAddCategory}>
              <input 
                type="text" 
                placeholder="Category Name (e.g. Kanjivaram)" 
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                required
              />
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Adding...' : 'Add Category'}
              </button>
            </form>
          </div>

          <div className="admin-card">
            <h3>Add New Saree</h3>
            <form onSubmit={handleAddSaree}>
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  value={newSaree.name}
                  onChange={e => setNewSaree({ ...newSaree, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input 
                  type="number" 
                  value={newSaree.price}
                  onChange={e => setNewSaree({ ...newSaree, price: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={newSaree.category_id}
                  onChange={e => setNewSaree({ ...newSaree, category_id: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Initial Stock</label>
                <input 
                  type="number" 
                  value={newSaree.stock}
                  onChange={e => setNewSaree({ ...newSaree, stock: e.target.value })}
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Product Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => setNewSaree({ ...newSaree, imageFile: e.target.files[0] })}
                  required
                  style={{ border: 'none', padding: 0 }}
                />
              </div>
              <button type="submit" disabled={uploading} className="btn-primary">
                {uploading ? 'Uploading...' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Stock Management */}
        <div className="admin-main">
          <div className="admin-card">
            <h3>Current Stock</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Updates here will automatically sync to the storefront in real-time.
            </p>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sarees.map(saree => {
                    const cat = categories.find(c => c.id === saree.category_id);
                    return (
                      <tr key={saree.id} style={{ opacity: saree.stock === 0 ? 0.6 : 1 }}>
                        <td><img src={saree.image_url} alt={saree.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} /></td>
                        <td style={{ fontWeight: 500 }}>{saree.name}</td>
                        <td>{cat ? cat.name : 'Unknown'}</td>
                        <td>₹{saree.price}</td>
                        <td>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '12px', 
                            background: saree.stock > 0 ? '#e8f5e9' : '#ffebee',
                            color: saree.stock > 0 ? '#2e7d32' : '#c62828',
                            fontWeight: 'bold'
                          }}>
                            {saree.stock}
                          </span>
                        </td>
                        <td>
                          <button 
                            onClick={() => handleUpdateStock(saree.id, saree.stock)}
                            style={{ padding: '6px 12px', background: 'var(--color-surface)', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
