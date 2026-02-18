"use client";

import { useState, useRef } from "react";
import ArrowLeftIcon from "@/assets/icons/components/arrow-left-medium.svg";
import ArrowRightIcon from "@/assets/icons/components/arrow-right-medium.svg";
import { formatDateWithWeekday, shiftByUnit, clampDate } from "@/utils/date";
import { cn } from "@/utils/style";
import DatePickerPopup from "@/components/common/DatePicker/DatePickerPopup";
import {
  DATE_PICKER_HEIGHT,
  DATE_PICKER_GAP,
} from "@/components/common/DatePicker/datePicker.constants";
import type { DateRangePickerProps } from "./dateRangePicker.type";

type OpenPicker = "start" | "end" | null;

function getPopupPosition(el: HTMLElement): { top: number; left: number } {
  const rect = el.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const showAbove = spaceBelow < DATE_PICKER_HEIGHT + DATE_PICKER_GAP;
  return {
    top: showAbove
      ? rect.top - DATE_PICKER_HEIGHT - DATE_PICKER_GAP
      : rect.bottom + DATE_PICKER_GAP,
    left: rect.left,
  };
}

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
  const [openPicker, setOpenPicker] = useState<OpenPicker>(null);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const endButtonRef = useRef<HTMLButtonElement>(null);

  const handleNavigate = (delta: number) => {
    const newStart = shiftByUnit(startDate, navigationUnit, delta);
    const newEnd = shiftByUnit(endDate, navigationUnit, delta);
    const clampedStart = clampDate(newStart, minDate, maxDate);
    const clampedEnd = clampDate(newEnd, minDate, maxDate);
    const finalStart = clampedStart <= clampedEnd ? clampedStart : clampedEnd;
    const finalEnd = clampedStart <= clampedEnd ? clampedEnd : clampedStart;
    onRangeChange(finalStart, finalEnd);
  };

  const openPickerFor = (which: "start" | "end") => {
    const ref = which === "start" ? startButtonRef : endButtonRef;
    if (ref.current) {
      setPickerPosition(getPopupPosition(ref.current));
    }
    setOpenPicker(which);
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
        <button
          ref={startButtonRef}
          type="button"
          className={dateFieldClasses}
          aria-label={`시작일 ${dateFormat(startDate)}`}
          onClick={() => openPickerFor("start")}
        >
          {dateFormat(startDate)}
        </button>
        <span className="typo-body-m-medium text-text-sub" aria-hidden>
          -
        </span>
        <button
          ref={endButtonRef}
          type="button"
          className={dateFieldClasses}
          aria-label={`종료일 ${dateFormat(endDate)}`}
          onClick={() => openPickerFor("end")}
        >
          {dateFormat(endDate)}
        </button>
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

      {openPicker === "start" && (
        <DatePickerPopup
          position={pickerPosition}
          value={startDate}
          onChange={(v) => {
            const newEnd = v > endDate ? v : endDate;
            onRangeChange(v, newEnd);
            setOpenPicker(null);
          }}
          onClose={() => setOpenPicker(null)}
        />
      )}
      {openPicker === "end" && (
        <DatePickerPopup
          position={pickerPosition}
          value={endDate}
          minDate={startDate}
          maxMonthsFromToday={6}
          onChange={(v) => {
            const newStart = v < startDate ? v : startDate;
            onRangeChange(newStart, v);
            setOpenPicker(null);
          }}
          onClose={() => setOpenPicker(null)}
        />
      )}
    </div>
  );
}

const navButtonBase =
  "flex size-10 shrink-0 items-center justify-center rounded-300 border border-border-normal bg-white-100 cursor-pointer transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300 disabled:pointer-events-none";

const dateFieldClasses =
  "inline-flex items-center rounded-300 border border-border-normal bg-white-100 px-400 py-300 typo-body-m-medium text-text-base cursor-pointer transition-colors hover:bg-gray-50";
