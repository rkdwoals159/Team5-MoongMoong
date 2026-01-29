import type { ChipMajorColor } from "@/components/common/Chip/Chip.type";
import type { ExpenseCategory } from "@/types/calendar";
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

export const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;
export const SCROLL_THRESHOLD = 9;
