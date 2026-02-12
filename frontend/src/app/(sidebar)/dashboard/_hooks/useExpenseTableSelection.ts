"use client";

import { useCallback, useEffect, useState } from "react";
import type { ExpenseData, SelectedCell } from "@/app/(sidebar)/dashboard/_types";

const EDITABLE_ACCESSORS: (keyof ExpenseData)[] = [
  "selected",
  "spentAt",
  "usage",
  "cost",
  "mainCategory",
  "memo",
];

/**
 * 지출 테이블 셀 선택 상태 + 클릭 선택 + 포커스 + 키보드(Tab/Enter) 이동
 */
export function useExpenseTableSelection(rowCount: number) {
  const [selectedCell, setSelectedCell] = useState<SelectedCell>(null);

  useEffect(() => {
    if (!selectedCell) return;
    const cell = document.querySelector<HTMLElement>(
      `[data-cell-id="${selectedCell.rowIndex}-${selectedCell.accessor}"]`,
    );
    const focusable = cell?.querySelector<HTMLElement>('input, button, [role="button"]');
    focusable?.focus();
  }, [selectedCell]);

  const onCellClick = useCallback((rowIndex: number, accessor: keyof ExpenseData) => {
    setSelectedCell({ rowIndex, accessor });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case "Tab": {
          const next = getNextTabCell(selectedCell, rowCount);
          if (next !== null) {
            e.preventDefault();
            setSelectedCell(next);
          }
          break;
        }
        case "Enter":
          if (selectedCell && selectedCell.rowIndex < rowCount - 1) {
            e.preventDefault();
            setSelectedCell({
              rowIndex: selectedCell.rowIndex + 1,
              accessor: selectedCell.accessor,
            });
          }
          break;
      }
    },
    [selectedCell, rowCount],
  );

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
