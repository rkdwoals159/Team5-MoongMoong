import { Suspense } from "react";
import AnalysisHeader from "./_components/AnalysisHeader";
import AnalysisChartsSkeleton from "./_components/skeleton/AnalysisChartsSkeleton";
import AnalysisTableSkeleton from "./_components/skeleton/AnalysisTableSkeleton";
import {
  getCategoryAnalysis,
  getGroupExpenses,
  getMedicalAnalysis,
} from "@/api/server/analysisApi";
import { getPetInfo } from "@/api/server/petApi";
import { resolveAnalysisRange } from "./_lib/analysisRange";
import AnalysisTable from "./_components/table/AnalysisTable";
import {
  CategoryAnalysisChartCard,
  MedicalAnalysisChartCard,
} from "./_components/chart/AnalysisCharts";
import { safeServerFetch } from "@/api/lib/client";

import type { AnalysisPageProps } from "./_types/componentPropsType.type";

export default async function AnalysisPage({ searchParams }: AnalysisPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const { startDate, endDate } = resolveAnalysisRange(resolvedSearchParams);

  //page.tsx에서 API 통합관리를 위해 promise를 사용. await은 내부 컴포넌트에서 처리하도록 함.
  const categoryPromise = safeServerFetch(() => getCategoryAnalysis(startDate, endDate));
  const medicalPromise = safeServerFetch(() => getMedicalAnalysis(startDate, endDate));
  const expensesPromise = safeServerFetch(() => getGroupExpenses(startDate, endDate));
  const petInfoPromise = safeServerFetch(() => getPetInfo());

  return (
    <article className="flex flex-col gap-850 px-850 pb-850">
      <AnalysisHeader startDate={startDate} endDate={endDate} />
      {/* API 데이터 조회가 필요한 컴포넌트는 suspense로 감싸서 관리 */}
      <Suspense fallback={<AnalysisTableSkeleton />}>
        <AnalysisTable petInfoPromise={petInfoPromise} expensesPromise={expensesPromise} />
      </Suspense>

      <section className="grid gap-600 lg:grid-cols-2">
        <Suspense fallback={<AnalysisChartsSkeleton />}>
          <CategoryAnalysisChartCard categoryPromise={categoryPromise} />
        </Suspense>
        <Suspense fallback={<AnalysisChartsSkeleton />}>
          <MedicalAnalysisChartCard
            petInfoPromise={petInfoPromise}
            medicalPromise={medicalPromise}
          />
        </Suspense>
      </section>
    </article>
  );
}
