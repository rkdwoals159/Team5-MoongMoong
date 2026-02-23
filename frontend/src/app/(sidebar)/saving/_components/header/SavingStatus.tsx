import { useSavingStatus } from "@/app/(sidebar)/saving/_hooks/useSavingStatus";
import { calcProgress } from "@/app/(sidebar)/saving/_utils";

export default function SavingStatus() {
  const { status } = useSavingStatus();
  const progress = calcProgress(status.current, status.target);

  return (
    <div>
      <h2 className="typo-title-s-bold text-gray-500">우리 가족 목표 금액</h2>
      <div className="flex gap-3.5 items-center">
        <div className="flex gap-350 typo-headline-l-bold text-gray-300">
          <span className="text-gray-800">{status.current?.toLocaleString() ?? 0}원</span>
          <span>/</span>
          <span>{status.target.toLocaleString()}원</span>
        </div>
        <div className="py-250 px-400 bg-gray-700 rounded-250">
          <span className="typo-body-l-bold text-white-100">{progress.toFixed(2)}% 달성</span>
        </div>
      </div>
    </div>
  );
}
