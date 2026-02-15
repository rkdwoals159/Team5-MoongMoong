import type { SSEEvent } from "@/types/sse";

export function getSSENotificationMessage(event: SSEEvent): string {
  switch (event.event) {
    case "SAVING":
      return `${event.data.name}님이 ${event.data.amount.toLocaleString()}원을 저축했어요!`;
    default:
      return "새로운 소식이 도착했어요!";
  }
}
