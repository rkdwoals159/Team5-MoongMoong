"use client";

import { useState, useRef, useEffect } from "react";
import NotificationIcon from "@/assets/components/ic_notification.svg";
import ClientModal from "@/components/ui/Modal/ClientModal";
import { NOTIFICATION_TEXT } from "@/constants/notification";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationModal from "./NotificationModal";

export default function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
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
  } = useNotifications();

  useEffect(() => {
    if (isOpen) {
      fetchPage(0);
    }
  }, [isOpen, fetchPage]);

  return (
    <div ref={buttonRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`relative flex items-center cursor-pointer ${isOpen ? "text-yellow-300" : "hover-bell-swing"}`}
      >
        <NotificationIcon className="size-8 transition-colors" />
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
          lastSeenNotificationId={lastSeenNotificationId}
          observerRef={observerRef}
          onClearAll={deleteAll}
          onDelete={deleteOne}
        />
      </ClientModal>
    </div>
  );
}
