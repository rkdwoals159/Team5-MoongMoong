import client from "@/lib/api";
import { components } from "@/types/schema";

/**
 * 그룹 소비내역 조회
 * @param startDate : 조회할 시작 날짜
 * @param endDate : 조회할 종료 날짜
 * @returns : 조회된 그룹 소비내역 목록
 */
export async function getGroupExpenses(
  startDate: string,
  endDate: string,
): Promise<components["schemas"]["GroupExpenseResponse"][]> {
  const { data, error } = await client.GET("/api/expenses/group", {
    params: { query: { startDate, endDate } },
  });
  if (error || !data) {
    console.error(error?.code, error?.message, error?.status);
    return [];
  }

  return data.expenses ?? [];
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
): Promise<{ total: number; items: components["schemas"]["CategoryCostResponse"][] }> {
  const { data, error } = await client.GET("/api/expenses/group/analysis/category", {
    params: { query: { startDate, endDate } },
  });

  if (error || !data) {
    console.error(error?.code, error?.message, error?.status);
    return { total: 0, items: [] };
  }

  return { total: data.total ?? 0, items: data.categoryAnalysis ?? [] };
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
): Promise<{ total: number; items: components["schemas"]["MedicalAnalysisResponse"][] }> {
  const { data, error } = await client.GET("/api/expenses/group/analysis/medical", {
    params: { query: { startDate, endDate } },
  });
  if (error || !data) {
    console.error(error?.code, error?.message, error?.status);
    return { total: 0, items: [] };
  }

  return { total: data.totalMedical ?? 0, items: data.medicalAnalysis ?? [] };
}

/**
 * 반려동물 정보 조회
 * @returns : 반려동물 정보
 */
export async function getPetInfo(): Promise<components["schemas"]["PetReadResponse"] | null> {
  const { data, error } = await client.GET("/api/pet");

  if (error || !data) {
    console.error(error?.code, error?.message, error?.status);
    return null;
  }

  return data;
}
