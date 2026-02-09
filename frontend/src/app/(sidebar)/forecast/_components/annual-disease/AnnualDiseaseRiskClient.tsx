"use client";

import { AnnualDiseaseRiskProps } from "@/app/(sidebar)/forecast/_types/annualDiseaseRisk";
import AnnualDiseaseRiskSelect from "./AnnualDiseaseRiskSelect";
import AnnualDiseaseRiskChart from "./AnnualDiseaseRiskChart";
import useAnnualDiseaseRisk from "@/app/(sidebar)/forecast/_hooks/useAnnualDiseaseRisk";

const AnnualDiseaseRiskClient = (props: AnnualDiseaseRiskProps) => {
  const {
    selectedDiseases,
    unselectedDiseases,
    chartData,
    handleReset,
    handleCancel,
    handleSelect,
  } = useAnnualDiseaseRisk(props);

  return (
    <>
      <AnnualDiseaseRiskChart chartData={chartData} selectedDiseases={selectedDiseases} />
      <AnnualDiseaseRiskSelect
        selectedDiseases={selectedDiseases}
        unselectedDiseases={unselectedDiseases}
        onReset={handleReset}
        onCancel={handleCancel}
        onSelect={handleSelect}
      />
    </>
  );
};

export default AnnualDiseaseRiskClient;
