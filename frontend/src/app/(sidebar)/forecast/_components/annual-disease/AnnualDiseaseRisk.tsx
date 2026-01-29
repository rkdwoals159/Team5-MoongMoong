"use client";

import { useState } from "react";
import InfoTooltip from "@/components/common/InfoTooltip/InfoTooltip";
import AnnualDiseaseRiskChart from "./AnnualDiseaseRiskChart";
import AnnualDiseaseRiskSelect from "./AnnualDiseaseRiskSelect";
import { DISEASE_KO_BY_CODE, toRiskLineData } from "@/app/(sidebar)/forecast/forecast-util";
import { MOCK_ANNUAL_DISEASES } from "@/app/(sidebar)/forecast/_components/annual-disease/mockAnnualDiseases";
import { AnnualDiseaseRiskProps } from "@/app/(sidebar)/forecast/forecast.type";
import { AI_RECOMMENDATION_DESCRIPTION } from "@/app/(sidebar)/forecast/forecast.constants";

const DEFAULT_SELECTED_DISEASES = 3;

/**
 * AnnualDiseaseRisk 컴포넌트
 * @param diseaseList - 질병 코드 리스트 (순위 순)
 * @returns AnnualDiseaseRisk 컴포넌트
 */
const AnnualDiseaseRisk = ({ diseaseList }: AnnualDiseaseRiskProps) => {
  const DISEASE_KO_NAMES = diseaseList.map((code) => DISEASE_KO_BY_CODE[code] as string);
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>(
    DISEASE_KO_NAMES.slice(0, DEFAULT_SELECTED_DISEASES),
  );
  const unselectedDiseases = DISEASE_KO_NAMES.filter(
    (disease) => !selectedDiseases.includes(disease),
  );

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

        {/* 차트 */}
        <AnnualDiseaseRiskChart
          chartData={toRiskLineData(MOCK_ANNUAL_DISEASES)}
          selectedDiseases={selectedDiseases}
        />

        {/* 질병 선택 */}
        <AnnualDiseaseRiskSelect
          selectedDiseases={selectedDiseases}
          unselectedDiseases={unselectedDiseases}
          onReset={() => setSelectedDiseases(DISEASE_KO_NAMES.slice(0, DEFAULT_SELECTED_DISEASES))}
          onCancel={(label) => {
            setSelectedDiseases((prev) => prev.filter((item) => item !== label));
          }}
          onSelect={(label) => {
            setSelectedDiseases((prev) => [...prev, label]);
          }}
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
