import { RefObject } from "react";
import Button from "@/components/common/Button/Button";
import { NOTIFICATION_TEXT } from "@/constants/notification";
import { NotificationItem } from "./notification.type";
import NotificationCard from "./NotificationCard";

export default function NotificationModal({
  notifications,
  isLoading,
  isInitialized,
  hasNext,
  lastSeenNotificationId,
  observerRef,
  onClearAll,
  onDelete,
}: {
  notifications: NotificationItem[];
  isLoading: boolean;
  isInitialized: boolean;
  hasNext: boolean;
  lastSeenNotificationId: number;
  observerRef: RefObject<HTMLDivElement | null>;
  onClearAll: () => void;
  onDelete: (id: number) => void;
}) {
  const hasNewNotifications =
    lastSeenNotificationId > 0 && notifications.some((n) => n.id > lastSeenNotificationId);

  return (
    <div className="flex flex-col pb-[10px] pt-700">
      <div className="flex items-center justify-between px-[30px] pb-[18px]">
        <p className="typo-headline-s-bold text-gray-800">{NOTIFICATION_TEXT.TITLE}</p>
        <Button
          variant="secondary"
          size="xsmall"
          type="button"
          isDisabled={notifications.length === 0}
          onClick={onClearAll}
          className="typo-body-m-medium rounded-[6px] border border-gray-200 px-[8px] py-[4px] text-gray-800"
        >
          {NOTIFICATION_TEXT.CLEAR_ALL}
        </Button>
      </div>
      <div className="flex h-[calc(30vh)] flex-col overflow-y-auto no-scrollbar">
        {isInitialized && notifications.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="typo-body-m-medium text-gray-400">{NOTIFICATION_TEXT.EMPTY}</p>
          </div>
        ) : (
          <>
            {notifications.map((item, index) => (
              <div key={item.id}>
                {hasNewNotifications && item.id === lastSeenNotificationId && <LastSeenDivider />}
                <NotificationCard item={item} index={index} onDelete={onDelete} />
              </div>
            ))}
            {hasNext && !isLoading && <div ref={observerRef} className="h-1 shrink-0" />}
          </>
        )}
        {isLoading && isInitialized && (
          <div className="flex shrink-0 items-center justify-center py-4">
            <div className="size-5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-500" />
          </div>
        )}
      </div>
    </div>
  );
}

function LastSeenDivider() {
  return (
    <div className="flex items-center gap-2 px-[30px] py-[6px]">
      <div className="h-px flex-1 bg-red-500" />
      <span className="typo-body-s-medium shrink-0 text-red-500">
        {NOTIFICATION_TEXT.LAST_SEEN_DIVIDER}
      </span>
      <div className="h-px flex-1 bg-red-500" />
    </div>
  );
}
