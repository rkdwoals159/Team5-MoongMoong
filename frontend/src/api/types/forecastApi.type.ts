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

export type DiseaseCodeResponse = NonNullable<
  components["schemas"]["PetDiseaseRankingResponse"]["diseases"]
>;

export type AnnualDiseases = NonNullable<components["schemas"]["GroupMedicalStatisticsResponse"]>;

export type TreatmentsResponse = NonNullable<
  components["schemas"]["TreatmentsResponse"]["treatments"]
>;

export type AIRecommendationResponse = NonNullable<
  components["schemas"]["GroupMedicalInfoResponse"]
>;
