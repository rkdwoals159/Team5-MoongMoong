"use client";

import { HEARTBEAT_TIMEOUT } from "@/constants/sseConnection";
import { parseSSE } from "@/lib/sse/parseSSE";
import type { SSEConnectionStatus, SSEEvent, SSEProps } from "@/types/sse";
import { useCallback, useEffect, useRef, useState } from "react";

export function useSSE({ onEvent, onError, connectionToken }: SSEProps) {
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

  const connect = useCallback(async (token: string) => {
    abortRef.current?.abort("new-connection");
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus("connecting");

    let heartbeatTimer: ReturnType<typeof setTimeout> | null = null;

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_SSE_URL!, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "text/event-stream",
        },
        cache: "no-store",
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`SSE 연결 실패: ${response.status}`);
      if (!response.body) throw new Error("SSE 연결 실패: 응답 본체가 없습니다.");

      setStatus("open");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const resetHeartbeat = () => {
        if (heartbeatTimer) clearTimeout(heartbeatTimer);
        heartbeatTimer = setTimeout(() => {
          controller.abort("heartbeat-timeout");
        }, HEARTBEAT_TIMEOUT);
      };

      resetHeartbeat();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        resetHeartbeat();

        buffer += decoder.decode(value, { stream: true });
        const { events, lastPart } = parseSSE(buffer);
        buffer = lastPart;

        for (const event of events) {
          if (event.id) lastEventIdRef.current = event.id;
          const parsed = event.id ? Number(event.id) : undefined;
          const numericId = parsed !== undefined && Number.isFinite(parsed) ? parsed : undefined;
          onEventRef.current({
            id: numericId,
            event: event.event,
            data: event.data,
          } as SSEEvent);
        }
      }

      if (heartbeatTimer) clearTimeout(heartbeatTimer);

      if (!controller.signal.aborted) {
        setStatus("closed");
        onErrorRef.current?.(new Error("SSE 스트림이 서버에 의해 종료되었습니다."));
        return;
      }
      setStatus("closed");
    } catch (e) {
      if (heartbeatTimer) clearTimeout(heartbeatTimer);
      if (controller.signal.aborted && controller.signal.reason !== "heartbeat-timeout") return;
      setStatus("closed");
      onErrorRef.current?.(e instanceof Error ? e : new Error(String(e)));
    }
  }, []);

  const disconnect = useCallback(() => {
    abortRef.current?.abort("user-disconnect");
    setStatus("closed");
  }, []);

  useEffect(() => {
    if (connectionToken) connect(connectionToken);
    return () => {
      disconnect();
    };
  }, [connectionToken, connect, disconnect]);

  return { status, connect, disconnect };
}
