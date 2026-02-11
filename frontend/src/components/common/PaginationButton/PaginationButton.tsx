import { cn } from "@/utils/style";
import ArrowLeftIcon from "@/assets/icons/components/arrow-left-medium.svg";
import ArrowRightIcon from "@/assets/icons/components/arrow-right-medium.svg";
import type { PaginationButtonProps, PaginationDirection } from "./paginationButton.type";

const labelByDirection: Record<PaginationDirection, string> = {
  left: "이전 페이지",
  right: "다음 페이지",
};

const iconComponentByDirection: Record<PaginationDirection, typeof ArrowLeftIcon> = {
  left: ArrowLeftIcon,
  right: ArrowRightIcon,
};

const PaginationButton = ({
  direction,
  isDisabled = false,
  className,
  type = "button",
  ...rest
}: PaginationButtonProps) => {
  const ariaLabel = rest["aria-label"] ?? labelByDirection[direction];
  const IconComponent = iconComponentByDirection[direction];

  return (
    <button
      {...rest}
      type={type}
      className={cn(baseClasses, className ?? "")}
      aria-label={ariaLabel}
      disabled={isDisabled}
    >
      <span className={iconWrapClasses}>
        <IconComponent className="w-10 h-10" aria-hidden="true" />
      </span>
    </button>
  );
};

export default PaginationButton;

//--------------------------------
// Tailwind CSS classes
const baseClasses =
  "inline-flex items-center justify-center w-[58px] h-[58px] p-2 rounded-[29px] border border-[var(--color-border-light)] bg-[var(--color-white-100)] shadow-[0px_3px_20px_0px_rgba(26,31,39,0.08)] transition-colors duration-200 ease-out select-none cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-blue-500)] disabled:cursor-not-allowed disabled:opacity-50";

const iconWrapClasses = "inline-flex items-center justify-center w-10 h-10";
