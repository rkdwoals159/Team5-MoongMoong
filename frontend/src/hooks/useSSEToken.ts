import { postSSEToken } from "@/api/client/sseApi";
import { useCallback, useEffect, useState } from "react";
import { BASE_DELAY, MAX_RECONNECT_DELAY } from "@/constants";

export function useSSEToken() {
  const [connectionToken, setConnectionToken] = useState<string | null>(null);
  const [retrySignal, setRetrySignal] = useState(0);
  const [isVisible, setIsVisible] = useState(() =>
    typeof document !== "undefined" ? document.visibilityState === "visible" : true,
  );

  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") {
        setIsVisible(true);
        setRetrySignal(0);
      } else {
        setIsVisible(false);
        setConnectionToken(null);
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function fetchToken() {
      try {
        const token = await postSSEToken();
        if (cancelled) return;
        setConnectionToken(token);
      } catch {
        if (!cancelled) {
          setRetrySignal((prev) => prev + 1);
        }
      }
    }

    if (retrySignal === 0) {
      fetchToken();
    } else {
      const exponential = BASE_DELAY * Math.pow(2, retrySignal - 1);
      const delay = Math.min(
        exponential / 2 + Math.random() * (exponential / 2),
        MAX_RECONNECT_DELAY,
      );
      timer = setTimeout(() => {
        if (!cancelled) fetchToken();
      }, delay);
    }

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [retrySignal, isVisible]);

  const handleSSEError = useCallback((error: Error) => {
    console.error("SSE 오류:", error);
    setConnectionToken(null);
    setRetrySignal((prev) => prev + 1);
  }, []);

  return { connectionToken, handleSSEError };
}
