import { formatDateKey } from "@/utils/date";
import { isValidDateParam } from "@/utils/date";

/**
 * 월말 날짜 오버플로우를 방지하며 한 달 후 날짜를 계산
 * 예: 1월 31일 → 2월 28일/29일 (2월 말일)
 *     3월 31일 → 4월 30일 (4월 말일)
 */
const getOneMonthLater = (date: Date): Date => {
  const targetMonth = date.getMonth() + 1;
  const targetYear = date.getFullYear() + Math.floor(targetMonth / 12);
  const normalizedMonth = targetMonth % 12;

  // 다음 달의 마지막 날을 구함 (0일 = 이전 달 마지막 날)
  const lastDayOfTargetMonth = new Date(targetYear, normalizedMonth + 1, 0).getDate();

  // 현재 날짜와 다음 달 마지막 날 중 작은 값 선택
  const targetDate = Math.min(date.getDate(), lastDayOfTargetMonth);

  return new Date(targetYear, normalizedMonth, targetDate);
};

const getDefaultRange = () => {
  const now = new Date();
  const oneMonthLater = getOneMonthLater(now);
  return {
    startDate: formatDateKey(now),
    endDate: formatDateKey(oneMonthLater),
  };
};

/**
 * URL searchParams에서 startDate, endDate 해석.
 * 없거나 유효하지 않으면 기본값(오늘 ~ 한 달 후) 반환.
 * 날짜 범위가 역전된 경우 자동으로 교정.
 */
export const resolveDashboardRange = (params: {
  startDate?: string | null;
  endDate?: string | null;
}) => {
  const defaults = getDefaultRange();
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
