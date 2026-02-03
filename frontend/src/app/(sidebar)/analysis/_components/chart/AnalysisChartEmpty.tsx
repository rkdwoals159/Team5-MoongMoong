import WarningIcon from "@/assets/icons/analysis/ic_warning.svg";
import { AnalysisChartEmptyProps } from "@/app/(sidebar)/analysis/_types/componentPropsType.type";

export default function AnalysisChartEmpty({
  message = "차트 데이터가 없습니다.",
}: AnalysisChartEmptyProps) {
  return (
    <div className="flex h-[330px] flex-col items-center justify-center gap-200">
      <WarningIcon className="h-[60px] w-[60px] text-text-sub" />
      <p className="typo-body-m-medium text-text-sub">{message}</p>
    </div>
  );
}
