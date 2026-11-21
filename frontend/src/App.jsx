import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ProductCard from './components/ProductCard';
import AdminModal from './components/AdminModal';
import Footer from './components/Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const CACHE_KEY = 'nandhus_products_cache_v1';

// Pre-warm Axios instance with timeout so requests never hang forever
const api = axios.create({
  baseURL: API_URL,
  timeout: 25000,
});

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
  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return !cached || JSON.parse(cached).length === 0;
    } catch {
      return true;
    }
  });
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
      const res = await api.get('/products');
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

  // 0ms Instant Optimistic Delete (never suffers from stale closure)
  const handleDeleteProduct = useCallback(
    async (id) => {
      let deletedItem = null;
      let deletedIndex = -1;

      syncProducts((prev) => {
        deletedIndex = prev.findIndex((item) => item.id === id);
        if (deletedIndex !== -1) {
          deletedItem = prev[deletedIndex];
        }
        return prev.filter((item) => item.id !== id);
      });

      try {
        await api.delete(`/products/${id}`);
      } catch (err) {
        console.error('Delete failed, restoring item:', err);
        if (deletedItem) {
          syncProducts((prev) => {
            const restored = [...prev];
            restored.splice(Math.max(0, deletedIndex), 0, deletedItem);
            return restored;
          });
        }
        alert('Delete failed. Please check your connection.');
      }
    },
    [syncProducts]
  );

  // 0ms Instant Product Addition (and instant update if editing)
  const handleProductAdded = useCallback(
    (newProduct) => {
      if (newProduct && newProduct.id) {
        syncProducts((prev) => {
          const exists = prev.some((p) => p.id === newProduct.id);
          return exists
            ? prev.map((p) => (p.id === newProduct.id ? newProduct : p))
            : [newProduct, ...prev];
        });
      } else {
        fetchProducts();
      }
    },
    [syncProducts, fetchProducts]
  );

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

        {loading && products.length === 0 ? (
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