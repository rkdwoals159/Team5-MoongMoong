import type { CalendarDay, GroupExpenseMap } from "@/app/(sidebar)/calendar/_types";
import { formatDateKey } from "@/utils/date";

export function buildCalendarDays(year: number, month: number, expenseMap: GroupExpenseMap) {
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastOfMonth.getDate();
  const startDay = firstOfMonth.getDay();
  const prevMonthLastDate = new Date(year, month, 0).getDate();
  const totalWeeks = Math.ceil((startDay + daysInMonth) / 7);
  const totalCells = totalWeeks * 7;
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
    weeks: totalWeeks,
  };
}
