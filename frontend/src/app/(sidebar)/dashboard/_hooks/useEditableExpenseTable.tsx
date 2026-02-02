"use client";

import { useState, useCallback, useMemo } from "react";
import { DataTableColumn } from "@/components/ui/DataTable/DataTable.type";
import Chip from "@/components/common/Chip/Chip";
import { useEditableRows } from "./useEditableRows";
import { CATEGORY_COLOR_MAP, DEFAULT_CATEGORY_COLOR } from "../_constants";
import { ExpenseData } from "../_types";
import { CATEGORY_POPUP_HEIGHT, EDITABLE_TABLE_MIN_ROWS } from "../_constants";
import { createEmptyRow } from "../_utils/expenseUtils";

type SelectedCell = {
  rowIndex: number;
  accessor: keyof ExpenseData;
} | null;

/**
 * useEditableExpenseTable 훅 반환 타입
 * - displayRows: 표시할 데이터 배열
 * - columns: 컬럼 메타데이터
 * - selectedCell: 선택된 셀
 * - showCategoryPopup: 카테고리 팝업 표시 여부
 * - popupPosition: 카테고리 팝업 위치
 * - handleCategorySelect: 카테고리 선택 핸들러
 * - handleClosePopup: 카테고리 팝업 닫기 핸들러
 */
export type UseEditableExpenseTableReturn = {
  displayRows: ExpenseData[];
  columns: DataTableColumn<ExpenseData>[];
  selectedCell: SelectedCell;
  showCategoryPopup: boolean;
  popupPosition: { top: number; left: number };
  handleCategorySelect: (mainCategory: string, subCategory?: string) => void;
  handleClosePopup: () => void;
};

export function useEditableExpenseTable(initialData: ExpenseData[]): UseEditableExpenseTableReturn {
  const { rows, updateCell, updateCellOrAppend } = useEditableRows<ExpenseData>(initialData);

  /** 선택된 셀 */
  const [selectedCell, setSelectedCell] = useState<SelectedCell>(null);
  /** 카테고리 팝업 표시 여부 */
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  /** 카테고리 팝업 위치 */
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  /** 표시할 데이터 배열 */
  const displayRows = useMemo<ExpenseData[]>(() => {
    const fillCount = Math.max(0, EDITABLE_TABLE_MIN_ROWS - rows.length);
    const fill = Array.from({ length: fillCount }, (_, i) => createEmptyRow(-(i + 1)));
    const trailingEmpty = createEmptyRow(-1000);
    return [...rows, ...fill, trailingEmpty];
  }, [rows]);

  /** 셀 클릭 핸들러 */
  const handleCellClick = useCallback((rowIndex: number, accessor: keyof ExpenseData) => {
    setSelectedCell({ rowIndex, accessor });

    const buttonId = `category-btn-${rowIndex}`;
    const buttonElement = document.getElementById(buttonId);

    if (buttonElement) {
      const rect = buttonElement.getBoundingClientRect();
      const GAP = 4;
      const spaceBelow = window.innerHeight - rect.bottom;
      const showAbove = spaceBelow < CATEGORY_POPUP_HEIGHT + GAP;

      setPopupPosition({
        top: showAbove ? rect.top - CATEGORY_POPUP_HEIGHT - GAP : rect.bottom + GAP,
        left: rect.left,
      });
      setShowCategoryPopup(true);
    }
  }, []);

  /** 카테고리 선택 핸들러 */
  const handleCategorySelect = useCallback(
    (mainCategory: string, subCategory?: string) => {
      if (!selectedCell) return;
      const { rowIndex } = selectedCell;
      const empty = createEmptyRow(0);
      if (rowIndex < rows.length) {
        updateCell(rowIndex, "mainCategory", mainCategory);
        if (subCategory) updateCell(rowIndex, "subCategory", subCategory);
        else updateCell(rowIndex, "subCategory", "");
      } else {
        updateCellOrAppend(rowIndex, "mainCategory", mainCategory, empty);
        if (subCategory) updateCellOrAppend(rowIndex, "subCategory", subCategory, empty);
        else updateCellOrAppend(rowIndex, "subCategory", "", empty);
      }
    },
    [selectedCell, rows.length, updateCell, updateCellOrAppend],
  );

  /** 카테고리 팝업 닫기 핸들러 */
  const handleClosePopup = useCallback(() => {
    setShowCategoryPopup(false);
    setSelectedCell(null);
  }, []);

  /** 편집 모드에서 사용할 셀 편집기 */
  const createEditor = useCallback(
    (accessor: keyof ExpenseData) => {
      const editor = (
        value: ExpenseData[keyof ExpenseData],
        _row: ExpenseData,
        rowIndex: number,
      ) => (
        <input
          className="w-full bg-transparent outline-none px-500 py-200"
          value={String(value ?? "")}
          onChange={(e) => {
            const v = e.target.value;
            if (rowIndex < rows.length) {
              updateCell(rowIndex, accessor, v);
            } else {
              updateCellOrAppend(rowIndex, accessor, v, createEmptyRow(0));
            }
          }}
        />
      );
      return editor;
    },
    [rows.length, updateCell, updateCellOrAppend],
  );

  /** 읽기 모드에서 사용할 셀 렌더러 */
  const createRender = useCallback(
    (value: ExpenseData[keyof ExpenseData], _row: ExpenseData, rowIndex: number) => {
      const mainCategory = String(value);
      const subCategory = String(_row?.subCategory ?? "");
      const color = CATEGORY_COLOR_MAP[mainCategory] || DEFAULT_CATEGORY_COLOR;

      return (
        <button
          type="button"
          id={`category-btn-${rowIndex}`}
          className="w-full h-full cursor-pointer px-500 py-200 flex items-center justify-start transition-colors gap-1"
          aria-label={`${mainCategory} 카테고리 선택`}
          onClick={() => handleCellClick(rowIndex, "mainCategory")}
        >
          <Chip label={mainCategory} level="major" color={color} />
          {subCategory && <Chip label={subCategory} level="minor" color="none" />}
        </button>
      );
    },
    [handleCellClick],
  );

  /** 컬럼 메타데이터 */
  const columns = useMemo<DataTableColumn<ExpenseData>[]>(
    () => [
      { label: "날짜", accessor: "spentAt", editor: createEditor("spentAt") },
      { label: "사용내역", accessor: "usage", editor: createEditor("usage") },
      { label: "비용", accessor: "cost", editor: createEditor("cost") },
      { label: "항목", accessor: "mainCategory", render: createRender },
      { label: "메모", accessor: "memo", editor: createEditor("memo") },
    ],
    [createEditor, createRender],
  );

  return {
    displayRows,
    columns,
    selectedCell,
    showCategoryPopup,
    popupPosition,
    handleCategorySelect,
    handleClosePopup,
  };
}
