import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Heart, Eye, Trash2 } from 'lucide-react';

export default function WishlistPage() {
  const [state, setState] = useState({ wishlist: null, loading: true, error: '' });

  useEffect(() => {
    let active = true;

    async function loadWishlist() {
      try {
        const response = await api.get('/wishlist');
        if (active) {
          setState({ wishlist: response.data.data.wishlist, loading: false, error: '' });
        }
      } catch (error) {
        if (active) {
          setState({ wishlist: null, loading: false, error: error.message });
        }
      }
    }

    loadWishlist();
    return () => { active = false; };
  }, []);

  async function removeItem(productId) {
    await api.delete(`/wishlist/items/${productId}`);
    const response = await api.get('/wishlist');
    setState({ wishlist: response.data.data.wishlist, loading: false, error: '' });
  }

  const products = state.wishlist?.products || [];

  return (
    <section>
      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">
        <Heart className="w-10 h-10 md:w-12 md:h-12 inline-block mr-3 -mt-1 fill-accent text-accent" strokeWidth={0} />
        Wishlist
      </h2>

      {state.loading ? (
        <div className="neo-card text-center py-12">
          <p className="font-bold text-lg uppercase animate-pulse">Loading wishlist…</p>
        </div>
      ) : null}

      {state.error ? (
        <div className="neo-card !bg-accent text-center py-8">
          <p className="font-bold text-lg">{state.error}</p>
        </div>
      ) : null}

      {!state.loading && products.length === 0 ? (
        <div className="neo-card text-center py-16">
          <Heart className="w-20 h-20 mx-auto mb-6 opacity-20" strokeWidth={1.5} />
          <p className="font-black text-2xl uppercase mb-2">No saved items yet</p>
          <p className="font-bold text-lg mb-6">Browse the catalog to add some.</p>
          <Link to="/products" className="neo-btn neo-btn-primary text-base">Browse products</Link>
        </div>
      ) : null}

      <div className="grid gap-4">
        {products.map((product) => (
          <article key={product._id} className="neo-stack-item animate-fade-in">
            <div className="flex-1 min-w-0">
              <div className="neo-badge bg-muted mb-1 text-[10px]">{product.category}</div>
              <h3 className="text-xl font-black uppercase leading-tight">{product.name}</h3>
              <p className="font-bold text-lg mt-1">₹{product.price}</p>
            </div>
            <div className="flex gap-2">
              <Link to={`/products/${product.slug}`} className="neo-btn neo-btn-secondary text-xs">
                <Eye className="w-4 h-4" strokeWidth={3} />
                View
              </Link>
              <button type="button" className="neo-btn text-xs" onClick={() => removeItem(product._id)}>
                <Trash2 className="w-4 h-4" strokeWidth={3} />
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}