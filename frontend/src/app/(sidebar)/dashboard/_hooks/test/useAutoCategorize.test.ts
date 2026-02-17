import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAutoCategorize } from "@/app/(sidebar)/dashboard/_hooks/useAutoCategorize";
import { postCategorizeExpense } from "@/api/dashboardApi";

const mockPostCategorizeExpense = vi.mocked(postCategorizeExpense);
const { mockShowToast } = vi.hoisted(() => ({ mockShowToast: vi.fn() }));

vi.mock("@/api/dashboardApi", () => ({
  postCategorizeExpense: vi.fn(),
}));

vi.mock("@/components/ui/Toast/ToastProvider", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
  useToast: () => ({ showToast: mockShowToast }),
}));

/**
 * 디바운스 없이 즉시 실행되도록 mock하여 비동기 로직만 테스트
 */
vi.mock("@/hooks/useDebouncedCallback", () => ({
  useDebouncedCallback: (fn: (localId: string, usage: string) => void | Promise<void>) => fn,
}));

describe("useAutoCategorize", () => {
  const mockUpdateCellByLocalId = vi.fn();

  const defaultParams = {
    updateCellByLocalId: mockUpdateCellByLocalId,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useAutoCategorize", () => {
    describe("시나리오: usage가 비어있을 때", () => {
      it("API를 호출하지 않고 mainCategory, subCategory를 초기화한다", async () => {
        const { result } = renderHook(() => useAutoCategorize(defaultParams));

        await act(async () => {
          result.current.triggerCategorize("exp-1", "");
        });

        expect(mockPostCategorizeExpense).not.toHaveBeenCalled();
        expect(mockUpdateCellByLocalId).toHaveBeenCalledWith(
          "exp-1",
          "mainCategory",
          "",
          "subCategory",
          "",
        );
      });

      it("공백만 있을 때도 카테고리를 초기화한다", async () => {
        const { result } = renderHook(() => useAutoCategorize(defaultParams));

        await act(async () => {
          result.current.triggerCategorize("exp-1", "   ");
        });

        expect(mockPostCategorizeExpense).not.toHaveBeenCalled();
        expect(mockUpdateCellByLocalId).toHaveBeenCalledWith(
          "exp-1",
          "mainCategory",
          "",
          "subCategory",
          "",
        );
      });
    });

    describe("시나리오: API 호출 성공", () => {
      it("postCategorizeExpense 결과로 mainCategory, subCategory를 업데이트한다", async () => {
        mockPostCategorizeExpense.mockResolvedValue({
          requestId: "exp-1",
          mainCategory: "병원비",
          subCategory: "약처방",
        });

        const { result } = renderHook(() => useAutoCategorize(defaultParams));

        await act(async () => {
          result.current.triggerCategorize("exp-1", "감기약 구매");
        });

        expect(mockPostCategorizeExpense).toHaveBeenCalledWith("감기약 구매", "exp-1");
        expect(mockUpdateCellByLocalId).toHaveBeenCalledWith(
          "exp-1",
          "mainCategory",
          "병원비",
          "subCategory",
          "약처방",
        );
      });

      it("subCategory가 없으면 빈 문자열로 반영한다", async () => {
        mockPostCategorizeExpense.mockResolvedValue({
          requestId: "exp-1",
          mainCategory: "병원비",
          subCategory: undefined,
        });

        const { result } = renderHook(() => useAutoCategorize(defaultParams));

        await act(async () => {
          result.current.triggerCategorize("exp-1", "수술");
        });

        expect(mockUpdateCellByLocalId).toHaveBeenCalledWith(
          "exp-1",
          "mainCategory",
          "병원비",
          "subCategory",
          "",
        );
      });
    });

    describe("시나리오: API 호출 실패", () => {
      it("Error 인스턴스일 때 에러 메시지를 토스트로 표시한다", async () => {
        mockPostCategorizeExpense.mockRejectedValue(new Error("네트워크 오류"));

        const { result } = renderHook(() => useAutoCategorize(defaultParams));

        await act(async () => {
          result.current.triggerCategorize("exp-1", "점심식사");
        });

        expect(mockShowToast).toHaveBeenCalledWith({
          variant: "error",
          message: "네트워크 오류",
        });
        expect(mockUpdateCellByLocalId).not.toHaveBeenCalled();
      });
    });
  });
});
