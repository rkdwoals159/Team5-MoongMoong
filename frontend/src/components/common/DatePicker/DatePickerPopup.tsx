"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DatePickerPopupProps } from "@/components/common/DatePicker/datePicker.type";
import {
  getPrevYearView,
  getPrevMonthView,
  getNextMonthView,
  getNextYearView,
  getThisMonthView,
} from "@/components/common/DatePicker/calendarViewNav";
import { getCalendarGrid } from "@/components/common/DatePicker/getCalendarGrid";
import { DAY_LABELS } from "@/constants";
import { formatDateKey, formatMonthLabel } from "@/utils/date";
import { cn } from "@/utils/style";
import { DATE_PICKER_HEIGHT } from "./datePicker.constants";
import IcCalendarPrevWeek from "@/assets/icons/datepicker/ic_calendar_prev_week.svg";
import IcCalendarPrevMonth from "@/assets/icons/datepicker/ic_calendar_prev_month.svg";
import IcCalendarNextMonth from "@/assets/icons/datepicker/ic_calendar_next_month.svg";
import IcCalendarNextWeek from "@/assets/icons/datepicker/ic_calendar_next_week.svg";
import Button from "@/components/common/Button/Button";

function resolveMaxDateKey(maxDate: string | undefined, maxMonthsFromToday: number | undefined) {
  if (maxDate) return maxDate;
  if (maxMonthsFromToday == null) return undefined;
  const d = new Date();
  d.setMonth(d.getMonth() + maxMonthsFromToday);
  return formatDateKey(d);
}

export default function DatePickerPopup({
  position,
  value,
  onChange,
  onClose,
  minHeight = DATE_PICKER_HEIGHT,
  minDate: minDateProp,
  maxDate: maxDateProp,
  maxMonthsFromToday,
  dayLabels = DAY_LABELS,
}: DatePickerPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => formatDateKey(today), [today]);

  const minDateKey = minDateProp;

  const maxDateKey = useMemo(
    () => resolveMaxDateKey(maxDateProp, maxMonthsFromToday),
    [maxDateProp, maxMonthsFromToday],
  );

  const initialYear = value ? parseInt(value.slice(0, 4), 10) : today.getFullYear();
  const initialMonth = value ? parseInt(value.slice(5, 7), 10) - 1 : today.getMonth();

  const [view, setView] = useState(() => ({ year: initialYear, month: initialMonth }));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const canGoPrevMonth = useMemo(() => {
    if (!minDateKey) return true;
    const prev = getPrevMonthView(view.year, view.month);
    const lastDay = new Date(prev.year, prev.month + 1, 0);
    return formatDateKey(lastDay) >= minDateKey;
  }, [minDateKey, view.month, view.year]);

  const canGoPrevYear = useMemo(() => {
    if (!minDateKey) return true;
    const prev = getPrevYearView(view.year, view.month);
    const lastDay = new Date(prev.year, prev.month + 1, 0);
    return formatDateKey(lastDay) >= minDateKey;
  }, [minDateKey, view.month, view.year]);

  const canGoNextMonth = useMemo(() => {
    if (!maxDateKey) return true;
    const next = getNextMonthView(view.year, view.month);
    const firstKey = formatDateKey(new Date(next.year, next.month, 1));
    return firstKey <= maxDateKey;
  }, [maxDateKey, view.month, view.year]);

  const canGoNextYear = useMemo(() => {
    if (!maxDateKey) return true;
    const next = getNextYearView(view.year, view.month);
    const firstKey = formatDateKey(new Date(next.year, next.month, 1));
    return firstKey <= maxDateKey;
  }, [maxDateKey, view.month, view.year]);

  const handleDateClick = useCallback(
    (dateKey: string) => {
      if (minDateKey != null && dateKey < minDateKey) return;
      if (maxDateKey != null && dateKey > maxDateKey) return;
      onChange(dateKey);
      onClose();
    },
    [onChange, onClose, minDateKey, maxDateKey],
  );

  const grid = useMemo(() => getCalendarGrid(view.year, view.month), [view.year, view.month]);

  return (
    <div
      ref={popupRef}
      role="dialog"
      aria-modal="true"
      aria-label="날짜 선택"
      className="fixed z-50 w-[280px] rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden"
      style={{ top: position.top, left: position.left }}
    >
      <div className="p-4" style={{ minHeight }}>
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="이전 년도"
              disabled={!canGoPrevYear}
              className="size-6 flex items-center justify-center rounded hover:bg-gray-100 text-text-base typo-body-s-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              onClick={() => setView((prev) => getPrevYearView(prev.year, prev.month))}
            >
              <IcCalendarPrevMonth className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="이전 달"
              disabled={!canGoPrevMonth}
              className="size-6 flex items-center justify-center rounded hover:bg-gray-100 text-text-base typo-body-s-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              onClick={() => setView((prev) => getPrevMonthView(prev.year, prev.month))}
            >
              <IcCalendarPrevWeek className="size-5" aria-hidden />
            </button>
          </div>
          <span className="typo-body-m-bold text-text-base">
            {formatMonthLabel(view.year, view.month)}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="다음 달"
              disabled={!canGoNextMonth}
              className="size-6 flex items-center justify-center rounded hover:bg-gray-100 text-text-base typo-body-s-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              onClick={() => setView((prev) => getNextMonthView(prev.year, prev.month))}
            >
              <IcCalendarNextWeek className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="다음 년도"
              disabled={!canGoNextYear}
              className="size-6 flex items-center justify-center rounded hover:bg-gray-100 text-text-base typo-body-s-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              onClick={() => setView((prev) => getNextYearView(prev.year, prev.month))}
            >
              <IcCalendarNextMonth className="size-5" aria-hidden />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7">
          {dayLabels.map((label) => (
            <div
              key={label}
              className="h-8 flex items-center justify-center typo-body-s-medium text-text-base"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {grid.map((cell) => {
            const isSelected = cell.dateKey === value;
            const isToday = cell.dateKey === todayKey;
            const isBeforeMin = minDateKey != null && cell.dateKey < minDateKey;
            const isAfterMax = maxDateKey != null && cell.dateKey > maxDateKey;
            const isDisabled = isBeforeMin || isAfterMax;

            return (
              <button
                key={cell.dateKey}
                type="button"
                aria-label={`${cell.dateKey} 선택`}
                disabled={isDisabled}
                className={cn(
                  "size-8 flex items-center justify-center rounded typo-body-s-medium transition-colors cursor-pointer",
                  !cell.isCurrentMonth && "text-gray-300 hover:bg-gray-100 hover:text-text-base",
                  cell.isCurrentMonth && "text-text-base hover:bg-gray-100",
                  isSelected && "bg-gray-800 text-white hover:bg-gray-800",
                  isToday && !isSelected && "font-bold",
                  isDisabled &&
                    "disabled:cursor-not-allowed opacity-40 hover:bg-transparent hover:opacity-40",
                )}
                onClick={() => handleDateClick(cell.dateKey)}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
        <Button
          variant="secondary"
          size="medium"
          fullWidth
          onClick={() => setView(getThisMonthView())}
        >
          이번달
        </Button>
      </div>
    </div>
  );
}
