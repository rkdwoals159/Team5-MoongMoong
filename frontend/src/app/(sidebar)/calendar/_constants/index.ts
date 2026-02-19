import type { ChipMajorColor } from "@/components/common/Chip/chip.type";
import type { ExpenseCategory } from "@/app/(sidebar)/calendar/_types";
export * from "./calendarGrid";
import { CATEGORY_COLOR_MAP } from "@/constants/colorTables";

export const categoryColorMap: Record<ExpenseCategory, ChipMajorColor> = CATEGORY_COLOR_MAP;

export const SCROLL_THRESHOLD = 9;
