import { Suspense } from "react";
import { formatMonthLabel } from "@/utils/date";
import PageHeader from "@/components/layout/Header/PageHeader";
import Summary from "@/app/(sidebar)/dashboard/_components/summary";
import SummarySkeleton from "@/app/(sidebar)/dashboard/_components/summary/SummarySkeleton";
import DashboardTable from "@/app/(sidebar)/dashboard/_components/dashboard-table";
import DashboardTableSkeleton from "@/app/(sidebar)/dashboard/_components/dashboard-table/DashboardTableSkeleton";

export default function DashboardHomePage() {
  const now = new Date();
  const monthLabel = formatMonthLabel(now.getFullYear(), now.getMonth());

  return (
    <>
      <PageHeader title={monthLabel} />
      <Suspense fallback={<SummarySkeleton />}>
        <Summary />
      </Suspense>
      <Suspense fallback={<DashboardTableSkeleton />}>
        <DashboardTable />
      </Suspense>
    </>
  );
}
