import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ProductCard from './components/ProductCard';
import AdminModal from './components/AdminModal';
import Footer from './components/Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const CACHE_KEY = 'nandhus_products_cache_v1';

export default function App() {
  const [products, setProducts] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(() => !localStorage.getItem(CACHE_KEY));
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const syncProducts = useCallback((updater) => {
    setProducts((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage quota errors
      }
      return next;
    });
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      const list = Array.isArray(res.data) ? res.data : [];
      syncProducts(list);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [syncProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Instant optimistic delete (0ms UI removal)
  const handleDeleteProduct = async (id) => {
    const backup = products;
    syncProducts((prev) => prev.filter((item) => item.id !== id));

    try {
      await axios.delete(`${API_URL}/products/${id}`);
    } catch (err) {
      console.error('Delete failed, restoring item:', err);
      syncProducts(backup);
      alert('Delete failed. Please check your connection.');
    }
  };

  // Instant product addition without full page reload
  const handleProductAdded = (newProduct) => {
    if (newProduct && newProduct.id) {
      syncProducts((prev) => [newProduct, ...prev]);
    } else {
      fetchProducts();
    }
  };

  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <HeroBanner onSelectCategory={setSelectedCategory} />

      <main id="catalog-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Curated Boutique Collection
            </h2>
            <p className="text-stone-500 text-sm mt-1">
              Handpicked luxury wear • Order directly on WhatsApp
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-stone-900 text-amber-300 shadow-sm'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-amber-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-96 animate-pulse border border-stone-200" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200">
            <p className="text-stone-500 text-base">No designs found matching your selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />

      {isAdminOpen && (
        <AdminModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          products={products}
          onProductAdded={handleProductAdded}
          onDeleteProduct={handleDeleteProduct}
          onRefresh={fetchProducts}
        />
      )}
    </div>
  );
}