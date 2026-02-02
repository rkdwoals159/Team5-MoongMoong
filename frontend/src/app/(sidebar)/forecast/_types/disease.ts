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

export type DiseaseLabel = {
  code: DiseaseCode;
  label: string;
};
