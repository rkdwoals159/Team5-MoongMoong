import { isValidDateParam, resolveMonthRange } from "@/utils/date";

/**
 * URL searchParams에서 startDate, endDate 해석.
 * 없거나 유효하지 않으면 기본값(이번 달 시작일 ~ 마지막일) 반환.
 * 날짜 범위가 역전된 경우 자동으로 교정.
 */
export const resolveDashboardRange = (params: {
  startDate?: string | null;
  endDate?: string | null;
}) => {
  const defaults = resolveMonthRange();
  let startDate = isValidDateParam(params.startDate ?? undefined)
    ? params.startDate!
    : defaults.startDate;
  let endDate = isValidDateParam(params.endDate ?? undefined) ? params.endDate! : defaults.endDate;

  // 날짜 역전 방지: startDate > endDate인 경우 swap
  if (startDate > endDate) {
    [startDate, endDate] = [endDate, startDate];
  }

  return { startDate, endDate };
};
