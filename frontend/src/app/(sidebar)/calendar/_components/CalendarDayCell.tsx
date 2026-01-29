"use client";

import { useRouter } from "next/navigation";
import Chip from "@/components/common/Chip/Chip";
import ExpenseCountChip from "./expense/ExpenseCountChip";
import { getChipColorForCategory } from "@/lib/calendar/buildCalendarDays";
import type { CalendarDayCellProps } from "@/types/calendar";

export default function CalendarDayCell({
  day,
  isSelected,
  isBottomLeft,
  isBottomRight,
  monthParam,
}: CalendarDayCellProps) {
  const router = useRouter();
  const isDisabled = !day.inCurrentMonth;
  const isClickable = day.inCurrentMonth && day.expenses.length > 0;
  const topExpenses = day.expenses
    .slice()
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 2);
  const extraCount = Math.max(day.expenses.length - 2, 0);

  const dateTextColor = isDisabled
    ? "text-[var(--color-gray-200)]"
    : day.isWeekend
      ? "text-[var(--color-red-500)]"
      : "text-[var(--color-text-base)]";

  const pillClasses =
    isSelected || day.isToday
      ? "bg-[var(--color-gray-700)] text-[var(--color-text-inverse)]"
      : "bg-transparent";

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-disabled={!isDisabled && !isClickable}
      aria-current={day.isToday ? "date" : undefined}
      onClick={() => {
        if (!isClickable) {
          return;
        }
        const params = new URLSearchParams();
        params.set("month", monthParam);
        params.set("selected", day.date);
        params.set("open", "1");
        router.push(`?${params.toString()}`);
      }}
      className={`flex h-full w-full flex-col items-start border border-(--color-gray-50) bg-(--color-white-100) px-350 py-300 text-left ${
        isClickable ? "cursor-pointer hover:bg-gray-30" : "cursor-default"
      } ${isBottomLeft ? "rounded-bl-600" : ""} ${isBottomRight ? "rounded-br-600" : ""}`}
    >
      <div
        className={`flex h-[24px] w-[24px] items-center justify-center rounded-full ${pillClasses}`}
      >
        <span className={`typo-body-s-medium ${dateTextColor}`}>{day.dayNumber}</span>
      </div>
      {day.expenses.length > 0 && (
        <div className="mt-350 flex w-full flex-col gap-200">
          {topExpenses.map((expense) => (
            <Chip
              key={expense.id}
              label={expense.category}
              level="major"
              color={getChipColorForCategory(expense.category)}
              price={expense.cost}
            />
          ))}
          {extraCount > 0 && <ExpenseCountChip count={extraCount} />}
        </div>
      )}
    </button>
  );
}
