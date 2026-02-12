import { components } from "@/types/schema";

export type AnalysisChartEmptyProps = {
  message?: string;
};

export type AnalysisHeaderProps = {
  startDate: string;
  endDate: string;
};

export type AnalysisTableSectionProps = {
  petInfoPromise: Promise<components["schemas"]["PetReadResponse"] | null>;
  expensesPromise: Promise<components["schemas"]["GroupExpenseResponse"][]>;
};

export type AnalysisSearchParams = {
  startDate?: string;
  endDate?: string;
  month?: string;
};

export type AnalysisPageProps = {
  searchParams?: Promise<AnalysisSearchParams>;
};

export type CategoryAnalysisChartCardProps = {
  categoryPromise: Promise<{
    total: number;
    items: components["schemas"]["CategoryCostResponse"][];
  }>;
};
export type MedicalAnalysisChartCardProps = {
  petInfoPromise: Promise<components["schemas"]["PetReadResponse"] | null>;
  medicalPromise: Promise<{
    total: number;
    items: components["schemas"]["MedicalAnalysisResponse"][];
  }>;
};

export type MedicalAnalysisChartProps = {
  data: components["schemas"]["MedicalAnalysisResponse"][];
};
export type CategoryAnalysisChartProps = {
  data: components["schemas"]["CategoryCostResponse"][];
};
