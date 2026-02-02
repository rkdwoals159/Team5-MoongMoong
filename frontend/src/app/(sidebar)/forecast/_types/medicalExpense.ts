import type { DiseaseCode } from "./disease";

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

export type MedicalExpenseProps = {
  diseaseList: DiseaseCode[];
  selectedDisease: DiseaseCode;
  costData: DiseaseCostResponse;
  currentPage: number;
};

export type TreatmentCardProps = {
  treatment: Treatment;
};

export type MedicalExpenseHeaderProps = {
  subtitle?: string;
  title?: string;
};
