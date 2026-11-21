import { useEffect, useRef, useState } from 'react';
import { UploadCloud, Trash2, LogOut, ImagePlus, BarChart3 } from 'lucide-react';
import { fetchProducts, uploadProduct, deleteProduct } from '../services/api';
import SalesDetails from './SalesDetails';

const AVAILABLE_SIZES = ['Free Size', 'S', 'M', 'L', 'XL', 'XXL'];

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('catalog');
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Silk Sarees');
  const [price, setPrice] = useState('');
  const [selectedSizes, setSelectedSizes] = useState(['Free Size']);
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  const loadCatalogs = () => {
    fetchProducts().then((res) => setProducts(res.data)).catch(console.error);
  };

  useEffect(() => {
    loadCatalogs();
  }, []);

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.length > 1
          ? prev.filter((s) => s !== size)
          : prev
        : [...prev, size]
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert('Please select a dress photo from gallery!');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('sizes', selectedSizes.join(', '));
    formData.append('description', description);
    formData.append('image', imageFile);

    setUploading(true);
    try {
      await uploadProduct(formData);
      setName('');
      setPrice('');
      setSelectedSizes(['Free Size']);
      setDescription('');
      setImageFile(null);
      setPreview('');
      loadCatalogs();
      alert('Catalog uploaded successfully!');
    } catch {
      alert('Upload failed. Check backend connection.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}" from boutique catalog?`)) {
      await deleteProduct(id);
      loadCatalogs();
    }
  };

  return (
    <div className="container">
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h1 className="serif-title" style={{ fontSize: '1.8rem' }}>
          Admin Panel
        </h1>
        <button className="btn-danger" onClick={onLogout}>
          <LogOut size={16} /> Log Out
        </button>
      </div>

      {/* Two Main Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        <button
          className={activeTab === 'catalog' ? 'btn-gold' : 'pill'}
          style={{ borderRadius: 12, padding: 12 }}
          onClick={() => setActiveTab('catalog')}
        >
          <ImagePlus size={17} /> 1. Catalog Upload
        </button>
        <button
          className={activeTab === 'sales' ? 'btn-gold' : 'pill'}
          style={{ borderRadius: 12, padding: 12 }}
          onClick={() => setActiveTab('sales')}
        >
          <BarChart3 size={17} /> 2. Sales Details
        </button>
      </div>

      {activeTab === 'sales' ? (
        <SalesDetails />
      ) : (
        <>
          {/* Upload Catalog Form */}
          <form onSubmit={handleUpload} className="panel-card" style={{ display: 'grid', gap: 14 }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--gold)' }}>Upload New Dress Catalog</h3>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div
              onClick={() => fileInputRef.current.click()}
              style={{
                border: '1.5px dashed var(--gold)',
                borderRadius: 14,
                padding: 20,
                textAlign: 'center',
                cursor: 'pointer',
                background: 'var(--accent-glow)',
              }}
            >
              {preview ? (
                <img src={preview} alt="Preview" style={{ maxHeight: 180, borderRadius: 10 }} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <UploadCloud size={28} color="var(--gold)" />
                  <span style={{ fontWeight: 600 }}>Upload Catalog Photo</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Tap to open gallery & choose outfit image
                  </span>
                </div>
              )}
            </div>

            <input
              className="input-field"
              placeholder="Dress / Saree Name (e.g., Kanchipuram Gold Zari)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Silk Sarees">Silk Sarees</option>
              <option value="Designer Kurtis">Designer Kurtis</option>
              <option value="Bridal Wear">Bridal Wear</option>
              <option value="Casuals">Casuals</option>
            </select>

            {/* Size Selector Pills */}
            <div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                Select Available Sizes:
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {AVAILABLE_SIZES.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    className={`pill ${selectedSizes.includes(sz) ? 'active' : ''}`}
                    onClick={() => toggleSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="number"
              className="input-field"
              placeholder="Price (₹)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <input
              className="input-field"
              placeholder="Fabric / Short Details (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button type="submit" className="btn-gold" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Publish to Store'}
            </button>
          </form>

          {/* Uploaded Catalogs List */}
          <h3 style={{ marginBottom: 12, fontSize: '1.05rem' }}>
            Uploaded Catalogs ({products.length})
          </h3>
          <div className="catalog-grid">
            {products.map((item) => (
              <div key={item.id} className="product-card">
                <div className="product-img-wrap">
                  <img src={item.imageUrl} alt={item.name} />
                </div>
                <div className="product-info">
                  <h4 style={{ fontSize: '0.9rem' }}>{item.name}</h4>
                  <p className="product-price">₹{item.price}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Sizes: {item.sizes || 'Free Size'}
                  </p>
                  <button
                    className="btn-danger"
                    style={{ marginTop: 'auto', width: '100%' }}
                    onClick={() => handleDelete(item.id, item.name)}
                  >
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}