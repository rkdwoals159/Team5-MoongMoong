"use client";

import cn from "@/utils/style";
import EditableDataTable from "./EditableDataTable";
import type { ExpenseData } from "../_types";

export type DashboardTableSectionProps = {
  initialData: ExpenseData[];
  /** EditableDataTable에 전달할 className (높이 등) */
  tableClassName?: string;
};

/**
 * 대시보드 지출 테이블 영역 (Client Component)
 * - 툴바는 page에서 스크롤 영역 밖에 두어 항상 하단 고정
 */
export default function DashboardTableSection({
  initialData,
  tableClassName,
}: DashboardTableSectionProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <EditableDataTable
        initialData={initialData}
        className={cn(
          tableClassName ?? "",
          "rounded-t-600 rounded-b-none border border-b-0 border-gray-50",
        )}
      />
    </div>
  );
}
