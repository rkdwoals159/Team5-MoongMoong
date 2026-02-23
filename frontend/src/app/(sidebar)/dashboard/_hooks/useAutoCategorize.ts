import { postCategorizeExpense } from "@/api/client/dashboardApi";
import { EXPENSES_CATEGORIZE_ERROR_MESSAGE } from "@/api/constants";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import type { UseAutoCategorizeParams } from "@/app/(sidebar)/dashboard/_types";
import { AUTO_CATEGORIZE_DEBOUNCE_MS } from "@/app/(sidebar)/dashboard/_constants";

/**
 * usage 변경 시 디바운스 후 자동 카테고리 분류 API 호출 및 결과 반영
 */
export function useAutoCategorize({ updateCellByLocalId }: UseAutoCategorizeParams): {
  triggerCategorize: (localId: string, usage: string) => void;
} {
  const { showToast } = useToast();

  const triggerCategorize = useDebouncedCallback(async (localId: string, usage: string) => {
    const trimmed = usage.trim();
    if (!trimmed) {
      updateCellByLocalId(localId, "mainCategory", "", "subCategory", "");
      return;
    }
    try {
      const result = await postCategorizeExpense(trimmed, localId);
      updateCellByLocalId(
        localId,
        "mainCategory",
        result?.mainCategory ?? "",
        "subCategory",
        result?.subCategory ?? "",
      );
    } catch (e) {
      showToast({
        variant: "error",
        message: e instanceof Error ? e.message : EXPENSES_CATEGORIZE_ERROR_MESSAGE,
      });
    }
  }, AUTO_CATEGORIZE_DEBOUNCE_MS);

  return { triggerCategorize };
}
