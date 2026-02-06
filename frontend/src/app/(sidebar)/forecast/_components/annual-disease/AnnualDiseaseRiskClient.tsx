"use client";

import { AnnualDiseaseRiskProps } from "@/app/(sidebar)/forecast/_types/annualDiseaseRisk";
import { DiseaseCode } from "@/app/(sidebar)/forecast/_types/disease";
import AnnualDiseaseRiskSelect from "./AnnualDiseaseRiskSelect";
import AnnualDiseaseRiskChart from "./AnnualDiseaseRiskChart";
import { toRiskLineData } from "@/app/(sidebar)/forecast/_utils";
import { DEFAULT_SELECT_COUNT } from "@/app/(sidebar)/forecast/_constants";
import { useState } from "react";

const AnnualDiseaseRiskClient = ({ diseaseList, statisticsData }: AnnualDiseaseRiskProps) => {
  const [selectedDiseases, setSelectedDiseases] = useState<DiseaseCode[]>(
    diseaseList.slice(0, DEFAULT_SELECT_COUNT),
  );
  const unselectedDiseases = diseaseList.filter((code) => !selectedDiseases.includes(code));
  return (
    <>
      {/* 차트 */}
      <AnnualDiseaseRiskChart
        chartData={toRiskLineData(statisticsData)}
        selectedDiseases={selectedDiseases}
      />

      {/* 질병 선택 */}
      <AnnualDiseaseRiskSelect
        selectedDiseases={selectedDiseases}
        unselectedDiseases={unselectedDiseases}
        onReset={() => setSelectedDiseases(diseaseList.slice(0, DEFAULT_SELECT_COUNT))}
        onCancel={(code) => {
          setSelectedDiseases((prev) => prev.filter((item) => item !== code));
        }}
        onSelect={(code) => {
          setSelectedDiseases((prev) => [...prev, code]);
        }}
      />
    </>
  );
};

export default AnnualDiseaseRiskClient;
