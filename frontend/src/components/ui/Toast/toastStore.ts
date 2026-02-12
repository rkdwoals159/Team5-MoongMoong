import { useCallback, useEffect, useRef, useState } from "react";
import type { TimerId, ToastItem, ToastOptions, ToastStore } from "./toast.type";
import { ANIMATION_MS, DEFAULT_DURATION } from "./toastConstants";
import { generateUniqueId } from "@/utils/generateUniqueId";

export const useToastStore = (): ToastStore => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const autoTimers = useRef<Map<string, TimerId>>(new Map());
  const closingIds = useRef<Set<string>>(new Set());

  const clearAutoTimer = useCallback((id: string) => {
    const timer = autoTimers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      autoTimers.current.delete(id);
    }
  }, []);

  const dismissToast = useCallback(
    (id: string) => {
      if (closingIds.current.has(id)) return;
      closingIds.current.add(id);
      clearAutoTimer(id);

      setToasts((prev) =>
        prev.map((toast) => (toast.id === id ? { ...toast, state: "closing" } : toast)),
      );

      window.setTimeout(() => {
        closingIds.current.delete(id);
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, ANIMATION_MS);
    },
    [clearAutoTimer],
  );

  const showToast = useCallback(
    ({ duration = DEFAULT_DURATION, ...options }: ToastOptions) => {
      const id = generateUniqueId();
      const nextToast: ToastItem = {
        id,
        duration,
        state: "open",
        variant: options.variant ?? "success",
        message: options.message,
      };

      setToasts((prev) => [...prev, nextToast]);

      const timer = window.setTimeout(() => dismissToast(id), duration);
      autoTimers.current.set(id, timer);

      return id;
    },
    [dismissToast],
  );

  useEffect(() => {
    const timers = autoTimers.current;
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return { toasts, showToast, dismissToast };
};
