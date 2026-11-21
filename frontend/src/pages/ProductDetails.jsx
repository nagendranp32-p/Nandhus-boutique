import { useEffect, useState } from 'react';
import { MessageCircle, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import CatalogCard from '../components/CatalogCard';

const SHOP_WHATSAPP = '919360219967';

export default function ProductDetails({ product, allProducts, onSelectProduct }) {
  const availableSizes = product?.sizes
    ? product.sizes.split(',').map((s) => s.trim()).filter(Boolean)
    : ['Free Size', 'S', 'M', 'L', 'XL'];

  const [selectedSize, setSelectedSize] = useState(availableSizes[0]);

  useEffect(() => {
    setSelectedSize(availableSizes[0]);
  }, [product]);

  if (!product) return null;

  const relatedProducts = allProducts.filter(
    (item) => item.category === product.category && item.id !== product.id
  );

  const displayRelated =
    relatedProducts.length > 0
      ? relatedProducts
      : allProducts.filter((item) => item.id !== product.id).slice(0, 4);

  const handleOrderNow = () => {
    const text = encodeURIComponent(
      `Vanakkam Nandhu's Boutique!\nI would like to order:\n• *Outfit:* ${product.name}\n• *Category:* ${product.category}\n• *Size:* ${selectedSize}\n• *Price:* ₹${product.price}`
    );
    window.open(`https://wa.me/${SHOP_WHATSAPP}?text=${text}`, '_blank');
  };

  return (
    <div className="container fade-up">
      <div className="details-layout">
        <div className="details-img-box">
          <span className="category-tag">{product.category}</span>
          <img src={product.imageUrl} alt={product.name} />
        </div>

        <div className="details-content">
          <p style={{ color: 'var(--gold)', fontSize: '0.75rem', letterSpacing: '0.2em' }}>
            NANDHU’S SIGNATURE EDITION
          </p>
          <h1 className="serif-title" style={{ fontSize: '2.1rem', lineHeight: 1.2 }}>
            {product.name}
          </h1>

          <div className="details-price">
            ₹{Number(product.price).toLocaleString('en-IN')}
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: 8 }}>
              (Inclusive of all taxes)
            </span>
          </div>

          <p style={{ color: 'var(--text-muted)', lineHeight: 1.65, fontSize: '0.95rem' }}>
            {product.description ||
              'Exquisitely crafted with premium fabric and intricate detailing, designed for festive celebrations, weddings, and timeless elegance.'}
          </p>

          {/* Dynamic Available Sizes from Admin Upload */}
          <div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 8 }}>
              Available Sizes:
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {availableSizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  className={`pill ${selectedSize === sz ? 'active' : ''}`}
                  onClick={() => setSelectedSize(sz)}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <div className="trust-row">
            <span><Sparkles size={15} color="var(--gold)" /> Handpicked Quality</span>
            <span><ShieldCheck size={15} color="var(--gold)" /> Authentic Weave</span>
            <span><Truck size={15} color="var(--gold)" /> Express Dispatch</span>
          </div>

          <button className="btn-gold" style={{ width: '100%', padding: '15px', fontSize: '1rem' }} onClick={handleOrderNow}>
            <MessageCircle size={19} /> Enquire &amp; Book on WhatsApp
          </button>
        </div>
      </div>

      {displayRelated.length > 0 && (
        <section style={{ marginTop: 42 }}>
          <div style={{ marginBottom: 16 }}>
            <p style={{ color: 'var(--gold)', fontSize: '0.75rem', letterSpacing: '0.18em' }}>
              CURATED FOR YOU
            </p>
            <h2 className="serif-title" style={{ fontSize: '1.75rem' }}>
              Related {product.category}
            </h2>
          </div>

          <div className="catalog-grid">
            {displayRelated.map((item) => (
              <CatalogCard
                key={item.id}
                product={item}
                onSelect={() => {
                  onSelectProduct(item);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}