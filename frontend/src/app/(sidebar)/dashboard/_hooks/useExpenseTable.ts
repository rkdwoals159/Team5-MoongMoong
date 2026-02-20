"use client";

import { useCallback, useState } from "react";
import { useAutoCategorize } from "@/app/(sidebar)/dashboard/_hooks/useAutoCategorize";
import { useExpenseRowsState } from "@/app/(sidebar)/dashboard/_hooks/useExpenseRowsState";
import { useExpenseRowSave } from "@/app/(sidebar)/dashboard/_hooks/useExpenseRowSave";
import { useExpenseCellPopup } from "@/app/(sidebar)/dashboard/_hooks/useExpenseCellPopup";
import { useExpenseCategoryUpdate } from "@/app/(sidebar)/dashboard/_hooks/useExpenseCategoryUpdate";
import { useExpenseTableColumns } from "@/app/(sidebar)/dashboard/_hooks/UseExpenseTableColumns";
import { useExpenseTableSelection } from "@/app/(sidebar)/dashboard/_hooks/useExpenseTableSelection";
import { useExpenseTableSort } from "@/app/(sidebar)/dashboard/_hooks/useExpenseTableSort";
import type {
  ExpenseData,
  SelectedCell,
  UseExpenseTableReturn,
} from "@/app/(sidebar)/dashboard/_types";
export const useExpenseTable = (initialData: ExpenseData[]): UseExpenseTableReturn => {
  const [selectedCell, setSelectedCell] = useState<SelectedCell>(null);

  const {
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
  } = useExpenseRowsState(initialData);

  const { sortedRows, sortConfig, handleSort } = useExpenseTableSort(displayInitialRows);

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
    mergeRowsFromServer,
    hasUnsavedChanges,
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
  });

  const { handleCategorySelect } = useExpenseCategoryUpdate({
    selectedCell,
    displayInitialRows: sortedRows,
    updateCellByLocalId,
  });

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
    totalExpense,
    sortConfig,
    handleSort,
    onCellClick,
    onKeyDown: handleKeyDown,
  };
};
