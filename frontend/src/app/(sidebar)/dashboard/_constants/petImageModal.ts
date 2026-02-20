export const IMAGE_SIZE = 210;
export const IMAGE_OVERLAY_TEXT = "강아지 이미지 변경";
export const SUCCESS_VIEW_TITLE = "강아지 이미지 변경";
export const SUCCESS_VIEW_DESCRIPTION =
  "가계부 대시보드 페이지에서 해당 강아지 사진을 볼 수 있어요.";
export const SUCCESS_VIEW_IMAGE_SIZE = 250;
export const SELECT_VIEW_TITLE = "강아지 이미지 변경";
export const SELECT_VIEW_DESCRIPTION = "가계부에서 우리 강아지를 더 자주 만나보세요.";
export const SELECT_VIEW_FILE_NAME_PLACEHOLDER = "강아지 이미지를 업로드해주세요.";
export const LOADING_VIEW_TITLE = "강아지 이미지를 불러오고 있어요";
export const LOADING_VIEW_DESCRIPTION = "잠시만 기다려주세요.";
export const ERROR_VIEW_TITLE = "이미지를 불러오지 못했어요";
export const ERROR_VIEW_DESCRIPTION = "다시 시도해주세요.";
export const ARIA_LABEL_BY_VIEW: Record<"select" | "loading" | "success" | "error", string> = {
  select: SELECT_VIEW_TITLE,
  loading: LOADING_VIEW_TITLE,
  success: SUCCESS_VIEW_TITLE,
  error: ERROR_VIEW_TITLE,
};
export const SAVE_DELAY_MS = 2500;
