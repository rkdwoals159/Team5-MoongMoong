import type { EditableExpenseRow } from "@/app/(sidebar)/dashboard/_types";
import { generateUniqueId } from "@/utils/generateUniqueId";

/** 빈 행용 placeholder (expenseId < 0 으로 구분) */
export function createEmptyRow(placeholderId: number): EditableExpenseRow {
  return {
    expenseId: placeholderId,
    spentAt: "",
    usage: "",
    memo: "",
    localId: `empty-${placeholderId}-${generateUniqueId()}`,
    isNew: true,
    isDirty: false,
    isDeleted: false,
  };
}
