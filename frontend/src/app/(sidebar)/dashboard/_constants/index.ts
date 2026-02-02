import { DataTableColumn } from "@/components/ui/DataTable/DataTable.type";
import { ExpenseData } from "../_types";

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
export const EDITABLE_TABLE_MIN_ROWS = 10;

/** CategoryPopup 높이 (팝업 위치 계산용) */
export const CATEGORY_POPUP_HEIGHT = 336;

import { ChipMajorColor } from "@/components/common/Chip/Chip.type";

/**
 * 메인 카테고리 목록
 */
export const MAIN_CATEGORIES = [
  "미용",
  "의류",
  "장난감",
  "의료비",
  "영양제",
  "사료",
  "간식",
  "기타",
] as const;

/**
 * 서브 카테고리 매핑 (의료비만 서브카테고리 있음)
 */
export const SUB_CATEGORIES: Record<string, string[]> = {
  의료비: ["진료비", "예방접종", "약/처방", "검사비", "수술/입원", "기타 의료비"],
};

/**
 * 카테고리별 Chip 색상 매핑
 */
export const CATEGORY_COLOR_MAP: Record<string, ChipMajorColor> = {
  미용: "green",
  의류: "purple",
  장난감: "blue",
  의료비: "red",
  영양제: "turquoise",
  사료: "orange",
  간식: "yellow",
  기타: "gray",
};

export const DEFAULT_CATEGORY_COLOR = "gray";
