"use client";

import { useState, useCallback } from "react";
import type {
  ExpenseData,
  UseExpenseCellPopupParams,
  UseExpenseCellPopupReturn,
} from "@/app/(sidebar)/dashboard/_types";
import { CELL_POPUP_VARIANT_CONFIG } from "@/app/(sidebar)/dashboard/_constants";

/**
 * 셀 팝업 열기/닫기 및 위치 상태 관리 (카테고리/날짜 공통)
 * 클릭/Tab 모두 handleOpenPopup(rowIndex)로 처리
 */
export function useExpenseCellPopup({
  setSelectedCell,
  variant,
}: UseExpenseCellPopupParams): UseExpenseCellPopupReturn {
  const { accessor, popupHeight, popupGap } = CELL_POPUP_VARIANT_CONFIG[variant];
  const [show, setShow] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const handleOpenPopup = useCallback(
    (rowIndex: number) => {
      setSelectedCell({ rowIndex, accessor: accessor as keyof ExpenseData });

      const cell = document.querySelector<HTMLElement>(`[data-cell-id="${rowIndex}-${accessor}"]`);
      const button = cell?.querySelector<HTMLButtonElement>("button");
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const showAbove = spaceBelow < popupHeight + popupGap;

      setPopupPosition({
        top: showAbove ? rect.top - popupHeight - popupGap : rect.bottom + popupGap,
        left: rect.left,
      });
      setShow(true);
    },
    [setSelectedCell, accessor, popupHeight, popupGap],
  );

  const handleClosePopup = useCallback(() => {
    setShow(false);
    setSelectedCell(null);
  }, [setSelectedCell]);

  return {
    show,
    popupPosition,
    handleOpenPopup,
    handleClosePopup,
  };
}
