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
