import React from "react";
import { useSearchParams } from "next/navigation";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useExpensePeriodQuery } from "@/app/(sidebar)/dashboard/_hooks/useExpensePeriodQuery";
import { EXPENSES_ERROR_MESSAGE } from "@/app/(sidebar)/dashboard/_constants";
import { getExpensesByPeriod } from "@/api/dashboardApi";
import type { ExpenseData } from "@/app/(sidebar)/dashboard/_types";

const mockGetExpensesByPeriod = vi.mocked(getExpensesByPeriod);
const { mockShowToast } = vi.hoisted(() => ({
  mockShowToast: vi.fn(),
}));

vi.mock("@/api/dashboardApi", () => ({
  getExpensesByPeriod: vi.fn(),
}));

vi.mock("@/components/ui/Toast/ToastProvider", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
  useToast: () => ({ showToast: mockShowToast }),
}));

describe("useExpensePeriodQuery", () => {
  const setExpenses = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams({ startDate: "2026-01-01", endDate: "2026-01-31" }) as ReturnType<
        typeof useSearchParams
      >,
    );
  });

  describe("시나리오: 마운트 시 기간 데이터 로딩", () => {
    it("URL 기간으로 getExpensesByPeriod를 호출하고, 성공 시 setExpenses에 결과를 넘긴다", async () => {
      const expenses: ExpenseData[] = [
        {
          expenseId: 1,
          spentAt: "2026-01-15",
          usage: "점심",
          cost: 5000,
          mainCategory: "식비",
          subCategory: "외식",
          memo: "",
        },
      ];
      mockGetExpensesByPeriod.mockResolvedValue({
        expenses,
        total: 1,
      } as Awaited<ReturnType<typeof getExpensesByPeriod>>);

      renderHook(() => useExpensePeriodQuery(setExpenses));

      await waitFor(() => {
        expect(mockGetExpensesByPeriod).toHaveBeenCalledWith("2026-01-01", "2026-01-31");
      });
      expect(setExpenses).toHaveBeenCalledWith(expenses);
    });

    it("반환값에 startDate, endDate가 URL에서 해석된 기간과 일치한다", () => {
      const { result } = renderHook(() => useExpensePeriodQuery(setExpenses));

      expect(result.current.startDate).toBe("2026-01-01");
      expect(result.current.endDate).toBe("2026-01-31");
    });
  });

  describe("시나리오: 기간 조회 API 실패", () => {
    it("토스트를 띄우고 setExpenses는 호출하지 않는다", async () => {
      mockGetExpensesByPeriod.mockRejectedValue(new Error("서버 오류"));

      renderHook(() => useExpensePeriodQuery(setExpenses));

      await waitFor(() => {
        expect(mockGetExpensesByPeriod).toHaveBeenCalled();
      });
      expect(mockShowToast).toHaveBeenCalledWith({
        variant: "error",
        message: "서버 오류",
      });
      expect(setExpenses).not.toHaveBeenCalled();
    });
  });

  describe("시나리오: Error 인스턴스가 아닌 값이 throw된 경우", () => {
    it("fallback으로 EXPENSES_ERROR_MESSAGE를 토스트에 표시한다", async () => {
      mockGetExpensesByPeriod.mockRejectedValue("unknown");

      renderHook(() => useExpensePeriodQuery(setExpenses));

      await waitFor(() => {
        expect(mockGetExpensesByPeriod).toHaveBeenCalled();
      });
      expect(mockShowToast).toHaveBeenCalledWith({
        variant: "error",
        message: EXPENSES_ERROR_MESSAGE,
      });
      expect(setExpenses).not.toHaveBeenCalled();
    });
  });

  describe("시나리오: 요청 중 언마운트된 경우", () => {
    it("응답이 돌아와도 setExpenses를 호출하지 않는다", async () => {
      let resolve!: (value: { expenses: ExpenseData[]; total: number }) => void;
      const delayed = new Promise<{ expenses: ExpenseData[]; total: number }>((r) => {
        resolve = r;
      });
      mockGetExpensesByPeriod.mockReturnValue(delayed as ReturnType<typeof getExpensesByPeriod>);

      const { unmount } = renderHook(() => useExpensePeriodQuery(setExpenses));

      await waitFor(() => {
        expect(mockGetExpensesByPeriod).toHaveBeenCalled();
      });

      unmount();

      await act(async () => {
        resolve({ expenses: [], total: 0 });
      });

      expect(setExpenses).not.toHaveBeenCalled();
    });
  });
});
