"use client";

import { useRouter } from "next/navigation";

type UseCalendarNavigationParams = {
  isCurrentMonth: boolean;
  prevMonthParam: string;
  nextMonthParam: string;
  todayMonthParam: string;
  todayDateParam: string;
};

const buildQuery = (monthParam: string, selected?: string) => {
  const params = new URLSearchParams();
  params.set("month", monthParam);
  if (selected) {
    params.set("selected", selected);
  }
  return `?${params.toString()}`;
};

export default function useCalendarNavigation({
  isCurrentMonth,
  prevMonthParam,
  nextMonthParam,
  todayMonthParam,
  todayDateParam,
}: UseCalendarNavigationParams) {
  const router = useRouter();

  const handleNavigate = (monthParam: string) => {
    const shouldSelectToday = monthParam === todayMonthParam;
    const selected = shouldSelectToday ? todayDateParam : undefined;
    router.push(buildQuery(monthParam, selected));
  };

  const handlePrev = () => handleNavigate(prevMonthParam);
  const handleNext = () => handleNavigate(nextMonthParam);

  const handleToday = () => {
    if (isCurrentMonth) {
      return;
    }
    router.push(buildQuery(todayMonthParam, todayDateParam));
  };

  return {
    handlePrev,
    handleNext,
    handleToday,
  };
}
