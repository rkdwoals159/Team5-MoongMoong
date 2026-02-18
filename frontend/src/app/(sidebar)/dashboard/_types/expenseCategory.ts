import type { ExpenseData } from "./expense";
import type { SelectedCell, UpdateCellByLocalId } from "./expenseTable";

/**
 * CategoryPopup 컴포넌트 타입
 */
export type CategoryPopupProps = {
  position: { top: number; left: number };
  onSelect: (mainCategory: string, subCategory?: string) => void;
  onClose: () => void;
  currentMainCategory?: string;
  currentSubCategory?: string;
};

/**
 * useExpenseCategoryUpdate 파라미터 타입
 */
export type UseExpenseCategoryUpdateParams = {
  selectedCell: SelectedCell;
  displayInitialRows: ExpenseData[];
  updateCellByLocalId: UpdateCellByLocalId;
};

/** 정렬 가능한 컬럼 (selected 제외) */
export type SortableExpenseAccessor = "spentAt" | "usage" | "cost" | "mainCategory" | "memo";

/**
 * useAutoCategorize 파라미터 타입
 */
export type UseAutoCategorizeParams = {
  updateCellByLocalId: UpdateCellByLocalId;
};
