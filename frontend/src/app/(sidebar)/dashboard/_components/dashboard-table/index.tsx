"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ExpenseData } from "@/app/(sidebar)/dashboard/_types";
import { getExpensesByPeriod } from "@/app/(sidebar)/dashboard/_api";
import { resolveDashboardRange } from "@/app/(sidebar)/dashboard/_lib";
import { EXPENSES_ERROR_MESSAGE } from "@/app/(sidebar)/dashboard/_constants";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import EditableDataTable from "@/app/(sidebar)/dashboard/_components/dashboard-table/EditableDataTable";
import DateRangePicker from "@/components/common/DateRangePicker/DateRangePicker";

export type DashboardTableProps = {
  tableClassName?: string;
};

const DashboardTable = ({ tableClassName }: DashboardTableProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();

  const { startDate, endDate } = resolveDashboardRange({
    startDate: searchParams.get("startDate"),
    endDate: searchParams.get("endDate"),
  });

  const [expenses, setExpenses] = useState<ExpenseData[]>([]);

  const setRangeToUrl = (start: string, end: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("startDate", start);
    params.set("endDate", end);
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    let cancelled = false;

    const loadExpenses = async () => {
      try {
        const data = await getExpensesByPeriod(startDate, endDate);
        if (cancelled) return;
        setExpenses(data.expenses);
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load expenses for period:", error);
        showToast({
          variant: "error",
          message: error instanceof Error ? error.message : EXPENSES_ERROR_MESSAGE,
        });
      }
    };

    loadExpenses();
    return () => {
      cancelled = true;
    };
  }, [startDate, endDate, showToast]);

  return (
    <>
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
    </>
  );
};

export default DashboardTable;
