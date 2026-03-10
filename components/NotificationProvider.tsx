
import React, { createContext, useContext, useState, useCallback } from 'react';

export type NotificationType = 'success' | 'info' | 'alert';

interface Toast {
  id: string;
  message: string;
  type: NotificationType;
  duration: number;
}

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showNotification = useCallback((message: string, type: NotificationType = 'info', duration?: number) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    // Default durations based on criticality
    const defaultDuration = type === 'alert' ? 6000 : type === 'success' ? 4000 : 3000;
    const finalDuration = duration || defaultDuration;

    setToasts((prev) => [...prev, { id, message, type, duration: finalDuration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, finalDuration);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed top-24 right-6 z-[10000] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right-full duration-300 flex items-center gap-4 ${
              toast.type === 'success' ? 'bg-green-600 border-green-500 text-white' :
              toast.type === 'alert' ? 'bg-red-600 border-red-500 text-white' :
              'bg-slate-900 border-slate-800 text-white'
            }`}
          >
            <div className="text-xl">
              {toast.type === 'success' ? '✅' : toast.type === 'alert' ? '⚠️' : 'ℹ️'}
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-black uppercase tracking-widest leading-tight">{toast.message}</p>
            </div>
            <button 
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-white/50 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
