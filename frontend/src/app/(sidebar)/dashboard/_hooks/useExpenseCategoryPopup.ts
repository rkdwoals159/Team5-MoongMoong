import type { MouseEvent } from "react";
import { useState, useCallback } from "react";
import type {
  ExpenseData,
  SelectedCell,
  UseExpenseCategoryPopupReturn,
} from "@/app/(sidebar)/dashboard/_types";
import { CATEGORY_POPUP_HEIGHT, CATEGORY_POPUP_GAP } from "@/app/(sidebar)/dashboard/_constants";

/**
 * 카테고리 팝업 열기/닫기 및 위치 상태 관리 훅
 */
export const useExpenseCategoryPopup = (
  setSelectedCell: (cell: SelectedCell) => void,
): UseExpenseCategoryPopupReturn => {
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const handleOpenPopup = useCallback(
    (e: MouseEvent<HTMLButtonElement>, rowIndex: number, accessor: keyof ExpenseData) => {
      setSelectedCell({ rowIndex, accessor });

      const rect = e.currentTarget.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const showAbove = spaceBelow < CATEGORY_POPUP_HEIGHT + CATEGORY_POPUP_GAP;

      setPopupPosition({
        top: showAbove
          ? rect.top - CATEGORY_POPUP_HEIGHT - CATEGORY_POPUP_GAP
          : rect.bottom + CATEGORY_POPUP_GAP,
        left: rect.left,
      });
      setShowCategoryPopup(true);
    },
    [setSelectedCell],
  );

  const handleClosePopup = useCallback(() => {
    setShowCategoryPopup(false);
    setSelectedCell(null);
  }, [setSelectedCell]);

  return {
    showCategoryPopup,
    popupPosition,
    handleOpenPopup,
    handleClosePopup,
  };
};
