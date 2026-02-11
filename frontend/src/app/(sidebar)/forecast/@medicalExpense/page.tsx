import type { DiseaseCode } from "@/app/(sidebar)/forecast/_types";
import { getDiseaseCost, getDiseaseRanking } from "@/api/forecastApi";
import { DISEASE_TAB_ORDER } from "@/app/(sidebar)/forecast/_constants";
import MedicalExpense from "@/app/(sidebar)/forecast/_components/medical-expense";

export default async function MedicalExpensePage({
  searchParams,
}: {
  searchParams: Promise<{ disease?: DiseaseCode; page?: number }>;
}) {
  const params = await searchParams;

  // 질병 목록 조회 (fetch 캐시로 중복 없음)
  const diseaseList = await getDiseaseRanking();
  const resolvedDiseaseList = diseaseList.length > 0 ? diseaseList : DISEASE_TAB_ORDER;

  const selectedDisease = (params?.disease as DiseaseCode) ?? resolvedDiseaseList[0];
  const currentPage = Number(params?.page ?? 0);
  const costData = await getDiseaseCost(selectedDisease);

  return (
    <MedicalExpense
      key={selectedDisease}
      diseaseList={resolvedDiseaseList}
      selectedDisease={selectedDisease}
      costData={costData}
      currentPage={currentPage}
    />
  );
}
