import type { components } from "@schema";

/**
 * 총지출, 의료비 지출 데이터 타입
 */
export type ProgressData = {
  totalRatio?: number | null;
  medicalRatio?: number | null;
  petName?: string;
};

/**
 * SummaryCard 컴포넌트 타입
 */
export type SummaryCardProps = {
  variant: "totalExpense" | "medicalExpense";
  data: number | null;
  petName?: string;
  className?: string;
};

/**
 * Summary 섹션용 통합 데이터 (API 응답을 ProgressData + ImageData 형태로 변환한 값)
 */
export type SummaryData = {
  progressData: ProgressData;
  petImageUrl: string;
};

/**
 * PetProfileImage 컴포넌트 타입
 */
export type PetProfileImageProps = {
  petImageUrl: string;
};

/**
 * 지난달 대비 비교 API 응답 타입 (스키마 기반)
 * GET /api/expenses/compare/last-month
 */
export type LastMonthComparisonResponse = components["schemas"]["LastMonthComparisonResponse"];
