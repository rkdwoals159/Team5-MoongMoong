"use client";
import React, { createContext, useContext, useMemo } from "react";
import { cn } from "@/utils/style";
import Toast from "./Toast";
import { ANIMATION_MS } from "./toast.constant";
import { useToastStore } from "./toastStore";
import type { ToastContextValue } from "./toast.type";

const ToastContext = createContext<ToastContextValue | null>(null);

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const { toasts, showToast, dismissToast } = useToastStore();

  const value = useMemo(
    () => ({
      showToast,
      dismissToast,
    }),
    [showToast, dismissToast],
  );

  const defaultToasts = toasts.filter((t) => t.variant !== "notification" && t.variant !== "nudge");
  const notificationToasts = toasts.filter(
    (t) => t.variant === "notification" || t.variant === "nudge",
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="assertive"
        aria-atomic="false"
        className={cn(
          "pointer-events-none fixed left-1/2 -translate-x-1/2 bottom-700 z-50 flex w-full max-w-[515px] flex-col gap-300 px-500",
        )}
      >
        {defaultToasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto",
              toast.state === "closing" ? "toast-out" : "toast-in",
            )}
            style={{ "--toast-duration": `${ANIMATION_MS}ms` } as React.CSSProperties}
          >
            <Toast variant={toast.variant} message={toast.message} />
          </div>
        ))}
      </div>
      <div
        aria-live="polite"
        aria-atomic="false"
        className={cn(
          "pointer-events-none fixed right-500 bottom-700 z-50 flex w-full max-w-[300px] flex-col gap-300",
        )}
      >
        {notificationToasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto",
              toast.state === "closing" ? "toast-out" : "toast-in",
            )}
            style={{ "--toast-duration": `${ANIMATION_MS}ms` } as React.CSSProperties}
          >
            <Toast variant={toast.variant} message={toast.message} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export default ToastProvider;
