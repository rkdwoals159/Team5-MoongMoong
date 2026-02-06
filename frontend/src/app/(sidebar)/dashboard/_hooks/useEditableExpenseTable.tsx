"use client";

import { useState, useCallback, useMemo } from "react";
import { getExpensesByPeriod, patchExpenses } from "@/app/(sidebar)/dashboard/_api";
import { DataTableColumn } from "@/components/ui/DataTable/DataTable.type";
import { useEditableRows } from "@/app/(sidebar)/dashboard/_hooks/useEditableRows";
import { EditableExpenseRow, ExpenseData } from "@/app/(sidebar)/dashboard/_types";
import { formatDateKey } from "@/utils/date";
import { formatAmountPlain } from "@/utils/amount";
import {
  CATEGORY_POPUP_HEIGHT,
  CATEGORY_COLOR_MAP,
  DEFAULT_CATEGORY_COLOR,
} from "@/app/(sidebar)/dashboard/_constants";
import NativeDateInput from "@/components/common/DateRangePicker/NativeDateInput";
import Chip from "@/components/common/Chip/Chip";
import CheckBox from "@/components/common/CheckBox/CheckBox";

type SelectedCell = { rowIndex: number; accessor: keyof ExpenseData } | null;

/**
 * useEditableExpenseTable 훅 반환 타입
 */
type UseEditableExpenseTableReturn = {
  displayInitialRows: ExpenseData[];
  columns: DataTableColumn<ExpenseData>[];
  selectedCell: SelectedCell;
  showCategoryPopup: boolean;
  popupPosition: { top: number; left: number };
  handleCategorySelect: (mainCategory: string, subCategory?: string) => void;
  handleClosePopup: () => void;
  deleteSelectedRows: () => void;
  mergeSelectedRows: () => void;
  handleSave: (startDate: string, endDate: string) => Promise<void>;
  hasUnsavedChanges: boolean;
  selectedCount: number;
  totalExpense: number;
};

export const useEditableExpenseTable = (
  initialData: ExpenseData[],
): UseEditableExpenseTableReturn => {
  const [selectedCell, setSelectedCell] = useState<SelectedCell>(null);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);

  const api = useMemo(() => ({ getExpensesByPeriod, patchExpenses }), []);

  const {
    displayInitialRows,
    updateCellByLocalId,
    updateAllCells,
    deleteSelectedRows,
    mergeSelectedRows,
    handleSave,
    hasUnsavedChanges,
    selectedCount,
    totalExpense,
  } = useEditableRows(initialData, api);

  /** 카테고리 선택 핸들러 */
  const handleCategorySelect = useCallback(
    (mainCategory: string, subCategory?: string) => {
      if (!selectedCell) return;
      const row = displayInitialRows[selectedCell.rowIndex] as EditableExpenseRow | undefined;
      if (!row?.localId) return;
      updateCellByLocalId(row.localId, "mainCategory", mainCategory, "subCategory", subCategory);
    },
    [selectedCell, displayInitialRows, updateCellByLocalId],
  );

  /** 카테고리 팝업 닫기 핸들러 */
  const handleClosePopup = useCallback(() => {
    setShowCategoryPopup(false);
    setSelectedCell(null);
  }, []);

  /** 셀 클릭 핸들러 */
  const handleCategoryCellClick = useCallback((rowIndex: number, accessor: keyof ExpenseData) => {
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

  /** 편집 모드에서 사용할 셀 편집기 */
  const createEditor = useCallback(
    (accessor: keyof ExpenseData) => {
      const editor = (value: ExpenseData[keyof ExpenseData], _row: ExpenseData) => {
        const row = _row as EditableExpenseRow;
        return (
          <input
            className="w-full bg-transparent outline-none px-500 py-200"
            value={String(value ?? "")}
            onChange={(e) => {
              const v = e.target.value;
              updateCellByLocalId(row.localId, accessor, v);
            }}
          />
        );
      };
      return editor;
    },
    [updateCellByLocalId],
  );

  /** 읽기 모드에서 사용할 셀 렌더러 */
  const createRender = useCallback(
    (value: ExpenseData[keyof ExpenseData], _row: ExpenseData, rowIndex: number) => {
      const mainCategory = String(value ?? "");
      const subCategory = String(_row?.subCategory ?? "");
      const color = CATEGORY_COLOR_MAP[mainCategory] || DEFAULT_CATEGORY_COLOR;
      return (
        <button
          type="button"
          id={`category-btn-${rowIndex}`}
          className="w-full h-full cursor-pointer px-500 py-200 flex items-center justify-start transition-colors gap-1"
          aria-label={mainCategory ? `${mainCategory} 카테고리 선택` : "카테고리 선택"}
          onClick={() => handleCategoryCellClick(rowIndex, "mainCategory")}
        >
          {mainCategory && <Chip label={mainCategory} level="major" color={color} />}
          {subCategory && <Chip label={subCategory} level="minor" color="none" />}
        </button>
      );
    },
    [handleCategoryCellClick],
  );

  const createEditorCost = useCallback(
    (value: ExpenseData[keyof ExpenseData], _row: ExpenseData) => {
      const row = _row as EditableExpenseRow;
      const num =
        typeof value === "number" ? value : value != null && value !== "" ? Number(value) : 0;
      const displayValue = num ? formatAmountPlain(num) : "";

      return (
        <input
          type="text"
          inputMode="numeric"
          className="w-full bg-transparent outline-none px-500 py-200"
          value={displayValue}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9]/g, "");
            const parsed = raw === "" ? 0 : Number(raw);
            updateCellByLocalId(row.localId, "cost", String(parsed));
          }}
        />
      );
    },
    [updateCellByLocalId],
  );

  /** 날짜 변경 핸들러 */
  const handleDateChange = useCallback(
    (rowIndex: number, date: string) => {
      const row = displayInitialRows[rowIndex] as EditableExpenseRow | undefined;
      if (!row?.localId) return;
      updateCellByLocalId(row.localId, "spentAt", date);
    },
    [updateCellByLocalId, displayInitialRows],
  );

  /** 날짜 셀 렌더러 */
  const createRenderDate = useCallback(
    (value: ExpenseData[keyof ExpenseData], _row: ExpenseData, rowIndex: number) => {
      return (
        <NativeDateInput
          className="w-full h-full cursor-pointer px-500 py-200 flex items-center justify-start transition-colors gap-1"
          value={value ? formatDateKey(new Date(String(value))) : ""}
          displayText={value ? formatDateKey(new Date(String(value))) : ""}
          ariaLabel="날짜 선택"
          onChange={(date: string) => handleDateChange(rowIndex, date)}
        />
      );
    },
    [handleDateChange],
  );

  const createRenderCheckBox = (value: ExpenseData[keyof ExpenseData], _row: ExpenseData) => {
    const row = _row as EditableExpenseRow;
    return (
      <CheckBox
        isChecked={!!value}
        onChange={() => updateCellByLocalId(row.localId, "selected", !value)}
      />
    );
  };

  /** 모든 셀 선택 여부 변경 핸들러 */
  const handleToggleAllCheckBox = () => {
    const nextValue = !isAllSelected;

    // 마지막 꼬리 빈 ROW 제외하고 모든 ROW 선택 여부 변경
    updateAllCells("selected", nextValue);
    setIsAllSelected(nextValue);
  };

  /** 컬럼 메타데이터 */
  const columns: DataTableColumn<ExpenseData>[] = [
    {
      label: <CheckBox isChecked={isAllSelected} onChange={handleToggleAllCheckBox} />,
      accessor: "selected",
      render: createRenderCheckBox,
      width: "48px",
    },
    { label: "날짜", accessor: "spentAt", render: createRenderDate },
    { label: "사용내역", accessor: "usage", editor: createEditor("usage") },
    { label: "비용", accessor: "cost", editor: createEditorCost },
    { label: "항목", accessor: "mainCategory", render: createRender },
    { label: "메모", accessor: "memo", editor: createEditor("memo") },
  ];

  return {
    displayInitialRows,
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
