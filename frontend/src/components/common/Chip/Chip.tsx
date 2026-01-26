import { ChipProps } from "./Chip.type";
import cn from "@/utils/style";

const Chip = ({ label, level, color, price, className, ...rest }: ChipProps) => {
  const hasPrice = typeof price === "number";
  const resolvedColor = level === "minor" ? "none" : color;

  const classes: string[] = [
    baseClasses,
    layoutClasses[hasPrice ? "withPrice" : "withoutPrice"],
    colorBgClasses[resolvedColor],
    level === "minor" ? minorBorderClasses : "",
    className ?? "",
  ];

  return (
    <div {...rest} className={cn(...classes)}>
      <span className={cn(labelClasses, colorTextClasses[resolvedColor])}>{label}</span>
      {hasPrice && <span className={priceClasses}>{price.toLocaleString()}원</span>}
    </div>
  );
};

export default Chip;

//--------------------------------
// Tailwind CSS classes
const baseClasses =
  "inline-flex items-center h-[24px] px-[var(--spacing-250)] py-[var(--spacing-100)] rounded-[var(--radius-200)]";

const layoutClasses = {
  withPrice: "w-[144px] justify-between",
  withoutPrice: "justify-start",
};

const labelClasses = "typo-caption-s-bold";
const priceClasses = "typo-caption-s-bold text-[var(--color-gray-700)]";

const minorBorderClasses = "border border-[var(--color-gray-50)]";

const colorBgClasses = {
  green: "bg-[var(--color-green-100)]",
  purple: "bg-[var(--color-purple-100)]",
  blue: "bg-[var(--color-blue-100)]",
  red: "bg-[var(--color-red-100)]",
  turquoise: "bg-[var(--color-turquoise-100)]",
  orange: "bg-[var(--color-orange-100)]",
  yellow: "bg-[var(--color-yellow-100)]",
  gray: "bg-[var(--color-gray-50)]",
  none: "bg-[var(--color-white-100)]",
} as const;

const colorTextClasses = {
  green: "text-[var(--color-green-500)]",
  purple: "text-[var(--color-purple-500)]",
  blue: "text-[var(--color-blue-500)]",
  red: "text-[var(--color-red-500)]",
  turquoise: "text-[var(--color-turquoise-500)]",
  orange: "text-[var(--color-orange-500)]",
  yellow: "text-[var(--color-yellow-500)]",
  gray: "text-[var(--color-gray-500)]",
  none: "text-[var(--color-gray-500)]",
} as const;
//--------------------------------
