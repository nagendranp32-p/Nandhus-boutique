import { useEffect, useState } from 'react';
import { fetchProducts } from './services/api';
import LoadingScreen from './components/LoadingScreen';
import BrandSplash from './components/BrandSplash';
import Navbar from './components/Navbar';
import MenuDrawer from './components/MenuDrawer';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [stage, setStage] = useState('loading');
  const [history, setHistory] = useState(['home']);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('nandhus_admin') === 'true');

  const currentPage = history[history.length - 1];

  const loadAllProducts = () => {
    setLoadingProducts(true);
    fetchProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingProducts(false));
  };

  useEffect(() => {
    loadAllProducts();
    const t1 = setTimeout(() => setStage('splash'), 1100);
    const t2 = setTimeout(() => setStage('app'), 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [darkMode]);

  const navigateTo = (nextPage) => {
    if (nextPage === 'home') loadAllProducts();
    if (nextPage !== currentPage) {
      setHistory((prev) => [...prev, nextPage]);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    if (currentPage !== 'details') {
      setHistory((prev) => [...prev, 'details']);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (history.length > 1) {
      const nextHistory = history.slice(0, -1);
      if (nextHistory[nextHistory.length - 1] === 'home') loadAllProducts();
      setHistory(nextHistory);
    } else {
      setHistory(['home']);
    }
  };

  const goHome = () => {
    loadAllProducts();
    setHistory(['home']);
  };

  const handleAdminSuccess = () => {
    localStorage.setItem('nandhus_admin', 'true');
    setIsAdmin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('nandhus_admin');
    setIsAdmin(false);
    loadAllProducts();
    setHistory(['home']);
  };

  if (stage === 'loading') return <LoadingScreen />;
  if (stage === 'splash') return <BrandSplash />;

  return (
    <>
      <Navbar
        onOpenMenu={() => setMenuOpen(true)}
        onGoHome={goHome}
        showBack={currentPage !== 'home'}
        onBack={goBack}
      />

      <MenuDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        isAdmin={isAdmin}
        onNavigate={navigateTo}
        onLogout={handleLogout}
      />

      {currentPage === 'home' && (
        <Home
          products={products}
          loading={loadingProducts}
          onSelectProduct={handleSelectProduct}
        />
      )}

      {currentPage === 'details' && (
        <ProductDetails
          product={selectedProduct}
          allProducts={products}
          onSelectProduct={handleSelectProduct}
        />
      )}

      {currentPage === 'admin' &&
        (isAdmin ? (
          <AdminDashboard onLogout={handleLogout} />
        ) : (
          <AdminLogin onSuccess={handleAdminSuccess} />
        ))}
    </>
  );
}