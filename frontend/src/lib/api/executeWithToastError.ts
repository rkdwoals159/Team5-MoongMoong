import { getErrorMessage } from "@/lib/api/errorMessage";
import type { ExecuteWithToastErrorOptions } from "@/lib/api/type";

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
