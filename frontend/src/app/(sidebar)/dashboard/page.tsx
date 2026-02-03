import { formatMonthLabel } from "@/utils/date";
import PageHeader from "@/components/layout/Header/PageHeader";
import Summary from "@/app/(sidebar)/dashboard/_components/summary";
import DashboardTable from "@/app/(sidebar)/dashboard/_components/dashboard-table";
import { Suspense } from "react";

export default function DashboardHomePage() {
  const now = new Date();
  const monthLabel = formatMonthLabel(now.getFullYear(), now.getMonth());

  return (
    <>
      <PageHeader title={monthLabel} />
      <Summary />
      <Suspense fallback={<div>Table Loading...</div>}>
        <DashboardTable />
      </Suspense>
    </>
  );
}
