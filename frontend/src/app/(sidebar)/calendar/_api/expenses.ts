import client from "@/lib/api";
import type { ExpenseCategory, ExpenseItem, ExpenseMap } from "@/app/(sidebar)/calendar/_types";
import { MEMBER_ID } from "../_constants";
import { resolveMonthRange } from "@/utils/date";

/**
 * 개인 소비내역 조회
 * @param monthParam : 조회할 월 파라미터
 * @returns : 조회된 소비내역 맵
 */
export async function getCalendarExpenses(monthParam?: string): Promise<ExpenseMap> {
  const { startDate, endDate } = resolveMonthRange(monthParam);
  const { data, error } = await client.GET("/api/expenses", {
    params: {
      query: {
        memberId: MEMBER_ID,
        startDate,
        endDate,
        // member: MEMBER_PROFILE,
      },
    },
  });

  if (error || !data) {
    console.error(error?.code, error?.message, error?.status);
    return {};
  }

  const expenses = data.expenses ?? [];
  return expenses.reduce<ExpenseMap>((acc, expense, index) => {
    const dateKey = expense.spentAt;
    if (!dateKey) {
      return acc;
    }
    const item = mapMemberExpense(expense, index);
    acc[dateKey] = acc[dateKey] ? [...acc[dateKey], item] : [item];
    return acc;
  }, {});
}

/**
 * 그룹 소비내역 조회
 * @param spentAt : 조회할 날짜 파라미터
 * @returns : 조회된 소비내역 목록
 */

export async function getGroupDailyExpenses(spentAt: string): Promise<ExpenseItem[]> {
  const { data, error } = await client.GET("/api/expenses/group/date", {
    params: {
      query: {
        spentAt,
      },
    },
  });

  if (error || !data) {
    console.error(error?.code, error?.message, error?.status);
    return [];
  }

  const expenses = data.expenses ?? [];
  return expenses.map((expense, index) => mapGroupDailyExpense(expense, index));
}

// ------------- 내부 구성함수 -------------------
const mapMemberExpense = (
  expense: {
    expenseId?: number;
    spentAt?: string;
    usage?: string;
    cost?: number;
    mainCategory?: string;
    memo?: string;
  },
  index: number,
): ExpenseItem => ({
  // todo : 닉네임 처리로직
  id: String(expense.expenseId ?? `member-${index}`),
  nickname: "나",
  description: expense.usage ?? expense.memo ?? "",
  cost: expense.cost ?? 0,
  category: expense.mainCategory as ExpenseCategory,
});

const mapGroupDailyExpense = (
  expense: {
    nickname?: string;
    usage?: string;
    cost?: number;
    mainCategory?: string;
  },
  index: number,
): ExpenseItem => ({
  id: `group-${index}`,
  nickname: expense.nickname ?? "",
  description: expense.usage ?? "",
  cost: expense.cost ?? 0,
  category: expense.mainCategory as ExpenseCategory,
});
