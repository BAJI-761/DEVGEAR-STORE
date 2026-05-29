import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Star } from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(form);
      navigate('/products');
    } catch (registerError) {
      setError(registerError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <section className="neo-card !shadow-neo-lg w-full max-w-md rotate-1 hover:rotate-0 transition-transform duration-200">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-secondary border-4 border-ink">
            <UserPlus className="w-6 h-6" strokeWidth={3} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Register</h2>
          <Star className="w-6 h-6 fill-accent text-accent ml-auto" strokeWidth={0} />
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-1.5">
            <span className="font-bold text-xs uppercase tracking-wider">Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
              className="neo-input"
              placeholder="Your name"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="font-bold text-xs uppercase tracking-wider">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
              className="neo-input"
              placeholder="you@example.com"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="font-bold text-xs uppercase tracking-wider">Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
              className="neo-input"
              placeholder="••••••••"
            />
          </label>

          {error ? (
            <div className="border-4 border-ink bg-accent px-4 py-3 font-bold text-sm uppercase">
              {error}
            </div>
          ) : null}

          <button type="submit" className="neo-btn neo-btn-secondary w-full text-base !shadow-neo" disabled={loading}>
            <UserPlus className="w-5 h-5" strokeWidth={3} />
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 font-bold text-center">
          Already have an account?{' '}
          <Link to="/login" className="underline decoration-4 decoration-secondary underline-offset-4 hover:bg-accent px-1 transition-colors duration-100">
            Sign in
          </Link>
          .
        </p>
      </section>
    </div>
  );
}