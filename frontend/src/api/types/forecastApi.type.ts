import type { components } from "@schema";

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

export type GetDiseaseRankingResponse = NonNullable<
  components["schemas"]["PetDiseaseRankingResponse"]["diseases"]
>;

export type GetDiseaseStatisticsResponse = NonNullable<
  components["schemas"]["GroupMedicalStatisticsResponse"]
>;

export type GetDiseaseCostResponse = NonNullable<
  components["schemas"]["TreatmentsResponse"]["treatments"]
>;

export type GetAIRecommendationResponse = NonNullable<
  components["schemas"]["GroupMedicalInfoResponse"]
>;
