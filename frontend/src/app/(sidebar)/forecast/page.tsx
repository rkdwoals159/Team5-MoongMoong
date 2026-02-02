import PageHeader from "@/components/layout/Header/PageHeader";
import AIRecommendation from "@/app/(sidebar)/forecast/_components/ai-recommendation";
import AnnualDiseaseRisk from "@/app/(sidebar)/forecast/_components/annual-disease";

export default function Page() {
  return (
    <>
      <PageHeader title="의료비 AI 예측" />

      {/* AI 의사 권장사항 */}
      <AIRecommendation />

      {/* 연간 질병 위험도 */}
      <AnnualDiseaseRisk />
    </>
  );
}
