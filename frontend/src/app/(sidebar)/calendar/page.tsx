import type { CalendarPageProps } from "@/app/(sidebar)/calendar/_types";
import CalendarGrid from "./_components/CalendarGrid";
import CalendarHeader from "./_components/CalendarHeader";
import { getCalendarPageProps } from "@/app/(sidebar)/calendar/_lib/getCalendarProps";
import { getGroupExpenses } from "@/api/server/calendarApi";
import ServerComponentErrorFallback from "@/components/ui/ErrorBoundary/ServerComponentErrorFallback";
import { safeServerFetch } from "@/api/lib/client";
import CalendarPageWrapper from "./_components/CalendarPageWrapper";

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const expenseMapResult = await safeServerFetch(() =>
    getGroupExpenses(resolvedSearchParams.month),
  );
  if (expenseMapResult instanceof Error) {
    return (
      <CalendarPageWrapper>
        <ServerComponentErrorFallback message={expenseMapResult.message} />
      </CalendarPageWrapper>
    );
  }
  const expenseMap = expenseMapResult;
  const { headerProps, gridProps } = getCalendarPageProps(resolvedSearchParams, expenseMap);

  return (
    <CalendarPageWrapper>
      <CalendarHeader {...headerProps} />
      <div data-calendar-scroll-container className="w-full overflow-x-auto">
        <CalendarGrid {...gridProps} />
      </div>
    </CalendarPageWrapper>
  );
}
