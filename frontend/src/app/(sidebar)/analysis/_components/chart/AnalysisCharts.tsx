import InfoTooltip from "@/components/common/InfoTooltip/InfoTooltip";
import { formatAmount } from "@/utils/amount";
import CategoryAnalysisChart from "./CategoryAnalysisChart";
import MedicalAnalysisChart from "./MedicalAnalysisChart";
import { formatRatio } from "@/app/(sidebar)/analysis/_utils";

import type { components } from "@/types/schema";
import type {
  CategoryAnalysisChartCardProps,
  MedicalAnalysisChartCardProps,
} from "@/app/(sidebar)/analysis/_types/componentPropsType.type";

export async function CategoryAnalysisChartCard({
  categoryPromise,
}: CategoryAnalysisChartCardProps) {
  const { items: categoryItems } = await categoryPromise;
  const topCategory = categoryItems.reduce<components["schemas"]["CategoryCostResponse"] | null>(
    (current, item) => {
      if (!current || (item.ratio && item.ratio > (current?.ratio ?? 0))) return item;
      return current;
    },
    null,
  );
  const topCategoryLabel = topCategory
    ? `${topCategory?.category} ${formatRatio(topCategory?.ratio ?? 0)}%`
    : "-";

  return (
    <section className="rounded-500 border border-gray-100 bg-white-100 p-600">
      <div className="flex items-start justify-between gap-400">
        <div className="flex items-center gap-300">
          <p className="typo-body-l-bold text-gray-500">지출이 가장 많은 항목</p>
          <InfoTooltip description="기간 내 카테고리별 소비 비율입니다." iconSize={20} />
        </div>
      </div>
      <h2 className="mt-200 typo-headline-l-bold text-text-base">{topCategoryLabel}</h2>
      <CategoryAnalysisChart data={categoryItems} />
    </section>
  );
}

export async function MedicalAnalysisChartCard({
  petInfoPromise,
  medicalPromise,
}: MedicalAnalysisChartCardProps) {
  const petInfo = await petInfoPromise;
  const { items: medicalItems, total: medicalTotal } = await medicalPromise;
  const medicalTotalLabel = medicalTotal > 0 ? `총 ${formatAmount(medicalTotal)}` : "-";

  return (
    <section className="rounded-500 border border-gray-100 bg-white-100 p-600">
      <div className="flex items-start justify-between gap-400">
        <div className="flex items-center gap-300">
          <p className="typo-body-l-bold text-gray-500">{petInfo?.petName ?? "-"}의 의료비</p>
          <InfoTooltip description="의료비 소분류별 소비 금액을 확인하세요." iconSize={20} />
        </div>
      </div>
      <h2 className="mt-200 typo-headline-l-bold text-text-base">{medicalTotalLabel}</h2>
      <MedicalAnalysisChart data={medicalItems} />
    </section>
  );
}
