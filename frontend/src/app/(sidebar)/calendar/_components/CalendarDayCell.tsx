"use client";

import { useRouter } from "next/navigation";
import Chip from "@/components/common/Chip/Chip";
import ExpenseCountChip from "./expense/ExpenseCountChip";
import { getChipColorForCategory } from "@/app/(sidebar)/calendar/_lib/buildCalendarDays";
import type { CalendarDayCellProps } from "@/app/(sidebar)/calendar/_types";
import { getDateTextColor, getTopExpenses } from "../_lib/conditionalStyles";

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
  const extraCount = Math.max(day.expenses.length - 2, 0);

  // 상위 2개 소비내역 반환 - 최대 두개만 표시하고 나머지는 +n건 chip 표시
  const topExpenses = getTopExpenses(day.expenses);
  // 조건부 텍스트 색상 반환
  const dateTextColor = getDateTextColor(isDisabled, day.isWeekend, isSelected, day.isToday);
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
        // 캘린더 페이지 이동 시 월 파라미터와 선택된 날짜 파라미터 설정
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
        className={`flex h-[24px] w-[24px] items-center justify-center rounded-full ${isSelected || day.isToday ? "bg-gray-700" : "bg-transparent"}`}
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
