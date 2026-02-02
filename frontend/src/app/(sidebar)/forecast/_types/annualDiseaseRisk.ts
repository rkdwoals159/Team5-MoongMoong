import type { DiseaseCode } from "./disease";

export type AnnualDiseases = {
  startYear: number;
  statistics: Array<{
    disease: DiseaseCode;
    ratios: number[];
  }>;
};

export type RiskLineRow = { year: number } & Partial<Record<DiseaseCode, number>>; // Recharts용 row 타입: year + 질병코드별 number

export type AnnualDiseaseRiskProps = {
  diseaseList: DiseaseCode[];
  statisticsData: AnnualDiseases | null;
};
