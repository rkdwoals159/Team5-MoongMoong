import type { DataTableColumn } from "@/components/ui/DataTable/dataTable.type";
import type { ExpenseData } from "@/app/(sidebar)/dashboard/_types";
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

/** CategoryPopup 높이 (팝업 위치 계산용) */
export const CATEGORY_POPUP_HEIGHT = 336;

/** CategoryPopup과 앵커 버튼 사이 간격 */
export const CATEGORY_POPUP_GAP = 4;
