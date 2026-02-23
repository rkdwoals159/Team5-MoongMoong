"use client";

import type { ReactNode } from "react";
import type { DataTableProps, DataTableColumn, DataTableShellCol } from "./dataTable.type";
import { TH_BASE_CLASS, TD_CELL_WRAPPER_BASE } from "./dataTableConstants";
import DataTableShell from "./DataTableShell";
import { cn } from "@/utils/style";
import ArrowUpIcon from "@/assets/icons/components/arrow-up.svg";
import ArrowDownIcon from "@/assets/icons/components/arrow-down.svg";

// --- 정렬 아이콘 ---
const SortIcon = ({ order }: { order: "asc" | "desc" }) => {
  const Icon = order === "asc" ? ArrowUpIcon : ArrowDownIcon;

  return (
    <span
      className="inline-flex shrink-0 text-gray-300"
      aria-label={order === "asc" ? "오름차순" : "내림차순"}
    >
      <Icon aria-hidden="true" />
    </span>
  );
};

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

  return (
    <th
      key={String(col.accessor)}
      className={cn(
        TH_BASE_CLASS,
        isSortable ? "cursor-pointer select-none hover:bg-gray-100" : "",
        isSorted ? "bg-gray-100" : "",
      )}
      style={{ width: col.width }}
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
      role={isSortable ? "button" : undefined}
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

// --- 바디 셀 렌더 ---
const renderBodyCell = <T,>(
  col: DataTableColumn<T>,
  row: T,
  rowIndex: number,
  selectedCell: DataTableProps<T>["selectedCell"],
  mode: "read" | "edit",
  onCellClick: DataTableProps<T>["onCellClick"],
  renderCell: (col: DataTableColumn<T>, row: T, rowIndex: number) => ReactNode,
) => {
  const isSelected = selectedCell?.rowIndex === rowIndex && selectedCell?.accessor === col.accessor;
  const isLifted = mode === "edit" && isSelected;

  return (
    <td
      key={`${rowIndex}-${String(col.accessor)}`}
      className={cn(
        "h-[48px] align-top overflow-visible bg-transparent p-0 border-b border-gray-50",
        isLifted ? "relative z-10" : "",
      )}
      style={{ width: col.width }}
      data-row-index={rowIndex}
      data-accessor={String(col.accessor)}
      data-cell-id={`${rowIndex}-${String(col.accessor)}`}
      onClick={onCellClick ? () => onCellClick(rowIndex, col.accessor) : undefined}
    >
      <div
        className={cn(
          TD_CELL_WRAPPER_BASE,
          isSelected ? "ring-2 ring-yellow-300 ring-inset" : "",
          isLifted ? "-translate-y-0.5 shadow-sm ring-2 ring-yellow-300 ring-inset" : "",
        )}
      >
        {renderCell(col, row, rowIndex)}
      </div>
    </td>
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
  scrollContainerRef,
  ...rest
}: DataTableProps<T>) => {
  const hasCellInteraction = mode === "edit" && (onCellClick ?? onKeyDown);

  const renderCell = (col: DataTableColumn<T>, row: T, rowIndex: number) => {
    return col.render ? (
      col.render(row[col.accessor], row, rowIndex)
    ) : mode === "edit" && col.editor ? (
      col.editor(row[col.accessor], row, rowIndex)
    ) : (
      <span>
        {row[col.accessor] == null || row[col.accessor] === "" ? "-" : String(row[col.accessor])}
      </span>
    );
  };

  const colgroupColumns: DataTableShellCol[] = columns.map((c) => ({
    accessor: String(c.accessor),
    width: c.width,
  }));

  return (
    <DataTableShell
      className={className}
      columns={colgroupColumns}
      tabIndex={hasCellInteraction ? 0 : undefined}
      onKeyDown={hasCellInteraction ? onKeyDown : undefined}
      bottomSlot={bottomSlot}
      scrollContainerRef={scrollContainerRef}
      {...rest}
    >
      <thead className="bg-gray-50 sticky top-0 z-10">
        <tr>{columns.map((col) => renderHeaderCell(col, sortConfig, onSort))}</tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={rowKey ? rowKey(row, rowIndex) : rowIndex}
            className="border-b border-gray-50 last:border-b-0"
          >
            {columns.map((col) =>
              renderBodyCell(col, row, rowIndex, selectedCell, mode, onCellClick, renderCell),
            )}
          </tr>
        ))}
      </tbody>
    </DataTableShell>
  );
};

export default ClientDataTable;
