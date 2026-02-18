import type { DiseaseCode } from "@/app/(sidebar)/forecast/_types";
import {
  FORECAST_DEFAULT_COLOR as SHARED_FORECAST_DEFAULT_COLOR,
  FORECAST_INDICATOR_PALETTE as SHARED_FORECAST_INDICATOR_PALETTE,
  DISEASE_TAB_ORDER as SHARED_DISEASE_TAB_ORDER,
  DISEASE_CODE_SHORT_NAMES as SHARED_DISEASE_CODE_SHORT_NAMES,
  DISEASE_CODE_FULL_NAMES as SHARED_DISEASE_CODE_FULL_NAMES,
} from "@/constants";

export const ONE_DAY = 60 * 60 * 24;
export const ONE_HOUR = 60 * 60;
export const ONE_MINUTE = 60;
export const ONE_SECOND = 1;

// TODO: 질병 매핑 DB 에 탑재하기
export const DISEASE_TAB_ORDER: DiseaseCode[] = [...SHARED_DISEASE_TAB_ORDER];

export const DISEASE_CODE_SHORT_NAMES: Record<DiseaseCode, string> =
  SHARED_DISEASE_CODE_SHORT_NAMES;

export const DISEASE_CODE_FULL_NAMES: Record<DiseaseCode, string> = SHARED_DISEASE_CODE_FULL_NAMES;

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
