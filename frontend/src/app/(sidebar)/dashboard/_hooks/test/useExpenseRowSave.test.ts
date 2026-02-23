import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useExpenseRowSave } from "@/app/(sidebar)/dashboard/_hooks/useExpenseRowSave";
import { SAVE_ERROR_MESSAGE } from "@/app/(sidebar)/dashboard/_constants";
import { patchExpenses } from "@/api/client/dashboardApi";

const mockPatchExpenses = vi.mocked(patchExpenses);
const { mockShowToast } = vi.hoisted(() => ({ mockShowToast: vi.fn() }));

vi.mock("@/api/client/dashboardApi", () => ({
  patchExpenses: vi.fn(),
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
    hasUnsavedChanges: true,
    onSaveSuccess: vi.fn(),
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
        await result.current.handleSave();
      });

      expect(mockPatchExpenses).not.toHaveBeenCalled();
      expect(defaultParams.onSaveSuccess).not.toHaveBeenCalled();
    });
  });

  describe("시나리오: 저장 성공 플로우", () => {
    it("patch 후 onSaveSuccess를 호출한다", async () => {
      const payload = { expenses: [{ expenseId: 1, usage: "점심" }], deletedIds: [] };
      defaultParams.getPatchPayload.mockReturnValue({
        payload,
        invalidCount: 0,
      } as never);
      mockPatchExpenses.mockResolvedValue(undefined);

      const { result } = renderHook(() => useExpenseRowSave(defaultParams));

      await act(async () => {
        await result.current.handleSave();
      });

      expect(mockPatchExpenses).toHaveBeenCalledWith(payload);
      expect(defaultParams.onSaveSuccess).toHaveBeenCalled();
    });
  });

  describe("시나리오: patch API 실패", () => {
    it("토스트를 띄우고 onSaveSuccess는 호출하지 않는다", async () => {
      mockPatchExpenses.mockRejectedValue(new Error("네트워크 오류"));

      const { result } = renderHook(() => useExpenseRowSave(defaultParams));

      await act(async () => {
        await result.current.handleSave();
      });

      expect(defaultParams.onSaveSuccess).not.toHaveBeenCalled();
      expect(mockShowToast).toHaveBeenCalledWith({
        variant: "error",
        message: "네트워크 오류",
      });
    });
  });

  describe("시나리오: Error 인스턴스가 아닌 값이 throw된 경우", () => {
    it("fallback으로 SAVE_ERROR_MESSAGE를 토스트에 표시한다", async () => {
      mockPatchExpenses.mockRejectedValue("unknown throw");

      const { result } = renderHook(() => useExpenseRowSave(defaultParams));

      await act(async () => {
        await result.current.handleSave();
      });

      expect(mockShowToast).toHaveBeenCalledWith({
        variant: "error",
        message: SAVE_ERROR_MESSAGE,
      });
    });
  });
});
