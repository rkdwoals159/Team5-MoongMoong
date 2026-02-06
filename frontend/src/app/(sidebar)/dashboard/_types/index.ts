/**
 * 소비내역 데이터 타입
 */
export type ExpenseData = {
  selected?: boolean | null;
  expenseId: number;
  spentAt: string;
  usage: string;
  cost?: number | null;
  mainCategory?: string | null;
  subCategory?: string;
  memo: string;
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
};

/**
 * 총지출, 의료비 지출 데이터 타입
 */
export type ProgressData = {
  totalRatio?: number | null;
  medicalRatio?: number | null;
  petName?: string;
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
 * SummaryCard 컴포넌트 타입
 */
export type SummaryCardProps = {
  variant: "totalExpense" | "medicalExpense";
  data: number | null;
  petName?: string;
  className?: string;
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

/**
 * 소비내역 기간별 조회 응답 타입
 */
export type ExpensesByPeriodResponse = {
  total: number;
  expenses: ExpenseData[];
};

/**
 * 지난달 대비 비교 API 응답 타입
 * GET /api/expenses/compare/last-month
 */
export type LastMonthCompareResponse = {
  totalRatio: number;
  medicalRatio: number;
  petName: string;
  petImageUrl: string;
};

/**
 * Summary 섹션용 통합 데이터 (API 응답을 ProgressData + ImageData 형태로 변환한 값)
 */
export type SummaryData = {
  progressData: ProgressData;
  petImageUrl: string;
};

/**
 * PetProfileImage 컴포넌트 타입
 */
export type PetProfileImageProps = {
  petImageUrl: string;
};
