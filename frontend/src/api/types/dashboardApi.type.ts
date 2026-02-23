import type { components } from "@schema";
import type { MAIN_CATEGORIES } from "@/app/(sidebar)/dashboard/_constants";
import type { ExpenseData } from "@/app/(sidebar)/dashboard/_types";

export type MemberExpensesUpsertRequest = components["schemas"]["MemberExpensesUpsertRequest"];
export type LastMonthComparisonResponse = components["schemas"]["LastMonthComparisonResponse"];

export type SummaryData = {
  progressData: {
    totalRatio?: number | null;
    medicalRatio?: number | null;
    petName?: string;
  };
  petImageUrl: string;
};

export type CategorizeExpenseResponse = {
  requestId: string;
  mainCategory?: string;
  subCategory?: string;
};

export type MemberExpenseResponse = components["schemas"]["MemberExpenseResponse"];
export type ExpensesByPeriodResponseV2 = components["schemas"]["MemberExpensesPeriodResponseV2"];

// 정렬 가능한 필드
export type ServerSortField = "spentAt" | "usage" | "cost" | "memo";

// 하나의 정렬 조건 (필드 + 방향)
export type SortConfigItem = { field: ServerSortField; order: "asc" | "desc" };

// 다중 정렬 조건 배열
export type SortConfigV2 = SortConfigItem[];

export type MainCategoryFilter = (typeof MAIN_CATEGORIES)[number];

/**
 * 기간별 소비내역 조회 V2 API 응답 (앱에서 사용하는 형태).
 * 스키마: MemberExpensesPeriodResponseV2. expenses는 API 응답을 ExpenseData로 매핑한 값.
 */
export type GetExpensesResult = {
  total: number;
  page: number;
  size: number;
  hasNext: boolean;
  expenses: ExpenseData[];
};
