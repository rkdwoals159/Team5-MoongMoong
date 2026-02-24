import PiggyBankIcon from "@/assets/icons/sidebar/ic_bank_light.svg";
import MedicIcon from "@/assets/icons/sidebar/ic_medic_light.svg";
import CloseIcon from "@/assets/icons/components/close.svg";
import { NOTIFICATION_TEXT } from "@/constants/notification";
import { NotificationItem } from "./notification.type";

export default function NotificationCard({
  item,
  index,
  onDelete,
}: {
  item: NotificationItem;
  index: number;
  onDelete: (id: number) => void;
}) {
  const icon =
    item.type === "AI_ADVICE_CREATED" ? (
      <MedicIcon className="size-6" />
    ) : (
      <PiggyBankIcon className="size-6" />
    );

  return (
    <div className={`flex flex-col px-[30px] py-[12px] ${index % 2 === 1 ? "bg-gray-50" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[18px]">
          <div
            className={`relative size-[38px] flex items-center justify-center rounded-600 shrink-0 overflow-hidden rounded-full ${item.type === "NUDGE" ? "bg-red-100 text-red-500" : "bg-gray-100"}`}
          >
            {icon}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
            <p className="typo-body-m-bold text-gray-800">{item.title}</p>
            <p className="typo-body-s-medium text-gray-600">{item.content}</p>
            <p className="typo-caption-s-medium text-gray-300">{item.time}</p>
          </div>
        </div>
        <button
          type="button"
          className="flex size-[30px] shrink-0 items-center justify-center p-[8px] text-gray-400 hover:text-gray-800 cursor-pointer transition-colors"
          aria-label={NOTIFICATION_TEXT.DELETE_ARIA_LABEL}
          onClick={() => onDelete(item.id)}
        >
          <CloseIcon className="size-[14px]" />
        </button>
      </div>
    </div>
  );
}
