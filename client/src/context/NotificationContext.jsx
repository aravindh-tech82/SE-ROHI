import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ message, type = 'success', duration = 4000, title }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type, title, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((message, title = 'Success') => {
    addToast({ message, title, type: 'success' });
  }, [addToast]);

  const error = useCallback((message, title = 'Error') => {
    addToast({ message, title, type: 'error' });
  }, [addToast]);

  const warning = useCallback((message, title = 'Warning') => {
    addToast({ message, title, type: 'warning' });
  }, [addToast]);

  const info = useCallback((message, title = 'Information') => {
    addToast({ message, title, type: 'info' });
  }, [addToast]);

  return (
    <NotificationContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl backdrop-blur-xl bg-[#070D19]/95 border border-royal-600/30 shadow-2xl shadow-black/60 transition-all duration-300 animate-in slide-in-from-bottom-3"
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-royal-400" />}
            </div>
            <div className="flex-1 min-w-0">
              {toast.title && <h4 className="text-xs font-semibold text-slate-200 tracking-wide uppercase">{toast.title}</h4>}
              <p className="text-sm text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

