import PageHeader from "@/components/layout/Header/PageHeader";
import AIRecommendation from "@/app/(sidebar)/forecast/_components/ai-recommendation/AIRecommendation";
import AnnualDiseaseRisk from "@/app/(sidebar)/forecast/_components/annual-disease/AnnualDiseaseRisk";
import MedicalExpense from "@/app/(sidebar)/forecast/_components/medical-expense/MedicalExpense";
import { DISEASE_TAB_ORDER } from "@/app/(sidebar)/forecast/forecast.constants";

export default function Page() {
  return (
    <>
      <PageHeader title="의료비 AI 예측" />
      {/* AI 의사 권장사항 */}
      <AIRecommendation
        predictionDetails="피부 질환 가능성이 높으므로, 일상 피부 관리와 정기 관찰을 통해 초기 증상 단계에서
              진료를 받는 것이 비용 부담을 줄이는 데 효과적입니다."
        predictionAmount={70000000}
      />

      {/* 연간 질병 위험도 */}
      <AnnualDiseaseRisk diseaseList={DISEASE_TAB_ORDER} />

      {/* 올해 주의 질병과 평균 의료비 */}
      <MedicalExpense diseaseList={DISEASE_TAB_ORDER} />
    </>
  );
}

/**
 * 의료비 AI 예측 API
 * GET /api/group/medical/info?memberId={memeberId}
 * GET /api/group/medical/disease?memberId={memeberId} - 질병 코드 반환 (순위 순)
 * GET /api/group/medical/statics?memberId={memeberId}
 * GET /api/group/medical/disease/cost?memberId={memeberId}&disease={disease}
 */
