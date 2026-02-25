import type { ToastOptions } from "@/components/ui/Toast/toast.type";
import type { BACKEND_ERROR_CODE_MAP } from "@/api/constants/errorCodeMap";

export type ErrorResponse = {
  code?: unknown;
  errorCode?: unknown;
  error?: unknown;
  message?: unknown;
};

export type ApiHttpError = Error & {
  status: number;
  response: Response;
  code?: string;
  body?: unknown;
};

export type ApiErrorMessageKey = keyof (typeof import("@/api/constants"))["API_ERROR_MESSAGES"];
export type BackendErrorCode = keyof typeof BACKEND_ERROR_CODE_MAP;
export type ToastFn = (options: ToastOptions) => string;

export type ExecuteWithToastErrorOptions<T> = {
  showToast: ToastFn;
  onSuccess?: (result: T) => void;
  fallbackMessage?: string;
};
