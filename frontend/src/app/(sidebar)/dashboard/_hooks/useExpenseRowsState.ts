import { useCallback, useEffect, useMemo, useState } from "react";
import { ExpenseData, EditableExpenseRow } from "@/app/(sidebar)/dashboard/_types";
import { createEmptyRow } from "@/app/(sidebar)/dashboard/_utils";
import { SYNC_FIELDS } from "@/app/(sidebar)/dashboard/_constants";
import {
  serverToEditableRow,
  mergeRows,
  buildPatchPayload,
  mergeSelectedRowsLogic,
  calculateTotalExpense,
  getExpenseRowKey,
} from "@/app/(sidebar)/dashboard/_lib";

export const useExpenseRowsState = (initialData: ExpenseData[]) => {
  const [rows, setRows] = useState<EditableExpenseRow[]>(() =>
    initialData.map(serverToEditableRow),
  );

  useEffect(() => {
    setRows(initialData.map(serverToEditableRow));
  }, [initialData]);

  const visibleRows = useMemo(() => rows.filter((row) => !row.isDeleted), [rows]);
  const displayInitialRows = useMemo(() => [...visibleRows, createEmptyRow(0)], [visibleRows]);

  /** 셀 업데이트 핸들러 (localId로 행 식별, 없으면 빈 행 편집으로 간주하고 새 행 추가) */
  const updateCellByLocalId = useCallback(
    (
      localId: string,
      accessor: keyof EditableExpenseRow,
      value: string | boolean,
      subAccessor?: keyof EditableExpenseRow,
      subValue?: string,
    ) => {
      setRows((prev) => {
        const idx = prev.findIndex((row) => row.localId === localId);
        const extraFields = subAccessor !== undefined ? { [subAccessor]: subValue ?? "" } : {};

        if (idx !== -1) {
          const row = prev[idx];
          if (!row) return prev;

          const isSyncField =
            SYNC_FIELDS.includes(accessor as (typeof SYNC_FIELDS)[number]) ||
            (subAccessor !== undefined &&
              SYNC_FIELDS.includes(subAccessor as (typeof SYNC_FIELDS)[number]));

          const next = [...prev];
          next[idx] = {
            ...row,
            ...extraFields,
            [accessor]: value,
            isDirty: row.isDirty || (isSyncField && row.expenseId != null && row.expenseId > 0),
          };
          return next;
        }

        // displayInitialRows 맨 아래 빈 행(아직 state에 없음) 편집 시 → 새 행 추가
        return [
          ...prev,
          {
            ...createEmptyRow(0),
            localId,
            ...extraFields,
            [accessor]: value,
          },
        ];
      });
    },
    [],
  );

  /** 모든 셀 업데이트 핸들러 */
  const updateAllCells = useCallback(
    (accessor: keyof EditableExpenseRow, value: string | boolean) => {
      setRows((prev) => prev.map((row) => ({ ...row, [accessor]: value })));
    },
    [],
  );

  /** 서버 데이터와 병합 핸들러 */
  const mergeRowsFromServer = useCallback((newRows: ExpenseData[]) => {
    setRows((prev) => mergeRows(prev, newRows));
  }, []);

  /** 선택된 셀 삭제 핸들러 */
  const deleteSelectedRows = useCallback(() => {
    setRows((prev) => prev.map((row) => (row.selected ? { ...row, isDeleted: true } : row)));
  }, []);

  /** 선택된 셀 병합 핸들러 */
  const mergeSelectedRows = useCallback(() => {
    setRows((prev) => {
      const result = mergeSelectedRowsLogic(prev);
      return result ?? prev;
    });
  }, []);

  /** 패치 페이로드 생성 핸들러 */
  const getPatchPayload = useCallback(() => buildPatchPayload(rows), [rows]);

  /** 변경 사항 존재 여부 체크 핸들러 */
  const hasUnsavedChanges = useMemo(
    () => rows.some((row) => row.isNew || row.isDirty || row.isDeleted),
    [rows],
  );

  /** 선택된 셀 개수 체크 핸들러 */
  const selectedCount = useMemo(
    () => rows.filter((row) => row.selected && !row.isDeleted).length,
    [rows],
  );

  /** 총 소비 금액 계산 */
  const totalExpense = useMemo(() => calculateTotalExpense(visibleRows), [visibleRows]);

  /** 행 식별 키 (DataTable rowKey prop) */
  const rowKey = getExpenseRowKey;

  return {
    displayInitialRows,
    rowKey,
    updateCellByLocalId,
    updateAllCells,
    deleteSelectedRows,
    mergeSelectedRows,
    getPatchPayload,
    mergeRowsFromServer,
    hasUnsavedChanges,
    selectedCount,
    totalExpense,
  };
};
