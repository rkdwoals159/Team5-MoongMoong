import type { CSSProperties, RefObject } from "react";
import type { components } from "@/types/schema";

export type { CalendarErrorProps } from "./calendarError";
export type {
  CalculatePanelLayoutParams,
  PanelLayout,
  PanelLayoutElementRefs,
} from "./calendarDayCell";
export type ExpenseCategory =
  | "미용"
  | "의료비"
  | "사료"
  | "의류"
  | "간식"
  | "영양제"
  | "장난감"
  | "기타";

export type GroupExpenseItem = components["schemas"]["GroupExpenseResponse"];

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
  hasSelectedDate: boolean;
  isBottomLeft: boolean;
  isBottomRight: boolean;
  isCompact: boolean;
};

export type CalendarGridProps = {
  days: CalendarDay[];
  weeks: number;
  selectedDate: string | null;
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

export type CalendarPageProps = {
  searchParams?: Promise<{
    month?: string;
    selected?: string;
  }>;
};
export type CalendarSearchParams = {
  month?: string;
  selected?: string;
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

export type UseCalendarDayCellDataParams = {
  day: CalendarDay;
  isSelected: boolean;
  hasSelectedDate: boolean;
  isPanelOpen: boolean;
  visibleExpenseCount: number;
};

export type UseCalendarDayCellPanelParams = {
  dayDate: string;
  isClickable: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  dayButtonRef: RefObject<HTMLButtonElement | null>;
};

export type UseCalendarDayCellPanelResult = {
  isPanelOpen: boolean;
  panelId: string;
  panelStyle: CSSProperties;
  tableStyle: CSSProperties;
  handleTogglePanel: () => void;
};

export type CalendarViewContext = CalendarContext & {
  todayKey: string;
  isCurrentMonth: boolean;
};
