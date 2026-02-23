"use client";

import { useToast } from "@/components/ui/Toast/ToastProvider";
import { useSSE } from "@/hooks/useSSE";
import { useSSEToken } from "@/hooks/useSSEToken";
import { getSSENotificationMessage } from "@/lib/sse/sseNotification";
import { useServerEvent } from "@/store/ServerEventProvider";
import type { SSEEvent } from "@/types/sse";
import { useCallback } from "react";
import { EVENT_TOAST_DURATION } from "@/constants/sseConnection";

export default function SSEListener() {
  const { showToast } = useToast();
  const { setLastEvent } = useServerEvent();
  const { connectionToken, handleSSEError } = useSSEToken();

  const handleEvent = useCallback(
    (event: SSEEvent) => {
      setLastEvent(event);
      showToast({
        variant: event.event === "NUDGE" ? "nudge" : "notification",
        message: getSSENotificationMessage(event),
        duration: EVENT_TOAST_DURATION,
      });
    },
    [showToast, setLastEvent],
  );

  useSSE({ onEvent: handleEvent, onError: handleSSEError, connectionToken });

  return null;
}
