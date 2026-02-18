import type { CalendarGridCell } from "@/components/common/DatePicker/datePicker.type";
import { formatDateKey } from "@/utils/date";

/** 해당 월의 캘린더 그리드 반환 (7x6, 이전/다음달 포함) */
export function getCalendarGrid(year: number, monthIndex: number): CalendarGridCell[] {
  const firstOfMonth = new Date(year, monthIndex, 1);
  const startOffset = firstOfMonth.getDay();
  const startDate = new Date(year, monthIndex, 1 - startOffset);
  const cells: CalendarGridCell[] = [];

  for (let i = 0; i < 42; i++) {
    const d = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
    const dateKey = formatDateKey(d);
    const day = d.getDate();
    const isCurrentMonth = d.getMonth() === monthIndex && d.getFullYear() === year;
    cells.push({ dateKey, day, isCurrentMonth });
  }
  return cells;
}
