import { API_ERROR_MESSAGES } from "@/api/constants";

export const getErrorMessage = (
  error: unknown,
  fallbackMessage: string = API_ERROR_MESSAGES.DEFAULT,
): string => {
  return error instanceof Error ? error.message : fallbackMessage;
};
