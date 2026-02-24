"use client";

import { useState, useEffect, useCallback } from "react";
import { getUnreadCount } from "@/api/client/notificationApi";

export function useUnreadNotiCount(lastSeenNotificationId: number) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [clientLastSeenId, setClientLastSeenId] = useState(0);

  const effectiveLastSeenId = Math.max(lastSeenNotificationId, clientLastSeenId);

  useEffect(() => {
    getUnreadCount().then(setUnreadCount);
  }, []);

  const incrementUnreadCount = useCallback(() => {
    setUnreadCount((prev) => prev + 1);
  }, []);

  const resetUnreadCount = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const updateClientLastSeen = useCallback((id: number) => {
    setClientLastSeenId((prev) => Math.max(prev, id));
  }, []);

  return {
    unreadCount,
    effectiveLastSeenId,
    incrementUnreadCount,
    resetUnreadCount,
    updateClientLastSeen,
  };
}
