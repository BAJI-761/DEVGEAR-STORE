import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ShoppingCart, Star } from 'lucide-react';

export default function AppShell({ children }) {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/products', label: 'Products' },
    { to: '/cart', label: 'Cart', id: 'cart-link', icon: ShoppingCart },
    { to: '/orders', label: 'Orders' },
    { to: '/wishlist', label: 'Wishlist' },
    { to: '/profile', label: 'Profile' },
  ];

  function isActive(path) {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <a className="skip-link" href="#main-content">Skip to content</a>

      {/* ── HEADER ── */}
      <header className="border-b-4 border-ink bg-secondary relative overflow-hidden">
        {/* Halftone overlay */}
        <div className="absolute inset-0 halftone-bg opacity-5 pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 border-4 border-ink bg-accent shadow-neo-sm font-black text-base uppercase tracking-wider -rotate-1 hover:rotate-0 transition-transform duration-100"
          >
            <Star className="w-5 h-5 fill-ink" strokeWidth={3} />
            DevGear Store
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2" aria-label="Primary">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                id={link.id}
                className={`neo-btn text-xs ${isActive(link.to) ? 'neo-btn-primary' : 'neo-btn-ghost'}`}
              >
                {link.icon && <link.icon className="w-4 h-4" strokeWidth={3} />}
                {link.label}
              </Link>
            ))}
            {loading ? null : user ? (
              <button
                type="button"
                className="neo-btn text-xs"
                onClick={logout}
                aria-label="Log out"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="neo-btn neo-btn-primary text-xs">
                Login
              </Link>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="neo-btn md:hidden !p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-6 h-6" strokeWidth={3} /> : <Menu className="w-6 h-6" strokeWidth={3} />}
          </button>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <nav
            className="md:hidden border-t-4 border-ink bg-surface px-4 py-4 flex flex-col gap-2 animate-fade-in"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                id={link.id ? `${link.id}-mobile` : undefined}
                className={`neo-btn w-full text-sm justify-start ${isActive(link.to) ? 'neo-btn-primary' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.icon && <link.icon className="w-4 h-4" strokeWidth={3} />}
                {link.label}
              </Link>
            ))}
            {loading ? null : user ? (
              <button
                type="button"
                className="neo-btn w-full text-sm justify-start"
                onClick={() => { logout(); setMenuOpen(false); }}
                aria-label="Log out"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="neo-btn neo-btn-primary w-full text-sm justify-start"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </nav>
        )}
      </header>

      {/* ── MAIN ── */}
      <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
        {children}
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t-4 border-ink bg-ink text-surface relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" aria-hidden="true" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 fill-secondary text-secondary animate-spin-slow" strokeWidth={0} />
            <span className="font-black text-lg uppercase tracking-wider">DevGear Store</span>
          </div>
          <p className="text-sm font-medium opacity-70 uppercase tracking-widest">
            Built for developers · Neo-brutalist by design
          </p>
          <div className="flex gap-2">
            <Link to="/products" className="neo-btn neo-btn-secondary text-xs !border-surface !text-ink">Products</Link>
            <Link to="/cart" className="neo-btn text-xs !border-surface !text-ink">Cart</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}