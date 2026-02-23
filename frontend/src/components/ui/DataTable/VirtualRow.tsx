"use client";

import { memo } from "react";
import type { DataTableColumn, DataTableProps } from "./dataTable.type";
import { TD_CELL_WRAPPER_BASE, VIRTUAL_ROW_HEIGHT } from "./dataTableConstants";
import { cn } from "@/utils/style";

export type VirtualRowProps<T> = {
  virtualIndex: number;
  row: T;
  columns: DataTableColumn<T>[];
  selectedAccessor: keyof T | null;
  mode: "read" | "edit";
  onCellClick: DataTableProps<T>["onCellClick"];
};

function VirtualRowInner<T>({
  virtualIndex,
  row,
  columns,
  selectedAccessor,
  mode,
  onCellClick,
}: VirtualRowProps<T>) {
  return (
    <tr className="border-b border-gray-50 last:border-b-0" data-virtual-index={virtualIndex}>
      {columns.map((col) => {
        const isSelected = selectedAccessor === col.accessor;
        const isLifted = mode === "edit" && isSelected;
        const value = row[col.accessor];
        const cellContent = col.render ? (
          col.render(value, row, virtualIndex)
        ) : mode === "edit" && col.editor ? (
          col.editor(value, row, virtualIndex)
        ) : (
          <span>{value == null || value === "" ? "-" : String(value)}</span>
        );

        return (
          <td
            key={`${virtualIndex}-${String(col.accessor)}`}
            className={cn(
              `h-[${VIRTUAL_ROW_HEIGHT}px] align-top overflow-visible bg-transparent p-0 border-b border-gray-50`,
              isLifted ? "relative z-10" : "",
            )}
            style={{ width: col.width }}
            data-row-index={virtualIndex}
            data-accessor={String(col.accessor)}
            data-cell-id={`${virtualIndex}-${String(col.accessor)}`}
            onClick={onCellClick ? () => onCellClick(virtualIndex, col.accessor) : undefined}
          >
            <div
              className={cn(
                TD_CELL_WRAPPER_BASE,
                isSelected ? "ring-2 ring-yellow-300 ring-inset" : "",
                isLifted ? "-translate-y-0.5 shadow-sm ring-2 ring-yellow-300 ring-inset" : "",
              )}
            >
              {cellContent}
            </div>
          </td>
        );
      })}
    </tr>
  );
}

const VirtualRow = memo(VirtualRowInner) as typeof VirtualRowInner;

export default VirtualRow;
