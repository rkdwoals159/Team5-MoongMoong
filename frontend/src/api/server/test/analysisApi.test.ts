import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGet = vi.fn();

vi.mock("@/lib/api", () => ({
  client: {
    GET: (...args: unknown[]) => mockGet(...args),
  },
}));

import {
  getCategoryAnalysis,
  getGroupExpenses,
  getMedicalAnalysis,
} from "@/api/server/analysisApi";

describe("server/analysisApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getGroupExpenses: 정상 응답이면 expenses를 반환한다", async () => {
    const expenses = [{ expenseId: 1 }, { expenseId: 2 }];
    mockGet.mockResolvedValue({ data: { expenses } });

    await expect(getGroupExpenses("2026-01-01", "2026-01-31")).resolves.toEqual(expenses);
    expect(mockGet).toHaveBeenCalledWith("/api/expenses/group", {
      params: { query: { startDate: "2026-01-01", endDate: "2026-01-31" } },
    });
  });

  it("getGroupExpenses: 데이터가 없으면 빈 배열을 반환한다", async () => {
    mockGet.mockResolvedValue({ data: null });

    await expect(getGroupExpenses("2026-01-01", "2026-01-31")).resolves.toEqual([]);
  });

  it("getCategoryAnalysis: total과 categoryAnalysis를 매핑한다", async () => {
    mockGet.mockResolvedValue({
      data: { total: 50000, categoryAnalysis: [{ category: "MEDICAL", cost: 50000 }] },
    });

    await expect(getCategoryAnalysis("2026-01-01", "2026-01-31")).resolves.toEqual({
      total: 50000,
      items: [{ category: "MEDICAL", cost: 50000 }],
    });
  });

  it("getCategoryAnalysis: 데이터가 없으면 기본값을 반환한다", async () => {
    mockGet.mockResolvedValue({ data: undefined });

    await expect(getCategoryAnalysis("2026-01-01", "2026-01-31")).resolves.toEqual({
      total: 0,
      items: [],
    });
  });

  it("getMedicalAnalysis: totalMedical과 medicalAnalysis를 매핑한다", async () => {
    mockGet.mockResolvedValue({
      data: { totalMedical: 120000, medicalAnalysis: [{ disease: "OCU", totalCost: 120000 }] },
    });

    await expect(getMedicalAnalysis("2026-01-01", "2026-01-31")).resolves.toEqual({
      total: 120000,
      items: [{ disease: "OCU", totalCost: 120000 }],
    });
  });

  it("getMedicalAnalysis: 데이터가 없으면 기본값을 반환한다", async () => {
    mockGet.mockResolvedValue({ data: undefined });

    await expect(getMedicalAnalysis("2026-01-01", "2026-01-31")).resolves.toEqual({
      total: 0,
      items: [],
    });
  });
});
