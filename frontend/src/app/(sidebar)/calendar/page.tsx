import { CalendarPageProps } from "@/app/(sidebar)/calendar/_types";
import CalendarGrid from "./_components/CalendarGrid";
import CalendarHeader from "./_components/CalendarHeader";
import ExpenseModal from "./_components/modal/ExpenseModal";
import {
  getExpenseModalProps,
  getGridProps,
  getHeaderProps,
} from "@/app/(sidebar)/calendar/_lib/getCalendarProps";
import { getCalendarExpenses, getGroupDailyExpenses } from "./_api/expenses";

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const { label, isCurrentMonth, prevMonthParam, nextMonthParam, todayMonthParam, todayDateParam } =
    getHeaderProps(resolvedSearchParams);
  const expenseMap = await getCalendarExpenses(resolvedSearchParams.month);
  const { days, weeks, monthParam } = getGridProps(resolvedSearchParams, expenseMap);
  const { isModalOpen, selectedDate, modalTitle, closeHref } =
    getExpenseModalProps(resolvedSearchParams);
  const selectedExpenses = selectedDate ? (expenseMap[selectedDate] ?? []) : [];
  const modalItems = selectedDate ? await getGroupDailyExpenses(selectedDate) : [];

  return (
    <>
      <h1 className="typo-headline-s-bold text-(--color-text-base)">달력</h1>
      <div className="flex flex-col gap-850">
        <CalendarHeader
          label={label}
          isCurrentMonth={isCurrentMonth}
          prevMonthParam={prevMonthParam}
          nextMonthParam={nextMonthParam}
          todayMonthParam={todayMonthParam}
          todayDateParam={todayDateParam}
        />
        <div className="w-full overflow-x-auto">
          <CalendarGrid
            days={days}
            weeks={weeks}
            selectedDate={selectedDate}
            monthParam={monthParam}
          />
        </div>
        <ExpenseModal
          open={isModalOpen && selectedExpenses.length > 0}
          title={modalTitle}
          items={modalItems}
          closeHref={closeHref}
        />
      </div>
    </>
  );
}
