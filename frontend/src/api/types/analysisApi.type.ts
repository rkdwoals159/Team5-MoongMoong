import type { components } from "@schema";

export type GetAnalysisGroupExpensesItem = components["schemas"]["GroupExpenseResponse"];
export type GetCategoryAnalysisItem = components["schemas"]["CategoryCostResponse"];
export type GetMedicalAnalysisItem = components["schemas"]["MedicalAnalysisResponse"];

export type GetCategoryAnalysisResponse = {
  total: number;
  items: GetCategoryAnalysisItem[];
};

export type GetMedicalAnalysisResponse = {
  total: number;
  items: GetMedicalAnalysisItem[];
};

export type GetPetInfoResponse = components["schemas"]["PetReadResponse"];
