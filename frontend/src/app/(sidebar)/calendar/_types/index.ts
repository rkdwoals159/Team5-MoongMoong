import type { components } from "@/types/schema";
export type ExpenseCategory = "사료/간식" | "의료비" | "물품구매비" | "미용" | "기타";

export type GroupExpenseItem = components["schemas"]["GroupExpenseResponse"];

export type GroupDailyExpenseItem = components["schemas"]["GroupExpensesDailyResponse"];
export type GroupExpenseMap = Record<string, GroupExpenseItem[]>;

export type CalendarDay = {
  date: string;
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  expenses: GroupExpenseMap[string];
};

export type CalendarDayCellProps = {
  day: CalendarDay;
  isSelected: boolean;
  isBottomLeft: boolean;
  isBottomRight: boolean;
  monthParam: string;
};

export type CalendarGridProps = {
  days: CalendarDay[];
  weeks: number;
  selectedDate: string | null;
  monthParam: string;
};

export type CalendarHeaderProps = {
  label: string;
  isCurrentMonth: boolean;
  prevMonthParam: string;
  nextMonthParam: string;
  todayMonthParam: string;
  todayDateParam: string;
};

export type ExpenseCountChipProps = {
  count: number;
};

export type ExpenseModalProps = {
  open: boolean;
  title: string;
  items: GroupDailyExpenseItem["expenses"];
  closeHref: string;
};

export type CalendarPageProps = {
  searchParams?: Promise<{
    month?: string;
    selected?: string;
    open?: string;
  }>;
};
export type CalendarSearchParams = {
  month?: string;
  selected?: string;
  open?: string;
};

export type CalendarContext = {
  today: Date;
  viewYear: number;
  viewMonth: number;
};

export type UseCalendarNavigationParams = {
  isCurrentMonth: boolean;
  prevMonthParam: string;
  nextMonthParam: string;
  todayMonthParam: string;
  todayDateParam: string;
};

export type CalendarViewContext = CalendarContext & {
  todayKey: string;
  monthParam: string;
  isCurrentMonth: boolean;
};
