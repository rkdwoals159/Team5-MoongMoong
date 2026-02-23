"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type {
  ExpenseData,
  UseExpensesV2Params,
  UseExpensesV2Return,
} from "@/app/(sidebar)/dashboard/_types";
import { getExpensesByPeriodV2 } from "@/api/client/dashboardApi";
import { resolveDashboardRange } from "@/app/(sidebar)/dashboard/_lib";
import { DEFAULT_PAGE_SIZE, EXPENSES_ERROR_MESSAGE } from "@/app/(sidebar)/dashboard/_constants";
import { useToast } from "@/components/ui/Toast/ToastProvider";

/**
 * V2 API를 사용한 기간별 지출 데이터 조회 훅
 *
 * sortConfig / startDate / endDate가 변경되면 resetKey를 증가시켜 첫 페이지를 다시 조회한다.
 * loadMore를 호출하면 다음 페이지를 fetch하여 기존 expenses에 append한다.
 */
export function useExpensesV2({
  toSortParams,
  mainCategoryFilter,
}: UseExpensesV2Params): UseExpensesV2Return {
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  const { startDate, endDate } = resolveDashboardRange({
    startDate: searchParams.get("startDate"),
    endDate: searchParams.get("endDate"),
  });

  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // resetKey는 조회조건(sortConfig, startDate, endDate)이 변경될 때마다 +1 해서 초기 페이지를 리셋할 때 활용
  const [resetKey, setResetKey] = useState(0);

  // fetchKey는 강제 재조회 (예: 저장 후) 시 +1 해서 useEffect 재실행 트리거
  const [fetchKey, setFetchKey] = useState(0);
  const refetch = useCallback(() => setFetchKey((k) => k + 1), []);

  /** 공통 페이지 fetch 로직 — page/lastRowId만 달라지는 중복 제거 */
  const fetchPageData = useCallback(
    async (pageNum: number, lastRowId?: number) => {
      try {
        return await getExpensesByPeriodV2({
          startDate,
          endDate,
          page: pageNum,
          size: DEFAULT_PAGE_SIZE,
          lastRowId,
          mainCategory: mainCategoryFilter ?? undefined,
          sort: toSortParams(),
        });
      } catch (error) {
        showToast({
          variant: "error",
          message: error instanceof Error ? error.message : EXPENSES_ERROR_MESSAGE,
        });
        return null;
      }
    },
    [startDate, endDate, mainCategoryFilter, toSortParams, showToast],
  );

  // 첫 페이지 조회: sortConfig / startDate / endDate / fetchKey 변경 시
  useEffect(() => {
    let cancelled = false;

    const fetchFirstPage = async () => {
      const result = await fetchPageData(0);
      if (cancelled || !result) return;
      setExpenses(result.expenses);
      setHasNext(result.hasNext);
      setPage(0);
      setResetKey((k) => k + 1);
    };

    fetchFirstPage();
    return () => {
      cancelled = true;
    };
  }, [fetchKey, fetchPageData]);

  // 다음 페이지 fetch → 기존 expenses에 append
  const loadMore = useCallback(async () => {
    if (!hasNext || isLoadingMore) return;
    setIsLoadingMore(true);
    const lastId = expenses.at(-1)?.expenseId;
    const nextPage = page + 1;
    const result = await fetchPageData(nextPage, lastId);
    if (result) {
      setExpenses((prev) => [...prev, ...result.expenses]);
      setHasNext(result.hasNext);
      setPage(nextPage);
    }
    setIsLoadingMore(false);
  }, [hasNext, isLoadingMore, expenses, page, fetchPageData]);

  return { startDate, endDate, expenses, refetch, hasNext, isLoadingMore, loadMore, resetKey };
}
