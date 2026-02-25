import type {
  BuildPatchPayloadResult,
  EditableExpenseRow,
  ExpenseData,
  MemberExpenseUpsertRequest,
  MemberExpensesUpsertRequest,
} from "@/app/(sidebar)/dashboard/_types";
import { SYNC_FIELDS } from "@/app/(sidebar)/dashboard/_constants";
import { createEmptyRow } from "@/app/(sidebar)/dashboard/_lib/createEmptyRow";
import { joinNonEmpty } from "@/utils/string";

/** ExpenseData → EditableExpenseRow 변환 */
export const serverToEditableRow = (serverRow: ExpenseData): EditableExpenseRow => {
  return {
    ...serverRow,
    localId: `exp-${serverRow.expenseId}`,
    isNew: false,
    isDirty: false,
    isDeleted: false,
    isSelected: false,
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

/**
 * API 전송 가능 여부: subCategory, memo만 null 허용. 새 행이면 expenseId도 null 허용.
 * 그 외 spentAt, usage, cost, mainCategory는 필수.
 */
function isRowValidForPatch(row: EditableExpenseRow): boolean {
  const spentAt = row.spentAt;
  if (spentAt == null || String(spentAt).trim() === "") return false;

  const usage = row.usage;
  if (usage == null || String(usage).trim() === "") return false;

  const cost =
    typeof row.cost === "number"
      ? row.cost
      : row.cost != null && row.cost !== ""
        ? Number(row.cost)
        : null;
  if (cost == null || Number.isNaN(cost)) return false;

  const mainCategory = row.mainCategory;
  if (mainCategory == null || String(mainCategory).trim() === "") return false;

  if (!row.isNew) {
    if (row.expenseId == null || row.expenseId <= 0) return false;
  }

  return true;
}

/** rows에서 isDirty/isNew 기준으로 PATCH 페이로드 생성. 필수 필드가 비어 있는 행은 제외하고 invalidCount에 반영. */
export const buildPatchPayload = (rows: EditableExpenseRow[]): BuildPatchPayloadResult => {
  const expenses: MemberExpensesUpsertRequest["expenses"] = [];
  const deletedIds: number[] = [];
  let invalidCount = 0;

  rows.forEach((row) => {
    if (row.isDeleted) {
      if (row.expenseId > 0) {
        deletedIds.push(row.expenseId);
      }
      return;
    }

    if (row.isNew || row.isDirty) {
      if (!isRowValidForPatch(row)) {
        invalidCount += 1;
        return;
      }

      const cost =
        typeof row.cost === "number"
          ? row.cost
          : row.cost != null && row.cost !== ""
            ? Number(row.cost)
            : null;
      const spentAt = String(row.spentAt ?? "").trim();
      const usage = String(row.usage ?? "").trim();
      const mainCategory = String(row.mainCategory ?? "").trim();
      const subCategory =
        row.subCategory != null && row.subCategory !== "" ? row.subCategory : null;
      const memo = row.memo != null && row.memo !== "" ? row.memo : null;

      expenses.push({
        isNew: row.isNew,
        expenseId: row.isNew ? null : row.expenseId,
        spentAt,
        usage,
        cost: cost as number,
        mainCategory,
        subCategory,
        memo,
      } as MemberExpenseUpsertRequest);
    }
  });

  return { payload: { expenses, deletedIds }, invalidCount };
};

/** 선택된 행들을 하나의 merged row로 생성 */
export const buildMergedRowFromSelected = (
  selected: EditableExpenseRow[],
): EditableExpenseRow | null => {
  if (selected.length < 2) return null;

  const first = selected[0];
  if (!first) return null;

  const costs = selected.map((row) => Number(row.cost)).reduce((a, b) => a + b, 0);
  const dates = selected.map((row) => row.spentAt).filter(Boolean) as string[];
  const merged: EditableExpenseRow = {
    ...createEmptyRow(0),
    expenseId: 0,
    spentAt: dates.length ? dates.sort()[0]! : "",
    cost: costs,
    usage: joinNonEmpty(selected.map((row) => row.usage)),
    mainCategory: first.mainCategory,
    subCategory: first.subCategory,
    memo: first.memo,
    isNew: true,
    isDirty: true,
  };

  return merged;
};

/** 선택된 행 병합 후 전체 rows 배열 반환 (병합 불가 시 null) */
export const mergeSelectedRowsLogic = (rows: EditableExpenseRow[]): EditableExpenseRow[] | null => {
  const selected = rows.filter((row) => row.isSelected && !row.isDeleted);
  const merged = buildMergedRowFromSelected(selected);
  if (!merged) return null;

  const selectedSet = new Set(selected.map((row) => row.localId));
  const next = rows.map((row) =>
    selectedSet.has(row.localId) ? { ...row, isDeleted: true } : row,
  );

  return [...next, merged];
};

/** 표시 중인 행 기준 총 소비 금액 계산 */
export const calculateTotalExpense = (visibleRows: EditableExpenseRow[]): number => {
  return visibleRows.reduce((sum, row) => {
    const c = row.cost;
    const v = typeof c === "number" ? c : c != null && c !== "" ? Number(c) : 0;
    return sum + (Number.isNaN(v) ? 0 : v);
  }, 0);
};

/** DataTable rowKey용 키 계산 */
export const getExpenseRowKey = (
  row: ExpenseData | EditableExpenseRow,
  rowIndex: number,
): string | number => {
  const rowData = row as EditableExpenseRow;
  if (rowData.localId) return rowData.localId;
  if (row.expenseId > 0) return row.expenseId;
  return `empty-${rowIndex}`;
};
