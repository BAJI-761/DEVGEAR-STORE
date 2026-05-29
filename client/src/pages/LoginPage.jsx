import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Star } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate('/orders');
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <section className="neo-card !shadow-neo-lg w-full max-w-md -rotate-1 hover:rotate-0 transition-transform duration-200">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-accent border-4 border-ink">
            <LogIn className="w-6 h-6" strokeWidth={3} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Login</h2>
          <Star className="w-6 h-6 fill-secondary text-secondary ml-auto" strokeWidth={0} />
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
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

          <button type="submit" className="neo-btn neo-btn-primary w-full text-base !shadow-neo" disabled={loading}>
            <LogIn className="w-5 h-5" strokeWidth={3} />
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 font-bold text-center">
          New here?{' '}
          <Link to="/signup" className="underline decoration-4 decoration-accent underline-offset-4 hover:bg-secondary px-1 transition-colors duration-100">
            Create an account
          </Link>
          .
        </p>
      </section>
    </div>
  );
}