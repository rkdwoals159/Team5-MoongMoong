"use client";
import React, { createContext, useContext, useMemo } from "react";
import cn from "@/utils/style";
import Toast from "./Toast";
import { ANIMATION_MS } from "./Toast.constants";
import { useToastStore } from "./Toast.store";
import type { ToastContextValue } from "./Toast.type";

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

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className={cn(
          "pointer-events-none fixed left-1/2 -translate-x-1/2 bottom-[var(--spacing-700)] z-50 flex w-full max-w-[515px] flex-col gap-[var(--spacing-300)] px-[var(--spacing-500)]",
        )}
      >
        {toasts.map((toast) => (
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
