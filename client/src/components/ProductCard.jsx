import { Link } from 'react-router-dom';
import { Eye, ShoppingCart } from 'lucide-react';
import { flyToCart } from '../lib/anim';
import api from '../lib/api';

export default function ProductCard({ product, idx = 0 }) {
  return (
    <article
      className="neo-card neo-card-hover animate-fade-in-up flex flex-col h-full"
      style={{ animationDelay: `${idx * 60}ms` }}
    >
      {/* Image */}
      <div className="border-4 border-ink mb-4 overflow-hidden bg-canvas">
        {product.images && product.images[0] ? (
          (() => {
            const img = product.images[0];
            const variants = img.variants || {};
            const sizes = Object.keys(variants).sort((a, b) => Number(a) - Number(b));
            const webpSrcSet = sizes.map((w) => `${variants[w].webp} ${w}w`).join(', ');
            const jpgSrcSet = sizes.map((w) => `${variants[w].jpg} ${w}w`).join(', ');
            const fallback = img.url;
            return (
              <picture>
                {webpSrcSet ? <source type="image/webp" srcSet={webpSrcSet} /> : null}
                <img
                  className="w-full h-44 object-cover"
                  src={fallback}
                  srcSet={jpgSrcSet}
                  alt={product.name}
                  loading="lazy"
                />
              </picture>
            );
          })()
        ) : (
          <img className="w-full h-44 object-cover" src="/images/placeholder.png" alt={product.name} loading="lazy" />
        )}
      </div>

      {/* Category badge */}
      <div className="neo-badge bg-muted mb-2 self-start">{product.category}</div>

      {/* Title */}
      <h3 className="text-xl font-black uppercase leading-tight mb-1">{product.name}</h3>
      <p className="text-sm font-medium mb-4 flex-1 line-clamp-2">{product.description}</p>

      {/* Meta */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t-4 border-ink mt-auto">
        <span className="text-2xl font-black">₹{product.price}</span>
        <div className="flex gap-2">
          <Link to={`/products/${product.slug}`} className="neo-btn neo-btn-secondary text-xs !py-2">
            <Eye className="w-4 h-4" strokeWidth={3} />
            View
          </Link>
          <button
            type="button"
            className="neo-btn neo-btn-primary text-xs !py-2"
            onClick={async (e) => {
              const img = e.currentTarget.closest('article').querySelector('img');
              flyToCart(img, '#cart-link');
              try {
                await api.post(`/cart/items/${product._id}`, { quantity: 1 });
                const evt = new CustomEvent('devgear:toast', { detail: { message: `${product.name} added to cart`, type: 'success' } });
                window.dispatchEvent(evt);
              } catch (err) {
                const evt = new CustomEvent('devgear:toast', { detail: { message: `Failed to add ${product.name}`, type: 'error' } });
                window.dispatchEvent(evt);
              }
            }}
          >
            <ShoppingCart className="w-4 h-4" strokeWidth={3} />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
