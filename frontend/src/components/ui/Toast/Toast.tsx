import type { ToastType } from "./toast.type";
import { cn } from "@/utils/style";
import WarningIcon from "@/assets/ic_warning.svg";
import CheckIcon from "@/assets/ic_check.svg";
import NotificationIcon from "@/assets/components/ic_notification.svg";
import { TOAST_BG_MAP, TOAST_TEXT_MAP } from "./toast.constant";

const TOAST_ICON_MAP = {
  nudge: <WarningIcon />,
  error: <WarningIcon />,
  notification: <NotificationIcon />,
  success: <CheckIcon />,
};

const TOAST_ROLE_MAP: Record<string, "alert" | "status"> = {
  error: "alert",
  nudge: "alert",
  success: "status",
  notification: "status",
};

const Toast = ({ variant = "success", message, className }: ToastType) => {
  const isFloating = variant === "notification" || variant === "nudge";

  return (
    <div
      role={TOAST_ROLE_MAP[variant]}
      className={cn(
        "inline-flex items-center gap-300 p-500 rounded-400 shadow-[0px_4px_40px_rgba(26,31,39,0.25)]",
        isFloating ? "w-auto" : "h-[52px] w-full max-w-[515px]",
        TOAST_BG_MAP[variant],
        className ?? "",
      )}
      data-variant={variant}
    >
      <span aria-hidden="true">{TOAST_ICON_MAP[variant]}</span>
      <span className={cn("typo-body-m-medium flex-1", TOAST_TEXT_MAP[variant])}>{message}</span>
    </div>
  );
};

export default Toast;
