import type { ChipProps } from "./chip.type";
import { cn } from "@/utils/style";

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
const baseClasses = "inline-flex items-center h-[24px] px-250 py-100 rounded-200";

const layoutClasses = {
  withPrice: "w-[144px] justify-between",
  withoutPrice: "justify-start",
};

const labelClasses = "typo-caption-s-bold";
const priceClasses = "typo-caption-s-bold text-gray-700";

const minorBorderClasses = "border border-gray-50";

const colorBgClasses = {
  green: "bg-green-100",
  purple: "bg-purple-100",
  blue: "bg-blue-100",
  red: "bg-red-100",
  turquoise: "bg-turquoise-100",
  orange: "bg-orange-100",
  yellow: "bg-yellow-100",
  gray: "bg-gray-50",
  none: "bg-white-100",
} as const;

const colorTextClasses = {
  green: "text-green-500",
  purple: "text-purple-500",
  blue: "text-blue-500",
  red: "text-red-500",
  turquoise: "text-turquoise-500",
  orange: "text-orange-500",
  yellow: "text-yellow-500",
  gray: "text-gray-500",
  none: "text-gray-500",
} as const;
//--------------------------------
