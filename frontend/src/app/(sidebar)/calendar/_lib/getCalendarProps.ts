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
import {
  CalendarContext,
  CalendarGridProps,
  CalendarHeaderProps,
  CalendarSearchParams,
  ExpenseMap,
} from "@/app/(sidebar)/calendar/_types";

type CalendarViewContext = CalendarContext & {
  todayKey: string;
  monthParam: string;
  isCurrentMonth: boolean;
};

//캘린더 페이지 전체 속성 반환
export function getCalendarPageProps(
  resolvedSearchParams: CalendarSearchParams,
  expenseMap: ExpenseMap,
) {
  const context = resolveCalendarContext(resolvedSearchParams);
  const selectedDate = resolveSelectedDateParam(resolvedSearchParams, context);

  return {
    headerProps: buildHeaderProps(context),
    gridProps: buildGridProps(context, expenseMap, selectedDate),
    modalProps: buildModalProps(resolvedSearchParams, context.monthParam, selectedDate),
  };
}

// ------------- 내부 구성함수-------------------

/**
 * 월 내비게이션 파라미터 빌드
 * @param viewYear - 현재 년도
 * @param viewMonth - 현재 월
 * @param today - 오늘 날짜
 * @returns 월 내비게이션 파라미터
 */
const buildMonthNavParams = ({ viewYear, viewMonth, today }: CalendarContext) => {
  const prevMonthDate = new Date(viewYear, viewMonth - 1, 1);
  const nextMonthDate = new Date(viewYear, viewMonth + 1, 1);

  return {
    prevMonthParam: formatMonthParam(prevMonthDate.getFullYear(), prevMonthDate.getMonth()),
    nextMonthParam: formatMonthParam(nextMonthDate.getFullYear(), nextMonthDate.getMonth()),
    todayMonthParam: formatMonthParam(today.getFullYear(), today.getMonth()),
  };
};

const resolveCalendarContext = (
  resolvedSearchParams: CalendarSearchParams,
): CalendarViewContext => {
  const today = new Date();
  const todayKey = formatDateKey(today);
  const parsedMonth = parseMonthParam(resolvedSearchParams.month);
  const viewYear = parsedMonth?.year ?? today.getFullYear();
  const viewMonth = parsedMonth?.monthIndex ?? today.getMonth();
  const monthParam = formatMonthParam(viewYear, viewMonth);

  return {
    today,
    todayKey,
    viewYear,
    viewMonth,
    monthParam,
    isCurrentMonth: isSameMonth(viewYear, viewMonth, today),
  };
};

const resolveSelectedDateParam = (
  resolvedSearchParams: CalendarSearchParams,
  context: CalendarViewContext,
) => {
  const selectedValue = resolvedSearchParams.selected ?? null;
  const selectedParam = isValidDateParam(selectedValue ?? undefined) ? selectedValue : null;
  return selectedParam && isDateInMonth(selectedParam, context.viewYear, context.viewMonth)
    ? selectedParam
    : null;
};

const buildHeaderProps = (context: CalendarViewContext): CalendarHeaderProps => {
  const { prevMonthParam, nextMonthParam, todayMonthParam } = buildMonthNavParams(context);

  return {
    label: formatMonthLabel(context.viewYear, context.viewMonth),
    isCurrentMonth: context.isCurrentMonth,
    prevMonthParam,
    nextMonthParam,
    todayMonthParam,
    todayDateParam: context.todayKey,
  };
};

const buildGridProps = (
  context: CalendarViewContext,
  expenseMap: ExpenseMap,
  selectedDate: string | null,
): CalendarGridProps => {
  const { days, weeks } = buildCalendarDays(context.viewYear, context.viewMonth, expenseMap);
  return { days, weeks, selectedDate, monthParam: context.monthParam };
};

const buildModalProps = (
  resolvedSearchParams: CalendarSearchParams,
  monthParam: string,
  selectedDate: string | null,
) => {
  return {
    isModalOpen: resolvedSearchParams.open === "1",
    selectedDate,
    modalTitle: selectedDate ? formatFullDateLabel(selectedDate) : "",
    closeHref: buildCloseHref(monthParam, selectedDate),
  };
};

/**
 * 닫기 링크 빌드
 * @param monthParam - 월 파라미터
 * @param selectedDate - 선택된 날짜
 * @returns 닫기 링크
 */
const buildCloseHref = (monthParam: string, selectedDate: string | null) => {
  const closeParams = new URLSearchParams();
  closeParams.set("month", monthParam);

  if (selectedDate) {
    closeParams.set("selected", selectedDate);
  }

  return `?${closeParams.toString()}`;
};
