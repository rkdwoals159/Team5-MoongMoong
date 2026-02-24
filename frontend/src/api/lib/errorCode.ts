import { API_ERROR_MESSAGES } from "@/api/constants";
import { BACKEND_ERROR_CODE_MAP, BACKEND_ERROR_CODE_TO_API_ERROR_KEY } from "@/api/lib/constant";
import type { BackendErrorCode } from "@/api/lib/type";

// backend/src/main/java/com/moong/exception/errorcode/ErrorCode.java 기준
const isBackendErrorCode = (value: unknown): value is BackendErrorCode => {
  return typeof value === "string" && Object.hasOwn(BACKEND_ERROR_CODE_MAP, value);
};

export const getApiErrorMessageByBackendErrorCode = (code: unknown): string | undefined => {
  if (!isBackendErrorCode(code)) return undefined;
  const messageKey = BACKEND_ERROR_CODE_TO_API_ERROR_KEY[code];
  if (!messageKey) return undefined;
  return API_ERROR_MESSAGES[messageKey];
};
