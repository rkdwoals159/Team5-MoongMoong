import { NOTIFICATION_TEXT } from "@/constants/notification";

// API 응답 타입 (백엔드 스키마 미반영 → 직접 정의)
export type NotificationReadResponse = {
  lastSeenNotificationId?: number;
  page?: number;
  size?: number;
  hasNext?: boolean;
  notifications?: NotificationResponse[];
};

export type NotificationResponse = {
  notificationId?: number;
  payload?: Record<string, unknown>;
  eventType?: string;
  createdAt?: string;
};

export type SavingPayload = {
  coinId: number;
  amount: number;
  name: string;
};

export type NudgePayload = {
  memberName: string;
};

export type AIAdviceCreatedPayload = {
  message: string;
};

export function getNotificationContent(eventType: string, payload: unknown): string {
  switch (eventType) {
    case "SAVING": {
      const data = payload as SavingPayload;
      return `${data.name}님이 ${data.amount?.toLocaleString()}원을 저축했어요!`;
    }
    case "NUDGE": {
      const data = payload as NudgePayload;
      return `${data.memberName}님이 저금을 재촉하고 있어요!`;
    }
    case "AI_ADVICE_CREATED": {
      const data = payload as AIAdviceCreatedPayload;
      return data.message;
    }
    default:
      return NOTIFICATION_TEXT.DEFAULT_CONTENT;
  }
}

// UI에서 사용하는 변환된 알림 아이템
export type NotificationItem = {
  id: number;
  type: string;
  title: string;
  content: string;
  time: string;
};
