"use client";

import { useExpenseRowsState } from "@/app/(sidebar)/dashboard/_hooks/useExpenseRowsState";
import { useExpenseRowSave } from "@/app/(sidebar)/dashboard/_hooks/useExpenseRowSave";
import { useExpenseCategoryPopup } from "@/app/(sidebar)/dashboard/_hooks/useExpenseCategoryPopup";
import { useExpenseCategoryUpdate } from "@/app/(sidebar)/dashboard/_hooks/useExpenseCategoryUpdate";
import { useExpenseTableColumns } from "@/app/(sidebar)/dashboard/_hooks/UseExpenseTableColumns";
import { useExpenseTableSelection } from "@/app/(sidebar)/dashboard/_hooks/useExpenseTableSelection";
import { useExpenseTableSort } from "@/app/(sidebar)/dashboard/_hooks/useExpenseTableSort";
import type { ExpenseData, UseExpenseTableReturn } from "@/app/(sidebar)/dashboard/_types";
export const useExpenseTable = (initialData: ExpenseData[]): UseExpenseTableReturn => {
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

  const { selectedCell, setSelectedCell, onCellClick, handleKeyDown } = useExpenseTableSelection(
    sortedRows.length,
  );

  const { handleSave } = useExpenseRowSave({
    getPatchPayload,
    mergeRowsFromServer,
    hasUnsavedChanges,
  });

  const { showCategoryPopup, popupPosition, handleOpenPopup, handleClosePopup } =
    useExpenseCategoryPopup(setSelectedCell);

  const columns = useExpenseTableColumns({
    displayInitialRows: sortedRows,
    updateCellByLocalId,
    updateAllCells,
    selectedCount,
    onCategoryCellClick: handleOpenPopup,
  });

  const { handleCategorySelect } = useExpenseCategoryUpdate({
    selectedCell,
    displayInitialRows: sortedRows,
    updateCellByLocalId,
  });

  return {
    sortedRows,
    rowKey,
    columns,
    selectedCell,
    showCategoryPopup,
    popupPosition,
    handleCategorySelect,
    handleClosePopup,
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
