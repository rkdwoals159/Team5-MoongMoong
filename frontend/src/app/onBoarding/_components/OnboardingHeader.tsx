import ArrowLeftIcon from "@/assets/icons/components/arrow-left-medium.svg";
import type { OnboardingHeaderProps } from "@/app/onBoarding/_types";
import { cn } from "@/utils/style";

/**
 * 온보딩 단계 제목과 뒤로가기 버튼을 렌더링한다.
 */
export default function OnboardingHeader({
  title,
  onBack,
  canGoBack = true,
  className,
}: OnboardingHeaderProps) {
  return (
    <div className={cn("flex items-center gap-[18px] relative", className ?? "")}>
      {canGoBack && (
        <button
          type="button"
          onClick={onBack}
          className={cn(
            "absolute -left-10 top-0 flex size-10 items-center justify-center rounded-200 transition-colors cursor-pointer",
            canGoBack ? "text-gray-400 hover:text-gray-600" : "text-gray-200",
          )}
          aria-label="이전 단계로 이동"
          disabled={!canGoBack}
        >
          <ArrowLeftIcon className="size-20" aria-hidden="true" />
        </button>
      )}
      <h2 className="typo-headline-l-bold text-text-base whitespace-pre-line">{title}</h2>
    </div>
  );
}
