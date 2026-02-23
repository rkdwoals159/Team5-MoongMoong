import { Suspense } from "react";
import InfoTooltip from "@/components/common/InfoTooltip/InfoTooltip";
import {
  AI_RECOMMENDATION_DESCRIPTION,
  ANNUAL_DISEASE_SUBTITLE,
  ANNUAL_DISEASE_TITLE,
  ANNUAL_DISEASE_UNIT,
} from "@/app/(sidebar)/forecast/_constants";
import AnnualDiseaseRiskContent from "./AnnualDiseaseRiskContent";
import AnnualDiseaseRiskSkeleton from "./AnnualDiseaseRiskSkeleton";

/**
 * AnnualDiseaseRisk 컴포넌트
 * @returns AnnualDiseaseRisk 컴포넌트
 */
export default function AnnualDiseaseRisk() {
  return (
    <section>
      <div className={containerClasses}>
        {/* 헤더 */}
        <div className={headerClasses}>
          <div className={titleGroupClasses}>
            <div className={titleRowClasses}>
              <p className={subtitleClasses}>{ANNUAL_DISEASE_SUBTITLE}</p>
              <InfoTooltip description={AI_RECOMMENDATION_DESCRIPTION} iconSize={20} />
            </div>
            <h2 className={titleClasses}>{ANNUAL_DISEASE_TITLE}</h2>
          </div>
          <span className={unitClasses}>{ANNUAL_DISEASE_UNIT}</span>
        </div>

        <Suspense fallback={<AnnualDiseaseRiskSkeleton />}>
          <AnnualDiseaseRiskContent />
        </Suspense>
      </div>
    </section>
  );
}

const containerClasses = "flex flex-col rounded-500 border border-gray-100 bg-white-100 p-600";
const headerClasses = "flex items-start justify-between gap-500";
const titleGroupClasses = "flex flex-col gap-200";
const titleRowClasses = "flex items-center gap-300";
const subtitleClasses = "typo-body-l-medium text-text-sub";
const titleClasses = "typo-headline-l-bold text-text-base";
const unitClasses = "typo-body-s-medium text-text-sub";
