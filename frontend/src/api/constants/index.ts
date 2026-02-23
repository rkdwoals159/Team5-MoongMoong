export const API_ERROR_MESSAGES = {
  DEFAULT: "요청 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.",
  EXPENSES: "소비 내역을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
  LAST_MONTH_COMPARISON: "지난달 비교 데이터를 불러오지 못했어요.",
  GROUP_EXPENSES: "그룹 소비 내역을 불러오지 못했어요.",
  GROUP_DAILY_EXPENSES: "일자별 그룹 소비 내역을 불러오지 못했어요.",
  CATEGORY_ANALYSIS: "카테고리 분석 데이터를 불러오지 못했어요.",
  MEDICAL_ANALYSIS: "의료비 분석 데이터를 불러오지 못했어요.",
  PET_INFO: "반려동물 정보를 불러오지 못했어요.",
  AI_RECOMMENDATION: "AI 의사 권장사항을 불러오는데 실패했습니다.",
  DISEASE_RANKING: "질병 목록을 불러오는데 실패했습니다.",
  DISEASE_STATISTICS: "질병 통계를 불러오는데 실패했습니다.",
  DISEASE_COST: "의료비 데이터를 불러오는데 실패했습니다.",
  BANK_INFO: "저금통 정보를 불러오는데 실패했습니다.",
  BANK_CREATE: "저금통 생성에 실패했습니다.",
  BANK_UPDATE_TARGET: "목표 금액 수정에 실패했습니다.",
  BANK_BREAK: "저금통 깨기에 실패했습니다.",
  PAYMENT_REQUEST: "결제 요청에 실패했습니다.",
  PAYMENT_CONFIRM: "결제 확인에 실패했습니다.",
  PAYMENT_FAIL: "결제 처리에 실패했습니다.",
} as const;

export const API_VALIDATION_MESSAGES = {
  INVALID_TARGET_AMOUNT: "유효하지 않은 목표 금액입니다.",
  INVALID_AMOUNT: "유효하지 않은 금액입니다.",
} as const;

export const EXPENSES_ERROR_MESSAGE = API_ERROR_MESSAGES.EXPENSES;
export const EXPENSES_SAVE_ERROR_MESSAGE =
  "소비 내역을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.";

export const CATEGORIZE_ERROR_MESSAGE =
  "자동 카테고리 분류에 실패했어요. 잠시 후 다시 시도해 주세요.";
export const EXPENSES_CATEGORIZE_ERROR_MESSAGE = CATEGORIZE_ERROR_MESSAGE;

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;
export const VERCEL_BLOB_HOST = "blob.vercel-storage.com";
export const DEFAULT_IMAGE_PATH_PREFIX = "img_dog_default";
