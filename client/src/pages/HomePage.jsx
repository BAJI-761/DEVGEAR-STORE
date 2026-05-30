import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Zap, Monitor, Rocket, ShieldCheck, Truck, Cpu, Headphones, Keyboard } from 'lucide-react';
import api from '../lib/api';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function fetchTrending() {
      try {
        const res = await api.get('/products?limit=3&sort=newest');
        if (active) {
          setTrending(res.data.data.items);
          setLoading(false);
        }
      } catch (err) {
        if (active) setLoading(false);
      }
    }
    fetchTrending();
    return () => { active = false; };
  }, []);

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-16">
      <section className="relative" aria-labelledby="home-hero-title">
        {/* ── HERO CARD ── */}
        <div className="neo-card relative overflow-hidden min-h-[75vh] md:min-h-[80vh] flex items-center">
          {/* Background texture */}
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" aria-hidden="true" />

          {/* Floating decorative elements */}
          <div
            className="absolute top-6 right-6 md:top-10 md:right-10 w-16 h-16 md:w-24 md:h-24 border-4 border-ink bg-secondary rotate-12 shadow-neo-sm hidden sm:block"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-12 right-16 md:bottom-20 md:right-32 w-12 h-12 md:w-16 md:h-16 border-4 border-ink bg-muted -rotate-6 shadow-neo-sm hidden sm:block"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/4 right-8 md:right-16"
            aria-hidden="true"
          >
            <Star className="w-10 h-10 md:w-14 md:h-14 text-accent fill-accent animate-spin-slow" strokeWidth={0} />
          </div>
          <div
            className="absolute bottom-8 left-6 md:bottom-12 md:left-12"
            aria-hidden="true"
          >
            <Star className="w-8 h-8 md:w-10 md:h-10 text-secondary fill-secondary animate-spin-slow" strokeWidth={0} style={{ animationDirection: 'reverse', animationDuration: '15s' }} />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-4xl px-2 md:px-4">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary border-4 border-ink shadow-neo-sm rotate-1 mb-6 md:mb-8 animate-fade-in-up">
              <Zap className="w-4 h-4" strokeWidth={3} />
              <span className="font-black text-xs uppercase tracking-widest">Neo-brutalist developer marketplace</span>
            </div>

            {/* Headline */}
            <h1
              id="home-hero-title"
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black uppercase leading-[0.85] tracking-tighter max-w-[14ch] mb-6 animate-fade-in-up"
              style={{ animationDelay: '100ms' }}
            >
              Gear up your{' '}
              <span className="text-stroke-lg inline-block -rotate-1">workflow</span>{' '}
              with loud, useful hardware.
            </h1>

            {/* Lead */}
            <p className="text-lg md:text-xl font-bold max-w-[50ch] leading-relaxed mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              DevGear Store is the starting point for developer-focused commerce: fast catalog browsing, cart flows, and a
              production-ready backend foundation.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <Link
                to="/products"
                className="neo-btn neo-btn-primary text-base !shadow-neo hover:!shadow-neo-lg"
                aria-label="Browse products"
              >
                <Monitor className="w-5 h-5" strokeWidth={3} />
                Browse products
                <ArrowRight className="w-5 h-5" strokeWidth={3} />
              </Link>
            </div>
          </div>
        </div>

        {/* ── MARQUEE DIVIDER ── */}
        <div className="border-y-4 border-ink bg-ink text-surface py-3 overflow-hidden mt-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="flex whitespace-nowrap animate-marquee gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="flex items-center gap-3 font-black text-sm uppercase tracking-widest">
                <Star className="w-4 h-4 fill-secondary text-secondary" strokeWidth={0} />
                Keyboards · Monitors · Audio · Laptops · Accessories
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUE PROPOSITION ── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="neo-stack-item bg-canvas flex-col items-start !gap-4 hover:bg-accent hover:text-ink transition-colors duration-300">
          <div className="p-3 border-4 border-ink bg-surface shadow-neo-sm -rotate-2">
            <Rocket className="w-8 h-8" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-2">Built for Speed</h3>
            <p className="font-bold text-sm opacity-80 leading-relaxed">
              We ship developer gear faster than your CI/CD pipeline. Get what you need to code without the wait.
            </p>
          </div>
        </div>
        <div className="neo-stack-item bg-canvas flex-col items-start !gap-4 hover:bg-secondary hover:text-ink transition-colors duration-300">
          <div className="p-3 border-4 border-ink bg-surface shadow-neo-sm rotate-2">
            <ShieldCheck className="w-8 h-8" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-2">Premium Warranty</h3>
            <p className="font-bold text-sm opacity-80 leading-relaxed">
              Every item comes with a 2-year worry-free guarantee. Focus on shipping features, not fixing hardware.
            </p>
          </div>
        </div>
        <div className="neo-stack-item bg-canvas flex-col items-start !gap-4 hover:bg-muted hover:text-ink transition-colors duration-300">
          <div className="p-3 border-4 border-ink bg-surface shadow-neo-sm -rotate-1">
            <Truck className="w-8 h-8" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-2">Free Global Shipping</h3>
            <p className="font-bold text-sm opacity-80 leading-relaxed">
              No matter where your remote office is, we deliver for free on all orders over ₹5,000.
            </p>
          </div>
        </div>
      </section>

      {/* ── TRENDING PRODUCTS ── */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            Trending <span className="text-accent">Hardware</span>
          </h2>
          <Link to="/products" className="neo-btn neo-btn-ghost text-xs md:text-sm hidden sm:inline-flex">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.map((product, idx) => (
              <ProductCard key={product._id} product={product} idx={idx} />
            ))}
          </div>
        )}
        <div className="mt-6 sm:hidden">
          <Link to="/products" className="neo-btn neo-btn-secondary w-full justify-center">
            View All Products
          </Link>
        </div>
      </section>

      {/* ── CATEGORY BENTO GRID ── */}
      <section>
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">
          Shop By <span className="text-muted">Category</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          
          <Link to="/products?category=Keyboards" className="neo-card neo-card-hover !bg-accent group flex flex-col justify-between overflow-hidden relative md:col-span-2">
            <div className="relative z-10">
              <Keyboard className="w-10 h-10 mb-4" strokeWidth={2} />
              <h3 className="text-3xl font-black uppercase">Keyboards</h3>
              <p className="font-bold opacity-90 mt-2">Mechanical perfection for typists.</p>
            </div>
            <div className="absolute right-[-20%] bottom-[-40%] w-[80%] h-[150%] bg-surface opacity-20 rotate-12 group-hover:rotate-6 transition-transform duration-500 pointer-events-none" />
          </Link>

          <Link to="/products?category=Displays" className="neo-card neo-card-hover !bg-secondary group flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <Monitor className="w-10 h-10 mb-4" strokeWidth={2} />
              <h3 className="text-3xl font-black uppercase">Displays</h3>
              <p className="font-bold opacity-90 mt-2">4K clarity.</p>
            </div>
            <div className="absolute right-[-20%] bottom-[-20%] w-[70%] h-[70%] bg-surface opacity-20 rotate-[30deg] group-hover:rotate-[15deg] transition-transform duration-500 pointer-events-none" />
          </Link>

          <Link to="/products?category=Audio" className="neo-card neo-card-hover !bg-muted group flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <Headphones className="w-10 h-10 mb-4" strokeWidth={2} />
              <h3 className="text-3xl font-black uppercase">Audio</h3>
              <p className="font-bold opacity-90 mt-2">Studio quality sound.</p>
            </div>
          </Link>

          <Link to="/products?category=Laptops" className="neo-card neo-card-hover !bg-ink text-surface group flex flex-col justify-between overflow-hidden relative md:col-span-2">
            <div className="relative z-10">
              <Cpu className="w-10 h-10 mb-4 text-secondary" strokeWidth={2} />
              <h3 className="text-3xl font-black uppercase">Laptops</h3>
              <p className="font-bold text-surface/80 mt-2">Portable dev machines.</p>
            </div>
            <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-ink" strokeWidth={3} />
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* ── NEWSLETTER CTA ── */}
      <section className="neo-card !bg-ink text-surface text-center py-16 md:py-24 relative overflow-hidden mt-8">
        <div className="absolute inset-0 halftone-bg opacity-30 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <Star className="w-12 h-12 text-accent fill-accent mx-auto mb-6 animate-spin-slow" />
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            Join the <span className="text-secondary">Cult</span>
          </h2>
          <p className="text-lg font-bold text-surface/80 mb-8 max-w-lg mx-auto">
            Subscribe for exclusive drops, restock alerts, and developer gear insights. No spam, just hardware.
          </p>
          <form 
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" 
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.querySelector('input');
              if (input.value) {
                const evt = new CustomEvent('devgear:toast', { 
                  detail: { message: `Successfully subscribed with ${input.value}!`, type: 'success' } 
                });
                window.dispatchEvent(evt);
                input.value = '';
              }
            }}
          >
            <input 
              type="email" 
              placeholder="YOUR@EMAIL.COM" 
              className="neo-input !bg-surface text-ink flex-1"
              required
            />
            <button type="submit" className="neo-btn neo-btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}