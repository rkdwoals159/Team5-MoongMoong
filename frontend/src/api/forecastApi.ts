import { client } from "@/lib/api";
import type {
  DiseaseCode,
  AnnualDiseases,
  DiseaseCodeResponse,
  TreatmentsResponse,
  AIRecommendationResponse,
} from "@/api/types/forecastApi.type";
export async function getAIRecommendation(): Promise<AIRecommendationResponse> {
  const { data, error } = await client.GET("/api/group/medical/info");

  if (error || !data) {
    throw new Error("AI 의사 권장사항을 불러오는데 실패했습니다.");
  }

  return data;
}

/**
 * 올해 기준 발병확률 순 질병 목록 조회
 * GET /api/group/medical/disease
 */
export async function getDiseaseRanking(): Promise<DiseaseCodeResponse> {
  const { data, error } = await client.GET("/api/group/medical/disease");
  if (error || !data) {
    throw new Error("질병 목록을 불러오는데 실패했습니다.");
  }

  return data.diseases ?? [];
}

/**
 * 그룹 질병 통계 조회 (7년간 위험도)
 * GET /api/group/medical/statistics
 */
export async function getDiseaseStatistics(): Promise<AnnualDiseases> {
  const { data, error } = await client.GET("/api/group/medical/statistics");

  if (error || !data) {
    throw new Error("질병 통계를 불러오는데 실패했습니다.");
  }

  return data;
}

/**
 * 특정 질병의 의료비 데이터 조회
 * GET /api/group/medical/disease/cost?disease={disease}
 */
export async function getDiseaseCost(disease: DiseaseCode): Promise<TreatmentsResponse> {
  const { data, error } = await client.GET("/api/group/medical/disease/cost", {
    params: {
      query: { disease },
    },
  });

  if (error || !data) {
    throw new Error("의료비 데이터를 불러오는데 실패했습니다.");
  }

  return data.treatments ?? [];
}
