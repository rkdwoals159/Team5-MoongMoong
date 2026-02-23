"use server";

import { client } from "@/lib/api";
import type { NotificationReadResponse } from "@/components/layout/Notification/notification.type";

export async function getNotifications(
  page: number,
  size: number,
): Promise<NotificationReadResponse> {
  const { data, error, response } = await client.GET("/api/notifications", {
    params: { query: { page, size } },
  });

  if (response.status === 404) {
    return {
      notifications: [],
      hasNext: false,
      lastSeenNotificationId: 0,
    };
  }

  if (!response.ok) {
    console.error("getNotifications error:", error?.message ?? "no data");
    throw new Error("알림을 불러오지 못했어요.");
  }

  return data!;
}

export async function deleteAllNotifications(notificationIds: number[]): Promise<void> {
  const { response } = await client.DELETE("/api/notifications", {
    params: { query: {} as never },
    body: { notificationIds } as never,
  });

  if (!response.ok) {
    throw new Error("알림 전체 삭제에 실패했어요.");
  }
}

export async function deleteNotification(notificationId: number): Promise<void> {
  const { response } = await client.DELETE("/api/notifications/{notificationId}", {
    params: {
      query: {} as never,
      path: { notificationId },
    },
  });

  if (!response.ok) {
    throw new Error("알림 삭제에 실패했어요.");
  }
}
