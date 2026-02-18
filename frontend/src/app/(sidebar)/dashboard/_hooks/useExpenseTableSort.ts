"use client";

import { useCallback, useMemo, useState } from "react";
import { sortExpenseRows } from "@/app/(sidebar)/dashboard/_lib";
import { isNewRow } from "@/app/(sidebar)/dashboard/_utils";
import type { SortableExpenseAccessor } from "@/app/(sidebar)/dashboard/_types";
import type { ExpenseData } from "@/app/(sidebar)/dashboard/_types";

const DEFAULT_SORT: { sortBy: SortableExpenseAccessor; sortOrder: "asc" | "desc" } = {
  sortBy: "spentAt",
  sortOrder: "desc",
};

/**
 * 지출 테이블 행 정렬 상태 및 핸들러
 * 저장 전 새 행(isNew)은 정렬에서 제외하고 맨 아래 고정. 저장 후에는 전체 정렬.
 *
 * @param rows - 정렬 대상 행 배열
 * @returns sortedRows, sortConfig, handleSort
 */
export function useExpenseTableSort<T extends ExpenseData>(rows: T[]) {
  const [sortState, setSortState] = useState(DEFAULT_SORT);

  const sortedRows = useMemo(() => {
    const savedRows = rows.filter((r) => !isNewRow(r)) as T[];
    const newRows = rows.filter((r) => isNewRow(r)) as T[];
    const sorted = sortExpenseRows(savedRows, sortState.sortBy, sortState.sortOrder);
    return [...sorted, ...newRows];
  }, [rows, sortState.sortBy, sortState.sortOrder]);

  const handleSort = useCallback((accessor: SortableExpenseAccessor) => {
    setSortState((prev) =>
      prev.sortBy === accessor
        ? { ...prev, sortOrder: prev.sortOrder === "asc" ? "desc" : "asc" }
        : { sortBy: accessor, sortOrder: "asc" },
    );
  }, []);

  return {
    sortedRows,
    sortConfig: sortState,
    handleSort,
  };
}
