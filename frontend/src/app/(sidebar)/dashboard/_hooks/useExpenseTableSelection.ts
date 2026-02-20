"use client";

import { useCallback, useEffect } from "react";
import type {
  ExpenseData,
  EditableExpenseRow,
  SelectedCell,
  UseExpenseTableSelectionParams,
} from "@/app/(sidebar)/dashboard/_types";
import { EDITABLE_ACCESSORS } from "@/app/(sidebar)/dashboard/_constants";
import { isNewRow } from "../_utils";
import { formatDateKey } from "@/utils/date";

/**
 * 지출 테이블 셀 선택 상태 + 클릭 선택 + 포커스 + 키보드(Tab/Enter) 이동
 */
export function useExpenseTableSelection({
  rowCount,
  selectedCell,
  setSelectedCell,
  openCategoryPopup,
  closeCategoryPopup,
  showCategoryPopup = false,
  openDatePicker,
  closeDatePicker,
  showDatePicker = false,
  sortedRows,
  updateCellByLocalId,
}: UseExpenseTableSelectionParams) {
  useEffect(() => {
    if (!selectedCell) return;
    const cell = document.querySelector<HTMLElement>(
      `[data-cell-id="${selectedCell.rowIndex}-${selectedCell.accessor}"]`,
    );
    const focusable = cell?.querySelector<HTMLElement>('input, button, [role="button"]');
    focusable?.focus();
  }, [selectedCell]);

  // 새 행의 어느 셀이든 선택되면 spentAt이 비어 있을 때 오늘 날짜로 자동 설정
  useEffect(() => {
    if (!selectedCell) return;
    if (selectedCell.accessor === "selected") return;
    const row = sortedRows[selectedCell.rowIndex];
    if (!row || !isNewRow(row)) return;
    const editableRow = row as EditableExpenseRow;
    if (!editableRow.localId) return;
    const currentSpentAt = editableRow.spentAt ?? "";
    if (!currentSpentAt.trim()) {
      updateCellByLocalId(editableRow.localId, "spentAt", formatDateKey(new Date()));
    }
  }, [selectedCell, sortedRows, updateCellByLocalId]);

  const onCellClick = useCallback(
    (rowIndex: number, accessor: keyof ExpenseData) => {
      setSelectedCell({ rowIndex, accessor });
    },
    [setSelectedCell],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.nativeEvent.isComposing) return;

    const shouldCloseDatePicker = showDatePicker && selectedCell?.accessor === "spentAt";
    const shouldCloseCategoryPopup = showCategoryPopup && selectedCell?.accessor === "mainCategory";

    const processMove = (next: SelectedCell) => {
      const shouldHandle = shouldCloseDatePicker || shouldCloseCategoryPopup || next !== null;
      if (!shouldHandle) return;

      e.preventDefault();
      if (shouldCloseDatePicker) closeDatePicker?.();
      if (shouldCloseCategoryPopup) closeCategoryPopup?.();
      if (next) {
        setSelectedCell(next);
        if (next.accessor === "mainCategory") openCategoryPopup?.(next.rowIndex);
        else if (next.accessor === "spentAt") openDatePicker?.(next.rowIndex);
      }
    };

    switch (e.key) {
      case "Tab":
        processMove(getNextTabCell(selectedCell, rowCount));
        break;
      case "Enter": {
        const next =
          selectedCell && selectedCell.rowIndex < rowCount - 1
            ? { rowIndex: selectedCell.rowIndex + 1, accessor: selectedCell.accessor }
            : null;
        processMove(next);
        break;
      }
    }
  };

  return { selectedCell, setSelectedCell, onCellClick, handleKeyDown };
}

function getNextTabCell(selectedCell: SelectedCell, rowCount: number): SelectedCell {
  if (rowCount <= 0) return null;

  const colCount = EDITABLE_ACCESSORS.length;
  const lastColIndex = colCount - 1;

  if (!selectedCell) {
    return { rowIndex: 0, accessor: EDITABLE_ACCESSORS[0]! };
  }

  const currentColIndex = EDITABLE_ACCESSORS.indexOf(selectedCell.accessor);
  if (currentColIndex === -1) return selectedCell;

  if (currentColIndex < lastColIndex) {
    return { rowIndex: selectedCell.rowIndex, accessor: EDITABLE_ACCESSORS[currentColIndex + 1]! };
  }

  if (selectedCell.rowIndex < rowCount - 1) {
    return { rowIndex: selectedCell.rowIndex + 1, accessor: EDITABLE_ACCESSORS[0]! };
  }
  return null;
}
