"use client";

import { useState, useRef } from "react";
import NotificationIcon from "@/assets/components/ic_notification.svg";
import ClientModal from "@/components/ui/Modal/ClientModal";
import NotificationModal from "./NotificationModal";
import { NotificationItem } from "./notification.type";

/**
 * TODO : 알림 GET 요청
 */

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: 1, title: "저금통 알림", content: "현민님이 4,000원을 저금하셨어요.", time: "10분 전" },
  { id: 2, title: "저금통 알림", content: "본승님이 12,000원을 저금하셨어요.", time: "30분 전" },
  { id: 3, title: "저금통 알림", content: "건우님이 8,500원을 저금하셨어요.", time: "1시간 전" },
  { id: 4, title: "저금통 알림", content: "재민님이 20,000원을 저금하셨어요.", time: "3시간 전" },
  { id: 5, title: "저금통 알림", content: "용현님이 5,000원을 저금하셨어요.", time: "어제" },
  { id: 6, title: "저금통 알림", content: "연진님이 15,000원을 저금하셨어요.", time: "어제" },
  { id: 7, title: "저금통 알림", content: "현민님이 3,000원을 저금하셨어요.", time: "어제" },
  { id: 8, title: "저금통 알림", content: "본승님이 9,000원을 저금하셨어요.", time: "2일 전" },
];

export default function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleClear = () => {
    setNotifications([]);
  };

  const handleDelete = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

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
        {notifications.length > 0 && (
          <span className="absolute top-0 left-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-[3px] text-[10px] font-bold text-white">
            {notifications.length}
          </span>
        )}
      </button>
      <ClientModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        variant="dropdown"
        outsideClickRefs={[buttonRef]}
        ariaLabel="알림"
        contentClassName="absolute top-full right-0 mt-200 z-50 w-[394px] rounded-600 border border-gray-100 bg-white-100 shadow-[0px_4px_20px_0px_rgba(26,31,39,0.12)]"
      >
        <NotificationModal
          notifications={notifications}
          onClearAll={handleClear}
          onDelete={handleDelete}
        />
      </ClientModal>
    </div>
  );
}
