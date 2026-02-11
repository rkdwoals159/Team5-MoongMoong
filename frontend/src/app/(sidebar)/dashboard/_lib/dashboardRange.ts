import { formatDateKey } from "@/utils/date";
import { isValidDateParam } from "@/utils/date";

const getDefaultRange = () => {
  const now = new Date();
  const oneMonthLater = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return {
    startDate: formatDateKey(now),
    endDate: formatDateKey(oneMonthLater),
  };
};

/**
 * URL searchParams에서 startDate, endDate 해석.
 * 없거나 유효하지 않으면 기본값(오늘 ~ 한 달 후) 반환.
 */
export function resolveDashboardRange(params: {
  startDate?: string | null;
  endDate?: string | null;
}) {
  const defaults = getDefaultRange();
  const startDate = isValidDateParam(params.startDate ?? undefined)
    ? params.startDate!
    : defaults.startDate;
  const endDate = isValidDateParam(params.endDate ?? undefined)
    ? params.endDate!
    : defaults.endDate;
  return { startDate, endDate };
}
