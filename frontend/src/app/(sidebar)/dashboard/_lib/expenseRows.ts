import { ExpenseData, EditableExpenseRow } from "@/app/(sidebar)/dashboard/_types";
import { SYNC_FIELDS } from "@/app/(sidebar)/dashboard/_constants";

/** ExpenseData → EditableExpenseRow 변환 */
export const serverToEditableRow = (serverRow: ExpenseData): EditableExpenseRow => {
  return {
    ...serverRow,
    localId: `exp-${serverRow.expenseId}`,
    isNew: false,
    isDirty: false,
    isDeleted: false,
  };
};

/** 서버 동기화 필드만 비교 (UI 전용 필드 제외) */
export const isRowEqual = (rowA: EditableExpenseRow | ExpenseData, rowB: ExpenseData): boolean => {
  return SYNC_FIELDS.every((field) => {
    const valueA = rowA[field];
    const valueB = rowB[field];
    return valueA === valueB || (valueA == null && valueB == null);
  });
};

/** GET 응답과 prev를 merge, 변경 없는 row는 reference 유지 */
export const mergeRows = (
  prev: EditableExpenseRow[],
  newRows: ExpenseData[],
): EditableExpenseRow[] => {
  const prevMap = new Map<string, EditableExpenseRow>();
  for (const row of prev) {
    const key = row.expenseId != null && row.expenseId > 0 ? String(row.expenseId) : row.localId;
    prevMap.set(key, row);
  }

  return newRows.map((row: ExpenseData) => {
    const key = String(row.expenseId);
    const oldRow = prevMap.get(key);

    // 1. 이전 데이터에 없는 새로운 데이터인 경우
    if (!oldRow) {
      return serverToEditableRow(row);
    }
    // 2. 이전 데이터와 변경이 없는 경우
    if (isRowEqual(oldRow, row)) {
      return { ...oldRow, isNew: false, isDirty: false, isDeleted: false };
    }
    // 3. 이전 데이터와 변경이 있는 경우
    return serverToEditableRow(row);
  });
};
