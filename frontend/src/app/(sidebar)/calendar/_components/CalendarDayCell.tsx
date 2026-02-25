"use client";

import { memo, useRef } from "react";
import Chip from "@/components/common/Chip/Chip";
import DataTable from "@/components/ui/DataTable/DataTable";
import { formatAmount } from "@/utils/amount";
import { useCalendarDayCellData } from "@/app/(sidebar)/calendar/_hooks";
import { useCalendarDayCellPanel } from "@/app/(sidebar)/calendar/_hooks";
import ExpenseCountChip from "./expense/ExpenseCountChip";
import type { CalendarDayCellProps, ExpenseCategory } from "@/app/(sidebar)/calendar/_types";
import { DAY_CELL_DETAIL_COLUMNS } from "@/app/(sidebar)/calendar/_constants/calendarDayCellColumns";
import { getChipColorForCategory } from "@/app/(sidebar)/calendar/_utils";

function CalendarDayCell({
  day,
  isSelected,
  hasSelectedDate,
  isBottomLeft,
  isBottomRight,
  isCompact,
}: CalendarDayCellProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dayButtonRef = useRef<HTMLButtonElement>(null);
  const isClickable = day.inCurrentMonth && day.expenses.length > 0;
  const visibleExpenseCount = isCompact ? 1 : 2;

  const panel = useCalendarDayCellPanel({
    dayDate: day.date,
    isClickable,
    containerRef,
    dayButtonRef,
  });

  const viewModel = useCalendarDayCellData({
    day,
    isSelected,
    hasSelectedDate,
    isPanelOpen: panel.isPanelOpen,
    visibleExpenseCount,
  });

  const buttonClassName = [
    "flex h-full w-full flex-col items-start border border-gray-50 bg-white-100 text-left",
    isCompact ? "px-300 py-100" : "px-350 py-200",
    isClickable ? "cursor-pointer hover:bg-gray-30" : "cursor-default",
    isBottomLeft ? "rounded-bl-600" : "",
    isBottomRight ? "rounded-br-600" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const expensesClassName = isCompact
    ? "mt-100 flex w-full flex-col gap-100"
    : "mt-200 flex w-full flex-col gap-200";
  const dateCircleClassName = isCompact ? "size-[24px]" : "size-[28px]";
  const isDateActive = isSelected || panel.isPanelOpen;

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <button
        ref={dayButtonRef}
        type="button"
        disabled={viewModel.isDisabled}
        aria-disabled={!viewModel.isDisabled && !isClickable}
        aria-current={day.isToday ? "date" : undefined}
        aria-expanded={isClickable ? panel.isPanelOpen : undefined}
        aria-controls={isClickable ? panel.panelId : undefined}
        onClick={panel.handleTogglePanel}
        className={buttonClassName}
      >
        <div
          className={`flex shrink-0 items-center justify-center rounded-full ${dateCircleClassName} ${
            isDateActive || viewModel.isTodayActive ? "bg-gray-700" : "bg-transparent"
          }`}
        >
          <span className={`typo-body-m-bold leading-none tabular-nums ${viewModel.dateTextColor}`}>
            {day.dayNumber}
          </span>
        </div>
        {viewModel.hasExpenses ? (
          <div className={expensesClassName}>
            {viewModel.topExpenses.map((expense, idx) => (
              <Chip
                key={expense.expenseId ?? idx}
                label={expense.mainCategory ?? ""}
                level="major"
                color={getChipColorForCategory(expense.mainCategory as ExpenseCategory)}
                price={expense.cost}
                className="w-full min-w-0"
              />
            ))}
            {viewModel.extraCount > 0 ? <ExpenseCountChip count={viewModel.extraCount} /> : null}
          </div>
        ) : null}
      </button>

      {isClickable && panel.isPanelOpen ? (
        <aside
          id={panel.panelId}
          className="absolute z-120 rounded-400 border border-gray-100 bg-white-100 p-350 shadow-[0_10px_28px_rgba(0,0,0,0.16)]"
          style={panel.panelStyle}
        >
          <div className="flex items-center">
            <span className="typo-headline-s-bold text-text-base">{viewModel.dateLabel}</span>
          </div>

          <div className="mt-600">
            {viewModel.visibleExpenses.length === 0 ? (
              <p className="typo-caption-s-medium text-gray-500">
                조건에 맞는 소비 내역이 없습니다.
              </p>
            ) : (
              <div style={panel.tableStyle}>
                <DataTable
                  className="h-full rounded-300 border-gray-50"
                  columns={DAY_CELL_DETAIL_COLUMNS}
                  data={viewModel.visibleExpenses}
                  rowKey={viewModel.rowKey}
                />
              </div>
            )}
          </div>

          <div className="mt-600 flex items-center justify-end gap-400">
            <span className="typo-body-l-bold text-gray-500">지출합계</span>
            <span className="typo-headline-s-bold text-gray-900">
              {formatAmount(viewModel.totalCost)}
            </span>
          </div>
        </aside>
      ) : null}
    </div>
  );
}

export default memo(CalendarDayCell);
