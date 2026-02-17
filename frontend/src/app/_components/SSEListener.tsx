"use client";

import { useToast } from "@/components/ui/Toast/ToastProvider";
import { useSSE } from "@/hooks/useSSE";
import { getSSENotificationMessage } from "@/lib/sse/sseNotification";
import { useServerEvent } from "@/store/ServerEventProvider";
import type { SSEEvent } from "@/types/sse";
import { useCallback } from "react";

export default function SSEListener() {
  const { showToast } = useToast();
  const { setLastEvent } = useServerEvent();
  const handleEvent = useCallback(
    (event: SSEEvent) => {
      setLastEvent(event);
      showToast({
        variant: "success",
        message: getSSENotificationMessage(event),
      });
    },
    [showToast, setLastEvent],
  );

  const handleError = (error: Error) => {
    console.error("SSE 오류:", error);
  };

  useSSE({
    onEvent: handleEvent,
    onError: handleError,
    enabled: true,
  });

  return null;
}
