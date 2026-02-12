import { components } from "@/types/schema";
import type { DiseaseCode } from "./disease";

export type MedicalExpenseProps = {
  diseaseList: DiseaseCode[];
  selectedDisease: DiseaseCode;
  costData: TreatmentsResponse;
  currentPage: number;
};

export type MedicalExpenseTabsProps = Pick<MedicalExpenseProps, "diseaseList" | "selectedDisease">;

export type MedicalExpenseHeaderProps = {
  subtitle?: string;
  title?: string;
};

export type TreatmentsResponse = NonNullable<
  components["schemas"]["TreatmentsResponse"]["treatments"]
>;

export type TreatmentResponse = NonNullable<components["schemas"]["TreatmentResponse"]>;

export type MedicalExpenseTreatmentsProps = {
  visibleTreatments: TreatmentsResponse;
  totalPages: number;
  selectedDisease: DiseaseCode;
  currentPage: number;
};
