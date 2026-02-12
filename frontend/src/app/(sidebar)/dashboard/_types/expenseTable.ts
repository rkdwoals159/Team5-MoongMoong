import type { MouseEvent } from "react";
import type { DataTableColumn } from "@/components/ui/DataTable/DataTable.type";
import type { components } from "@schema";
import type { EditableExpenseRow, ExpenseData } from "./expense";

type MemberExpensesUpsertRequest = components["schemas"]["MemberExpensesUpsertRequest"];

/**
 * 셀 단위 업데이트 (localId로 행 식별)
 */
export type UpdateCellByLocalId = (
  localId: string,
  accessor: keyof EditableExpenseRow,
  value: string | boolean,
  subAccessor?: keyof EditableExpenseRow,
  subValue?: string,
) => void;

/**
 * 전체 행 동일 accessor 일괄 업데이트
 */
export type UpdateAllCells = (accessor: keyof EditableExpenseRow, value: string | boolean) => void;

/**
 * useExpenseTable 반환 타입
 */
export type UseExpenseTableReturn = {
  displayInitialRows: ExpenseData[];
  rowKey: (row: ExpenseData, rowIndex: number) => string | number;
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

/**
 * useExpenseTableColumns 파라미터 타입
 */
export type UseExpenseTableColumnsParams = {
  displayInitialRows: ExpenseData[];
  updateCellByLocalId: UpdateCellByLocalId;
  updateAllCells: UpdateAllCells;
  selectedCount: number;
  onCategoryCellClick: (
    event: MouseEvent<HTMLButtonElement>,
    rowIndex: number,
    accessor: keyof ExpenseData,
  ) => void;
};

/**
 * useExpenseRowSave 파라미터 타입
 */
export type UseExpenseRowSaveParams = {
  getPatchPayload: () => MemberExpensesUpsertRequest;
  mergeRowsFromServer: (newRows: ExpenseData[]) => void;
  hasUnsavedChanges: boolean;
};

/**
 * EditableDataTable 컴포넌트 타입
 */
export type EditableDataTableProps = {
  initialData: ExpenseData[];
  startDate: string;
  endDate: string;
  className?: string;
};

/**
 * EditableDataTable selectedCell 타입
 */
export type SelectedCell = { rowIndex: number; accessor: keyof ExpenseData } | null;

/**
 * ExpenseTableToolbar 컴포넌트 타입 (지출 테이블 하단 툴바)
 */
export type ExpenseTableToolbarProps = {
  totalExpense?: number;
  selectedCount?: number;
  hasUnsavedChanges?: boolean;
  onSave?: () => void;
  onDeleteSelected?: () => void;
  onMergeSelected?: () => void;
  className?: string;
};
