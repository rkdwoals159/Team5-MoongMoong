/**
 * 질병 코드 탭 순서 (AI 예측 탭, 온보딩 등에서 공통 사용)
 */
export const DISEASE_TAB_ORDER = [
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
] as const;

export const DISEASE_CODE_SHORT_NAMES = {
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

export const DISEASE_CODE_FULL_NAMES = {
  DER: "피부과 질환",
  MUS: "근골격계 질환",
  NEU: "신경계 질환",
  OCU: "안과 질환",
  RES: "호흡기 질환",
  CAR: "심장/순환기 질환",
  HEM: "혈액 질환",
  GAS: "소화기 질환",
  URI: "비뇨기 질환",
  REP: "생식기 질환",
  END: "내분비 질환",
  INF: "감염성 질환",
} as const;

export const DISEASE_CODES = Object.keys(DISEASE_CODE_SHORT_NAMES) as Array<
  keyof typeof DISEASE_CODE_SHORT_NAMES
>;
