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
 * ProgressSummarySection 컴포넌트 타입
 */
export type ProgressSummarySectionProps = {
  data: ProgressData;
  image: ImageData;
};

/**
 * ProgressCard 컴포넌트 타입
 */
export type ProgressCardProps = {
  variant: "totalExpense" | "medicalExpense";
  data: ProgressStat | null;
  petName?: string;
  className?: string;
};
