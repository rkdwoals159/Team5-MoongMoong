import type { ApiHttpError } from "@/lib/api/type";

export const isApiHttpError = (error: unknown): error is ApiHttpError => {
  return (
    error instanceof Error &&
    "status" in error &&
    typeof (error as { status?: unknown }).status === "number"
  );
};
