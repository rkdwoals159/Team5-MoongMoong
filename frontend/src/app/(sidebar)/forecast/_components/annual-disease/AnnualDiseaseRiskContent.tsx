import { getDiseaseRanking, getDiseaseStatistics } from "@/api/server/forecastApi";
import AnnualDiseaseRiskClient from "./AnnualDiseaseRiskClient";
import ServerComponentErrorFallback from "@/components/ui/ErrorBoundary/ServerComponentErrorFallback";
import { safeServerFetch } from "@/api/lib/client";

export default async function AnnualDiseaseRiskContent() {
  const result = await safeServerFetch(() =>
    Promise.all([getDiseaseRanking(), getDiseaseStatistics()]),
  );

  if (result instanceof Error) return <ServerComponentErrorFallback message={result.message} />;

  const [diseaseList, statisticsData] = result;

  // 데이터가 없는 경우 (아직 정보가 모이지 않음)
  if (diseaseList.length === 0 || !statisticsData) {
    return (
      <div className={emptyStateClasses}>
        <p className={emptyMessageClasses}>아직 정보가 없습니다.</p>
      </div>
    );
  }

  return <AnnualDiseaseRiskClient diseaseList={diseaseList} statisticsData={statisticsData} />;
}

const emptyStateClasses = "flex items-center justify-center py-600";
const emptyMessageClasses = "typo-body-l-medium text-text-sub";
