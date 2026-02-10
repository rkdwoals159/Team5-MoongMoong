"use client";
import { useState } from "react";
import { ExpenseData } from "@/app/(sidebar)/dashboard/_types";
import { useExpensePeriodQuery } from "@/app/(sidebar)/dashboard/_hooks";
import { useSetRangeToUrl } from "@/app/(sidebar)/dashboard/_hooks";
import EditableDataTable from "@/app/(sidebar)/dashboard/_components/dashboard-table/EditableDataTable";
import DateRangePicker from "@/components/common/DateRangePicker/DateRangePicker";

export type DashboardTableProps = {
  tableClassName?: string;
};

const DashboardTable = ({ tableClassName }: DashboardTableProps) => {
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const { startDate, endDate } = useExpensePeriodQuery(setExpenses);
  const setRangeToUrl = useSetRangeToUrl();

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-600">
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onRangeChange={(start, end) => setRangeToUrl(start, end)}
      />
      <EditableDataTable
        initialData={expenses}
        startDate={startDate}
        endDate={endDate}
        className={tableClassName ?? ""}
      />
    </div>
  );
};

export default DashboardTable;
