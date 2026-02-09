"use client";

import { useState } from "react";
import { useExpenseRowsState } from "@/app/(sidebar)/dashboard/_hooks/useExpenseRowsState";
import { useExpenseRowSave } from "@/app/(sidebar)/dashboard/_hooks/useExpenseRowSave";
import { useExpenseCategoryPopup } from "@/app/(sidebar)/dashboard/_hooks/useExpenseCategoryPopup";
import { useExpenseCategoryUpdate } from "@/app/(sidebar)/dashboard/_hooks/useExpenseCategoryUpdate";
import { useExpenseTableColumns } from "@/app/(sidebar)/dashboard/_hooks/useExpenseTableColumns";
import { ExpenseData, SelectedCell, UseExpenseTableReturn } from "@/app/(sidebar)/dashboard/_types";

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

  const { handleSave } = useExpenseRowSave({
    getPatchPayload,
    mergeRowsFromServer,
    hasUnsavedChanges,
  });

  const { showCategoryPopup, popupPosition, handleOpenPopup, handleClosePopup } =
    useExpenseCategoryPopup(setSelectedCell);

  const columns = useExpenseTableColumns({
    displayInitialRows,
    updateCellByLocalId,
    updateAllCells,
    selectedCount,
    onCategoryCellClick: handleOpenPopup,
  });

  const { handleCategorySelect } = useExpenseCategoryUpdate({
    selectedCell,
    displayInitialRows,
    updateCellByLocalId,
  });

  return {
    displayInitialRows,
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
  };
};
