"use client";

import { useCallback, useMemo } from "react";
import { DataTableColumn } from "@/components/ui/DataTable/DataTable.type";
import {
  EditableExpenseRow,
  ExpenseData,
  UseExpenseTableColumnsParams,
} from "@/app/(sidebar)/dashboard/_types";
import { formatDateKey } from "@/utils/date";
import { formatAmountPlain } from "@/utils/amount";
import { CATEGORY_COLOR_MAP, DEFAULT_CATEGORY_COLOR } from "@/app/(sidebar)/dashboard/_constants";
import NativeDateInput from "@/components/common/DateRangePicker/NativeDateInput";
import Chip from "@/components/common/Chip/Chip";
import CheckBox from "@/components/common/CheckBox/CheckBox";

/**
 * 지출 테이블 컬럼 정의 및 셀 렌더러/에디터 생성 훅
 */
export const useExpenseTableColumns = ({
  displayInitialRows,
  updateCellByLocalId,
  updateAllCells,
  selectedCount,
  onCategoryCellClick,
}: UseExpenseTableColumnsParams): DataTableColumn<ExpenseData>[] => {
  const isAllSelected =
    selectedCount === displayInitialRows.length - 1 && displayInitialRows.length > 1;

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

  const createRenderCategory = useCallback(
    (value: ExpenseData[keyof ExpenseData], _row: ExpenseData, rowIndex: number) => {
      const mainCategory = String(value ?? "");
      const subCategory = String(_row?.subCategory ?? "");
      const color = CATEGORY_COLOR_MAP[mainCategory] || DEFAULT_CATEGORY_COLOR;
      return (
        <button
          type="button"
          className="w-full h-full cursor-pointer px-500 py-200 flex items-center justify-start transition-colors gap-1"
          aria-label={mainCategory ? `${mainCategory} 카테고리 선택` : "카테고리 선택"}
          onClick={(e) => onCategoryCellClick(e, rowIndex, "mainCategory")}
        >
          {mainCategory && <Chip label={mainCategory} level="major" color={color} />}
          {subCategory && <Chip label={subCategory} level="minor" color="none" />}
        </button>
      );
    },
    [onCategoryCellClick],
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

  const handleDateChange = useCallback(
    (rowIndex: number, date: string) => {
      const row = displayInitialRows[rowIndex] as EditableExpenseRow | undefined;
      if (!row?.localId) return;
      updateCellByLocalId(row.localId, "spentAt", date);
    },
    [updateCellByLocalId, displayInitialRows],
  );

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

  const createRenderCheckBox = useCallback(
    (value: ExpenseData[keyof ExpenseData], _row: ExpenseData) => {
      const row = _row as EditableExpenseRow;
      return (
        <CheckBox
          isChecked={!!value}
          onChange={() => updateCellByLocalId(row.localId, "selected", !value)}
        />
      );
    },
    [updateCellByLocalId],
  );

  const handleToggleAllCheckBox = useCallback(() => {
    const nextValue = !isAllSelected;
    updateAllCells("selected", nextValue);
  }, [isAllSelected, updateAllCells]);

  return useMemo(
    () => [
      {
        label: <CheckBox isChecked={isAllSelected} onChange={handleToggleAllCheckBox} />,
        accessor: "selected" as keyof ExpenseData,
        render: createRenderCheckBox,
        width: "48px",
      },
      { label: "날짜", accessor: "spentAt", render: createRenderDate },
      { label: "사용내역", accessor: "usage", editor: createEditor("usage") },
      { label: "비용", accessor: "cost", editor: createEditorCost },
      { label: "항목", accessor: "mainCategory", render: createRenderCategory },
      { label: "메모", accessor: "memo", editor: createEditor("memo") },
    ],
    [
      isAllSelected,
      handleToggleAllCheckBox,
      createRenderCheckBox,
      createRenderDate,
      createEditor,
      createEditorCost,
      createRenderCategory,
    ],
  );
};
