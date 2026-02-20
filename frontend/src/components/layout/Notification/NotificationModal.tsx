import Button from "@/components/common/Button/Button";
import { NotificationItem } from "./notification.type";
import NotificationCard from "./NotificationCard";

export default function NotificationModal({
  notifications,
  onClearAll,
  onDelete,
}: {
  notifications: NotificationItem[];
  onClearAll: () => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="flex flex-col pb-[10px] pt-700">
      <div className="flex items-center justify-between px-[30px] pb-[18px]">
        <p className="typo-headline-s-bold text-gray-800">알림</p>
        <Button
          variant="secondary"
          size="xsmall"
          type="button"
          isDisabled={notifications.length === 0}
          onClick={onClearAll}
          className="typo-body-m-medium rounded-[6px] border border-gray-200 px-[8px] py-[4px] text-gray-800"
        >
          모두 지우기
        </Button>
      </div>
      <div className="flex flex-col h-[calc(30vh)] overflow-y-auto no-scrollbar">
        {notifications.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="typo-body-m-medium text-gray-400">새로운 알림이 없습니다.</p>
          </div>
        ) : (
          notifications.map((item) => (
            <NotificationCard key={item.id} item={item} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  );
}
