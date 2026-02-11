"use client";

import { useRouter } from "next/navigation";
import type { UseCalendarNavigationParams } from "@/app/(sidebar)/calendar/_types";

export default function useCalendarNavigation({
  isCurrentMonth,
  prevMonthParam,
  nextMonthParam,
  todayMonthParam,
  todayDateParam,
}: UseCalendarNavigationParams) {
  const router = useRouter();

  function handleNavigate(monthParam: string) {
    router.push(buildQuery(monthParam));
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
    router.push(buildQuery(todayMonthParam, todayDateParam));
  }

  return {
    handlePrev,
    handleNext,
    handleToday,
  };
}

function buildQuery(monthParam: string, selected?: string) {
  const params = new URLSearchParams();
  params.set("month", monthParam);
  if (selected) {
    params.set("selected", selected);
  }
  return `?${params.toString()}`;
}
