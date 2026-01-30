import {
  formatDateKey,
  formatFullDateLabel,
  formatMonthLabel,
  formatMonthParam,
  isDateInMonth,
  isSameMonth,
  isValidDateParam,
  parseMonthParam,
} from "@/utils/date";
import { buildCalendarDays } from "@/app/(sidebar)/calendar/_lib/buildCalendarDays";
import { CalendarContext, CalendarSearchParams, ExpenseMap } from "@/app/(sidebar)/calendar/_types";

//캘린더 헤더 컴포넌트 속성 조회
export function getHeaderProps(resolvedSearchParams: CalendarSearchParams) {
  const context = resolveCalendarContext(resolvedSearchParams);
  const { prevMonthParam, nextMonthParam, todayMonthParam } = buildMonthNavParams(context);

  return {
    label: formatMonthLabel(context.viewYear, context.viewMonth),
    isCurrentMonth: context.isCurrentMonth,
    prevMonthParam,
    nextMonthParam,
    todayMonthParam,
    todayDateParam: context.todayKey,
  };
}

//캘린더 표 컴포넌트 속성 조회
export function getGridProps(resolvedSearchParams: CalendarSearchParams, expenseMap: ExpenseMap) {
  const context = resolveCalendarContext(resolvedSearchParams);
  const { days, weeks } = buildCalendarDays(context.viewYear, context.viewMonth, expenseMap);

  return { days, weeks, monthParam: context.monthParam };
}

//지출 모달 컴포넌트 속성 조회
export function getExpenseModalProps(resolvedSearchParams: CalendarSearchParams) {
  const context = resolveCalendarContext(resolvedSearchParams);
  const selectedValue = resolvedSearchParams.selected ?? null;
  const selectedParam = isValidDateParam(selectedValue ?? undefined) ? selectedValue : null;
  const selectedDate = resolveSelectedDate(selectedParam, context);

  return {
    isModalOpen: resolvedSearchParams.open === "1",
    selectedDate,
    modalTitle: selectedDate ? formatFullDateLabel(selectedDate) : "",
    closeHref: buildCloseHref(context.monthParam, selectedDate),
  };
}

// ------------- 내부 구성함수-------------------

const resolveCalendarContext = (resolvedSearchParams: CalendarSearchParams): CalendarContext => {
  const today = new Date();
  const todayKey = formatDateKey(today);
  const parsedMonth = parseMonthParam(resolvedSearchParams.month);
  const viewYear = parsedMonth?.year ?? today.getFullYear();
  const viewMonth = parsedMonth?.monthIndex ?? today.getMonth();
  const monthParam = formatMonthParam(viewYear, viewMonth);
  const isCurrentMonth = isSameMonth(viewYear, viewMonth, today);

  return {
    today,
    todayKey,
    viewYear,
    viewMonth,
    monthParam,
    isCurrentMonth,
  };
};

const buildMonthNavParams = ({ viewYear, viewMonth, today }: CalendarContext) => {
  const prevMonthDate = new Date(viewYear, viewMonth - 1, 1);
  const nextMonthDate = new Date(viewYear, viewMonth + 1, 1);

  return {
    prevMonthParam: formatMonthParam(prevMonthDate.getFullYear(), prevMonthDate.getMonth()),
    nextMonthParam: formatMonthParam(nextMonthDate.getFullYear(), nextMonthDate.getMonth()),
    todayMonthParam: formatMonthParam(today.getFullYear(), today.getMonth()),
  };
};

const resolveSelectedDate = (
  selectedParam: string | null,
  { viewYear, viewMonth, isCurrentMonth, todayKey }: CalendarContext,
) => {
  if (selectedParam && isDateInMonth(selectedParam, viewYear, viewMonth)) {
    return selectedParam;
  }

  if (isCurrentMonth) {
    return todayKey;
  }

  return null;
};

const buildCloseHref = (monthParam: string, selectedDate: string | null) => {
  const closeParams = new URLSearchParams();
  closeParams.set("month", monthParam);

  if (selectedDate) {
    closeParams.set("selected", selectedDate);
  }

  return `?${closeParams.toString()}`;
};
