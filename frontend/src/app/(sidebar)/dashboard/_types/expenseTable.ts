import type { DataTableColumn } from "@/components/ui/DataTable/dataTable.type";
import type { components } from "@schema";
import type { EditableExpenseRow, ExpenseData } from "./expense";
import type {
  MainCategoryFilter,
  ServerSortField,
  SortConfigV2,
} from "@/api/types/dashboardApi.type";

/**
 * useExpensesV2 파라미터 타입
 */
export type UseExpensesV2Params = {
  toSortParams: () => string[];
  mainCategoryFilter: MainCategoryFilter | null;
};

/**
 * useExpensesV2 반환 타입
 */
export type UseExpensesV2Return = {
  startDate: string;
  endDate: string;
  expenses: ExpenseData[];
  refetch: () => void;
  hasNext: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  resetKey: number;
};

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
  sortedRows: ExpenseData[];
  rowKey: (row: ExpenseData, rowIndex: number) => string | number;
  columns: DataTableColumn<ExpenseData>[];
  selectedCell: SelectedCell;
  showCategoryPopup: boolean;
  popupPosition: { top: number; left: number };
  handleCategorySelect: (mainCategory: string, subCategory?: string) => void;
  handleClosePopup: () => void;
  showDatePicker: boolean;
  datePickerPosition: { top: number; left: number };
  handleDateSelect: (dateKey: string) => void;
  handleCloseDatePicker: () => void;
  deleteSelectedRows: () => void;
  mergeSelectedRows: () => void;
  handleSave: () => Promise<void>;
  hasUnsavedChanges: boolean;
  selectedCount: number;
  totalExpense: number;
  onCellClick: (rowIndex: number, accessor: keyof ExpenseData) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
};

/**
 * useExpenseTableColumns 파라미터 타입
 */
export type UseExpenseTableColumnsParams = {
  displayInitialRows: ExpenseData[];
  updateCellByLocalId: UpdateCellByLocalId;
  updateAllCells: UpdateAllCells;
  selectedCount: number;
  onCategoryCellClick: (rowIndex: number) => void;
  onDateCellClick: (rowIndex: number) => void;
  onUsageChange?: (localId: string, usage: string) => void;
  mainCategoryFilter: MainCategoryFilter | null;
  onCategoryFilterChange: (category: MainCategoryFilter | null) => void;
};

/**
 * useExpenseRowSave 파라미터 타입
 */
export type UseExpenseRowSaveParams = {
  getPatchPayload: () => { payload: MemberExpensesUpsertRequest; invalidCount: number };
  hasUnsavedChanges: boolean;
  onSaveSuccess: () => void;
};

/**
 * EditableDataTable 컴포넌트 타입
 */
export type EditableDataTableProps = {
  initialData: ExpenseData[];
  startDate: string;
  endDate: string;
  className?: string;
  sortConfig: SortConfigV2;
  onSort: (field: ServerSortField) => void;
  onSaveSuccess: () => void;
  resetKey: number;
  hasNext: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  mainCategoryFilter: MainCategoryFilter | null;
  onCategoryFilterChange: (category: MainCategoryFilter | null) => void;
};

/**
 * EditableDataTable selectedCell 타입
 */
export type SelectedCell = { rowIndex: number; accessor: keyof ExpenseData } | null;

/**
 * useExpenseTableSelection 파라미터 타입
 */
export type UseExpenseTableSelectionParams = {
  rowCount: number;
  selectedCell: SelectedCell;
  setSelectedCell: React.Dispatch<React.SetStateAction<SelectedCell>>;
  openCategoryPopup?: (rowIndex: number) => void;
  closeCategoryPopup?: () => void;
  showCategoryPopup?: boolean;
  openDatePicker?: (rowIndex: number) => void;
  closeDatePicker?: () => void;
  showDatePicker?: boolean;
  sortedRows: ExpenseData[];
  updateCellByLocalId: UpdateCellByLocalId;
};

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
