import PiggyBankIcon from "@/assets/icons/sidebar/ic_bank_light.svg";
import CloseIcon from "@/assets/icons/components/close.svg";
import { NotificationItem } from "./notification.type";

export default function NotificationCard({
  item,
  onDelete,
}: {
  item: NotificationItem;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="flex flex-col border-b border-gray-100 px-[30px] py-[12px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[18px]">
          <div className="relative size-[38px] flex items-center justify-center bg-gray-100 rounded-600 shrink-0 overflow-hidden rounded-full">
            <PiggyBankIcon className="size-6" />
          </div>
          <div className="flex w-[186px] flex-col gap-[2px]">
            <p className="typo-body-m-bold text-gray-800">{item.title}</p>
            <p className="typo-body-s-medium text-gray-600">{item.content}</p>
            <p className="typo-caption-s-medium text-gray-300">{item.time}</p>
          </div>
        </div>
        <button
          type="button"
          className="flex size-[30px] shrink-0 items-center justify-center p-[8px] text-gray-400 hover:text-gray-800 cursor-pointer transition-colors"
          aria-label="알림 삭제"
          onClick={() => onDelete(item.id)}
        >
          <CloseIcon className="size-[14px]" />
        </button>
      </div>
    </div>
  );
}
