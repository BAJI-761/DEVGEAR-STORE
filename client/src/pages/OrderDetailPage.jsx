import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import { Package, Loader } from 'lucide-react';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const [state, setState] = useState({ order: null, loading: true, error: '' });

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      try {
        const response = await api.get(`/orders/${orderId}`);
        if (active) {
          setState({ order: response.data.data.order, loading: false, error: '' });
        }
      } catch (error) {
        if (active) {
          setState({ order: null, loading: false, error: error.message });
        }
      }
    }

    loadOrder();
    return () => { active = false; };
  }, [orderId]);

  if (state.loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader className="w-10 h-10 animate-spin-slow" strokeWidth={3} />
        <p className="font-black text-xl uppercase tracking-wider">Loading order…</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="neo-card !bg-accent text-center py-12">
        <p className="font-bold text-lg">{state.error}</p>
      </div>
    );
  }

  if (!state.order) return null;

  const order = state.order;

  return (
    <section className="max-w-3xl mx-auto animate-fade-in">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-8">
        <Package className="w-10 h-10 inline-block mr-3 -mt-1" strokeWidth={3} />
        Order Detail
      </h2>

      <div className="neo-card mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b-4 border-ink">
          <div>
            <div className="neo-badge bg-canvas mb-2">{order.orderNumber}</div>
            <h3 className="text-2xl font-black uppercase">{order.status}</h3>
          </div>
          <div className="inline-flex items-center px-4 py-2 bg-secondary border-4 border-ink shadow-neo-sm">
            <span className="text-2xl font-black">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Items */}
        <div className="grid gap-3">
          {order.items.map((item) => (
            <article key={`${item.productSlug}-${item.product}`} className="neo-stack-item">
              <div className="flex-1 min-w-0">
                <strong className="font-black text-lg uppercase">{item.productName}</strong>
              </div>
              <div className="flex items-center gap-4">
                <span className="neo-badge bg-muted">Qty: {item.quantity}</span>
                <span className="font-black text-lg">₹{item.lineTotal}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}