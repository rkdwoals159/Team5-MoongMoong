import type { CalendarPageProps } from "@/app/(sidebar)/calendar/_types";
import CalendarGrid from "./_components/CalendarGrid";
import CalendarHeader from "./_components/CalendarHeader";
import { getCalendarPageProps } from "@/app/(sidebar)/calendar/_lib/getCalendarProps";
import { getGroupExpenses } from "@/api/calendarApi";
import PageHeader from "@/components/layout/Header/PageHeader";
import ServerComponentErrorFallback from "@/components/ui/ErrorBoundary/ServerComponentErrorFallback";
import { safeServerFetch } from "@/lib/api";

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const expenseMapResult = await safeServerFetch(() =>
    getGroupExpenses(resolvedSearchParams.month),
  );
  if (expenseMapResult instanceof Error) {
    return <ServerComponentErrorFallback message={expenseMapResult.message} />;
  }
  const expenseMap = expenseMapResult;
  const { headerProps, gridProps } = getCalendarPageProps(resolvedSearchParams, expenseMap);

  return (
    <>
      <PageHeader title="달력" />
      <div className="flex flex-col gap-500">
        <CalendarHeader {...headerProps} />
        <div data-calendar-scroll-container className="w-full overflow-x-auto">
          <CalendarGrid {...gridProps} />
        </div>
      </div>
    </>
  );
}
