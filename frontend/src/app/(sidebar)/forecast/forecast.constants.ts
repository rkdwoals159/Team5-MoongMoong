import { DiseaseCode } from "./forecast.type";

export const DISEASE_TAB_ORDER: DiseaseCode[] = [
  "DER",
  "OCU",
  "HEM",
  "MUS",
  "NEU",
  "RES",
  "CAR",
  "URI",
  "REP",
  "END",
  "INF",
  "GAS",
];

export const DISEASE_CODE_SHORT_NAMES: Record<DiseaseCode, string> = {
  DER: "피부",
  OCU: "안과",
  HEM: "혈액",
  MUS: "근골격",
  NEU: "신경",
  RES: "호흡기",
  CAR: "심장",
  URI: "비뇨",
  REP: "생식",
  END: "내분비",
  INF: "감염",
  GAS: "소화기",
} as const;

export const TITLE_TEXT = "AI 의사 권장사항";
export const TOOLTIP_DESCRIPTION =
  "AI가 분석한 의료비 예측 결과와 권장사항입니다. 정기적인 건강 관리를 통해 예상 의료비를 줄일 수 있습니다.";
export const AI_RECOMMENDATION_DESCRIPTION =
  "반려견 데이터를 학습한 AI 모델이 반려견의 정보를 기반으로 향후 특정 질병 발생 확률을 추정합니다.";
