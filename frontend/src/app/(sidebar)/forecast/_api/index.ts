import client from "@/lib/api";
import type { DiseaseCode, AnnualDiseases } from "@/app/(sidebar)/forecast/_types";
import { ONE_HOUR } from "../_constants";

/**
 * 올해 기준 발병확률 순 질병 목록 조회
 * GET /api/group/medical/disease
 */
export async function getDiseaseRanking(): Promise<DiseaseCode[]> {
  const { data, error } = await client.GET("/api/group/medical/disease", {
    next: { revalidate: ONE_HOUR },
  });

  if (error || !data) {
    console.error("getDiseaseRanking error:", error?.message);
    return [];
  }

  return (data.diseases ?? []) as DiseaseCode[];
}

/**
 * 그룹 질병 통계 조회 (7년간 위험도)
 * GET /api/group/medical/statistics
 */
export async function getDiseaseStatistics(): Promise<AnnualDiseases | null> {
  const { data } = await client.GET("/api/group/medical/statistics");

  if (!data) {
    console.error("getDiseaseStatistics error: no data returned");
    return null;
  }

  return {
    startYear: data.startYear ?? new Date().getFullYear(),
    statistics: (data.statistics ?? []).map((stat) => ({
      disease: (stat.disease ?? "DER") as DiseaseCode,
      ratios: stat.ratios ?? [],
    })),
  };
}

/**
 * 특정 질병의 의료비 데이터 조회
 * GET /api/group/medical/disease/cost?disease={disease}
 */
export async function getDiseaseCost(disease: DiseaseCode) {
  const { data, error } = await client.GET("/api/group/medical/disease/cost", {
    params: {
      query: { disease },
    },
    signal: AbortSignal.timeout(5000),
  });

  if (error || !data) {
    console.error("getDiseaseCost error:", error?.message);
    return { treatments: [] };
  }

  return {
    treatments: (data.treatments ?? []).map((t) => ({
      name: t.name ?? "",
      description: t.description ?? "",
      minPrice: t.minPrice ?? 0,
      maxPrice: t.maxPrice ?? 0,
      averagePrice: t.averagePrice ?? 0,
    })),
  };
}
