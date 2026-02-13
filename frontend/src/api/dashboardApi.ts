"use server";

import { client } from "@/lib/api";
import type {
  ExpenseData,
  ExpensesByPeriodResponse,
  MemberExpensesUpsertRequest,
  SummaryData,
} from "@/api/types/dashboardApi.type";
import { EXPENSES_ERROR_MESSAGE } from "@/api/constants";

/**
 * 소비내역 일괄 생성/수정/삭제 (Server Action)
 * PATCH /api/expenses
 *
 * 성공 시 생성/수정된 내역 반환, 실패 시 throw.
 */
export const patchExpenses = async (body: MemberExpensesUpsertRequest) => {
  const { error, response } = await client.PATCH("/api/expenses", {
    body,
  });

  if (!response.ok) {
    console.error("patchExpenses error:", error?.message ?? "no data");
    throw new Error(EXPENSES_ERROR_MESSAGE);
  }

  return;
};

/**
 * 기간별 개인 소비내역 조회 (Server Action)
 * GET /api/expenses?startDate=&endDate=
 *
 * 성공 시 데이터 반환, 실패 시 throw. 호출부에서는 try/catch로 처리한다.
 */
export const getExpensesByPeriod = async (
  startDate: string,
  endDate: string,
): Promise<ExpensesByPeriodResponse> => {
  const { data, error, response } = await client.GET("/api/expenses", {
    params: {
      query: {
        startDate,
        endDate,
      },
    },
  });

  if (!response.ok) {
    console.error("getExpensesByPeriod error:", error?.message ?? "no data");
    throw new Error(EXPENSES_ERROR_MESSAGE);
  }

  const total = data!.total ?? 0;
  const expenses = (data!.expenses ?? []).map(mapExpenseResponse);
  return { total, expenses };
};

/**
 * 지난달 대비 비교 데이터 조회 (Server Action)
 * GET /api/expenses/compare/last-month
 */
export const getCompareLastMonth = async (): Promise<SummaryData> => {
  const { data, error } = await client.GET("/api/expenses/compare/last-month");

  if (error || !data) {
    console.error("getCompareLastMonth error:", error ?? "no data");
    // dashboard/error.tsx 페이지 띄우기
    throw new Error("지난달 비교 데이터를 불러오지 못했어요.");
  }

  return {
    progressData: {
      totalRatio: data.totalRatio ?? 0,
      medicalRatio: data.medicalRatio ?? 0,
      petName: data.petName ?? "",
    },
    // TODO: 백엔드 S3 작업 이후, 변경 필요
    // petImageUrl: data.petImageUrl ?? "/images/img_dog_default.svg",
    petImageUrl: "/images/img_dog_default.svg",
  };
};

/**
 * 소비내역 데이터 매핑
 */
const mapExpenseResponse = (
  item: {
    expenseId?: number;
    spentAt?: string;
    usage?: string;
    cost?: number;
    mainCategory?: string;
    subCategory?: string;
    memo?: string;
    modifiedAt?: string;
  },
  index: number,
): ExpenseData => {
  return {
    expenseId: item.expenseId ?? index,
    spentAt: item.spentAt ?? "",
    usage: item.usage ?? "",
    cost: item.cost ?? null,
    mainCategory: item.mainCategory ?? null,
    subCategory: item.subCategory,
    memo: item.memo ?? "",
    modifiedAt: item.modifiedAt,
  };
};
