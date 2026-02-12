import type { components } from "@/types/schema";
export type PieChartLabelLayoutParams = {
  cx: number;
  cy: number;
  midAngle?: number;
  outerRadius?: number | string;
  percent?: number;
  payload?:
    | components["schemas"]["CategoryCostResponse"]
    | components["schemas"]["MedicalAnalysisResponse"];
};

export type ChartPayloadType =
  | components["schemas"]["CategoryCostResponse"]
  | components["schemas"]["MedicalAnalysisResponse"];
