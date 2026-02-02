import client from "@/lib/api";
import { ONE_DAY } from "@/app/(sidebar)/forecast/_constants";

/**
 * AI 의사 권장사항 컴포넌트
 * @returns AI 의사 권장사항 컴포넌트
 */
const AIRecommendationContent = async () => {
  const { data, error } = await client.GET("/api/group/medical/info", {
    headers: {
      accept: "application/json;charset=UTF-8",
      Authorization: "1",
    },
    next: { revalidate: ONE_DAY },
  });

  if (error) {
    const errorMessage =
      (typeof error === "string" ? error : (error as Error)?.message) ?? "Unknown error";
    throw new Error(errorMessage);
  }

  return (
    <>
      <div className={descriptionClasses}>{data?.advice}</div>
      <div className="mt-500">
        <span className={highlightClasses}>
          {data?.year}년 예상 의료비 : {data?.expectedCost?.toLocaleString()}원
        </span>
      </div>
    </>
  );
};

export default AIRecommendationContent;

const descriptionClasses = "typo-body-l-medium text-text-base mt-200";
const highlightClasses =
  "typo-body-l-medium text-text-base bg-yellow-150 py-300 px-400 rounded-250";
