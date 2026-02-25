"use client";

import { useCallback, useMemo } from "react";
import type { DataTableColumn } from "@/components/ui/DataTable/dataTable.type";
import type {
  EditableExpenseRow,
  UseExpenseTableColumnsParams,
} from "@/app/(sidebar)/dashboard/_types";
import { formatAmountPlain } from "@/utils/amount";
import {
  CATEGORY_COLOR_MAP,
  DEFAULT_CATEGORY_COLOR,
  COST_MAX_DIGITS,
} from "@/app/(sidebar)/dashboard/_constants";
import DateInput from "@/app/(sidebar)/dashboard/_components/dashboard-table/DateInput";
import Chip from "@/components/common/Chip/Chip";
import CheckBox from "@/components/common/CheckBox/CheckBox";
import CategoryFilterHeader from "@/app/(sidebar)/dashboard/_components/dashboard-table/CategoryFilterHeader";

const ACCESSOR_LABEL_MAP: Partial<Record<keyof EditableExpenseRow, string>> = {
  usage: "사용내역",
  cost: "비용",
  memo: "메모",
};

/**
 * 지출 테이블 컬럼 정의 및 셀 렌더러/에디터 생성 훅
 */
export const useExpenseTableColumns = ({
  displayInitialRows,
  updateCellByLocalId,
  updateAllCells,
  selectedCount,
  onCategoryCellClick,
  onDateCellClick,
  onUsageChange,
  mainCategoryFilter,
  onCategoryFilterChange,
}: UseExpenseTableColumnsParams): DataTableColumn<EditableExpenseRow>[] => {
  const isAllSelected =
    selectedCount === displayInitialRows.length - 1 && displayInitialRows.length > 1;

  const createEditor = useCallback(
    (accessor: keyof EditableExpenseRow) => {
      const editor = (
        value: EditableExpenseRow[keyof EditableExpenseRow],
        _row: EditableExpenseRow,
      ) => {
        return (
          <input
            aria-label={ACCESSOR_LABEL_MAP[accessor] ?? String(accessor)}
            className="w-full bg-transparent outline-none px-500 py-200 truncate"
            value={String(value ?? "")}
            onChange={(e) => {
              const v = e.target.value;
              updateCellByLocalId(_row.localId, accessor, v);
              if (accessor === "usage") {
                onUsageChange?.(_row.localId, v);
              }
            }}
          />
        );
      };
      return editor;
    },
    [updateCellByLocalId, onUsageChange],
  );

  const createRenderCategory = useCallback(
    (
      value: EditableExpenseRow[keyof EditableExpenseRow],
      _row: EditableExpenseRow,
      rowIndex: number,
    ) => {
      const mainCategory = String(value ?? "");
      const subCategory = String(_row?.subCategory ?? "");
      const color = CATEGORY_COLOR_MAP[mainCategory] || DEFAULT_CATEGORY_COLOR;
      return (
        <button
          type="button"
          className="w-full h-full cursor-pointer px-500 py-200 flex items-center justify-start transition-colors gap-1 focus:outline-none focus-visible:outline-none"
          aria-label={mainCategory ? `${mainCategory} 카테고리 선택` : "카테고리 선택"}
          onClick={() => onCategoryCellClick(rowIndex)}
        >
          {mainCategory && <Chip label={mainCategory} level="major" color={color} />}
          {subCategory && <Chip label={subCategory} level="minor" color="none" />}
        </button>
      );
    },
    [onCategoryCellClick],
  );

  const createEditorCost = useCallback(
    (value: EditableExpenseRow[keyof EditableExpenseRow], _row: EditableExpenseRow) => {
      const num =
        typeof value === "number" ? value : value != null && value !== "" ? Number(value) : 0;
      const displayValue = num ? formatAmountPlain(num) : "";

      return (
        <input
          type="text"
          inputMode="numeric"
          aria-label="비용"
          className="w-full bg-transparent outline-none px-500 py-200"
          value={displayValue}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9]/g, "");
            if (raw.length > COST_MAX_DIGITS) return;
            const parsed = raw === "" ? 0 : Number(raw);
            updateCellByLocalId(_row.localId, "cost", String(parsed));
          }}
        />
      );
    },
    [updateCellByLocalId],
  );

  const createRenderDate = useCallback(
    (
      value: EditableExpenseRow[keyof EditableExpenseRow],
      _row: EditableExpenseRow,
      rowIndex: number,
    ) => {
      const dateValue = value ? String(value) : "";
      return (
        <DateInput
          value={dateValue}
          onOpen={() => onDateCellClick(rowIndex)}
          className="w-full h-full px-500 py-200"
          focusable
          ariaLabel="날짜 선택"
        />
      );
    },
    [onDateCellClick],
  );

  const createRenderCheckBox = useCallback(
    (_value: EditableExpenseRow[keyof EditableExpenseRow], _row: EditableExpenseRow) => {
      return (
        <CheckBox
          aria-label="행 선택"
          isChecked={_row.isSelected}
          onChange={() => updateCellByLocalId(_row.localId, "isSelected", !_row.isSelected)}
        />
      );
    },
    [updateCellByLocalId],
  );

  const handleToggleAllCheckBox = useCallback(() => {
    const nextValue = !isAllSelected;
    updateAllCells("isSelected", nextValue);
  }, [isAllSelected, updateAllCells]);

  return useMemo(
    () => [
      {
        label: (
          <CheckBox
            aria-label="전체 선택"
            isChecked={isAllSelected}
            onChange={handleToggleAllCheckBox}
          />
        ),
        accessor: "isSelected" as keyof EditableExpenseRow,
        render: createRenderCheckBox,
        width: "48px",
        sortable: false,
      },
      { label: "날짜", accessor: "spentAt", render: createRenderDate, sortable: true },
      { label: "사용내역", accessor: "usage", editor: createEditor("usage"), sortable: true },
      { label: "비용", accessor: "cost", editor: createEditorCost, sortable: true },
      {
        label: (
          <CategoryFilterHeader value={mainCategoryFilter} onChange={onCategoryFilterChange} />
        ),
        accessor: "mainCategory",
        render: createRenderCategory,
        sortable: false,
      },
      { label: "메모", accessor: "memo", editor: createEditor("memo"), sortable: false },
    ],
    [
      isAllSelected,
      handleToggleAllCheckBox,
      createRenderCheckBox,
      createRenderDate,
      createEditor,
      createEditorCost,
      createRenderCategory,
      mainCategoryFilter,
      onCategoryFilterChange,
    ],
  );
};
