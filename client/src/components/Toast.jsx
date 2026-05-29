import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { flyToCart } from '../lib/anim';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_ICONS = {
  info: Info,
  success: CheckCircle,
  error: AlertTriangle,
};

const TOAST_COLORS = {
  info: 'bg-muted',
  success: 'bg-secondary',
  error: 'bg-accent',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, opts = {}) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const toast = { id, message, type: opts.type || 'info' };
    setToasts((t) => [...t, toast]);
    if (!opts.persistent) {
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), opts.duration || 3000);
    }
    return id;
  }, []);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  useEffect(() => {
    function handler(e) {
      const { message, type = 'info', duration } = e.detail || {};
      if (message) showToast(message, { type, duration });
    }
    window.addEventListener('devgear:toast', handler);
    return () => window.removeEventListener('devgear:toast', handler);
  }, [showToast]);

  useEffect(() => {
    function handleFly(e) {
      const { img } = e.detail || {};
      if (img) flyToCart(img, '#cart-link');
    }
    window.addEventListener('devgear:fly', handleFly);
    return () => window.removeEventListener('devgear:fly', handleFly);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismiss }}>
      {children}
      <div aria-live="polite" aria-atomic="true" className="toast-container">
        {toasts.map((t) => {
          const Icon = TOAST_ICONS[t.type] || Info;
          const colorClass = TOAST_COLORS[t.type] || 'bg-muted';

          return (
            <div
              key={t.id}
              className={`flex items-stretch border-4 border-ink bg-surface shadow-neo-sm animate-slide-in`}
              role="status"
            >
              {/* Color bar */}
              <div className={`${colorClass} w-2 shrink-0`} />
              <div className="flex items-center gap-3 px-4 py-3 flex-1">
                <Icon className="w-5 h-5 shrink-0" strokeWidth={3} />
                <span className="font-bold text-sm uppercase tracking-wide flex-1">{t.message}</span>
                <button
                  className="neo-btn !p-1 !min-h-0 !border-2"
                  onClick={() => dismiss(t.id)}
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" strokeWidth={3} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default ToastProvider;
