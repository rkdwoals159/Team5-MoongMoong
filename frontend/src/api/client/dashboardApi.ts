"use server";

import { client } from "@/lib/api";
import type {
  CategorizeExpenseResponse,
  GetExpensesResult,
  MainCategoryFilter,
  MemberExpenseResponse,
  MemberExpensesUpsertRequest,
} from "@/api/types/dashboardApi.type";
import type { ExpenseData } from "@/app/(sidebar)/dashboard/_types";
import {
  EXPENSES_SAVE_ERROR_MESSAGE,
  EXPENSES_ERROR_MESSAGE,
  EXPENSES_CATEGORIZE_ERROR_MESSAGE,
} from "@/api/constants";

function mapItemToExpenseData(item: MemberExpenseResponse): ExpenseData {
  return {
    expenseId: item.expenseId ?? 0,
    spentAt: item.spentAt ?? "",
    usage: item.usage ?? "",
    cost: item.cost ?? null,
    mainCategory: item.mainCategory ?? null,
    subCategory: item.subCategory ?? null,
    memo: item.memo ?? null,
    modifiedAt: item.modifiedAt,
  };
}

/**
 * 기간별 개인 소비내역 조회 V2
 */
export async function getExpensesByPeriodV2(params: {
  startDate: string;
  endDate: string;
  mainCategory?: MainCategoryFilter | null;
  lastRowId?: number;
  page: number;
  size: number;
  sort: string[];
}): Promise<GetExpensesResult> {
  const { data, error, response } = await client.GET("/api/v2/expenses", {
    params: {
      query: {
        startDate: params.startDate,
        endDate: params.endDate,
        mainCategory: params.mainCategory ?? undefined,
        lastRowId: params.lastRowId,
        page: params.page,
        size: params.size,
        sort: params.sort,
      },
    },
  });

  if (!response.ok) {
    throw new Error(error?.message ?? EXPENSES_ERROR_MESSAGE);
  }

  return {
    total: data?.total ?? 0,
    page: data?.page ?? params.page,
    size: data?.size ?? params.size,
    hasNext: data?.hasNext ?? false,
    expenses: (data?.expenses ?? []).map(mapItemToExpenseData),
  };
}

/**
 * 소비내역 일괄 생성/수정/삭제
 */
export async function patchExpenses(body: MemberExpensesUpsertRequest): Promise<void> {
  const { error, response } = await client.PATCH("/api/expenses", { body });

  if (!response.ok) {
    throw new Error(error?.message ?? EXPENSES_SAVE_ERROR_MESSAGE);
  }
}

/**
 * 자동 카테고리 분류
 */
export async function postCategorizeExpense(
  usage: string,
  requestId: string,
): Promise<CategorizeExpenseResponse> {
  const { data, error, response } = await client.POST("/api/expenses", {
    body: { usage, requestId },
  });

  if (!response.ok) {
    throw new Error(error?.message ?? EXPENSES_CATEGORIZE_ERROR_MESSAGE);
  }

  return data as CategorizeExpenseResponse;
}
