import { useEffect, useRef, useState } from 'react';
import { Sparkles, Crown, Scissors, Truck, PhoneCall } from 'lucide-react';
import CatalogCard from '../components/CatalogCard';

const CATEGORIES = ['All', 'Silk Sarees', 'Designer Kurtis', 'Bridal Wear', 'Casuals'];

const FALLBACK_IMG = 'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=900';

const BANNER_SLIDES = [
  {
    url: 'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=900',
    tag: 'ROYAL KANCHIPURAM SILKS',
  },
  {
    url: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=900',
    tag: 'BRIDAL COUTURE EDITION',
  },
  {
    url: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=900',
    tag: 'FESTIVE DESIGNER WEAR',
  },
  {
    url: 'https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=900',
    tag: 'HANDCRAFTED ELEGANCE',
  },
];

export default function Home({ products = [], loading, onSelectProduct }) {
  const [selectedCat, setSelectedCat] = useState('All');
  const [slideIndex, setSlideIndex] = useState(0);
  const catalogSectionRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const scrollToCatalog = () => {
    catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filtered =
    selectedCat === 'All'
      ? products
      : products.filter((p) => p.category?.toLowerCase() === selectedCat.toLowerCase());

  return (
    <>
      <main className="container">
        {/* Clean Royal Navy & Gold Hero Section */}
        <section className="grand-hero fade-up">
          <div>
            <span className="hero-badge">
              <Crown size={14} /> NANDHU’S COUTURE HOUSE
            </span>
            <h1 className="serif-title hero-title">
              Woven in Royal Silk, Draped in Grace
            </h1>
            <p
              style={{
                color: '#c7d3ea',
                fontSize: '0.96rem',
                marginBottom: 24,
                lineHeight: 1.65,
                maxWidth: 500,
              }}
            >
              Experience pure handloom Kanchipuram silks, regal bridal lehengas, and statement designer wear crafted to make every celebration unforgettable.
            </p>
            <button className="btn-gold" onClick={scrollToCatalog}>
              <Sparkles size={17} /> Explore Collection
            </button>
          </div>

          {/* Auto-Changing Floating Outfit Showcase Card */}
          <div className="hero-floating-showcase">
            <div className="floating-photo-card">
              {/* Top-Right Slide Indicator Dots */}
              <div className="slide-dots">
                {BANNER_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Slide ${idx + 1}`}
                    className={`slide-dot ${slideIndex === idx ? 'active' : ''}`}
                    onClick={() => setSlideIndex(idx)}
                  />
                ))}
              </div>

              {BANNER_SLIDES.map((slide, idx) => (
                <img
                  key={slide.url}
                  src={slide.url}
                  alt={slide.tag}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMG;
                  }}
                  className={`slide-img ${slideIndex === idx ? 'active' : ''}`}
                />
              ))}

              <div className="floating-label-pill">
                {BANNER_SLIDES[slideIndex].tag}
              </div>
            </div>
          </div>
        </section>

        {/* Clean Borderless Marquee with Italic Serif Font */}
        <div className="luxury-marquee">
          <div className="marquee-track">
            Pure Kanchipuram Silks &nbsp;&nbsp;•&nbsp;&nbsp; Handcrafted Bridal Couture &nbsp;&nbsp;•&nbsp;&nbsp; Designer Kurtis &nbsp;&nbsp;•&nbsp;&nbsp; Bespoke Tailoring &nbsp;&nbsp;•&nbsp;&nbsp; Pure Kanchipuram Silks &nbsp;&nbsp;•&nbsp;&nbsp; Handcrafted Bridal Couture &nbsp;&nbsp;•&nbsp;&nbsp; Designer Kurtis &nbsp;&nbsp;•&nbsp;&nbsp; Bespoke Tailoring &nbsp;&nbsp;•&nbsp;&nbsp;
          </div>
        </div>

        {/* 3 Boutique Highlights */}
        <div className="highlights-grid">
          <div className="highlight-box">
            <Crown size={22} color="var(--gold)" />
            <strong style={{ fontSize: '0.84rem' }}>100% Pure Weave</strong>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Silk Mark Certified</span>
          </div>
          <div className="highlight-box">
            <Scissors size={22} color="var(--gold)" />
            <strong style={{ fontSize: '0.84rem' }}>Bespoke Fit</strong>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Custom Tailoring</span>
          </div>
          <div className="highlight-box">
            <Truck size={22} color="var(--gold)" />
            <strong style={{ fontSize: '0.84rem' }}>Express Dispatch</strong>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Pan-India Delivery</span>
          </div>
        </div>

        {/* Catalog Section */}
        <div ref={catalogSectionRef}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <h2 className="serif-title" style={{ fontSize: '1.9rem' }}>
              Signature Catalog
            </h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--gold)' }}>
              {filtered.length} {filtered.length === 1 ? 'Outfit' : 'Outfits'}
            </span>
          </div>

          <div className="category-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`pill ${selectedCat === cat ? 'active' : ''}`}
                onClick={() => setSelectedCat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading && products.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center' }}>
              Loading boutique catalogs...
            </p>
          ) : filtered.length === 0 ? (
            <div className="panel-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ color: 'var(--text-muted)' }}>No outfits found in this category yet.</p>
            </div>
          ) : (
            <div className="catalog-grid">
              {filtered.map((item) => (
                <CatalogCard key={item.id} product={item} onSelect={onSelectProduct} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Clean Showroom Footer */}
      <footer className="boutique-footer">
        <h3 className="serif-title" style={{ fontSize: '1.75rem', color: 'var(--gold)', marginBottom: 6 }}>
          Nandhu’s Luxury Boutique
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginBottom: 12 }}>
          Exclusive Silks • Bridal Couture • Designer Wear | Open Daily: 10:00 AM – 9:00 PM
        </p>
        <p style={{ color: 'var(--gold)', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <PhoneCall size={14} /> Boutique Concierge: +91 63834 33216
        </p>
      </footer>
    </>
  );
}