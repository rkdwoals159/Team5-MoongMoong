import { getAIRecommendation } from "@/api/server/forecastApi";
import ServerComponentErrorFallback from "@/components/ui/ErrorBoundary/ServerComponentErrorFallback";
import { safeServerFetch } from "@/api/lib/client";

/**
 * AI 의사 권장사항 컴포넌트
 * @returns AI 의사 권장사항 컴포넌트
 */
export default async function AIRecommendationContent() {
  const recommendation = await safeServerFetch(() => getAIRecommendation());

  if (recommendation instanceof Error) {
    return <ServerComponentErrorFallback message={recommendation.message} />;
  }

  if (recommendation === null) {
    return (
      <div className={emptyStateClasses}>
        <p className={generatingMessageClasses}>AI 권장사항 생성중입니다..</p>
        <div className={spinnerClasses} />
      </div>
    );
  }

  if (!recommendation.advice && recommendation.expectedCost == null) {
    return (
      <div className={emptyStateClasses}>
        <p className={emptyMessageClasses}>아직 정보가 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      {recommendation.advice && (
        <div
          className={descriptionClasses}
          dangerouslySetInnerHTML={{ __html: recommendation.advice }}
        />
      )}
      {recommendation.expectedCost != null && recommendation.year != null && (
        <div className="mt-800 mb-500">
          <span className={highlightClasses}>
            {recommendation.year}년 예상 의료비 : {recommendation.expectedCost.toLocaleString()}원
          </span>
        </div>
      )}
    </>
  );
}

const descriptionClasses = "typo-body-l-medium text-text-base mt-200";
const highlightClasses =
  "typo-body-l-medium text-text-base bg-yellow-150 py-300 px-400 rounded-250";
const spinnerClasses =
  "w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin";
const emptyStateClasses = "flex flex-col items-center justify-center gap-300 mt-200 py-500";
const emptyMessageClasses = "typo-body-l-medium text-text-sub";
const generatingMessageClasses = "typo-body-l-medium text-text-sub animate-pulse";
