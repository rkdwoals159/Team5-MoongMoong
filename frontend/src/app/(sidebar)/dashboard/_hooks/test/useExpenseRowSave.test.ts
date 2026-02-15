import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useExpenseRowSave } from "@/app/(sidebar)/dashboard/_hooks/useExpenseRowSave";
import { SAVE_ERROR_MESSAGE } from "@/app/(sidebar)/dashboard/_constants";
import { patchExpenses, getExpensesByPeriod } from "@/api/dashboardApi";
import type { ExpenseData } from "@/app/(sidebar)/dashboard/_types";

const mockPatchExpenses = vi.mocked(patchExpenses);
const mockGetExpensesByPeriod = vi.mocked(getExpensesByPeriod);
const { mockShowToast } = vi.hoisted(() => ({ mockShowToast: vi.fn() }));

vi.mock("@/api/dashboardApi", () => ({
  patchExpenses: vi.fn(),
  getExpensesByPeriod: vi.fn(),
}));

vi.mock("@/components/ui/Toast/ToastProvider", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
  useToast: () => ({ showToast: mockShowToast }),
}));

describe("useExpenseRowSave", () => {
  const defaultParams = {
    getPatchPayload: vi.fn(() => ({
      payload: { expenses: [], deletedIds: [] },
      invalidCount: 0,
    })),
    mergeRowsFromServer: vi.fn(),
    hasUnsavedChanges: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("시나리오: 변경사항 없을 때 저장 버튼을 누른 경우", () => {
    it("API를 호출하지 않고 early return 한다", async () => {
      const { result } = renderHook(() =>
        useExpenseRowSave({
          ...defaultParams,
          hasUnsavedChanges: false,
        }),
      );

      await act(async () => {
        await result.current.handleSave("2026-01-01", "2026-01-31");
      });

      expect(mockPatchExpenses).not.toHaveBeenCalled();
      expect(mockGetExpensesByPeriod).not.toHaveBeenCalled();
      expect(defaultParams.mergeRowsFromServer).not.toHaveBeenCalled();
    });
  });

  describe("시나리오: 저장 성공 플로우", () => {
    it("patch 후 같은 기간으로 재조회하고, 결과를 mergeRowsFromServer에 넘긴다", async () => {
      const payload = { expenses: [{ expenseId: 1, usage: "점심" }], deletedIds: [] };
      const refreshed: ExpenseData[] = [
        {
          expenseId: 1,
          spentAt: "2026-01-15",
          usage: "점심",
          cost: 5000,
          mainCategory: "",
          subCategory: "",
          memo: "",
        },
      ];
      defaultParams.getPatchPayload.mockReturnValue({
        payload,
        invalidCount: 0,
      } as never);
      mockPatchExpenses.mockResolvedValue(undefined);
      mockGetExpensesByPeriod.mockResolvedValue({
        expenses: refreshed,
        total: 1,
      } as Awaited<ReturnType<typeof getExpensesByPeriod>>);

      const { result } = renderHook(() => useExpenseRowSave(defaultParams));

      await act(async () => {
        await result.current.handleSave("2026-01-01", "2026-01-31");
      });

      expect(mockPatchExpenses).toHaveBeenCalledWith(payload);
      expect(mockGetExpensesByPeriod).toHaveBeenCalledWith("2026-01-01", "2026-01-31");
      expect(defaultParams.mergeRowsFromServer).toHaveBeenCalledWith(refreshed);
    });
  });

  describe("시나리오: patch API 실패", () => {
    it("토스트를 띄우고 mergeRowsFromServer는 호출하지 않는다", async () => {
      mockPatchExpenses.mockRejectedValue(new Error("네트워크 오류"));

      const { result } = renderHook(() => useExpenseRowSave(defaultParams));

      await act(async () => {
        await result.current.handleSave("2026-01-01", "2026-01-31");
      });

      expect(defaultParams.mergeRowsFromServer).not.toHaveBeenCalled();
      expect(mockGetExpensesByPeriod).not.toHaveBeenCalled();
      expect(mockShowToast).toHaveBeenCalledWith({
        variant: "error",
        message: "네트워크 오류",
      });
    });
  });

  describe("시나리오: patch 성공 후 재조회 API 실패", () => {
    it("토스트를 띄우고 mergeRowsFromServer는 호출하지 않는다", async () => {
      mockPatchExpenses.mockResolvedValue(undefined);
      mockGetExpensesByPeriod.mockRejectedValue(new Error("조회 실패"));

      const { result } = renderHook(() => useExpenseRowSave(defaultParams));

      await act(async () => {
        await result.current.handleSave("2026-01-01", "2026-01-31");
      });

      expect(defaultParams.mergeRowsFromServer).not.toHaveBeenCalled();
      expect(mockShowToast).toHaveBeenCalledWith({
        variant: "error",
        message: "조회 실패",
      });
    });
  });

  describe("시나리오: Error 인스턴스가 아닌 값이 throw된 경우", () => {
    it("fallback으로 SAVE_ERROR_MESSAGE를 토스트에 표시한다", async () => {
      mockPatchExpenses.mockRejectedValue("unknown throw");

      const { result } = renderHook(() => useExpenseRowSave(defaultParams));

      await act(async () => {
        await result.current.handleSave("2026-01-01", "2026-01-31");
      });

      expect(mockShowToast).toHaveBeenCalledWith({
        variant: "error",
        message: SAVE_ERROR_MESSAGE,
      });
    });
  });
});
