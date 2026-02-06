import type { AnnualDiseases, DiseaseCode, RiskLineRow } from "@/app/(sidebar)/forecast/_types";

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
