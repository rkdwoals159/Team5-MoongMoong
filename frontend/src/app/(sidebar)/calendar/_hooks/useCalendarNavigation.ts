"use client";

import { useRouter } from "next/navigation";
import type { UseCalendarNavigationParams } from "@/app/(sidebar)/calendar/_types";
import { buildCalendarQuery } from "@/app/(sidebar)/calendar/_utils";

export function useCalendarNavigation({
  isCurrentMonth,
  prevMonthParam,
  nextMonthParam,
  todayMonthParam,
  todayDateParam,
}: UseCalendarNavigationParams) {
  const router = useRouter();

  function handleNavigate(monthParam: string) {
    router.push(buildCalendarQuery(monthParam));
  }

  function handlePrev() {
    handleNavigate(prevMonthParam);
  }
  function handleNext() {
    handleNavigate(nextMonthParam);
  }

  function handleToday() {
    if (isCurrentMonth) {
      return;
    }
    router.push(buildCalendarQuery(todayMonthParam, todayDateParam));
  }

  return {
    handlePrev,
    handleNext,
    handleToday,
  };
}
