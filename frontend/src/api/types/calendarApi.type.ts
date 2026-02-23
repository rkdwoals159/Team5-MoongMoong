import type { components } from "@schema";

export type GetCalendarGroupExpenseItem = components["schemas"]["GroupExpenseResponse"];
export type GetCalendarGroupExpensesMap = Record<string, GetCalendarGroupExpenseItem[]>;
export type GetCalendarGroupDailyExpensesResponse =
  components["schemas"]["GroupExpensesDailyResponse"];
