import { useEffect, useState } from 'react';
import api from '../lib/api';
import { Package, Truck, CheckCircle } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'bg-secondary',
  confirmed: 'bg-muted',
  shipped: 'bg-accent',
  delivered: 'bg-[#2ecc71]',
  cancelled: 'bg-ink text-surface',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  async function loadOrders() {
    const response = await api.get('/admin/orders');
    setOrders(response.data.data.orders);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateOrder(orderId, payload) {
    await api.patch(`/admin/orders/${orderId}`, payload);
    await loadOrders();
    window.dispatchEvent(new CustomEvent('devgear:toast', { detail: { message: `Order ${payload.status}`, type: 'success' } }));
  }

  return (
    <section>
      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">
        <Package className="w-10 h-10 md:w-12 md:h-12 inline-block mr-3 -mt-1" strokeWidth={3} />
        Admin Orders
      </h2>

      <div className="grid gap-4">
        {orders.map((order) => (
          <article key={order._id} className="neo-stack-item animate-fade-in">
            <div className="flex-1 min-w-0">
              <strong className="font-black text-lg uppercase">{order.orderNumber}</strong>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className={`neo-badge rounded-full ${STATUS_COLORS[order.status] || 'bg-canvas'}`}>
                  {order.status}
                </span>
                <span className="neo-badge bg-canvas">{order.paymentStatus}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="neo-btn neo-btn-secondary text-xs"
                type="button"
                onClick={() => updateOrder(order._id, { status: 'shipped' })}
              >
                <Truck className="w-4 h-4" strokeWidth={3} />
                Ship
              </button>
              <button
                className="neo-btn text-xs"
                type="button"
                onClick={() => updateOrder(order._id, { status: 'delivered' })}
              >
                <CheckCircle className="w-4 h-4" strokeWidth={3} />
                Deliver
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}