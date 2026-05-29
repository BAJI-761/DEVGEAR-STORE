import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Package, Eye, XCircle, ArrowRight } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'bg-secondary',
  confirmed: 'bg-muted',
  shipped: 'bg-accent',
  delivered: 'bg-[#2ecc71]',
  cancelled: 'bg-ink text-surface',
};

export default function OrdersPage() {
  const [state, setState] = useState({ orders: [], loading: true, error: '' });

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        const response = await api.get('/orders');
        if (active) {
          setState({ orders: response.data.data.orders, loading: false, error: '' });
        }
      } catch (error) {
        if (active) {
          setState({ orders: [], loading: false, error: error.message });
        }
      }
    }

    loadOrders();
    return () => { active = false; };
  }, []);

  async function cancelOrder(orderId) {
    await api.patch(`/orders/${orderId}/cancel`);
    const response = await api.get('/orders');
    setState({ orders: response.data.data.orders, loading: false, error: '' });
  }

  return (
    <section>
      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">
        <Package className="w-10 h-10 md:w-12 md:h-12 inline-block mr-3 -mt-1" strokeWidth={3} />
        Order History
      </h2>

      {state.loading ? (
        <div className="neo-card text-center py-12">
          <p className="font-bold text-lg uppercase animate-pulse">Loading orders…</p>
        </div>
      ) : null}

      {state.error ? (
        <div className="neo-card !bg-accent text-center py-8">
          <p className="font-bold text-lg">{state.error}</p>
        </div>
      ) : null}

      {!state.loading && state.orders.length === 0 ? (
        <div className="neo-card text-center py-16">
          <Package className="w-20 h-20 mx-auto mb-6 opacity-20" strokeWidth={1.5} />
          <p className="font-black text-2xl uppercase mb-4">No orders yet</p>
          <Link to="/products" className="neo-btn neo-btn-primary text-base">
            Start shopping
            <ArrowRight className="w-5 h-5" strokeWidth={3} />
          </Link>
        </div>
      ) : null}

      <div className="grid gap-4">
        {state.orders.map((order) => (
          <article key={order._id} className="neo-stack-item animate-fade-in">
            <div className="flex-1 min-w-0">
              <div className="neo-badge bg-canvas mb-1 text-[10px]">{order.orderNumber}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`neo-badge rounded-full ${STATUS_COLORS[order.status] || 'bg-canvas'}`}>
                  {order.status}
                </span>
              </div>
              <p className="font-bold text-xl mt-2">Total: ₹{order.totalAmount}</p>
            </div>
            <div className="flex gap-2">
              <Link to={`/orders/${order._id}`} className="neo-btn neo-btn-secondary text-xs">
                <Eye className="w-4 h-4" strokeWidth={3} />
                View order
              </Link>
              {['confirmed', 'pending'].includes(order.status) ? (
                <button type="button" className="neo-btn text-xs" onClick={() => cancelOrder(order._id)}>
                  <XCircle className="w-4 h-4" strokeWidth={3} />
                  Cancel
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}