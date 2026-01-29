import { AnnualDiseases, DiseaseCode, RiskLineRow } from "@/app/(sidebar)/forecast/forecast.type";
import {
  DISEASE_CODE_ORDER,
  MOCK_DISEASE_KO_NAMES,
} from "@/app/(sidebar)/forecast/_components/annual-disease/mockAnnualDiseases";

export function toRiskLineData(input: AnnualDiseases): RiskLineRow[] {
  const { startYear, statistics } = input;

  // 기준 길이(모든 disease가 동일 길이라는 가정. 다르면 최소 길이로 맞춤)
  const len = statistics.length === 0 ? 0 : Math.min(...statistics.map((s) => s.ratios.length));

  const rows: RiskLineRow[] = Array.from({ length: len }, (_, i) => {
    const year = startYear + i;
    const row: RiskLineRow = { year };

    for (const s of statistics) {
      row[s.disease] = s.ratios[i];
    }
    return row;
  });

  return rows;
}

// 코드 -> 한글 질환명
export const DISEASE_KO_BY_CODE: Record<DiseaseCode, string> = Object.fromEntries(
  DISEASE_CODE_ORDER.map((code, idx) => [code, MOCK_DISEASE_KO_NAMES[idx]]),
) as Record<DiseaseCode, string>;

// 한글 질환명 -> 코드 (역매핑)
export const DISEASE_CODE_BY_KO: Record<string, DiseaseCode> = Object.fromEntries(
  MOCK_DISEASE_KO_NAMES.map((ko, idx) => [ko, DISEASE_CODE_ORDER[idx]]),
) as Record<string, DiseaseCode>;
