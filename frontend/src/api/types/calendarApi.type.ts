import type { components } from "@schema";

export type GroupExpenseItem = components["schemas"]["GroupExpenseResponse"];
export type GroupExpenseMap = Record<string, GroupExpenseItem[]>;
export type GroupDailyExpenseItem = components["schemas"]["GroupExpensesDailyResponse"];
