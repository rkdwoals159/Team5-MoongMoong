import WarningIcon from "@/assets/icons/analysis/ic_warning.svg";

export default function AnalysisTableEmpty() {
  return (
    <div className="flex flex-col items-center gap-200">
      <WarningIcon className="h-[60px] w-[60px] text-text-sub" />
      <p className="typo-body-m-medium text-text-sub">지출 데이터가 아직 없어요</p>
    </div>
  );
}
