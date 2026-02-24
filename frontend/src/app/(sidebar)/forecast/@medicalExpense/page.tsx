import type { DiseaseCode } from "@/app/(sidebar)/forecast/_types";
import { getDiseaseCost, getDiseaseRanking } from "@/api/server/forecastApi";
import { DISEASE_TAB_ORDER } from "@/app/(sidebar)/forecast/_constants";
import MedicalExpense from "@/app/(sidebar)/forecast/_components/medical-expense";
import ServerComponentErrorFallback from "@/components/ui/ErrorBoundary/ServerComponentErrorFallback";
import { safeServerFetch } from "@/api/lib/client";

export default async function MedicalExpensePage({
  searchParams,
}: {
  searchParams: Promise<{ disease?: DiseaseCode; page?: number }>;
}) {
  const params = await searchParams;

  const diseaseListResult = await safeServerFetch(() => getDiseaseRanking());
  if (diseaseListResult instanceof Error) {
    return <ServerComponentErrorFallback message={diseaseListResult.message} />;
  }

  // 질병 목록 조회 (fetch 캐시로 중복 없음)
  const diseaseList = diseaseListResult;
  const resolvedDiseaseList = diseaseList.length > 0 ? diseaseList : DISEASE_TAB_ORDER;

  const selectedDisease = (params?.disease as DiseaseCode) ?? resolvedDiseaseList[0];
  const currentPage = Number(params?.page ?? 0);

  const costDataResult = await safeServerFetch(() => getDiseaseCost(selectedDisease));
  if (costDataResult instanceof Error) {
    return <ServerComponentErrorFallback message={costDataResult.message} />;
  }
  const costData = costDataResult;

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
