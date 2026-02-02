import InfoTooltip from "@/components/common/InfoTooltip/InfoTooltip";
import {
  AI_RECOMMENDATION_DESCRIPTION,
  DISEASE_TAB_ORDER,
} from "@/app/(sidebar)/forecast/_constants";
import AnnualDiseaseRiskClient from "./AnnualDiseaseRiskClient";
import { getDiseaseRanking, getDiseaseStatistics } from "../../_api";

/**
 * AnnualDiseaseRisk 컴포넌트
 * @returns AnnualDiseaseRisk 컴포넌트
 */
const AnnualDiseaseRisk = async () => {
  const [diseaseList, statisticsData] = await Promise.all([
    getDiseaseRanking(),
    getDiseaseStatistics(),
  ]);

  // API 실패 시 기존 상수 fallback
  const resolvedDiseaseList = diseaseList.length > 0 ? diseaseList : DISEASE_TAB_ORDER;

  return (
    <section>
      <div className={containerClasses}>
        {/* 헤더 */}
        <div className={headerClasses}>
          <div className={titleGroupClasses}>
            <div className={titleRowClasses}>
              <p className={subtitleClasses}>향후 7년간 위험도 상위 질병</p>
              <InfoTooltip description={AI_RECOMMENDATION_DESCRIPTION} iconSize={20} />
            </div>
            <h2 className={titleClasses}>연간 질병 위험도</h2>
          </div>
          <span className={unitClasses}>단위: %</span>
        </div>

        <AnnualDiseaseRiskClient
          diseaseList={resolvedDiseaseList}
          statisticsData={statisticsData}
        />
      </div>
    </section>
  );
};

export default AnnualDiseaseRisk;

const containerClasses = "flex flex-col rounded-500 border border-gray-100 bg-white-100 p-600";
const headerClasses = "flex items-start justify-between gap-500";
const titleGroupClasses = "flex flex-col gap-200";
const titleRowClasses = "flex items-center gap-300";
const subtitleClasses = "typo-body-l-medium text-text-sub";
const titleClasses = "typo-headline-l-bold text-text-base";
const unitClasses = "typo-body-s-medium text-text-sub";
