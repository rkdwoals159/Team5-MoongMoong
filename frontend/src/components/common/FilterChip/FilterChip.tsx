import { FilterChipProps } from "./FilterChip.type";
import cn from "@/utils/style";
import CancelIcon from "@/assets/ic_out_small.svg?react";

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
      disabled={isSelected}
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
          <button
            type="button"
            className={cancelButtonClasses}
            onClick={(event) => {
              event.stopPropagation();
              onCancel?.();
            }}
            aria-label="선택 해제"
          >
            <CancelIcon width={30} height={30} />
          </button>
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
const cancelButtonClasses = "flex items-center justify-center p-[8px] text-[var(--color-gray-600)]";

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
