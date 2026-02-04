import { components } from "@/types/schema";

export type ExpenseCategory =
  | "미용"
  | "의료비"
  | "사료"
  | "의류"
  | "간식"
  | "영양제"
  | "장난감"
  | "기타";

export type ExpenseItem = components["schemas"]["MemberExpenseResponse"];

export type GroupDailyExpenseItem = components["schemas"]["GroupExpensesDailyResponse"];
export type ExpenseMap = Record<string, ExpenseItem[]>;

export type CalendarDay = {
  date: string;
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  expenses: ExpenseMap[string];
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
