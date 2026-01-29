/**
 * 소비내역 데이터 타입
 */
export type ExpenseData = {
  expenseId: number;
  spentAt: string;
  usage: string;
  cost: number;
  mainCategory: string;
  subCategory?: string;
  memo: string;
  modifiedAt?: string;
};

/**
 * EditableDataTable 컴포넌트 타입
 */
export type EditableDataTableProps = {
  initialData: ExpenseData[];
  className?: string;
};

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
