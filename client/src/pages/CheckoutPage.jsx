import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { CreditCard, ArrowRight, MapPin } from 'lucide-react';

const FIELDS = [
  { key: 'fullName', label: 'Full Name', required: true },
  { key: 'phone', label: 'Phone', required: true },
  { key: 'line1', label: 'Address Line 1', required: true },
  { key: 'line2', label: 'Address Line 2', required: false },
  { key: 'city', label: 'City', required: true },
  { key: 'state', label: 'State', required: true },
  { key: 'postalCode', label: 'Postal Code', required: true },
  { key: 'country', label: 'Country', required: true },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    paymentMethod: 'mock'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/orders', form);
      window.dispatchEvent(new CustomEvent('devgear:toast', { detail: { message: 'Order placed', type: 'success' } }));
      navigate('/orders');
    } catch (checkoutError) {
      setError(checkoutError.message);
      window.dispatchEvent(new CustomEvent('devgear:toast', { detail: { message: 'Order failed', type: 'error' } }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">Checkout</h2>

      <form className="grid gap-6" onSubmit={handleSubmit}>
        {/* Shipping section */}
        <div className="neo-card">
          <div className="flex items-center gap-3 pb-4 mb-4 border-b-4 border-ink">
            <div className="p-2 bg-secondary border-4 border-ink">
              <MapPin className="w-5 h-5" strokeWidth={3} />
            </div>
            <h3 className="text-xl font-black uppercase">Shipping Address</h3>
          </div>
          <div className="grid gap-4">
            {FIELDS.map((field) => (
              <label key={field.key} className="grid gap-1.5">
                <span className="font-bold text-xs uppercase tracking-wider">{field.label}</span>
                <input
                  aria-label={field.label}
                  type="text"
                  value={form[field.key]}
                  onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                  required={field.required}
                  className="neo-input"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Payment section */}
        <div className="neo-card">
          <div className="flex items-center gap-3 pb-4 mb-4 border-b-4 border-ink">
            <div className="p-2 bg-accent border-4 border-ink">
              <CreditCard className="w-5 h-5" strokeWidth={3} />
            </div>
            <h3 className="text-xl font-black uppercase">Payment Method</h3>
          </div>
          <label className="grid gap-1.5">
            <span className="font-bold text-xs uppercase tracking-wider">Method</span>
            <select
              value={form.paymentMethod}
              onChange={(event) => setForm({ ...form, paymentMethod: event.target.value })}
              className="neo-input cursor-pointer"
            >
              <option value="mock">Mock</option>
              <option value="cod">Cash on Delivery</option>
              <option value="stripe">Stripe</option>
              <option value="razorpay">Razorpay</option>
            </select>
          </label>
        </div>

        {error ? (
          <div className="border-4 border-ink bg-accent px-4 py-3 font-bold text-sm uppercase">
            {error}
          </div>
        ) : null}

        <button type="submit" className="neo-btn neo-btn-primary w-full text-lg !shadow-neo !py-4" disabled={loading}>
          {loading ? 'Placing order…' : 'Place order'}
          <ArrowRight className="w-5 h-5" strokeWidth={3} />
        </button>
      </form>
    </div>
  );
}