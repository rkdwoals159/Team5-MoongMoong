import type { DataTableColumn } from "@/components/ui/DataTable/dataTable.type";
import type { EditableExpenseRow, ExpenseData } from "@/app/(sidebar)/dashboard/_types";
import {
  DATE_PICKER_HEIGHT,
  DATE_PICKER_GAP,
} from "@/components/common/DatePicker/datePicker.constants";

/** Tab/Enter 네비게이션 순서 (useExpenseTableSelection) */
export const EDITABLE_ACCESSORS: (keyof EditableExpenseRow)[] = [
  "isSelected",
  "spentAt",
  "usage",
  "cost",
  "mainCategory",
  "memo",
];

/** 서버 동기화 필드 (isRowEqual 비교용) */
export const SYNC_FIELDS = [
  "spentAt",
  "usage",
  "cost",
  "mainCategory",
  "subCategory",
  "memo",
] as const;

/**
 * 소비내역 컬럼 메타데이터
 */
export const EXPENSE_COLUMNS: DataTableColumn<ExpenseData>[] = [
  { label: "날짜", accessor: "spentAt" },
  { label: "사용내역", accessor: "usage" },
  { label: "비용", accessor: "cost" },
  { label: "항목", accessor: "mainCategory" },
  { label: "메모", accessor: "memo" },
] as const;

/** EditableDataTable 기본 표시 행 수 */
export const EDITABLE_TABLE_MIN_ROWS = 1;

/** 기간별 소비내역 한 페이지 기본 조회 수 */
export const DEFAULT_PAGE_SIZE = 10;

/** CategoryPopup 높이 (팝업 위치 계산용) */
export const CATEGORY_POPUP_HEIGHT = 240;

/** CategoryPopup과 앵커 버튼 사이 간격 */
export const CATEGORY_POPUP_GAP = 4;

export { DATE_PICKER_HEIGHT, DATE_PICKER_GAP };

/** 비용 입력 최대 자릿수 */
export const COST_MAX_DIGITS = 8;

/** 텍스트 입력 최대 글자수 (사용내역, 메모) */
export const TEXT_MAX_LENGTH = 250;

/** useExpenseCellPopup variant별 accessor·높이·간격 */
export const CELL_POPUP_VARIANT_CONFIG = {
  category: {
    accessor: "mainCategory" as const,
    popupHeight: CATEGORY_POPUP_HEIGHT,
    popupGap: CATEGORY_POPUP_GAP,
  },
  date: {
    accessor: "spentAt" as const,
    popupHeight: DATE_PICKER_HEIGHT,
    popupGap: DATE_PICKER_GAP,
  },
} as const;
