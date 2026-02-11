import type { components } from "@/types/schema";
import type { DiseaseCode } from "./disease";

export type AnnualDiseases = NonNullable<components["schemas"]["GroupMedicalStatisticsResponse"]>;

export type RiskLineRow = { year: number } & Partial<Record<DiseaseCode, number>>; // Recharts용 row 타입: year + 질병코드별 number

export type AnnualDiseaseRiskProps = {
  diseaseList: DiseaseCode[];
  statisticsData: AnnualDiseases;
};

export type SelectedDisease = {
  code: DiseaseCode;
  color: string;
};

export type AnnualDiseaseRiskSelectProps = {
  selectedDiseases: SelectedDisease[];
  unselectedDiseases: DiseaseCode[];
  onReset: () => void;
  onCancel: (code: DiseaseCode) => void;
  onSelect: (code: DiseaseCode) => void;
};
