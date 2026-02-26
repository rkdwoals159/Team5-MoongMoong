"use client";

import type { RefObject } from "react";
import { useCallback, useMemo, useState } from "react";
import { useAutoCategorize } from "@/app/(sidebar)/dashboard/_hooks/useAutoCategorize";
import { useExpenseRowsState } from "@/app/(sidebar)/dashboard/_hooks/useExpenseRowsState";
import { useExpenseRowSave } from "@/app/(sidebar)/dashboard/_hooks/useExpenseRowSave";
import { useExpenseCellPopup } from "@/app/(sidebar)/dashboard/_hooks/useExpenseCellPopup";
import { useExpenseTableColumns } from "@/app/(sidebar)/dashboard/_hooks/useExpenseTableColumns";
import { useExpenseTableSelection } from "@/app/(sidebar)/dashboard/_hooks/useExpenseTableSelection";
import { useUnsavedChangesWarning } from "@/app/(sidebar)/dashboard/_hooks/useUnsavedChangesWarning";
import { isNewRow } from "@/app/(sidebar)/dashboard/_utils";
import type {
  EditableExpenseRow,
  ExpenseData,
  SelectedCell,
  UseExpenseTableReturn,
} from "@/app/(sidebar)/dashboard/_types";
import type { MainCategoryFilter } from "@/api/types/dashboardApi.type";

export const useExpenseTable = ({
  initialData,
  resetKey,
  onSaveSuccess,
  scrollContainerRef,
  mainCategoryFilter,
  onCategoryFilterChange,
}: {
  initialData: ExpenseData[];
  resetKey: number;
  onSaveSuccess: () => void;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  mainCategoryFilter: MainCategoryFilter | null;
  onCategoryFilterChange: (category: MainCategoryFilter | null) => void;
}): UseExpenseTableReturn => {
  const [selectedCell, setSelectedCell] = useState<SelectedCell>(null);

  const onSaveSuccessWithScroll = useCallback(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    onSaveSuccess();
  }, [scrollContainerRef, onSaveSuccess]);

  const {
    displayInitialRows,
    rowKey,
    updateCellByLocalId,
    updateAllCells,
    deleteSelectedRows,
    mergeSelectedRows,
    getPatchPayload,
    hasUnsavedChanges,
    selectedCount,
    costDelta,
  } = useExpenseRowsState(initialData, resetKey);

  useUnsavedChangesWarning(hasUnsavedChanges);

  // 서버에서 정렬된 데이터를 받으므로 새 행(isNew)만 맨 아래 고정하고 나머지는 그대로 유지
  // 사용자가 새로 입력하는 행은 서버 정렬 대상이 아니므로, 정렬 결과에서 제외한다.
  const sortedRows = useMemo(() => {
    const savedRows = displayInitialRows.filter((r) => !isNewRow(r));
    const newRows = displayInitialRows.filter((r) => isNewRow(r));
    return [...savedRows, ...newRows];
  }, [displayInitialRows]);

  const {
    show: showCategoryPopup,
    popupPosition,
    handleOpenPopup: handleOpenCategoryPopup,
    handleClosePopup: handleCloseCategoryPopup,
  } = useExpenseCellPopup({ setSelectedCell, variant: "category" });

  const {
    show: showDatePicker,
    popupPosition: datePickerPosition,
    handleOpenPopup: handleOpenDatePicker,
    handleClosePopup: handleCloseDatePicker,
  } = useExpenseCellPopup({ setSelectedCell, variant: "date" });

  const { onCellClick, handleKeyDown } = useExpenseTableSelection({
    rowCount: sortedRows.length,
    selectedCell,
    setSelectedCell,
    openCategoryPopup: handleOpenCategoryPopup,
    closeCategoryPopup: handleCloseCategoryPopup,
    showCategoryPopup,
    openDatePicker: handleOpenDatePicker,
    closeDatePicker: handleCloseDatePicker,
    showDatePicker,
    sortedRows,
    updateCellByLocalId,
  });

  const { handleSave } = useExpenseRowSave({
    getPatchPayload,
    hasUnsavedChanges,
    onSaveSuccess: onSaveSuccessWithScroll,
  });

  const { triggerCategorize } = useAutoCategorize({ updateCellByLocalId });

  const columns = useExpenseTableColumns({
    displayInitialRows: sortedRows,
    updateCellByLocalId,
    updateAllCells,
    selectedCount,
    onCategoryCellClick: handleOpenCategoryPopup,
    onDateCellClick: handleOpenDatePicker,
    onUsageChange: triggerCategorize,
    mainCategoryFilter,
    onCategoryFilterChange,
  });

  const handleCategorySelect = useCallback(
    (mainCategory: string, subCategory?: string) => {
      if (!selectedCell) return;
      const row = sortedRows[selectedCell.rowIndex] as EditableExpenseRow | undefined;
      if (!row?.localId) return;
      updateCellByLocalId(row.localId, "mainCategory", mainCategory, "subCategory", subCategory);
    },
    [selectedCell, sortedRows, updateCellByLocalId],
  );

  const handleDateSelect = useCallback(
    (dateKey: string) => {
      if (!selectedCell || selectedCell.accessor !== "spentAt") return;
      const row = sortedRows[selectedCell.rowIndex] as { localId?: string } | undefined;
      if (!row?.localId) return;
      updateCellByLocalId(row.localId, "spentAt", dateKey);
      handleCloseDatePicker();
    },
    [selectedCell, sortedRows, updateCellByLocalId, handleCloseDatePicker],
  );

  return {
    sortedRows,
    rowKey,
    columns,
    selectedCell,
    showCategoryPopup,
    popupPosition,
    handleCategorySelect,
    handleClosePopup: handleCloseCategoryPopup,
    showDatePicker,
    datePickerPosition,
    handleDateSelect,
    handleCloseDatePicker,
    deleteSelectedRows,
    mergeSelectedRows,
    handleSave,
    hasUnsavedChanges,
    selectedCount,
    costDelta,
    onCellClick,
    onKeyDown: handleKeyDown,
  };
};
