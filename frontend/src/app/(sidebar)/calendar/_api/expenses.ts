import client from "@/lib/api";
import type { GroupExpenseMap } from "@/app/(sidebar)/calendar/_types";
import { resolveMonthRange } from "@/utils/date";

/**
 * 개인 소비내역 조회
 * @param monthParam : 조회할 월 파라미터
 * @returns : 조회된 소비내역 맵
 */
export async function getGroupExpenses(monthParam?: string) {
  const { startDate, endDate } = resolveMonthRange(monthParam);
  const { data, error } = await client.GET("/api/expenses/group", {
    params: {
      query: {
        startDate,
        endDate,
      },
    },
  });

  if (error || !data) {
    console.error(error?.code, error?.message, error?.status);
    return {};
  }

  const expenses = data.expenses ?? [];
  return expenses.reduce<GroupExpenseMap>((acc, expense) => {
    const dateKey = expense.spendAt;
    if (!dateKey) {
      return acc;
    }
    acc[dateKey] = acc[dateKey] ? [...acc[dateKey], expense] : [expense];
    return acc;
  }, {});
}

/**
 * 그룹 소비내역 조회
 * @param spentAt : 조회할 날짜 파라미터
 * @returns : 조회된 소비내역 목록
 */

export async function getGroupDailyExpenses(spentAt: string) {
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

  return data.expenses ?? [];
}
