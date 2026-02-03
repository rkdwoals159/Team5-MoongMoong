"use server";

import client from "@/lib/api";
import type {
  ExpenseData,
  ExpensesByPeriodResponse,
  SummaryData,
} from "@/app/(sidebar)/dashboard/_types";

/**
 * 기간별 개인 소비내역 조회 (Server Action)
 * GET /api/expenses?startDate=&endDate=
 */
export const getExpensesByPeriod = async (
  startDate: string,
  endDate: string,
): Promise<ExpensesByPeriodResponse> => {
  const { data, error } = await client.GET("/api/expenses", {
    params: {
      query: {
        startDate,
        endDate,
      },
    },
  });

  if (error || !data) {
    console.error("getExpensesByPeriod error:", error?.message ?? "no data");
    return { total: 0, expenses: [] };
  }

  const total = data.total ?? 0;
  const expenses = (data.expenses ?? []).map(mapExpenseResponse);
  const result: ExpensesByPeriodResponse = { total, expenses };

  return result;
};

/**
 * 지난달 대비 비교 데이터 조회 (Server Action)
 * GET /api/expenses/compare/last-month
 */
export const getCompareLastMonth = async (): Promise<SummaryData> => {
  const { data, error } = await client.GET("/api/expenses/compare/last-month");

  if (error || !data) {
    console.error("getCompareLastMonth error:", error?.message ?? "no data");
    return {
      progressData: {
        totalExpense: null,
        medicalExpense: null,
        petName: "",
      },
      imageData: { src: "/images/img_dog_sample.png" },
    };
  }

  return mapCompareResponseToSummary(data);
};

/**
 * 지난달 대비 비교 데이터 매핑
 */
const mapCompareResponseToSummary = (raw: {
  totalRatio?: number;
  medicalRatio?: number;
  petName?: string;
  petImageUrl?: string;
}): SummaryData => {
  const totalRatio = raw.totalRatio ?? 0;
  const medicalRatio = raw.medicalRatio ?? 0;
  return {
    progressData: {
      totalExpense: {
        forecast: Math.abs(totalRatio),
        isMinus: totalRatio < 0,
      },
      medicalExpense: {
        forecast: Math.abs(medicalRatio),
        isMinus: medicalRatio < 0,
      },
      petName: raw.petName ?? "",
    },
    imageData: {
      // TODO: 백엔드 S3 작업 이후, 변경 필요
      src: "/images/img_dog_sample.png",
      // src: raw.petImageUrl ?? "/images/img_dog_sample.png",
    },
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
