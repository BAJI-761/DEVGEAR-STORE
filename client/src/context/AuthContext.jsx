import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const response = await api.get('/auth/me');
        if (active) {
          setUser(response.data.data.user);
        }
      } catch (_error) {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSession();

    return () => {
      active = false;
    };
  }, []);

  async function login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    setUser(response.data.data.user);
    return response.data.data.user;
  }

  async function register(payload) {
    const response = await api.post('/auth/register', payload);
    setUser(response.data.data.user);
    return response.data.data.user;
  }

  async function logout() {
    await api.post('/auth/logout');
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, register, logout, setUser }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}