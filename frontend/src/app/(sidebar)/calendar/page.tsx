import { CalendarPageProps } from "@/types/calendar";
import CalendarGrid from "./_components/CalendarGrid";
import CalendarHeader from "./_components/CalendarHeader";
import ExpenseModal from "./_components/modal/ExpenseModal";
import { getExpensesForDate } from "@/lib/calendar/mocks";
import {
  getExpenseModalProps,
  getGridProps,
  getHeaderProps,
} from "@/lib/calendar/getCalendarProps";

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const { label, isCurrentMonth, prevMonthParam, nextMonthParam, todayMonthParam, todayDateParam } =
    getHeaderProps(resolvedSearchParams);
  const { days, weeks, monthParam } = getGridProps(resolvedSearchParams);
  const { isModalOpen, selectedDate, modalTitle, closeHref } =
    getExpenseModalProps(resolvedSearchParams);
  const selectedExpenses = selectedDate ? getExpensesForDate(selectedDate) : [];

  return (
    <article className="px-8">
      <div className="flex flex-col gap-850">
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
            items={selectedExpenses}
            closeHref={closeHref}
          />
        </div>
      </div>
    </article>
  );
}
