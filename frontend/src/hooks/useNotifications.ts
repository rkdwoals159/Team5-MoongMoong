"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  getNotifications,
  deleteNotification,
  deleteAllNotifications,
} from "@/api/client/notificationApi";
import { formatRelativeTime } from "@/utils/relativeTime";
import type {
  NotificationItem,
  NotificationResponse,
} from "@/components/layout/Notification/notification.type";
import { getNotificationContent } from "@/components/layout/Notification/notification.type";
import {
  NOTIFICATION_PAGE_SIZE,
  EVENT_TYPE_TITLE,
  NOTIFICATION_TEXT,
} from "@/constants/notification";

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastSeenNotificationId, setLastSeenNotificationId] = useState(0);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchPage = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    try {
      const res = await getNotifications(pageNum, NOTIFICATION_PAGE_SIZE);
      const items = (res.notifications ?? []).map(mapNotification);

      if (pageNum === 0) {
        setNotifications(items);
        setLastSeenNotificationId(res.lastSeenNotificationId ?? 0);
      } else {
        setNotifications((prev) => [...prev, ...items]);
      }

      setPage(pageNum);
      setHasNext(res.hasNext ?? false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (hasNext && !isLoading) {
      fetchPage(page + 1);
    }
  }, [hasNext, isLoading, page, fetchPage]);

  const deleteOne = useCallback(async (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await deleteNotification(id);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const deleteAll = useCallback(async () => {
    const ids = notifications.map((n) => n.id);
    setNotifications([]);
    setHasNext(false);
    try {
      await deleteAllNotifications(ids);
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  useEffect(() => {
    const sentinel = observerRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return {
    notifications,
    isLoading,
    isInitialized,
    hasNext,
    lastSeenNotificationId,
    observerRef,
    fetchPage,
    deleteOne,
    deleteAll,
  };
}

function mapNotification(n: NotificationResponse): NotificationItem {
  return {
    id: n.notificationId ?? 0,
    type: n.eventType ?? "",
    title: EVENT_TYPE_TITLE[n.eventType ?? ""] ?? NOTIFICATION_TEXT.TITLE,
    content: getNotificationContent(n.eventType ?? "", n.payload),
    time: n.createdAt ? formatRelativeTime(n.createdAt) : "",
  };
}
