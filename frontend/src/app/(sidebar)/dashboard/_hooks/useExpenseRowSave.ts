"use client";

import { useCallback } from "react";
import { UseExpenseRowSaveParams } from "@/app/(sidebar)/dashboard/_types";
import { SAVE_ERROR_MESSAGE } from "@/app/(sidebar)/dashboard/_constants";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { patchExpenses, getExpensesByPeriod } from "@/app/(sidebar)/dashboard/_api";

export const useExpenseRowSave = ({
  getPatchPayload,
  mergeRowsFromServer,
  hasUnsavedChanges,
}: UseExpenseRowSaveParams) => {
  const { showToast } = useToast();

  const handleSave = useCallback(
    async (startDate: string, endDate: string): Promise<void> => {
      if (!hasUnsavedChanges) return;

      try {
        const payload = getPatchPayload();
        await patchExpenses(payload);
        const { expenses } = await getExpensesByPeriod(startDate, endDate);
        mergeRowsFromServer(expenses);
      } catch (error) {
        console.error("Failed to save expenses:", error);
        showToast({
          variant: "error",
          message: error instanceof Error ? error.message : SAVE_ERROR_MESSAGE,
        });
      }
    },
    [getPatchPayload, mergeRowsFromServer, hasUnsavedChanges, showToast],
  );

  return { handleSave };
};
