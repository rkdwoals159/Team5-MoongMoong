import { API_ERROR_MESSAGES } from "@/api/constants";
import { getApiErrorMessageByBackendErrorCode } from "@/api/lib/errorCode";
import { STATUS_ERROR_MESSAGE_MAP, RESPONSE_PATH_ERROR_MESSAGE_MAP } from "@/api/lib/constant";
import type { ApiHttpError, ErrorResponse } from "@/api/lib/type";

export const toApiHttpError = async (
  response: Response,
  fallbackMessage: string = API_ERROR_MESSAGES.DEFAULT,
): Promise<ApiHttpError> => {
  const responseBody = await parseResponseBody(response);
  const status = response.status;
  const code = extractErrorCode(responseBody);
  const message = resolveApiErrorMessage(response.url, status, code, fallbackMessage);

  const error = new Error(message) as ApiHttpError;
  error.name = "ApiHttpError";
  error.status = status;
  error.response = response;
  error.code = code;
  error.body = responseBody;

  return error;
};

//------------------------내장함수----------------------------
const resolveApiErrorMessage = (
  url: string,
  status: number,
  code: string | undefined,
  fallbackMessage: string,
): string => {
  return (
    getApiErrorMessageByBackendErrorCode(code) ??
    getMessageByResponsePath(url) ??
    STATUS_ERROR_MESSAGE_MAP[status] ??
    fallbackMessage
  );
};

const getMessageByResponsePath = (url: string): string | undefined => {
  let pathname = "";
  try {
    pathname = new URL(url).pathname;
  } catch {
    return undefined;
  }

  return RESPONSE_PATH_ERROR_MESSAGE_MAP[pathname];
};

const isObjectRecord = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === "object";
};

const getCodeFromErrorResponse = (value: unknown): string | undefined => {
  if (!isObjectRecord(value)) return undefined;
  const payload = value as ErrorResponse;
  if (typeof payload.code === "string" && payload.code.length > 0) {
    return payload.code;
  }
  if (typeof payload.errorCode === "string" && payload.errorCode.length > 0) {
    return payload.errorCode;
  }
  return undefined;
};

const extractErrorCode = (body: unknown): string | undefined => {
  const directCode = getCodeFromErrorResponse(body);
  if (directCode) return directCode;

  if (!isObjectRecord(body)) return undefined;
  const nestedError = (body as ErrorResponse).error;
  return getCodeFromErrorResponse(nestedError);
};

const parseResponseBody = async (response: Response): Promise<unknown> => {
  const text = await response.clone().text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};
