import { DAY_LABELS } from "@/constants";
import type { NavigationUnit } from "@/components/common/DateRangePicker/dateRangePicker.type";
const monthLabelFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "2-digit",
});

const fullDateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

export function getDayLabels() {
  return DAY_LABELS;
}

/** Date를 YYYY-MM-DD 형식 문자열로 변환 */
export function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** 년·월을 "YYYY년 MM월" 형식으로 포맷 */
export function formatMonthLabel(year: number, month: number) {
  const date = new Date(year, month, 1);
  const yearPart = getDatePart(monthLabelFormatter, date, "year");
  const monthPart = getDatePart(monthLabelFormatter, date, "month");
  return `${yearPart}년 ${monthPart}월`;
}

/** dateKey를 "YYYY년 M월 D일 (요일)" 형식으로 포맷 */
export function formatFullDateLabel(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number) as [number, number, number];

  const date = new Date(year, month - 1, day);
  const yearPart = getDatePart(fullDateFormatter, date, "year");
  const monthPart = getDatePart(fullDateFormatter, date, "month");
  const dayPart = getDatePart(fullDateFormatter, date, "day");
  const dayLabel = DAY_LABELS[date.getDay()];

  return `${yearPart}년 ${monthPart}월 ${dayPart}일 (${dayLabel})`;
}

/** formatter로 date의 year/month/day 중 지정한 부분만 추출 */
const getDatePart = (formatter: Intl.DateTimeFormat, date: Date, type: string) =>
  formatter.formatToParts(date).find((part) => part.type === type)?.value ?? "";

/** 주어진 년·월과 compare Date가 같은 월인지 여부 */
export function isSameMonth(year: number, month: number, compare: Date) {
  return year === compare.getFullYear() && month === compare.getMonth();
}

/** YYYY-MM 형식 문자열 유효성 검사 */
export function isValidMonthParam(value?: string) {
  return !!value && /^\d{4}-\d{2}$/.test(value);
}

/** YYYY-MM 문자열을 { year, monthIndex }로 파싱 (유효하지 않으면 null) */
export function parseMonthParam(value?: string) {
  if (!value || !isValidMonthParam(value)) {
    return null;
  }
  const [year, month] = value.split("-").map(Number);
  if (month === undefined || month < 1 || month > 12) {
    return null;
  }
  return { year, monthIndex: month - 1 };
}

/** year, monthIndex를 YYYY-MM 문자열로 변환 */
export function formatMonthParam(year: number, monthIndex: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

/** YYYY-MM-DD 형식 문자열 유효성 검사 */
export function isValidDateParam(value?: string) {
  return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/** dateKey가 주어진 년·월에 속하는지 여부 */
export function isDateInMonth(dateKey: string, year: number, monthIndex: number) {
  const [dateYear, dateMonth] = dateKey.split("-").map(Number);
  return dateYear === year && dateMonth === monthIndex + 1;
}

/** monthParam(YYYY-MM)에 해당하는 월의 시작일·마지막일을 dateKey로 반환 */
export function resolveMonthRange(monthParam?: string) {
  const today = new Date();
  const parsed = parseMonthParam(monthParam);
  const year = parsed?.year ?? today.getFullYear();
  const monthIndex = parsed?.monthIndex ?? today.getMonth();
  const startDate = formatDateKey(new Date(year, monthIndex, 1));
  const endDate = formatDateKey(new Date(year, monthIndex + 1, 0));

  return { startDate, endDate };
}

/** YYYY-MM-DD를 YYYY.MM.DD 형식으로 변환 (구분자만 변경) */
export function formatDateWithDots(date: string): string {
  return date.replace(/-/g, ".");
}

/** YYYY.MM.DD (요일) 형식으로 표시 (DateRangePicker 등 공용 표시용) */
export function formatDateWithWeekday(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number) as [number, number, number];
  const date = new Date(year, month - 1, day);
  const dayLabel = DAY_LABELS[date.getDay()];
  return `${formatDateWithDots(dateKey)} (${dayLabel})`;
}

/** 날짜에 N일을 더하거나 뺀 YYYY-MM-DD 반환 */
export function shiftDateByDays(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split("-").map(Number) as [number, number, number];
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return formatDateKey(date);
}

/** 날짜에 N달을 더하거나 뺀 YYYY-MM-DD 반환 */
export function shiftDateByMonths(dateKey: string, months: number): string {
  const [y, m, d] = dateKey.split("-").map(Number) as [number, number, number];
  const date = new Date(y, m - 1, d);
  date.setMonth(date.getMonth() + months);
  return formatDateKey(date);
}

/** 주어진 날짜가 주어진 최소·최대 날짜 사이에 있는지 여부 */
export function clampDate(value: string, min?: string, max?: string): string {
  let result = value;
  if (min && result < min) result = min;
  if (max && result > max) result = max;
  return result;
}

/** YYYY-MM 형식 생년월일로 만 나이(소수 포함)를 계산 */
export function getPetAge(value: string): number {
  const [yearStr, monthStr] = value.split("-");
  if (!yearStr || !monthStr) return 0;

  const year = Number(yearStr);
  const month = Number(monthStr);
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  return currentYear - year + (currentMonth - month) / 12;
}

/** 주어진 날짜를 주어진 단위로 증가 또는 감소 */
export function shiftByUnit(dateKey: string, unit: NavigationUnit, delta: number): string {
  switch (unit) {
    case "day":
      return shiftDateByDays(dateKey, delta);
    case "week":
      return shiftDateByDays(dateKey, 7 * delta);
    case "month":
      return shiftDateByMonths(dateKey, delta);
    default:
      return shiftDateByMonths(dateKey, delta);
  }
}
