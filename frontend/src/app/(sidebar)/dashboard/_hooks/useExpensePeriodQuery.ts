"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { ExpenseData, UseExpensePeriodQueryReturn } from "@/app/(sidebar)/dashboard/_types";
import { getExpensesByPeriod } from "@/api/dashboardApi";
import { resolveDashboardRange } from "@/app/(sidebar)/dashboard/_lib";
import { EXPENSES_ERROR_MESSAGE } from "@/app/(sidebar)/dashboard/_constants";
import { useToast } from "@/components/ui/Toast/ToastProvider";

/**
 * 기간별 지출 데이터 조회 및 URL 동기화 훅
 */
export const useExpensePeriodQuery = (
  setExpenses: (expenses: ExpenseData[]) => void,
): UseExpensePeriodQueryReturn => {
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  const { startDate, endDate } = resolveDashboardRange({
    startDate: searchParams.get("startDate"),
    endDate: searchParams.get("endDate"),
  });

  useEffect(() => {
    let cancelled = false;

    const loadExpenses = async () => {
      try {
        const res = await getExpensesByPeriod(startDate, endDate);
        if (cancelled) return;
        setExpenses(res.expenses);
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load expenses for period:", error);
        showToast({
          variant: "error",
          message: error instanceof Error ? error.message : EXPENSES_ERROR_MESSAGE,
        });
      }
    };

    loadExpenses();

    return () => {
      cancelled = true;
    };
  }, [startDate, endDate, showToast, setExpenses]);

  return { startDate, endDate };
};
