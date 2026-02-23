import type { SSEEvent } from "@/types/sse";

export function getSSENotificationMessage(event: SSEEvent): string {
  switch (event.event) {
    case "SAVING":
      return `${event.data.name}님이 ${event.data.amount.toLocaleString()}원을 저축했어요!`;
    case "NUDGE":
      return `${event.data.memberName}님이 저금을 재촉하고 있어요!`;
  }
}
