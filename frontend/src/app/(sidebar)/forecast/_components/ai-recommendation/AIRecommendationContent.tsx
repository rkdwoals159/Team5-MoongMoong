import { getAIRecommendation } from "@/api/forecastApi";
import ServerComponentErrorFallback from "@/components/ui/ErrorBoundary/ServerComponentErrorFallback";
import { safeServerFetch } from "@/lib/api";

/**
 * AI 의사 권장사항 컴포넌트
 * @returns AI 의사 권장사항 컴포넌트
 */
export default async function AIRecommendationContent() {
  const recommendation = await safeServerFetch(() => getAIRecommendation());

  if (recommendation instanceof Error) {
    return <ServerComponentErrorFallback message={recommendation.message} />;
  }

  // recommendation은 있지만 advice나 expectedCost가 없으면 정보 없음 메시지 표시
  if (!recommendation.advice && recommendation.expectedCost == null) {
    return (
      <div className={emptyStateClasses}>
        <p className={emptyMessageClasses}>아직 정보가 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      {recommendation.advice && <div className={descriptionClasses}>{recommendation.advice}</div>}
      {recommendation.expectedCost != null && recommendation.year != null && (
        <div className="mt-500">
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
const emptyStateClasses = "flex items-center justify-center mt-200";
const emptyMessageClasses = "typo-body-l-medium text-text-sub";
