"use client";

import { memo, useMemo, useRef } from "react";
import type { DataTableProps, DataTableColumn, DataTableShellCol } from "./dataTable.type";
import { TH_BASE_CLASS, VIRTUAL_ROW_HEIGHT } from "./dataTableConstants";
import DataTableShell from "./DataTableShell";
import VirtualRow from "./VirtualRow";
import { cn } from "@/utils/style";
import ArrowUpIcon from "@/assets/icons/components/arrow-up.svg";
import ArrowDownIcon from "@/assets/icons/components/arrow-down.svg";
import { useVirtualizer } from "@tanstack/react-virtual";

// --- 정렬 아이콘 ---
const SortIcon = memo(function SortIcon({ order }: { order: "asc" | "desc" }) {
  const Icon = order === "asc" ? ArrowUpIcon : ArrowDownIcon;

  return (
    <span
      className="inline-flex shrink-0 text-gray-500"
      aria-label={order === "asc" ? "오름차순" : "내림차순"}
    >
      <Icon aria-hidden="true" />
    </span>
  );
});

// --- 헤더 셀 렌더 ---
const renderHeaderCell = <T,>(
  col: DataTableColumn<T>,
  sortConfig: DataTableProps<T>["sortConfig"],
  onSort: DataTableProps<T>["onSort"],
) => {
  const isSortable = col.sortable && onSort;
  const sortEntry = sortConfig?.find((s) => s.sortBy === col.accessor);
  const isSorted = sortEntry !== undefined;
  const handleClick = () => (isSortable ? onSort?.(col.accessor) : undefined);
  const ariaSortValue = isSortable
    ? isSorted
      ? sortEntry.sortOrder === "asc"
        ? ("ascending" as const)
        : ("descending" as const)
      : ("none" as const)
    : undefined;

  return (
    <th
      key={String(col.accessor)}
      scope="col"
      className={cn(
        TH_BASE_CLASS,
        isSortable ? "cursor-pointer select-none hover:bg-gray-100" : "",
        isSorted ? "bg-gray-100" : "",
      )}
      style={{ width: col.width }}
      aria-sort={ariaSortValue}
      onClick={handleClick}
      onKeyDown={
        isSortable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSort?.(col.accessor);
              }
            }
          : undefined
      }
      tabIndex={isSortable ? 0 : undefined}
    >
      {isSorted ? (
        <span className="inline-flex items-center gap-100">
          {col.label}
          <SortIcon order={sortEntry.sortOrder} />
        </span>
      ) : (
        col.label
      )}
    </th>
  );
};

/**
 * 정렬·셀 클릭·키보드 네비게이션을 지원하는 Client 전용 DataTable
 */
const ClientDataTable = <T,>({
  className,
  columns,
  data,
  mode = "read",
  rowKey,
  selectedCell,
  sortConfig,
  onSort,
  onCellClick,
  onKeyDown,
  bottomSlot,
  scrollContainerRef: externalRef,
  ...rest
}: DataTableProps<T>) => {
  "use no memo";

  const hasCellInteraction = mode === "edit" && (onCellClick ?? onKeyDown);

  // 외부 ref가 없을 경우 내부 fallback ref 사용 (읽기 전용 테이블에서 사용)
  const internalRef = useRef<HTMLDivElement>(null);
  const scrollRef = externalRef ?? internalRef;

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => VIRTUAL_ROW_HEIGHT,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  const colgroupColumns = useMemo<DataTableShellCol[]>(
    () => columns.map((c) => ({ accessor: String(c.accessor), width: c.width })),
    [columns],
  );

  const headerSlot = useMemo(
    () => (
      <thead className="bg-gray-50">
        <tr>{columns.map((col) => renderHeaderCell(col, sortConfig, onSort))}</tr>
      </thead>
    ),
    [columns, sortConfig, onSort],
  );

  return (
    <DataTableShell
      className={className}
      columns={colgroupColumns}
      tabIndex={hasCellInteraction ? 0 : undefined}
      onKeyDown={hasCellInteraction ? onKeyDown : undefined}
      headerSlot={headerSlot}
      bottomSlot={bottomSlot}
      scrollContainerRef={scrollRef}
      {...rest}
    >
      <tbody>
        {/* 위쪽 spacer */}
        {virtualItems.length > 0 && virtualItems[0] && (
          <tr style={{ height: `${virtualItems[0].start}px` }} aria-hidden="true">
            <td colSpan={columns.length} />
          </tr>
        )}

        {virtualItems.map((virtualRow) => {
          const row = data[virtualRow.index];
          if (!row) return null;

          return (
            <VirtualRow
              key={rowKey ? rowKey(row, virtualRow.index) : virtualRow.index}
              virtualIndex={virtualRow.index}
              row={row}
              columns={columns}
              selectedAccessor={
                selectedCell?.rowIndex === virtualRow.index ? selectedCell.accessor : null
              }
              mode={mode}
              onCellClick={onCellClick}
            />
          );
        })}

        {/* 아래쪽 spacer */}
        {virtualItems.length > 0 && virtualItems[virtualItems.length - 1] && (
          <tr
            style={{
              height: `${virtualizer.getTotalSize() - (virtualItems[virtualItems.length - 1]?.end ?? 0)}px`,
            }}
            aria-hidden="true"
          >
            <td colSpan={columns.length} />
          </tr>
        )}
      </tbody>
    </DataTableShell>
  );
};

export default ClientDataTable;
