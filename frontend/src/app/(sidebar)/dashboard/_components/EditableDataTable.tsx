"use client";

import { useState, useCallback, useMemo } from "react";
import DataTable from "@/components/ui/DataTable/DataTable";
import { DataTableColumn } from "@/components/ui/DataTable/DataTable.type";
import Chip from "@/components/common/Chip/Chip";
import { useEditableRows } from "../_hooks/useEditableRows";
import { CATEGORY_COLOR_MAP, DEFAULT_CATEGORY_COLOR } from "../_constants/categoryMap";
import CategoryPopup, { CATEGORY_POPUP_HEIGHT } from "./CategoryPopup";
import { EditableDataTableProps, ExpenseData } from "../_types/dashboard.type";

/**
 * 수정 가능한 DataTable 컴포넌트
 * @param data - 초기 데이터 (ExpenseData 타입)
 * @param className - 추가할 스타일 클래스 (옵셔널)
 * @returns 수정 가능한 DataTable 컴포넌트
 */
const EditableDataTable = ({ initialData, className }: EditableDataTableProps) => {
  const { rows, updateCell } = useEditableRows<ExpenseData>(initialData);

  // 선택된 셀 상태를 부모(EditableDataTable)에서 관리
  const [selectedCell, setSelectedCell] = useState<{
    rowIndex: number;
    accessor: keyof ExpenseData;
  } | null>(null);

  // 카테고리 팝업 상태
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  // 셀 클릭 핸들러
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

  // 카테고리 선택 핸들러
  const handleCategorySelect = useCallback(
    (mainCategory: string, subCategory?: string) => {
      if (selectedCell) {
        updateCell(selectedCell.rowIndex, "mainCategory", mainCategory);

        if (subCategory) updateCell(selectedCell.rowIndex, "subCategory", subCategory);
        else updateCell(selectedCell.rowIndex, "subCategory", "");
      }
    },
    [selectedCell, updateCell],
  );

  // 팝업 닫기 핸들러
  const handleClosePopup = useCallback(() => {
    setShowCategoryPopup(false);
    setSelectedCell(null);
  }, []);

  // 각 컬럼의 편집 가능한 input을 생성하는 헬퍼 함수
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
          onChange={(e) => updateCell(rowIndex, accessor, e.target.value)}
        />
      );
      return editor;
    },
    [updateCell],
  );

  // 카테고리 렌더 함수 (Chip 컴포넌트로 표시, 클릭 가능)
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

  // TODO: 컬럼 메타데이터 분리해서 관리
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

  return (
    <>
      <DataTable<ExpenseData>
        mode="edit"
        columns={columns}
        data={rows}
        rowKey={(row) => row.expenseId}
        className={className}
        selectedCell={selectedCell}
      />

      {showCategoryPopup && selectedCell && (
        <CategoryPopup
          position={popupPosition}
          onSelect={handleCategorySelect}
          onClose={handleClosePopup}
          currentMainCategory={String(rows[selectedCell.rowIndex]?.mainCategory ?? "")}
          currentSubCategory={String(rows[selectedCell.rowIndex]?.subCategory ?? "")}
        />
      )}
    </>
  );
};

export default EditableDataTable;
