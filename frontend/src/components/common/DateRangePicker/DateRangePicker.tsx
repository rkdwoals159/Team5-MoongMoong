"use client";

import ArrowLeftIcon from "@/assets/icons/components/arrow-left-medium.svg";
import ArrowRightIcon from "@/assets/icons/components/arrow-right-medium.svg";
import { formatDateWithWeekday, shiftByUnit, clampDate } from "@/utils/date";
import cn from "@/utils/style";
import NativeDateInput from "./NativeDateInput";
import type { DateRangePickerProps } from "./DateRangePicker.type";

export default function DateRangePicker({
  startDate,
  endDate,
  onRangeChange,
  minDate,
  maxDate,
  navigationUnit = "month",
  className,
  dateFormat = formatDateWithWeekday,
  ariaLabelPrev = "이전 기간",
  ariaLabelNext = "다음 기간",
  ...rest
}: DateRangePickerProps) {
  const handleNavigate = (delta: number) => {
    const newStart = shiftByUnit(startDate, navigationUnit, delta);
    const newEnd = shiftByUnit(endDate, navigationUnit, delta);
    const clampedStart = clampDate(newStart, minDate, maxDate);
    const clampedEnd = clampDate(newEnd, minDate, maxDate);
    const finalStart = clampedStart <= clampedEnd ? clampedStart : clampedEnd;
    const finalEnd = clampedStart <= clampedEnd ? clampedEnd : clampedStart;
    onRangeChange(finalStart, finalEnd);
  };

  const isPrevDisabled = !!minDate && startDate <= minDate;
  const isNextDisabled = !!maxDate && endDate >= maxDate;

  return (
    <div
      {...rest}
      className={cn("flex items-center gap-300", className ?? "")}
      role="group"
      aria-label="날짜 범위 선택"
    >
      <button
        type="button"
        className={navButtonBase}
        aria-label={ariaLabelPrev}
        disabled={isPrevDisabled}
        onClick={() => handleNavigate(-1)}
      >
        <ArrowLeftIcon className="h-5 w-5 text-text-base" aria-hidden />
      </button>

      <div className="flex items-center gap-200">
        <NativeDateInput
          value={startDate}
          displayText={dateFormat(startDate)}
          min={minDate}
          max={endDate}
          ariaLabel={`시작일 ${dateFormat(startDate)}`}
          onChange={(v) => {
            const newEnd = v > endDate ? v : endDate;
            onRangeChange(v, newEnd);
          }}
          className={dateFieldClasses}
        />
        <span className="typo-body-m-medium text-text-sub" aria-hidden>
          -
        </span>
        <NativeDateInput
          value={endDate}
          displayText={dateFormat(endDate)}
          min={startDate}
          max={maxDate}
          ariaLabel={`종료일 ${dateFormat(endDate)}`}
          onChange={(v) => {
            const newStart = v < startDate ? v : startDate;
            onRangeChange(newStart, v);
          }}
          className={dateFieldClasses}
        />
      </div>

      <button
        type="button"
        className={navButtonBase}
        aria-label={ariaLabelNext}
        disabled={isNextDisabled}
        onClick={() => handleNavigate(1)}
      >
        <ArrowRightIcon className="h-5 w-5 text-text-base" aria-hidden />
      </button>
    </div>
  );
}

const navButtonBase =
  "flex size-10 shrink-0 items-center justify-center rounded-300 border border-border-normal bg-white-100 cursor-pointer transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300 disabled:pointer-events-none";

const dateFieldClasses =
  "inline-flex items-center rounded-300 border border-border-normal bg-white-100 px-400 py-300 typo-body-m-medium text-text-base cursor-pointer transition-colors hover:bg-gray-50";
