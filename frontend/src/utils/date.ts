import { DAY_LABELS } from "@/lib/calendar/mocks/constants";

export const getDayLabels = () => DAY_LABELS;

const monthLabelFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "2-digit",
});

const fullDateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

export const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatMonthLabel = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const yearPart = getDatePart(monthLabelFormatter, date, "year");
  const monthPart = getDatePart(monthLabelFormatter, date, "month");
  return `${yearPart}년 ${monthPart}월`;
};

export const formatFullDateLabel = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const yearPart = getDatePart(fullDateFormatter, date, "year");
  const monthPart = getDatePart(fullDateFormatter, date, "month");
  const dayPart = getDatePart(fullDateFormatter, date, "day");
  const dayLabel = DAY_LABELS[date.getDay()];
  return `${yearPart}년 ${monthPart}월 ${dayPart}일 (${dayLabel})`;
};

const getDatePart = (formatter: Intl.DateTimeFormat, date: Date, type: string) =>
  formatter.formatToParts(date).find((part) => part.type === type)?.value ?? "";

export const isSameMonth = (year: number, month: number, compare: Date) =>
  year === compare.getFullYear() && month === compare.getMonth();

export const isValidMonthParam = (value?: string) => !!value && /^\d{4}-\d{2}$/.test(value);

export const parseMonthParam = (value?: string) => {
  if (!value || !isValidMonthParam(value)) {
    return null;
  }
  const [year, month] = value.split("-").map(Number);
  if (month < 1 || month > 12) {
    return null;
  }
  return { year, monthIndex: month - 1 };
};

export const formatMonthParam = (year: number, monthIndex: number) =>
  `${year}-${String(monthIndex + 1).padStart(2, "0")}`;

export const isValidDateParam = (value?: string) => !!value && /^\d{4}-\d{2}-\d{2}$/.test(value);

export const isDateInMonth = (dateKey: string, year: number, monthIndex: number) => {
  const [dateYear, dateMonth] = dateKey.split("-").map(Number);
  return dateYear === year && dateMonth === monthIndex + 1;
};

/**
 * "yyyy-mm-dd" 형식을 "yyyy.mm.dd" 형식으로 변환
 * @param date - "yyyy-mm-dd" 형식의 날짜 문자열
 * @returns "yyyy.mm.dd" 형식의 날짜 문자열
 * @example
 * formatDateWithDots("2026-01-15") // "2026.01.15"
 */

import { DAY_LABELS } from "@/lib/calendar/mocks/constants";

export const getDayLabels = () => DAY_LABELS;

const monthLabelFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "2-digit",
});

const fullDateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

export const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatMonthLabel = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const yearPart = getDatePart(monthLabelFormatter, date, "year");
  const monthPart = getDatePart(monthLabelFormatter, date, "month");
  return `${yearPart}년 ${monthPart}월`;
};

export const formatFullDateLabel = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number) as [
    number,
    number,
    number
  ];

  const date = new Date(year, month - 1, day);
  const yearPart = getDatePart(fullDateFormatter, date, "year");
  const monthPart = getDatePart(fullDateFormatter, date, "month");
  const dayPart = getDatePart(fullDateFormatter, date, "day");
  const dayLabel = DAY_LABELS[date.getDay()];

  return `${yearPart}년 ${monthPart}월 ${dayPart}일 (${dayLabel})`;
};

const getDatePart = (formatter: Intl.DateTimeFormat, date: Date, type: string) =>
  formatter.formatToParts(date).find((part) => part.type === type)?.value ?? "";

export const isSameMonth = (year: number, month: number, compare: Date) =>
  year === compare.getFullYear() && month === compare.getMonth();

export const isValidMonthParam = (value?: string) => !!value && /^\d{4}-\d{2}$/.test(value);

export const parseMonthParam = (value?: string) => {
  if (!value || !isValidMonthParam(value)) {
    return null;
  }
  const [year, month] = value.split("-").map(Number);
  if (month < 1 || month > 12) {
    return null;
  }
  return { year, monthIndex: month - 1 };
};

export const formatMonthParam = (year: number, monthIndex: number) =>
  `${year}-${String(monthIndex + 1).padStart(2, "0")}`;

export const isValidDateParam = (value?: string) => !!value && /^\d{4}-\d{2}-\d{2}$/.test(value);

export const isDateInMonth = (dateKey: string, year: number, monthIndex: number) => {
  const [dateYear, dateMonth] = dateKey.split("-").map(Number);
  return dateYear === year && dateMonth === monthIndex + 1;
};

export const formatDateWithDots = (date: string): string => {
  return date.replace(/-/g, ".");
};
