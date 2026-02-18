import type { ExpenseData } from "@/app/(sidebar)/dashboard/_types";

/**
 * isNew 행 여부 (EditableExpenseRow)
 */
export function isNewRow(row: ExpenseData): boolean {
  return "isNew" in row && row.isNew === true;
}
