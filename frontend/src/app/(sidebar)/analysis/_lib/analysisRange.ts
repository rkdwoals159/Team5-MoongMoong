import { isValidDateParam, resolveMonthRange } from "@/utils/date";
import type { AnalysisSearchParams } from "@/app/(sidebar)/analysis/_types/componentPropsType.type";

const resolveDate = (value?: string) => (isValidDateParam(value) ? value : undefined);

//조회 기간 파라미터 검증 및 변환
export function resolveAnalysisRange(params: AnalysisSearchParams) {
  const fromParam = resolveDate(params.startDate);
  const toParam = resolveDate(params.endDate);
  const { startDate: monthStart, endDate: monthEnd } = resolveMonthRange();
  const startDate = fromParam ?? monthStart;
  const endDate = toParam ?? monthEnd;

  return { startDate, endDate };
}
