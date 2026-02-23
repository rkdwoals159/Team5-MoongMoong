import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import type { ExpenseData, EditableExpenseRow } from "@/app/(sidebar)/dashboard/_types";
import { SYNC_FIELDS } from "@/app/(sidebar)/dashboard/_constants";
import {
  createEmptyRow,
  serverToEditableRow,
  buildPatchPayload,
  mergeSelectedRowsLogic,
  calculateTotalExpense,
  getExpenseRowKey,
} from "@/app/(sidebar)/dashboard/_lib";

export function useExpenseRowsState(initialData: ExpenseData[], resetKey: number) {
  const [rows, setRows] = useState<EditableExpenseRow[]>(() =>
    initialData.map(serverToEditableRow),
  );

  const prevResetKeyRef = useRef(resetKey);

  useEffect(() => {
    const isReset = prevResetKeyRef.current !== resetKey;
    prevResetKeyRef.current = resetKey;

    setRows((prev) => {
      if (isReset) {
        // 정렬/날짜/조건 변경 → 전체 교체
        return initialData.map(serverToEditableRow);
      }
      // loadMore append → 이미 존재하는 expenseId는 제외하고 새 항목만 추가
      const existingIds = new Set(prev.map((r) => r.expenseId).filter(Boolean));
      const newItems = initialData
        .filter((item) => item.expenseId != null && !existingIds.has(item.expenseId))
        .map(serverToEditableRow);
      if (newItems.length === 0) return prev;
      return [...prev, ...newItems];
    });
  }, [initialData, resetKey]);

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

  /** 저장할 내용이 있을 때만 true (payload 기준). 삭제된 새 행·빈 행만 있으면 false */
  const hasUnsavedChanges = useMemo(() => {
    const { payload } = getPatchPayload();
    return (payload.expenses?.length ?? 0) > 0 || (payload.deletedIds?.length ?? 0) > 0;
  }, [getPatchPayload]);

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
    hasUnsavedChanges,
    selectedCount,
    totalExpense,
  };
}
