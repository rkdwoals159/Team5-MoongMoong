import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  EXPENSES_CATEGORIZE_ERROR_MESSAGE,
  EXPENSES_ERROR_MESSAGE,
  EXPENSES_SAVE_ERROR_MESSAGE,
} from "@/api/constants";

const mockGet = vi.fn();
const mockPatch = vi.fn();
const mockPost = vi.fn();

vi.mock("@/api/lib/client", () => ({
  client: {
    GET: (...args: unknown[]) => mockGet(...args),
    PATCH: (...args: unknown[]) => mockPatch(...args),
    POST: (...args: unknown[]) => mockPost(...args),
  },
}));

import {
  getExpensesByPeriodV2,
  patchExpenses,
  postCategorizeExpense,
} from "@/api/client/dashboardApi";

describe("client/dashboardApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getExpensesByPeriodV2", () => {
    const params = {
      startDate: "2026-01-01",
      endDate: "2026-01-31",
      mainCategory: null,
      page: 1,
      size: 20,
      sort: ["spentAt,desc"],
    };

    it("성공 시 소비내역을 매핑해 반환한다", async () => {
      mockGet.mockResolvedValue({
        response: { ok: true },
        data: {
          total: 2,
          page: 1,
          size: 20,
          hasNext: true,
          expenses: [
            {
              expenseId: 101,
              spentAt: "2026-01-02",
              usage: "동물병원",
              cost: 30000,
              mainCategory: "MEDICAL",
              subCategory: "CHECKUP",
              memo: "정기검진",
              modifiedAt: "2026-01-03T00:00:00.000Z",
            },
            {
              expenseId: null,
              spentAt: null,
              usage: null,
              cost: null,
              mainCategory: null,
              subCategory: null,
              memo: null,
              modifiedAt: undefined,
            },
          ],
        },
      });

      const result = await getExpensesByPeriodV2(params);

      expect(mockGet).toHaveBeenCalledWith("/api/v2/expenses", {
        params: {
          query: {
            startDate: "2026-01-01",
            endDate: "2026-01-31",
            mainCategory: undefined,
            lastRowId: undefined,
            page: 1,
            size: 20,
            sort: ["spentAt,desc"],
          },
        },
      });
      expect(result).toEqual({
        total: 2,
        page: 1,
        size: 20,
        hasNext: true,
        expenses: [
          {
            expenseId: 101,
            spentAt: "2026-01-02",
            usage: "동물병원",
            cost: 30000,
            mainCategory: "MEDICAL",
            subCategory: "CHECKUP",
            memo: "정기검진",
            modifiedAt: "2026-01-03T00:00:00.000Z",
          },
          {
            expenseId: 0,
            spentAt: "",
            usage: "",
            cost: null,
            mainCategory: null,
            subCategory: null,
            memo: null,
            modifiedAt: undefined,
          },
        ],
      });
    });

    it("response.ok=false면 error.message를 throw한다", async () => {
      mockGet.mockResolvedValue({
        response: { ok: false },
        error: { message: "조회 실패" },
      });

      await expect(getExpensesByPeriodV2(params)).rejects.toThrow("조회 실패");
    });

    it("response.ok=false이고 메시지가 없으면 기본 에러 메시지를 throw한다", async () => {
      mockGet.mockResolvedValue({
        response: { ok: false },
        error: undefined,
      });

      await expect(getExpensesByPeriodV2(params)).rejects.toThrow(EXPENSES_ERROR_MESSAGE);
    });
  });

  describe("patchExpenses", () => {
    it("성공 시 에러 없이 종료한다", async () => {
      mockPatch.mockResolvedValue({ response: { ok: true } });

      await expect(patchExpenses({} as never)).resolves.toBeUndefined();
    });

    it("실패 시 error.message를 throw한다", async () => {
      mockPatch.mockResolvedValue({
        response: { ok: false },
        error: { message: "저장 실패" },
      });

      await expect(patchExpenses({} as never)).rejects.toThrow("저장 실패");
    });

    it("실패 시 에러 메시지가 없으면 기본 에러 메시지를 throw한다", async () => {
      mockPatch.mockResolvedValue({
        response: { ok: false },
        error: undefined,
      });

      await expect(patchExpenses({} as never)).rejects.toThrow(EXPENSES_SAVE_ERROR_MESSAGE);
    });
  });

  describe("postCategorizeExpense", () => {
    it("성공 시 분류 결과를 반환한다", async () => {
      const categorized = { mainCategory: "MEDICAL", subCategory: "CHECKUP" };
      mockPost.mockResolvedValue({
        response: { ok: true },
        data: categorized,
      });

      await expect(postCategorizeExpense("동물병원", "req-1")).resolves.toEqual(categorized);
      expect(mockPost).toHaveBeenCalledWith("/api/expenses", {
        body: { usage: "동물병원", requestId: "req-1" },
      });
    });

    it("실패 시 error.message를 throw한다", async () => {
      mockPost.mockResolvedValue({
        response: { ok: false },
        error: { message: "분류 실패" },
      });

      await expect(postCategorizeExpense("동물병원", "req-2")).rejects.toThrow("분류 실패");
    });

    it("실패 시 에러 메시지가 없으면 기본 에러 메시지를 throw한다", async () => {
      mockPost.mockResolvedValue({
        response: { ok: false },
        error: undefined,
      });

      await expect(postCategorizeExpense("동물병원", "req-3")).rejects.toThrow(
        EXPENSES_CATEGORIZE_ERROR_MESSAGE,
      );
    });
  });
});
