import SavingStatus from "@/app/(sidebar)/saving/_components/header/SavingStatus";
import SavingTargetChangeButton from "@/app/(sidebar)/saving/_components/header/SavingTargetChangeButton";
import { useSavingStatus } from "@/app/(sidebar)/saving/_hooks/useSavingStatus";
import { calcProgress } from "@/app/(sidebar)/saving/_utils";

export default function SavingInfo() {
  const { status } = useSavingStatus();
  const progress = calcProgress(status.current, status.target);

  return (
    <div>
      <div className="flex justify-between">
        <SavingStatus />
        <SavingTargetChangeButton />
      </div>

      {/* progress bar */}
      <div className="mt-400 w-full">
        <div
          className="h-5 w-full rounded-full bg-gray-200"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Number(progress.toFixed(0))}
        >
          <div
            className="h-full rounded-full bg-yellow-300 transition-[width] duration-500 ease-out"
            style={{ width: `${progress.toFixed(0)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
