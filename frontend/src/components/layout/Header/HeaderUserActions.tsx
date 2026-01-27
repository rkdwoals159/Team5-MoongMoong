"use client";
import NotificationIcon from "@/assets/components/ic_notification.svg";
import ChevronIcon from "@/components/ui/Dropdown/ChevronIcon";

const HeaderUserActions = () => {
  return (
    <div className="flex items-center gap-600">
      <div className="flex items-center justify-center overflow-clip p-2">
        <NotificationIcon className="size-8" />
      </div>
      <div className="flex items-center gap-200 text-gray-800 typo-body-l-medium">
        <span>이름</span>
        <span>님</span>
        <div className="flex h-8 w-8 items-center justify-center overflow-clip">
          <ChevronIcon isOpen={false} className="h-2 w-2" />
        </div>
      </div>
    </div>
  );
};

export default HeaderUserActions;
