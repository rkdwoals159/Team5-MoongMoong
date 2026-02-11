import type { components } from "@schema";

export type MemberExpensesUpsertRequest = components["schemas"]["MemberExpensesUpsertRequest"];
export type MemberExpensesUpsertResponse = components["schemas"]["MemberExpensesUpsertResponse"];
export type LastMonthComparisonResponse = components["schemas"]["LastMonthComparisonResponse"];

export type ExpenseData = {
  selected?: boolean | null;
  expenseId: number;
  spentAt: string;
  usage: string;
  cost?: number | null;
  mainCategory?: string | null;
  subCategory?: string;
  memo: string;
  modifiedAt?: string;
};

export type ExpensesByPeriodResponse = {
  total: number;
  expenses: ExpenseData[];
};

export type SummaryData = {
  progressData: {
    totalRatio?: number | null;
    medicalRatio?: number | null;
    petName?: string;
  };
  petImageUrl: string;
};
