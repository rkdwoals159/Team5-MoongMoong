import type { CalendarPageProps } from "@/app/(sidebar)/calendar/_types";
import CalendarGrid from "./_components/CalendarGrid";
import CalendarHeader from "./_components/CalendarHeader";
import ExpenseModal from "./_components/modal/ExpenseModal";
import { getCalendarPageProps } from "@/app/(sidebar)/calendar/_lib/getCalendarProps";
import { getGroupExpenses, getGroupDailyExpenses } from "@/api/calendarApi";
import PageHeader from "@/components/layout/Header/PageHeader";

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const expenseMap = await getGroupExpenses(resolvedSearchParams.month);
  const { headerProps, gridProps, modalProps } = getCalendarPageProps(
    resolvedSearchParams,
    expenseMap,
  );
  const { selectedDate } = modalProps;
  const modalItems = selectedDate ? await getGroupDailyExpenses(selectedDate) : [];

  return (
    <>
      <PageHeader title="달력" />
      <div className="flex flex-col gap-850">
        <CalendarHeader {...headerProps} />
        <div className="w-full overflow-x-auto">
          <CalendarGrid {...gridProps} />
        </div>
        <ExpenseModal
          open={modalProps.isModalOpen && (modalItems?.length ?? 0) > 0}
          title={modalProps.modalTitle}
          items={modalItems}
          closeHref={modalProps.closeHref}
        />
      </div>
    </>
  );
}
