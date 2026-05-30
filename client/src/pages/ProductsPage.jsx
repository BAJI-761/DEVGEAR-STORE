import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { useToast } from '../components/Toast';
import { flyToCart } from '../lib/anim';
import { Search, ShoppingCart, Eye, Star, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const [state, setState] = useState({ items: [], loading: true, error: '' });
  const [filters, setFilters] = useState({ search: '', category: '', sort: 'newest' });

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const params = new URLSearchParams({ limit: '12', ...filters });
        const response = await api.get(`/products?${params.toString()}`);
        if (active) {
          setState({ items: response.data.data.items, loading: false, error: '' });
        }
      } catch (error) {
        if (active) {
          setState({ items: [], loading: false, error: error.message });
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [filters]);

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
    setState((current) => ({ ...current, loading: true, error: current.error }));
  }

  return (
    <section>
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter">
            Product{' '}
            <span className="text-stroke inline-block rotate-1">Listing</span>
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent border-4 border-ink shadow-neo-sm -rotate-2">
          <Star className="w-4 h-4 fill-ink" strokeWidth={0} />
          <span className="font-black text-xs uppercase tracking-widest">Hot deals</span>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="neo-card !bg-canvas mb-8">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-5 h-5" strokeWidth={3} />
          <span className="font-black text-sm uppercase tracking-wider">Filters</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="grid gap-1.5">
            <span className="font-bold text-xs uppercase tracking-wider">Search</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 pointer-events-none" strokeWidth={3} />
              <input
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Keyboards, monitors…"
                className="neo-input !pl-10"
              />
            </div>
          </label>
          <label className="grid gap-1.5">
            <span className="font-bold text-xs uppercase tracking-wider">Category</span>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="neo-input cursor-pointer"
            >
              <option value="">All Categories</option>
              <option value="Laptops">Laptops</option>
              <option value="Keyboards">Keyboards</option>
              <option value="Displays">Displays</option>
              <option value="Audio">Audio</option>
              <option value="Accessories">Accessories</option>
              <option value="Storage">Storage</option>
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className="font-bold text-xs uppercase tracking-wider">Sort</span>
            <select name="sort" value={filters.sort} onChange={handleFilterChange} className="neo-input cursor-pointer">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_asc">Price low → high</option>
              <option value="price_desc">Price high → low</option>
              <option value="name_asc">Name A-Z</option>
              <option value="name_desc">Name Z-A</option>
            </select>
          </label>
        </div>
      </div>

      {/* ── Loading skeletons ── */}
      {state.loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <article key={i} className="neo-card">
              <div className="animate-shimmer h-40 border-4 border-ink mb-4" />
              <div className="animate-shimmer h-4 w-3/5 mb-2" />
              <div className="animate-shimmer h-3 w-4/5 mb-4" />
              <div className="flex justify-between items-center">
                <div className="animate-shimmer h-7 w-20" />
                <div className="animate-shimmer h-10 w-24" />
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {/* ── Error ── */}
      {state.error ? (
        <div className="neo-card !bg-accent text-center py-8">
          <p className="font-bold text-lg">{state.error}</p>
        </div>
      ) : null}

      {/* ── Empty ── */}
      {!state.loading && !state.error && state.items.length === 0 ? (
        <div className="neo-card text-center py-12">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-30" strokeWidth={2} />
          <p className="font-bold text-xl uppercase">No products available yet.</p>
        </div>
      ) : null}

      {/* ── Product grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.items.map((product, idx) => (
          <ProductCard key={product._id} product={product} idx={idx} />
        ))}
      </div>
    </section>
  );
}