'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toast: (options: {
    type?: ToastType;
    title?: string;
    message: string;
    duration?: number;
  }) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({
      type = 'info',
      title,
      message,
      duration = 4000,
    }: {
      type?: ToastType;
      title?: string;
      message: string;
      duration?: number;
    }) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, message, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const contextValue: ToastContextType = {
    toast: addToast,
    success: (message, title) => addToast({ type: 'success', title, message }),
    error: (message, title) => addToast({ type: 'error', title, message }),
    warning: (message, title) => addToast({ type: 'warning', title, message }),
    info: (message, title) => addToast({ type: 'info', title, message }),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast Notification Container (Pojok Kanan Atas) */}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((t) => {
          const config = {
            success: {
              icon: CheckCircle2,
              bg: 'bg-white',
              border: 'border-emerald-200',
              accent: 'text-emerald-600',
              badgeBg: 'bg-emerald-50',
              title: t.title || 'Berhasil',
            },
            error: {
              icon: AlertCircle,
              bg: 'bg-white',
              border: 'border-rose-200',
              accent: 'text-rose-600',
              badgeBg: 'bg-rose-50',
              title: t.title || 'Terjadi Kesalahan',
            },
            warning: {
              icon: AlertTriangle,
              bg: 'bg-white',
              border: 'border-amber-200',
              accent: 'text-amber-600',
              badgeBg: 'bg-amber-50',
              title: t.title || 'Peringatan',
            },
            info: {
              icon: Info,
              bg: 'bg-white',
              border: 'border-blue-200',
              accent: 'text-blue-600',
              badgeBg: 'bg-blue-50',
              title: t.title || 'Informasi',
            },
          }[t.type];

          const Icon = config.icon;

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl shadow-black/5 ${config.bg} ${config.border} transition-all animate-in slide-in-from-top-2 duration-200`}
            >
              <div
                className={`p-1.5 rounded-lg shrink-0 ${config.badgeBg} ${config.accent}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-xs font-bold text-[#18181B] leading-tight">
                  {config.title}
                </p>
                <p className="text-xs text-[#52525B] mt-0.5 leading-relaxed break-words">
                  {t.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-[#A1A1AA] hover:text-[#18181B] p-1 rounded-md transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
