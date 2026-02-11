import type { components } from "@schema";

export type GroupExpenseResponse = components["schemas"]["GroupExpenseResponse"];
export type CategoryCostResponse = components["schemas"]["CategoryCostResponse"];
export type MedicalAnalysisResponse = components["schemas"]["MedicalAnalysisResponse"];

export type CategoryAnalysisResult = {
  total: number;
  items: CategoryCostResponse[];
};

export type MedicalAnalysisResult = {
  total: number;
  items: MedicalAnalysisResponse[];
};

export type PetReadResponse = components["schemas"]["PetReadResponse"];
