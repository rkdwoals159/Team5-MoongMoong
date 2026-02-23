import type { components } from "@/types/schema";

export type SafeServerResult<T> = T | Error;

export type AnalysisChartEmptyProps = {
  message?: string;
};

export type AnalysisErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export type AnalysisHeaderProps = {
  startDate: string;
  endDate: string;
};

export type AnalysisTableSectionProps = {
  petInfoPromise: Promise<SafeServerResult<components["schemas"]["PetReadResponse"] | null>>;
  expensesPromise: Promise<SafeServerResult<components["schemas"]["GroupExpenseResponse"][]>>;
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
  categoryPromise: Promise<
    SafeServerResult<{
      total: number;
      items: components["schemas"]["CategoryCostResponse"][];
    }>
  >;
};
export type MedicalAnalysisChartCardProps = {
  petInfoPromise: Promise<SafeServerResult<components["schemas"]["PetReadResponse"] | null>>;
  medicalPromise: Promise<
    SafeServerResult<{
      total: number;
      items: components["schemas"]["MedicalAnalysisResponse"][];
    }>
  >;
};

export type MedicalAnalysisChartProps = {
  data: components["schemas"]["MedicalAnalysisResponse"][];
};
export type CategoryAnalysisChartProps = {
  data: components["schemas"]["CategoryCostResponse"][];
};
