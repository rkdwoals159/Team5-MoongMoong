import { useMemo } from "react";
import { formatFullDateLabel } from "@/utils/date";
import type {
  GroupExpenseItem,
  UseCalendarDayCellDataParams,
} from "@/app/(sidebar)/calendar/_types";
import {
  getDateTextColor,
  getExpenseRowKey,
  getTopExpenses,
  getVisibleExpensesByLatest,
} from "@/app/(sidebar)/calendar/_utils";

export function useCalendarDayCellData({
  day,
  isSelected,
  hasSelectedDate,
  isPanelOpen,
  visibleExpenseCount,
}: UseCalendarDayCellDataParams) {
  const isDisabled = !day.inCurrentMonth;
  const hasExpenses = day.expenses.length > 0;
  const isDateActive = isSelected || isPanelOpen;
  const isTodayActive = day.isToday && !hasSelectedDate;
  const extraCount = Math.max(day.expenses.length - visibleExpenseCount, 0);

  const dateTextColor = getDateTextColor(isDisabled, day.isWeekend, isDateActive, isTodayActive);
  const topExpenses = useMemo(
    () => (hasExpenses ? getTopExpenses(day.expenses, visibleExpenseCount) : []),
    [day.expenses, hasExpenses, visibleExpenseCount],
  );

  const visibleExpenses = useMemo<GroupExpenseItem[]>(() => {
    if (!isPanelOpen || !hasExpenses) {
      return [];
    }

    return getVisibleExpensesByLatest(day.expenses);
  }, [day.expenses, hasExpenses, isPanelOpen]);

  const totalCost = visibleExpenses.reduce((sum, expense) => sum + Number(expense.cost ?? 0), 0);
  const dateLabel = formatFullDateLabel(day.date);

  return {
    isDisabled,
    hasExpenses,
    isTodayActive,
    extraCount,
    dateTextColor,
    topExpenses,
    visibleExpenses,
    totalCost,
    dateLabel,
    rowKey: getExpenseRowKey,
  };
}
