import type { DiseaseCode } from "@/app/(sidebar)/forecast/_types";
import {
  FORECAST_DEFAULT_COLOR as SHARED_FORECAST_DEFAULT_COLOR,
  FORECAST_INDICATOR_PALETTE as SHARED_FORECAST_INDICATOR_PALETTE,
} from "@/constants/colorTables";
export const ONE_DAY = 60 * 60 * 24;
export const ONE_HOUR = 60 * 60;
export const ONE_MINUTE = 60;
export const ONE_SECOND = 1;

// TODO: 질병 매핑 DB 에 탑재하기
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

export const DISEASE_CODE_FULL_NAMES: Record<DiseaseCode, string> = {
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

export const TITLE_TEXT = "AI 의사 권장사항";
export const TOOLTIP_DESCRIPTION =
  "AI가 분석한 의료비 예측 결과와 권장사항입니다. 정기적인 건강 관리를 통해 예상 의료비를 줄일 수 있습니다.";
export const AI_RECOMMENDATION_DESCRIPTION =
  "반려견 데이터를 학습한 AI 모델이 반려견의 정보를 기반으로 향후 특정 질병 발생 확률을 추정합니다.";

export const DEFAULT_SELECT_COUNT = 3;

export const DEFAULT_COLOR = SHARED_FORECAST_DEFAULT_COLOR;
export const INDICATOR_PALETTE: string[] = [...SHARED_FORECAST_INDICATOR_PALETTE];
export const PAGE_SIZE = 3;

export const ANNUAL_DISEASE_SUBTITLE = "향후 7년간 위험도 상위 질병";
export const ANNUAL_DISEASE_TITLE = "연간 질병 위험도";
export const ANNUAL_DISEASE_UNIT = "단위: %";
