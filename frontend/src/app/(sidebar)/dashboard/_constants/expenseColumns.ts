import { DataTableColumn } from "@/components/ui/DataTable/DataTable.type";
import { ExpenseData } from "@/app/(sidebar)/dashboard/_types";

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

/** EditableDataTable 기본 표시 행 수 (데이터 부족 시 빈 행으로 채움) */
export const EDITABLE_TABLE_MIN_ROWS = 6;

/** CategoryPopup 높이 (팝업 위치 계산용) */
export const CATEGORY_POPUP_HEIGHT = 336;
