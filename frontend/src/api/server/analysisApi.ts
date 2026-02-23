import { client } from "@/lib/api";
import type {
  GetCategoryAnalysisResponse,
  GetAnalysisGroupExpensesItem,
  GetMedicalAnalysisResponse,
} from "@/api/types/analysisApi.type";
/**
 * 그룹 소비내역 조회
 * @param startDate : 조회할 시작 날짜
 * @param endDate : 조회할 종료 날짜
 * @returns : 조회된 그룹 소비내역 목록
 */
export async function getGroupExpenses(
  startDate: string,
  endDate: string,
): Promise<GetAnalysisGroupExpensesItem[]> {
  const { data } = await client.GET("/api/expenses/group", {
    params: { query: { startDate, endDate } },
  });

  return data?.expenses ?? [];
}

/**
 * 그룹 소비내역 카테고리 분석 조회
 * @param startDate : 조회할 시작 날짜
 * @param endDate : 조회할 종료 날짜
 * @returns : 조회된 그룹 소비내역 카테고리 분석 목록
 */
export async function getCategoryAnalysis(
  startDate: string,
  endDate: string,
): Promise<GetCategoryAnalysisResponse> {
  const { data } = await client.GET("/api/expenses/group/analysis/category", {
    params: { query: { startDate, endDate } },
  });

  return { total: data?.total ?? 0, items: data?.categoryAnalysis ?? [] };
}

/**
 * 그룹 소비내역 의료비 분석 조회
 * @param startDate : 조회할 시작 날짜
 * @param endDate : 조회할 종료 날짜
 * @returns : 조회된 그룹 소비내역 의료비 분석 목록
 */

export async function getMedicalAnalysis(
  startDate: string,
  endDate: string,
): Promise<GetMedicalAnalysisResponse> {
  const { data } = await client.GET("/api/expenses/group/analysis/medical", {
    params: { query: { startDate, endDate } },
  });

  return { total: data?.totalMedical ?? 0, items: data?.medicalAnalysis ?? [] };
}
