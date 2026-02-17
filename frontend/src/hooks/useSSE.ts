"use client";

import { parseSSE } from "@/lib/sse/parseSSE";
import type { SSEConnectionStatus, SSEEvent, SSEProps } from "@/types/sse";
import { useCallback, useEffect, useRef, useState } from "react";

export function useSSE({ onEvent, onError, enabled }: SSEProps) {
  const [status, setStatus] = useState<SSEConnectionStatus>("closed");
  const abortRef = useRef<AbortController | null>(null);
  const lastEventIdRef = useRef<string>("");
  const onEventRef = useRef(onEvent);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const connect = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus("connecting");

    try {
      // SSE 연결 요청
      const response = await fetch("/api/sse", {
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`SSE 연결 실패: ${response.status}`);
      if (!response.body) throw new Error("SSE 연결 실패: 응답 본체가 없습니다.");

      setStatus("open");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const { events, lastPart } = parseSSE(buffer);
        buffer = lastPart;

        for (const event of events) {
          if (event.id) lastEventIdRef.current = event.id;
          onEventRef.current({
            event: event.event,
            data: event.data,
          } as SSEEvent);
        }
      }

      setStatus("closed");
    } catch (e) {
      if (controller.signal.aborted) return;
      setStatus("closed");
      onErrorRef.current?.(e instanceof Error ? e : new Error(String(e)));
    }
  }, []);

  const disconnect = useCallback(() => {
    abortRef.current?.abort();
    setStatus("closed");
  }, []);

  useEffect(() => {
    if (enabled) connect();
    return () => {
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  return { status, connect, disconnect };
}
