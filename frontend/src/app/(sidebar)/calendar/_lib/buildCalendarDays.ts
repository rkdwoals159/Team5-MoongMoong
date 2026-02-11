import { CalendarDay, GroupExpenseMap } from "@/app/(sidebar)/calendar/_types";
import { formatDateKey } from "@/utils/date";
import { categoryColorMap } from "@/app/(sidebar)/calendar/_constants";
import { ExpenseCategory } from "@/app/(sidebar)/calendar/_types";

export function getChipColorForCategory(category: ExpenseCategory) {
  return categoryColorMap[category];
}

export function buildCalendarDays(year: number, month: number, expenseMap: GroupExpenseMap) {
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastOfMonth.getDate();
  const startDay = firstOfMonth.getDay();
  const prevMonthLastDate = new Date(year, month, 0).getDate();
  const totalCells = startDay + daysInMonth <= 35 ? 35 : 42;
  const todayKey = formatDateKey(new Date());

  const days: CalendarDay[] = Array.from({ length: totalCells }, (_, index) => {
    const dayOffset = index - startDay + 1;
    let cellDate: Date;
    let inCurrentMonth = true;
    if (dayOffset <= 0) {
      cellDate = new Date(year, month - 1, prevMonthLastDate + dayOffset);
      inCurrentMonth = false;
    } else if (dayOffset > daysInMonth) {
      cellDate = new Date(year, month + 1, dayOffset - daysInMonth);
      inCurrentMonth = false;
    } else {
      cellDate = new Date(year, month, dayOffset);
    }

    const dateKey = formatDateKey(cellDate);
    const expenses = inCurrentMonth ? (expenseMap[dateKey] ?? []) : [];
    const dayOfWeek = cellDate.getDay();

    return {
      date: dateKey,
      dayNumber: cellDate.getDate(),
      inCurrentMonth,
      isToday: dateKey === todayKey,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      expenses,
    };
  });

  return {
    days,
    weeks: totalCells / 7,
  };
}
