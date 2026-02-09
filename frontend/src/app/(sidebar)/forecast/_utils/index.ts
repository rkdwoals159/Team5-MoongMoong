import type {
  AnnualDiseases,
  DiseaseCode,
  RiskLineRow,
  SelectedDisease,
} from "@/app/(sidebar)/forecast/_types";
import { INDICATOR_PALETTE, DEFAULT_COLOR } from "@/app/(sidebar)/forecast/_constants";

/**
 * 연도별 질병 발생 확률 데이터를 차트 형식에 맞게 변환
 * @param input 연도별 질병 발생 확률 데이터
 * @returns 차트 형식에 맞는 데이터
 */
export function toRiskLineData(input: AnnualDiseases): RiskLineRow[] {
  const { startYear = new Date().getFullYear(), statistics } = input;
  if (!statistics || statistics.length === 0) return [];
  // 기준 길이(모든 disease가 동일 길이라는 가정. 다르면 최소 길이로 맞춤)
  const len = Math.min(...statistics.map((s) => s.ratios?.length ?? 0));

  const rows: RiskLineRow[] = Array.from({ length: len }, (_, i) => {
    const year = startYear + i;
    const row: RiskLineRow = { year };

    for (const s of statistics) {
      if (!s.ratios) continue;
      row[s.disease as DiseaseCode] = s.ratios?.[i] ?? 0;
    }
    return row;
  });

  return rows;
}

/**
 * 질병 코드 배열에 색상을 할당
 * @param codes 질병 코드 배열
 * @returns 색상이 할당된 질병 객체 배열
 */
export const assignColors = (codes: DiseaseCode[]): SelectedDisease[] =>
  codes.map((code, i) => ({
    code,
    color: INDICATOR_PALETTE[i % INDICATOR_PALETTE.length] ?? DEFAULT_COLOR,
  }));

/**
 * 선택된 질병 목록에서 다음으로 사용 가능한 색상을 가져옴
 * @param selected 선택된 질병 목록
 * @returns 다음으로 사용 가능한 색상
 */
export const getNextAvailableColor = (selected: SelectedDisease[]): string => {
  const usedColors = new Set(selected.map((d) => d.color));
  return INDICATOR_PALETTE.find((c) => !usedColors.has(c)) ?? DEFAULT_COLOR;
};
