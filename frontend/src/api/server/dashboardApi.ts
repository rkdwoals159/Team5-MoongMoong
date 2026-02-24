import type { SummaryData } from "@/api/types/dashboardApi.type";
import { client } from "@/api/lib/client";

/**
 * 지난달 대비 비교 데이터 조회 (Server Action)
 * GET /api/expenses/compare/last-month
 */
export async function getCompareLastMonth(): Promise<SummaryData> {
  const { data, error } = await client.GET("/api/expenses/compare/last-month");

  if (error || !data) {
    console.error("getCompareLastMonth error:", error ?? "no data");
    throw new Error("지난달 비교 데이터를 불러오지 못했어요.");
  }

  return {
    progressData: {
      totalRatio: data.totalRatio ?? 0,
      medicalRatio: data.medicalRatio ?? 0,
      petName: data.petName ?? "",
    },
    petImageUrl: data.petImageUrl ?? "/images/img_dog_default.svg",
  };
}
