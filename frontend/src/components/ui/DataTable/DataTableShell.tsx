"use client";

import { memo } from "react";
import { cn } from "@/utils/style";
import type { DataTableShellProps } from "./dataTable.type";
/**
 * 테이블 공통 레이아웃 (wrapper, colgroup, table)
 * DataTable / DataTableInteractive에서 공유
 */
const DataTableShell = memo(function DataTableShell({
  className,
  columns,
  children,
  headerSlot,
  bottomSlot,
  scrollContainerRef,
  tabIndex,
  onKeyDown,
  ...tableRest
}: DataTableShellProps) {
  const colDefs = columns.map((col) => (
    <col key={String(col.accessor)} style={{ width: col.width }} />
  ));

  return (
    <div
      className={cn(
        "flex flex-col w-full border border-gray-50 rounded-600 overflow-hidden min-h-0",
        className ?? "",
      )}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
    >
      <table
        className="w-full border-separate border-spacing-0 text-left table-fixed shrink-0"
        role="presentation"
        aria-hidden="true"
      >
        <colgroup>{colDefs}</colgroup>
        {headerSlot}
      </table>
      <div
        ref={scrollContainerRef}
        className="data-table-scroll flex-1 min-h-0 overflow-auto pt-100"
      >
        <table
          {...tableRest}
          className="w-full border-separate border-spacing-0 text-left table-fixed"
        >
          <colgroup>{colDefs}</colgroup>
          {children}
        </table>
        {bottomSlot}
      </div>
    </div>
  );
});

export default DataTableShell;
