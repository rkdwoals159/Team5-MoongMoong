"use client";

import { useState, useRef, useEffect } from "react";
import NotificationIcon from "@/assets/components/ic_notification.svg";
import ClientModal from "@/components/ui/Modal/ClientModal";
import { NOTIFICATION_TEXT } from "@/constants/notification";
import { useNotifications } from "@/hooks/useNotifications";
import { useUnreadNotiCount } from "@/hooks/useUnreadNotiCount";
import { useServerEvent } from "@/hooks/ServerEventProvider";
import NotificationModal from "./NotificationModal";

export default function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const isOpenRef = useRef(isOpen);
  const { lastEvent } = useServerEvent();

  const {
    notifications,
    isLoading,
    isInitialized,
    hasNext,
    lastSeenNotificationId,
    observerRef,
    fetchPage,
    deleteOne,
    deleteAll,
    addNotification,
  } = useNotifications();

  const {
    unreadCount,
    effectiveLastSeenId,
    incrementUnreadCount,
    resetUnreadCount,
    updateClientLastSeen,
  } = useUnreadNotiCount(lastSeenNotificationId);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (!lastEvent || !lastEvent.id) return;

    if (isOpenRef.current) {
      addNotification(lastEvent);
      updateClientLastSeen(lastEvent.id);
    } else {
      incrementUnreadCount();
    }
  }, [lastEvent, addNotification, updateClientLastSeen, incrementUnreadCount]);

  useEffect(() => {
    if (isOpen) {
      fetchPage(0);
      resetUnreadCount();
    }
  }, [isOpen, fetchPage, resetUnreadCount]);

  return (
    <div ref={buttonRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="알림"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`relative flex items-center cursor-pointer ${isOpen ? "text-yellow-300" : "hover-bell-swing"}`}
      >
        <NotificationIcon aria-hidden="true" className="size-8 transition-colors" />
        {unreadCount > 0 && (
          <span className="animate-badge-pop absolute -top-1 -right-1 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold leading-[18px] text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
      <ClientModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        variant="dropdown"
        outsideClickRefs={[buttonRef]}
        ariaLabel={NOTIFICATION_TEXT.TITLE}
        contentClassName="absolute top-full right-0 mt-200 z-50 w-[420px] rounded-600 border border-gray-100 bg-white-100 shadow-[0px_4px_20px_0px_rgba(26,31,39,0.12)]"
      >
        <NotificationModal
          notifications={notifications}
          isLoading={isLoading}
          isInitialized={isInitialized}
          hasNext={hasNext}
          lastSeenNotificationId={effectiveLastSeenId}
          observerRef={observerRef}
          onClearAll={deleteAll}
          onDelete={deleteOne}
        />
      </ClientModal>
    </div>
  );
}
