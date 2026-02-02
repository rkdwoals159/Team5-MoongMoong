import { ExpenseData } from "../_types";

/** 빈 행용 placeholder (expenseId < 0 으로 구분) */
export function createEmptyRow(placeholderId: number): ExpenseData {
  return {
    expenseId: placeholderId,
    spentAt: "",
    usage: "",
    cost: 0,
    mainCategory: "",
    memo: "",
  };
}
