import { MessageCircle } from 'lucide-react';

const SHOP_WHATSAPP = '9163834 33216';

export default function CatalogCard({ product, onSelect }) {
  const handleWhatsAppEnquiry = (e) => {
    e.stopPropagation(); // WhatsApp button click pannaa full details page open aagama direct WhatsApp pogum
    const text = encodeURIComponent(
      `Vanakkam Nandhu's Boutique! I'm interested in:\n*${product.name}* (${product.category}) - ₹${product.price}`
    );
    window.open(`https://wa.me/${SHOP_WHATSAPP}?text=${text}`, '_blank');
  };

  return (
    <div className="product-card" onClick={() => onSelect && onSelect(product)}>
      <div className="product-img-wrap">
        <span className="category-tag">{product.category}</span>
        <img src={product.imageUrl} alt={product.name} loading="lazy" />
      </div>

      <div className="product-info">
        <h3 style={{ fontSize: '0.96rem', fontWeight: 600 }}>{product.name}</h3>
        <p className="product-price">₹{Number(product.price).toLocaleString('en-IN')}</p>
        {product.description && (
          <p
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.description}
          </p>
        )}
        <button className="btn-whatsapp" onClick={handleWhatsAppEnquiry}>
          <MessageCircle size={15} /> Order on WhatsApp
        </button>
      </div>
    </div>
  );
}