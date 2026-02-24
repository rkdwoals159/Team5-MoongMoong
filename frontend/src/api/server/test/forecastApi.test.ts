import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGet = vi.fn();

vi.mock("@/api/lib/client", () => ({
  client: {
    GET: (...args: unknown[]) => mockGet(...args),
  },
}));

import {
  getAIRecommendation,
  getDiseaseCost,
  getDiseaseRanking,
  getDiseaseStatistics,
} from "@/api/server/forecastApi";

describe("server/forecastApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAIRecommendation: 응답 데이터를 그대로 반환한다", async () => {
    const recommendation = { recommendedDiseases: ["OCU"] };
    mockGet.mockResolvedValue({ data: recommendation });

    await expect(getAIRecommendation()).resolves.toEqual(recommendation);
  });

  it("getDiseaseRanking: 응답의 diseases 목록을 반환한다", async () => {
    const diseases = [{ disease: "OCU", risk: 0.8 }];
    mockGet.mockResolvedValue({ data: { diseases } });

    await expect(getDiseaseRanking()).resolves.toEqual(diseases);
  });

  it("getDiseaseRanking: 데이터가 없으면 빈 배열을 반환한다", async () => {
    mockGet.mockResolvedValue({ data: undefined });

    await expect(getDiseaseRanking()).resolves.toEqual([]);
  });

  it("getDiseaseStatistics: 응답 데이터를 그대로 반환한다", async () => {
    const statistics = { annualRisks: [{ year: 2026, risk: 0.3 }] };
    mockGet.mockResolvedValue({ data: statistics });

    await expect(getDiseaseStatistics()).resolves.toEqual(statistics);
  });

  it("getDiseaseCost: 질병 파라미터로 조회하고 treatments를 반환한다", async () => {
    const treatments = [{ hospital: "동물병원", totalCost: 50000 }];
    mockGet.mockResolvedValue({ data: { treatments } });

    await expect(getDiseaseCost("OCU" as never)).resolves.toEqual(treatments);
    expect(mockGet).toHaveBeenCalledWith("/api/group/medical/disease/cost", {
      params: {
        query: { disease: "OCU" },
      },
    });
  });

  it("getDiseaseCost: 데이터가 없으면 빈 배열을 반환한다", async () => {
    mockGet.mockResolvedValue({ data: undefined });

    await expect(getDiseaseCost("OCU" as never)).resolves.toEqual([]);
  });
});
