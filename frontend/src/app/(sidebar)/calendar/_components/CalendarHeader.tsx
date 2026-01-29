"use client";

import ArrowLeftIcon from "@/assets/icons/components/arrow-left-medium.svg";
import ArrowRightIcon from "@/assets/icons/components/arrow-right-medium.svg";
import useCalendarNavigation from "@/hooks/calendar/useCalendarNavigation";
import { CalendarHeaderProps } from "@/types/calendar";

export default function CalendarHeader({
  label,
  isCurrentMonth,
  prevMonthParam,
  nextMonthParam,
  todayMonthParam,
  todayDateParam,
}: CalendarHeaderProps) {
  const { handlePrev, handleNext, handleToday } = useCalendarNavigation({
    isCurrentMonth,
    prevMonthParam,
    nextMonthParam,
    todayMonthParam,
    todayDateParam,
  });

  return (
    <section className="flex flex-wrap items-center justify-between gap-600">
      <div className="flex items-center gap-600">
        <button
          type="button"
          className={
            "flex size-[40px] items-center justify-center rounded-300 border border-(--color-border-normal) bg-(--color-white-100) cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-(--color-gray-300) focus-visible:outline-offset-2"
          }
          aria-label="이전 달"
          onClick={handlePrev}
        >
          <ArrowLeftIcon className="h-5 w-5 text-(--color-text-base)" aria-hidden />
        </button>
        <span className="typo-title-l-bold text-(--color-text-base)">{label}</span>
        <button
          type="button"
          className={
            "flex size-[40px] items-center justify-center rounded-300 border border-(--color-border-normal) bg-(--color-white-100) pointer-events-auto transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-(--color-gray-300) focus-visible:outline-offset-2"
          }
          aria-label="다음 달"
          onClick={handleNext}
        >
          <ArrowRightIcon className="h-5 w-5 text-(--color-text-base)" aria-hidden />
        </button>
      </div>
      <button
        type="button"
        onClick={handleToday}
        disabled={isCurrentMonth}
        className="rounded-250 border border-(--color-border-normal) bg-(--color-white-100) px-300 py-200 text-(--color-text-base) transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-(--color-gray-300) focus-visible:outline-offset-2 disabled:cursor-default disabled:text-(--color-text-sub)"
      >
        <span className="typo-body-m-medium">이번 달</span>
      </button>
    </section>
  );
}
