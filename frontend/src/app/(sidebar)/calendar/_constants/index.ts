import type { ChipMajorColor } from "@/components/common/Chip/Chip.type";
import type { ExpenseCategory } from "@/app/(sidebar)/calendar/_types";

export const categoryColorMap: Record<ExpenseCategory, ChipMajorColor> = {
  미용: "green",
  의료비: "red",
  사료: "orange",
  의류: "purple",
  간식: "yellow",
  영양제: "turquoise",
  장난감: "blue",
  기타: "gray",
};

export const SCROLL_THRESHOLD = 9;
