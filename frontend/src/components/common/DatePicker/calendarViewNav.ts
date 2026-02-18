/** 캘린더 뷰 (년/월) 네비게이션 결과 */
export type CalendarView = { year: number; month: number };

/** 이전 년도 */
export function getPrevYearView(year: number, month: number): CalendarView {
  return { year: year - 1, month };
}

/** 이전 달 */
export function getPrevMonthView(year: number, month: number): CalendarView {
  if (month === 0) return { year: year - 1, month: 11 };
  return { year, month: month - 1 };
}

/** 다음 달 */
export function getNextMonthView(year: number, month: number): CalendarView {
  if (month === 11) return { year: year + 1, month: 0 };
  return { year, month: month + 1 };
}

/** 다음 년도 */
export function getNextYearView(year: number, month: number): CalendarView {
  return { year: year + 1, month };
}

/** 이번 달 */
export function getThisMonthView(): CalendarView {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
}
