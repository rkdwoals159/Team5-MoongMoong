/**
 * 소비내역 데이터 타입
 */
export type ExpenseData = {
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
 * 카드 한 개 지표 데이터 (forecast, isMinus)
 */
export type ProgressStat = {
  forecast: number;
  isMinus: boolean;
};

/**
 * 총지출, 의료비 지출 데이터 타입
 */
export type ProgressData = {
  totalExpense?: ProgressStat | null;
  medicalExpense?: ProgressStat | null;
  petName?: string;
};

/**
 * Image 데이터 타입
 */
export type ImageData = {
  src: string;
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

/**
 * SummaryCardsWrapper 컴포넌트 타입
 */
export type SummaryCardsWrapperProps = {
  data: ProgressData;
};

/**
 * SummaryCard 컴포넌트 타입
 */
export type SummaryCardProps = {
  variant: "totalExpense" | "medicalExpense";
  data: ProgressStat | null;
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
  imageData: ImageData;
};
