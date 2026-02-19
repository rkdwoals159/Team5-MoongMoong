import { getDiseaseRanking, getDiseaseStatistics } from "@/api/forecastApi";
import AnnualDiseaseRiskClient from "./AnnualDiseaseRiskClient";

export default async function AnnualDiseaseRiskContent() {
  const [diseaseList, statisticsData] = await Promise.all([
    getDiseaseRanking(),
    getDiseaseStatistics(),
  ]);

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
