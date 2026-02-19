import { postSSEToken } from "@/api/sseApi";
import { useCallback, useEffect, useState } from "react";
import { MAX_RETRY, BASE_DELAY } from "@/constants";

export function useSSEToken() {
  const [connectionToken, setConnectionToken] = useState<string | null>(null);
  const [retrySignal, setRetrySignal] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let retryCount = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function fetchToken() {
      const token = await postSSEToken();
      if (cancelled) return;
      if (token) {
        setConnectionToken(token);
        setRetrySignal(0);
      } else if (retryCount < MAX_RETRY) {
        const delay = BASE_DELAY * Math.pow(2, retryCount);
        timer = setTimeout(() => {
          retryCount++;
          fetchToken();
        }, delay);
      }
    }

    fetchToken();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [retrySignal]);

  const handleSSEError = useCallback((error: Error) => {
    console.error("SSE 오류:", error);
    setConnectionToken(null);
    setRetrySignal((prev) => (prev < MAX_RETRY ? prev + 1 : prev));
  }, []);

  return { connectionToken, handleSSEError };
}
