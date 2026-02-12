import { useState, useMemo, useCallback } from "react";
import {
  AnnualDiseaseRiskProps,
  SelectedDisease,
} from "@/app/(sidebar)/forecast/_types/annualDiseaseRisk";
import { DiseaseCode } from "@/app/(sidebar)/forecast/_types/disease";
import {
  toRiskLineData,
  assignColors,
  getNextAvailableColor,
} from "@/app/(sidebar)/forecast/_utils";
import { DEFAULT_SELECT_COUNT } from "@/app/(sidebar)/forecast/_constants";

const useAnnualDiseaseRisk = ({ diseaseList, statisticsData }: AnnualDiseaseRiskProps) => {
  const [selectedDiseases, setSelectedDiseases] = useState<SelectedDisease[]>(() =>
    assignColors(diseaseList.slice(0, DEFAULT_SELECT_COUNT)),
  );

  const chartData = useMemo(() => toRiskLineData(statisticsData), [statisticsData]);

  const unselectedDiseases = useMemo(() => {
    const selectedSet = new Set(selectedDiseases.map((d) => d.code));
    return diseaseList.filter((code) => !selectedSet.has(code));
  }, [diseaseList, selectedDiseases]);

  const handleReset = useCallback(
    () => setSelectedDiseases(assignColors(diseaseList.slice(0, DEFAULT_SELECT_COUNT))),
    [diseaseList],
  );

  const handleCancel = useCallback(
    (code: DiseaseCode) => setSelectedDiseases((prev) => prev.filter((item) => item.code !== code)),
    [],
  );

  const handleSelect = useCallback(
    (code: DiseaseCode) =>
      setSelectedDiseases((prev) => [...prev, { code, color: getNextAvailableColor(prev) }]),
    [],
  );

  return {
    selectedDiseases,
    unselectedDiseases,
    chartData,
    handleReset,
    handleCancel,
    handleSelect,
  };
};

export default useAnnualDiseaseRisk;
