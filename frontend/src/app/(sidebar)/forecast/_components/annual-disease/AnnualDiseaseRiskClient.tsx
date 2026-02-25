"use client";

import type { AnnualDiseaseRiskProps } from "@/app/(sidebar)/forecast/_types/annualDiseaseRisk";
import AnnualDiseaseRiskSelect from "./AnnualDiseaseRiskSelect";
import AnnualDiseaseRiskChart from "./AnnualDiseaseRiskChart";
import ErrorBoundary from "@/components/ui/ErrorBoundary/ErrorBoundary";
import { useAnnualDiseaseRisk } from "@/app/(sidebar)/forecast/_hooks/useAnnualDiseaseRisk";
import { CLIENT_ERROR_MESSAGES } from "@/api/constants";

export default function AnnualDiseaseRiskClient(props: AnnualDiseaseRiskProps) {
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
      <ErrorBoundary message={CLIENT_ERROR_MESSAGES.CHART_ERROR}>
        <AnnualDiseaseRiskChart chartData={chartData} selectedDiseases={selectedDiseases} />
      </ErrorBoundary>
      <AnnualDiseaseRiskSelect
        selectedDiseases={selectedDiseases}
        unselectedDiseases={unselectedDiseases}
        onReset={handleReset}
        onCancel={handleCancel}
        onSelect={handleSelect}
      />
    </>
  );
}
