export * from "./disease";
export * from "./annualDiseaseRisk";
export * from "./medicalExpense";

export type ForecastErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};
