"use client";

import { useCallback } from "react";
import type { UseExpenseRowSaveParams } from "@/app/(sidebar)/dashboard/_types";
import {
  SAVE_ERROR_MESSAGE,
  SAVE_VALIDATION_ERROR_MESSAGE,
} from "@/app/(sidebar)/dashboard/_constants";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { patchExpenses } from "@/api/client/dashboardApi";

export function useExpenseRowSave({
  getPatchPayload,
  hasUnsavedChanges,
  onSaveSuccess,
}: UseExpenseRowSaveParams) {
  const { showToast } = useToast();

  const handleSave = useCallback(async (): Promise<void> => {
    if (!hasUnsavedChanges) return;

    const { payload, invalidCount } = getPatchPayload();
    if (invalidCount > 0) {
      showToast({
        variant: "error",
        message: SAVE_VALIDATION_ERROR_MESSAGE,
      });
      return;
    }

    try {
      await patchExpenses(payload);
      onSaveSuccess();
    } catch (error) {
      console.error("Failed to save expenses:", error);
      showToast({
        variant: "error",
        message: error instanceof Error ? error.message : SAVE_ERROR_MESSAGE,
      });
    }
  }, [getPatchPayload, hasUnsavedChanges, showToast, onSaveSuccess]);

  return { handleSave };
}
