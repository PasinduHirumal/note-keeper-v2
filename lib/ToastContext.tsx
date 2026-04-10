"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toasts: ToastMessage[];
  toast: {
    (message: string): void;
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
  };
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const toastObj = useCallback((message: string) => addToast(message, "info"), [addToast]);
  // Typecasting the function object so we have toast.error, toast.success 
  const toast = Object.assign(toastObj, {
    success: (message: string) => addToast(message, "success"),
    error: (message: string) => addToast(message, "error"),
    info: (message: string) => addToast(message, "info"),
  });

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-2xl border w-80 backdrop-blur-xl transform transition-all duration-300 translate-y-0 opacity-100 ${
              t.type === "error"
                ? "bg-red-500/10 border-red-500/30 text-red-500 dark:text-red-400"
                : t.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-card/80 border-border text-foreground"
            }`}
          >
            <div className="flex items-center space-x-3 break-words w-full pr-2">
              {t.type === "error" && <AlertCircle className="w-5 h-5 shrink-0" />}
              {t.type === "success" && <CheckCircle2 className="w-5 h-5 shrink-0" />}
              {t.type === "info" && <AlertCircle className="w-5 h-5 shrink-0 text-primary" />}
              <span className="text-sm font-semibold">{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
