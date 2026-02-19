import type { OnboardingProgressProps } from "@/app/onBoarding/_types";
import { cn } from "@/utils/style";

/**
 * 온보딩 진행률 바를 렌더링한다.
 */
export default function OnboardingProgress({ percent, className }: OnboardingProgressProps) {
  const width = `${Math.min(100, Math.max(0, percent))}%`;

  return (
    <div className={cn("h-[2px] w-full bg-gray-100", className ?? "")}>
      <div
        className="h-full bg-orange-500 transition-[width] duration-300 ease-out"
        style={{ width }}
      />
    </div>
  );
}
