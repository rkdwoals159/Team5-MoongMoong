import { client } from "@/lib/api";
import type {
  GetCalendarGroupExpensesMap,
  GetCalendarGroupDailyExpensesResponse,
} from "@/api/types/calendarApi.type";
import { resolveMonthRange } from "@/utils/date";

/**
 * 개인 소비내역 조회
 * @param monthParam : 조회할 월 파라미터
 * @returns : 조회된 소비내역 맵
 */
export async function getGroupExpenses(monthParam?: string): Promise<GetCalendarGroupExpensesMap> {
  const { startDate, endDate } = resolveMonthRange(monthParam);
  const { data } = await client.GET("/api/expenses/group", {
    params: {
      query: {
        startDate,
        endDate,
      },
    },
  });

  const expenses = data?.expenses ?? [];
  return expenses.reduce<GetCalendarGroupExpensesMap>((acc, expense) => {
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

export async function getGroupDailyExpenses(
  spentAt: string,
): Promise<GetCalendarGroupDailyExpensesResponse["expenses"]> {
  const { data } = await client.GET("/api/expenses/group/date", {
    params: {
      query: {
        spentAt,
      },
    },
  });

  return data?.expenses ?? [];
}
