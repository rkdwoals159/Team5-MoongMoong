/**
 * 소비내역 데이터 타입
 */
export type ExpenseData = {
  expenseId: number;
  spentAt: string;
  usage: string;
  cost?: number | null;
  mainCategory?: string | null;
  subCategory?: string | null;
  memo: string | null;
  modifiedAt?: string;
};

/**
 * 소비내역 데이터 화면용 Row (UI에서만 필요한 필드 포함)
 */
export type EditableExpenseRow = ExpenseData & {
  localId: string;
  isNew: boolean;
  isDirty: boolean;
  isDeleted: boolean;
  isSelected: boolean;
};
