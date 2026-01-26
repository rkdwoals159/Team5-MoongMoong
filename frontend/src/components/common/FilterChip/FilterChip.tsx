import type { MouseEvent } from "react";
import { FilterChipProps } from "./FilterChip.type";
import cn from "@/utils/style";
import CancelIcon from "@/assets/ic_out_small.svg";

const FilterChip = ({
  label,
  colorIndicator = false,
  number = 0,
  hasCancelIcon = false,
  onCancel,
  onSelect,
  className,
  ...rest
}: FilterChipProps) => {
  const isSelected = colorIndicator || hasCancelIcon || number > 0;
  const indicatorColor = resolveIndicatorColor(number);

  const classes = [
    baseClasses,
    isSelected ? selectedBorderClasses : unselectedBorderClasses,
    isSelected ? selectedTextClasses : unselectedTextClasses,
    className ?? "",
  ];

  return (
    <button
      type="button"
      {...rest}
      className={cn(...classes)}
      onClick={onSelect}
      disabled={isSelected && !hasCancelIcon}
    >
      <div className={contentClasses}>
        <div className={labelGroupClasses}>
          {colorIndicator && (
            <span
              className={indicatorClasses}
              style={{ backgroundColor: indicatorColor }}
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
            onClick={(event: MouseEvent<SVGSVGElement>) => {
              event.stopPropagation();
              onCancel?.();
            }}
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
  "inline-flex items-center justify-center h-[48px] px-[20px] py-[10px] rounded-[44px] bg-[var(--color-white-100)] cursor-pointer select-none";

const selectedBorderClasses = "border border-[var(--color-yellow-300)]";
const unselectedBorderClasses = "border border-[var(--color-gray-200)]";

const selectedTextClasses = "text-[var(--color-gray-800)]";
const unselectedTextClasses = "text-[var(--color-gray-600)]";

const contentClasses = "flex items-center gap-[2px]";
const labelGroupClasses = "flex items-center gap-[10px]";
const labelClasses = "typo-body-m-medium";

const indicatorClasses = "h-[14px] w-[14px] rounded-full";
const cancelButtonClasses =
  "z-50 flex items-center justify-center p-[8px] text-[var(--color-gray-600)] cursor-pointer";

const indicatorPalette = [
  "var(--color-red-500)",
  "var(--color-yellow-500)",
  "var(--color-blue-500)",
  "var(--color-green-500)",
  "var(--color-purple-500)",
  "var(--color-pink-500)",
  "var(--color-orange-500)",
  "var(--color-lime-500)",
  "var(--color-indigo-500)",
  "var(--color-turquoise-500)",
  "var(--color-fuchsia-500)",
  "var(--color-lightblue-500)",
];

const resolveIndicatorColor = (rank?: number) => {
  if (!rank || rank < 1) {
    return "var(--color-gray-500)";
  }
  const index = Math.min(rank - 1, indicatorPalette.length - 1);
  return indicatorPalette[index];
};
//--------------------------------
