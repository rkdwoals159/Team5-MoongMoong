import { getErrorMessage } from "@/api/lib/errorMessage";
import type { ExecuteWithToastErrorOptions } from "@/api/lib/type";

export const executeWithToastError = async <T>(
  task: () => Promise<T>,
  options: ExecuteWithToastErrorOptions<T>,
): Promise<T | undefined> => {
  try {
    const result = await task();
    options.onSuccess?.(result);
    return result;
  } catch (error) {
    options.showToast({
      variant: "error",
      message: getErrorMessage(error, options.fallbackMessage),
    });
    return undefined;
  }
};
