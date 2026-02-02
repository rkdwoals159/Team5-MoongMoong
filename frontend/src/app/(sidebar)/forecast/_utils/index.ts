import type { AnnualDiseases, RiskLineRow } from "@/app/(sidebar)/forecast/_types";

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
