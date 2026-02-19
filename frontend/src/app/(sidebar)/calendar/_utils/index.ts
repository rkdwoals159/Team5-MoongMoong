import type { ExpenseCategory, GroupExpenseItem } from "@/app/(sidebar)/calendar/_types";
import { categoryColorMap } from "@/app/(sidebar)/calendar/_constants";
import {
  CALENDAR_COMPACT_MAX_ROW_HEIGHT,
  CALENDAR_COMPACT_MIN_ROW_HEIGHT,
  CALENDAR_FIVE_WEEK_MAX_ROW_HEIGHT,
  CALENDAR_FOUR_WEEK_MAX_ROW_HEIGHT,
  CALENDAR_WEEK_COUNT_FOUR,
  CALENDAR_WEEK_COUNT_FIVE,
  CALENDAR_WEEK_COUNT_TO_COMPACT,
  CALENDAR_SIX_OR_MORE_WEEK_MAX_ROW_HEIGHT,
  CALENDAR_ROW_HEIGHT_VIEWPORT_OFFSET,
} from "@/app/(sidebar)/calendar/_constants";

export function buildCalendarQuery(monthParam: string, selected?: string) {
  const params = new URLSearchParams();
  params.set("month", monthParam);
  if (selected) {
    params.set("selected", selected);
  }
  return `?${params.toString()}`;
}

export function getChipColorForCategory(category: ExpenseCategory) {
  return categoryColorMap[category];
}

export function getDateTextColor(
  isDisabled: boolean,
  isWeekend: boolean,
  isSelected: boolean,
  isToday: boolean,
) {
  if (isDisabled) {
    return "text-(--color-gray-200)";
  } else if (isSelected || isToday) {
    return "text-(--color-text-inverse)";
  } else if (isWeekend) {
    return "text-(--color-red-500)";
  }
  return "text-(--color-text-base)";
}

export function getTopExpenses(expenses: GroupExpenseItem[], maxCount = 2) {
  return expenses
    .slice()
    .sort((a, b) => Number(b.cost ?? 0) - Number(a.cost ?? 0))
    .slice(0, maxCount);
}

export function getExpenseRowKey(row: GroupExpenseItem, idx: number) {
  return `${String(row.expenseId ?? idx)}-${String(row.modifiedAt ?? "")}`;
}

function toExpenseTimestamp(value?: string) {
  const parsed = value ? new Date(value).getTime() : 0;
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function getVisibleExpensesByLatest(expenses: GroupExpenseItem[]) {
  return [...expenses].sort((a, b) => {
    const modifiedA = toExpenseTimestamp(a.modifiedAt);
    const modifiedB = toExpenseTimestamp(b.modifiedAt);
    if (modifiedA !== modifiedB) {
      return modifiedB - modifiedA;
    }
    return Number(b.expenseId ?? 0) - Number(a.expenseId ?? 0);
  });
}

export function getCalendarGridRowHeight(weeks: number) {
  const isCompact = weeks >= CALENDAR_WEEK_COUNT_TO_COMPACT;
  const minRowHeight = isCompact
    ? CALENDAR_COMPACT_MAX_ROW_HEIGHT
    : CALENDAR_COMPACT_MIN_ROW_HEIGHT;
  const maxRowHeight =
    weeks === CALENDAR_WEEK_COUNT_FOUR
      ? CALENDAR_FOUR_WEEK_MAX_ROW_HEIGHT
      : weeks === CALENDAR_WEEK_COUNT_FIVE
        ? CALENDAR_FIVE_WEEK_MAX_ROW_HEIGHT
        : CALENDAR_SIX_OR_MORE_WEEK_MAX_ROW_HEIGHT;

  return {
    isCompact,
    minRowHeight,
    maxRowHeight,
    rowHeight: `clamp(${minRowHeight}px, calc((100vh - ${CALENDAR_ROW_HEIGHT_VIEWPORT_OFFSET}px) / ${weeks}), ${maxRowHeight}px)`,
  };
}
