import { ToastType } from "./Toast.type";
import cn from "@/utils/style";
import WarningIcon from "@/assets/ic_warning.svg?react";
import CheckIcon from "@/assets/ic_check.svg?react";

const Toast = ({ variant = "success", message, className }: ToastType) => {
  const icon = variant === "error" ? <WarningIcon /> : <CheckIcon />;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-[var(--spacing-300)] h-[52px] p-[var(--spacing-500)] rounded-[var(--radius-400)] bg-[var(--color-gray-800)] shadow-[0px_4px_40px_rgba(26,31,39,0.25)] w-full max-w-[515px]",
        className ?? "",
      )}
      data-variant={variant}
    >
      {icon}
      <span className="typo-body-m-medium text-[var(--color-gray-100)] flex-1">{message}</span>
    </div>
  );
};

export default Toast;
