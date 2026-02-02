import MedicalIcon from "@/assets/icons/forecast/medical_icon.svg";
import InfoTooltip from "@/components/common/InfoTooltip/InfoTooltip";
import { TITLE_TEXT, TOOLTIP_DESCRIPTION } from "@/app/(sidebar)/forecast/_constants";
import { Suspense } from "react";
import AIRecommendationContent from "./AIRecommendationContent";
import AIRecommendationSkeleton from "./AIRecommendationSkeleton";

/**
 * AIRecommendation 컴포넌트
 * @returns AIRecommendation 컴포넌트
 */
const AIRecommendation = () => {
  return (
    <section>
      <div className={containerClasses}>
        <MedicalIcon width={48} height={48} className={iconClasses} />
        <div className={contentClasses}>
          <div className={titleRowClasses}>
            <span className={titleClasses}>{TITLE_TEXT}</span>
            <InfoTooltip description={TOOLTIP_DESCRIPTION} iconSize={20} />
          </div>
          <Suspense fallback={<AIRecommendationSkeleton />}>
            <AIRecommendationContent />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default AIRecommendation;

const containerClasses = "flex gap-500 p-600 rounded-500 bg-yellow-100";
const iconClasses = "shrink-0";
const contentClasses = "flex flex-col flex-1";
const titleRowClasses = "flex items-center gap-300";
const titleClasses = "typo-title-m-bold text-text-base";
