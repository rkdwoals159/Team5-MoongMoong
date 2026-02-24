import { client } from "@/api/lib/client";
import type {
  DiseaseCode,
  GetDiseaseStatisticsResponse,
  GetDiseaseRankingResponse,
  GetDiseaseCostResponse,
  GetAIRecommendationResponse,
} from "@/api/types/forecastApi.type";
import { isApiHttpError } from "@/api/utils/isApiHttpError";

export async function getAIRecommendation(): Promise<GetAIRecommendationResponse | null> {
  try {
    const { data } = await client.GET("/api/group/medical/info");
    return data as GetAIRecommendationResponse;
  } catch (error) {
    if (isApiHttpError(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * 올해 기준 발병확률 순 질병 목록 조회
 * GET /api/group/medical/disease
 */
export async function getDiseaseRanking(): Promise<GetDiseaseRankingResponse> {
  const { data } = await client.GET("/api/group/medical/disease");
  return data?.diseases ?? [];
}

/**
 * 그룹 질병 통계 조회 (7년간 위험도)
 * GET /api/group/medical/statistics
 */
export async function getDiseaseStatistics(): Promise<GetDiseaseStatisticsResponse> {
  const { data } = await client.GET("/api/group/medical/statistics");
  return data as GetDiseaseStatisticsResponse;
}

/**
 * 특정 질병의 의료비 데이터 조회
 * GET /api/group/medical/disease/cost?disease={disease}
 */
export async function getDiseaseCost(disease: DiseaseCode): Promise<GetDiseaseCostResponse> {
  const { data } = await client.GET("/api/group/medical/disease/cost", {
    params: {
      query: { disease },
    },
  });

  return data?.treatments ?? [];
}
