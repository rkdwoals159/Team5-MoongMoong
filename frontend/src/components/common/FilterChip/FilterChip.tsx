import type { FilterChipProps } from "./filterChip.type";
import { cn } from "@/utils/style";
import CancelIcon from "@/assets/ic_out_small.svg";

const DEFAULT_INDICATOR_COLOR = "var(--color-gray-100)";

const FilterChip = ({
  label,
  colorIndicator = false,
  color = DEFAULT_INDICATOR_COLOR,
  hasCancelIcon = false,
  onCancel,
  onSelect,
  className,
  ...rest
}: FilterChipProps) => {
  const isSelected = colorIndicator || hasCancelIcon;

  const classes = [
    baseClasses,
    isSelected ? selectedBorderClasses : unselectedBorderClasses,
    isSelected ? selectedTextClasses : unselectedTextClasses,
    className ?? "",
  ];

  return (
    <button
      type="button"
      aria-label={`${label} 선택`}
      {...rest}
      className={cn(...classes)}
      onClick={isSelected ? onCancel : onSelect}
      disabled={isSelected && !hasCancelIcon}
    >
      <div className={contentClasses}>
        <div className={labelGroupClasses}>
          {colorIndicator && (
            <span
              className={indicatorClasses}
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
          )}
          <span className={labelClasses}>{label}</span>
        </div>
        {hasCancelIcon && (
          <CancelIcon
            width={40}
            height={40}
            className={cancelButtonClasses}
            aria-label="선택 해제"
          />
        )}
      </div>
    </button>
  );
};

export default FilterChip;

//--------------------------------
// Tailwind CSS classes
const baseClasses =
  "inline-flex items-center justify-center h-[48px] px-[20px] py-[10px] rounded-[44px] bg-white-100 cursor-pointer select-none transition-colors duration-200";

const selectedBorderClasses = "border border-yellow-300 hover:border-yellow-400";
const unselectedBorderClasses = "border border-gray-200 hover:border-gray-300";

const selectedTextClasses = "text-gray-800";
const unselectedTextClasses = "text-gray-600";

const contentClasses = "flex items-center gap-[2px]";
const labelGroupClasses = "flex items-center gap-[10px]";
const labelClasses = "typo-body-m-medium";

const indicatorClasses = "h-[14px] w-[14px] rounded-full";
const cancelButtonClasses =
  "z-50 flex items-center justify-center p-[8px] text-gray-600 cursor-pointer";
//--------------------------------
