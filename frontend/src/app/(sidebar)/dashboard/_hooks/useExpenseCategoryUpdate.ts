import { useCallback } from "react";
import {
  EditableExpenseRow,
  UseExpenseCategoryUpdateParams,
} from "@/app/(sidebar)/dashboard/_types";

/**
 * 카테고리 팝업에서 선택된 항목을 행 데이터에 반영하는 훅
 */
export const useExpenseCategoryUpdate = ({
  selectedCell,
  displayInitialRows,
  updateCellByLocalId,
}: UseExpenseCategoryUpdateParams) => {
  const handleCategorySelect = useCallback(
    (mainCategory: string, subCategory?: string) => {
      if (!selectedCell) return;
      const row = displayInitialRows[selectedCell.rowIndex] as EditableExpenseRow | undefined;
      if (!row?.localId) return;
      updateCellByLocalId(row.localId, "mainCategory", mainCategory, "subCategory", subCategory);
    },
    [selectedCell, displayInitialRows, updateCellByLocalId],
  );

  return { handleCategorySelect };
};
