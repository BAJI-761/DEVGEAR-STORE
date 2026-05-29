import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { LayoutDashboard, Package, ShoppingBag, Users, ArrowRight, Star } from 'lucide-react';

export default function AdminDashboardPage() {
  const [state, setState] = useState({ stats: null, products: [], orders: [], users: [], loading: true, error: '' });

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const [statsResponse, productsResponse, ordersResponse, usersResponse] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/products'),
          api.get('/admin/orders'),
          api.get('/admin/users')
        ]);

        if (active) {
          setState({
            stats: statsResponse.data.data,
            products: productsResponse.data.data.products,
            orders: ordersResponse.data.data.orders,
            users: usersResponse.data.data.users,
            loading: false,
            error: ''
          });
        }
      } catch (error) {
        if (active) {
          setState({ stats: null, products: [], orders: [], users: [], loading: false, error: error.message });
        }
      }
    }

    loadDashboard();
    return () => { active = false; };
  }, []);

  return (
    <section>
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard className="w-10 h-10 md:w-12 md:h-12" strokeWidth={3} />
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Admin Dashboard</h2>
        <Star className="w-8 h-8 fill-secondary text-secondary ml-2 animate-spin-slow" strokeWidth={0} />
      </div>

      {state.loading ? (
        <div className="neo-card text-center py-12">
          <p className="font-bold text-lg uppercase animate-pulse">Loading dashboard…</p>
        </div>
      ) : null}

      {state.error ? (
        <div className="neo-card !bg-accent text-center py-8">
          <p className="font-bold text-lg">{state.error}</p>
        </div>
      ) : null}

      {/* Stats */}
      {state.stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <article className="neo-stat bg-accent">
            <Package className="w-6 h-6" strokeWidth={3} />
            <strong className="text-4xl font-black">{state.stats.totalProducts}</strong>
            <span className="font-bold text-sm uppercase tracking-wider">Total Products</span>
          </article>
          <article className="neo-stat bg-secondary">
            <ShoppingBag className="w-6 h-6" strokeWidth={3} />
            <strong className="text-4xl font-black">{state.stats.totalOrders}</strong>
            <span className="font-bold text-sm uppercase tracking-wider">Total Orders</span>
          </article>
          <article className="neo-stat bg-muted">
            <span className="font-black text-sm">₹</span>
            <strong className="text-4xl font-black">₹{state.stats.totalRevenue}</strong>
            <span className="font-bold text-sm uppercase tracking-wider">Total Revenue</span>
          </article>
        </div>
      ) : null}

      {/* Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Products */}
        <div className="neo-card">
          <div className="flex items-center justify-between pb-4 mb-4 border-b-4 border-ink">
            <h3 className="text-xl font-black uppercase">Products</h3>
            <Link to="/admin/products" className="neo-btn neo-btn-secondary text-xs">
              Manage
              <ArrowRight className="w-3 h-3" strokeWidth={3} />
            </Link>
          </div>
          <div className="grid gap-2">
            {state.products.map((product) => (
              <article key={product._id} className="neo-stack-item !p-3">
                <strong className="font-bold text-sm uppercase truncate">{product.name}</strong>
                <span className="neo-badge bg-canvas text-[10px]">{product.category}</span>
              </article>
            ))}
          </div>
        </div>

        {/* Orders */}
        <div className="neo-card">
          <div className="flex items-center justify-between pb-4 mb-4 border-b-4 border-ink">
            <h3 className="text-xl font-black uppercase">Orders</h3>
            <Link to="/admin/orders" className="neo-btn neo-btn-secondary text-xs">
              Manage
              <ArrowRight className="w-3 h-3" strokeWidth={3} />
            </Link>
          </div>
          <div className="grid gap-2">
            {state.orders.map((order) => (
              <article key={order._id} className="neo-stack-item !p-3">
                <strong className="font-bold text-sm truncate">{order.orderNumber}</strong>
                <span className="neo-badge bg-muted text-[10px]">{order.status}</span>
              </article>
            ))}
          </div>
        </div>

        {/* Users */}
        <div className="neo-card">
          <div className="flex items-center justify-between pb-4 mb-4 border-b-4 border-ink">
            <h3 className="text-xl font-black uppercase">Users</h3>
          </div>
          <div className="grid gap-2">
            {state.users.map((u) => (
              <article key={u._id} className="neo-stack-item !p-3">
                <strong className="font-bold text-sm truncate">{u.name}</strong>
                <span className="neo-badge bg-secondary text-[10px]">{u.role}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}