export type DiseaseCode =
  | "DER"
  | "MUS"
  | "NEU"
  | "OCU"
  | "RES"
  | "CAR"
  | "HEM"
  | "GAS"
  | "URI"
  | "REP"
  | "END"
  | "INF";

export type AnnualDiseases = {
  startYear: number;
  statistics: Array<{
    disease: DiseaseCode;
    ratios: number[];
  }>;
};

export type RiskLineRow = { year: number } & Partial<Record<DiseaseCode, number>>; // Recharts용 row 타입: year + 질병코드별 number

export type AIRecommendationProps = {
  predictionDetails: string;
  predictionAmount: number;
};

export type AnnualDiseaseRiskProps = {
  diseaseList: DiseaseCode[];
};

export type Treatment = {
  name: string;
  description: string;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
};

export type DiseaseCostResponse = {
  treatments: Treatment[];
};

export type DiseaseLabel = {
  code: DiseaseCode;
  label: string;
};

export type MedicalExpenseProps = {
  memberId?: string;
  diseaseList: DiseaseCode[];
};

export type TreatmentCardProps = {
  treatment: Treatment;
};

export type MedicalExpenseHeaderProps = {
  subtitle?: string;
  title?: string;
};
