import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetAnalysisGroupExpenses = vi.fn();
const mockResolveMonthRange = vi.fn();
const mockGet = vi.fn();

vi.mock("@/api/server/analysisApi", () => ({
  getGroupExpenses: (...args: unknown[]) => mockGetAnalysisGroupExpenses(...args),
}));

vi.mock("@/utils/date", () => ({
  resolveMonthRange: (...args: unknown[]) => mockResolveMonthRange(...args),
}));

vi.mock("@/api/lib/client", () => ({
  client: {
    GET: (...args: unknown[]) => mockGet(...args),
  },
}));

import { getGroupDailyExpenses, getGroupExpenses } from "@/api/server/calendarApi";

describe("server/calendarApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getGroupExpenses: 월 범위를 해석해 일자별 맵으로 변환한다", async () => {
    mockResolveMonthRange.mockReturnValue({
      startDate: "2026-02-01",
      endDate: "2026-02-28",
    });
    mockGetAnalysisGroupExpenses.mockResolvedValue([
      { spendAt: "2026-02-10", usage: "병원" },
      { spendAt: "2026-02-10", usage: "사료" },
      { spendAt: undefined, usage: "invalid" },
    ]);

    const result = await getGroupExpenses("2026-02");

    expect(mockResolveMonthRange).toHaveBeenCalledWith("2026-02");
    expect(mockGetAnalysisGroupExpenses).toHaveBeenCalledWith("2026-02-01", "2026-02-28");
    expect(Object.keys(result)).toEqual(["2026-02-10"]);
    expect(result["2026-02-10"]).toHaveLength(2);
  });

  it("getGroupDailyExpenses: 정상 응답이면 expenses를 반환한다", async () => {
    const expenses = [{ usage: "병원비" }];
    mockGet.mockResolvedValue({ data: { expenses } });

    await expect(getGroupDailyExpenses("2026-02-10")).resolves.toEqual(expenses);
    expect(mockGet).toHaveBeenCalledWith("/api/expenses/group/date", {
      params: {
        query: {
          spentAt: "2026-02-10",
        },
      },
    });
  });

  it("getGroupDailyExpenses: 데이터가 없으면 빈 배열을 반환한다", async () => {
    mockGet.mockResolvedValue({ data: undefined });

    await expect(getGroupDailyExpenses("2026-02-10")).resolves.toEqual([]);
  });
});
