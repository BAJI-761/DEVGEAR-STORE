import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight, XCircle } from 'lucide-react';

export default function CartPage() {
  const [state, setState] = useState({ cart: null, loading: true, error: '' });

  async function loadCart() {
    try {
      const response = await api.get('/cart');
      setState({ cart: response.data.data.cart, loading: false, error: '' });
    } catch (error) {
      setState({ cart: null, loading: false, error: error.message });
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function updateQuantity(productId, quantity) {
    try {
      await api.post(`/cart/items/${productId}`, { quantity });
      window.dispatchEvent(new CustomEvent('devgear:toast', { detail: { message: 'Cart updated', type: 'info' } }));
    } catch (err) {
      window.dispatchEvent(new CustomEvent('devgear:toast', { detail: { message: 'Failed to update cart', type: 'error' } }));
    }
    loadCart();
  }

  async function removeItem(productId) {
    try {
      await api.delete(`/cart/items/${productId}`);
      window.dispatchEvent(new CustomEvent('devgear:toast', { detail: { message: 'Item removed', type: 'info' } }));
    } catch (err) {
      window.dispatchEvent(new CustomEvent('devgear:toast', { detail: { message: 'Failed to remove item', type: 'error' } }));
    }
    loadCart();
  }

  async function clearCart() {
    try {
      await api.delete('/cart');
      window.dispatchEvent(new CustomEvent('devgear:toast', { detail: { message: 'Cart cleared', type: 'info' } }));
    } catch (err) {
      window.dispatchEvent(new CustomEvent('devgear:toast', { detail: { message: 'Failed to clear cart', type: 'error' } }));
    }
    loadCart();
  }

  const items = state.cart?.items || [];
  const total = items.reduce((sum, item) => sum + item.unitPriceSnapshot * item.quantity, 0);

  return (
    <section>
      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">
        <ShoppingCart className="w-10 h-10 md:w-12 md:h-12 inline-block mr-3 -mt-1" strokeWidth={3} />
        Cart
      </h2>

      {state.loading ? (
        <div className="neo-card text-center py-12">
          <p className="font-bold text-lg uppercase animate-pulse">Loading cart…</p>
        </div>
      ) : null}

      {state.error ? (
        <div className="neo-card !bg-accent text-center py-8">
          <p className="font-bold text-lg">{state.error}</p>
        </div>
      ) : null}

      {!state.loading && items.length === 0 ? (
        <div className="neo-card text-center py-16">
          <ShoppingCart className="w-20 h-20 mx-auto mb-6 opacity-20" strokeWidth={1.5} />
          <p className="font-black text-2xl uppercase mb-4">Your cart is empty</p>
          <Link to="/products" className="neo-btn neo-btn-primary text-base">
            Browse products
            <ArrowRight className="w-5 h-5" strokeWidth={3} />
          </Link>
        </div>
      ) : null}

      {/* Cart items */}
      <div className="grid gap-4 mb-8">
        {items.map((item) => (
          <article key={item.product._id} className="neo-stack-item animate-fade-in">
            <div className="flex-1 min-w-0">
              <div className="neo-badge bg-muted mb-1 text-[10px]">{item.product.category}</div>
              <h3 className="text-xl font-black uppercase leading-tight">{item.product.name}</h3>
              <p className="font-bold text-lg mt-1">₹{item.unitPriceSnapshot} each</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Qty controls */}
              <button
                className="neo-btn !p-2 !min-h-0"
                type="button"
                aria-label={`Decrease quantity of ${item.product.name}`}
                onClick={() => updateQuantity(item.product._id, Math.max(item.quantity - 1, 1))}
              >
                <Minus className="w-4 h-4" strokeWidth={3} />
              </button>
              <span className="font-black text-xl w-8 text-center" aria-live="polite">{item.quantity}</span>
              <button
                className="neo-btn !p-2 !min-h-0"
                type="button"
                aria-label={`Increase quantity of ${item.product.name}`}
                onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
              >
                <Plus className="w-4 h-4" strokeWidth={3} />
              </button>
              <button
                className="neo-btn neo-btn-secondary !p-2 !min-h-0 ml-2"
                type="button"
                aria-label={`Remove ${item.product.name}`}
                onClick={() => removeItem(item.product._id)}
              >
                <Trash2 className="w-4 h-4" strokeWidth={3} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Summary bar */}
      {items.length > 0 ? (
        <div className="neo-card !bg-secondary flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-black text-sm uppercase tracking-wider">Total</span>
            <span className="text-3xl font-black">₹{total}</span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button className="neo-btn flex-1 sm:flex-initial" type="button" onClick={clearCart}>
              <XCircle className="w-4 h-4" strokeWidth={3} />
              Clear
            </button>
            <Link to="/checkout" className="neo-btn neo-btn-primary flex-1 sm:flex-initial text-base !shadow-neo">
              Checkout
              <ArrowRight className="w-5 h-5" strokeWidth={3} />
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}