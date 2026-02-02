import { DataTableProps, DataTableColumn } from "./DataTable.type";
import cn from "@/utils/style";

const DataTable = <T,>({
  className,
  columns,
  data,
  mode = "read",
  rowKey,
  selectedCell,
  ...rest
}: DataTableProps<T>) => {
  const renderCell = (col: DataTableColumn<T>, row: T, rowIndex: number) => {
    return col.render ? (
      col.render(row[col.accessor], row, rowIndex)
    ) : mode === "edit" && col.editor ? (
      col.editor(row[col.accessor], row, rowIndex)
    ) : (
      <span>{row[col.accessor] == null ? "-" : String(row[col.accessor])}</span>
    );
  };

  const colWidth = `${100 / columns.length}%`;

  return (
    <div
      className={cn(
        "flex flex-col w-full border border-gray-50 rounded-600 overflow-hidden min-h-0",
        className ?? "",
      )}
    >
      {/* thead: 스크롤 밖, 항상 고정 */}
      <table
        {...rest}
        className="w-full border-separate border-spacing-0 text-left table-fixed shrink-0"
      >
        <colgroup>
          {columns.map((col) => (
            <col key={String(col.accessor)} style={{ width: col.width ?? colWidth }} />
          ))}
        </colgroup>
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.accessor)}
                className="h-[48px] px-500 py-200 bg-gray-50 text-text-base typo-body-m-bold"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
      </table>
      {/* tbody: 이 영역만 스크롤 */}
      <div className="flex-1 min-h-0 overflow-auto border-t border-gray-50">
        <table className="w-full border-separate border-spacing-0 text-left table-fixed">
          <colgroup>
            {columns.map((col) => (
              <col key={String(col.accessor)} style={{ width: col.width ?? colWidth }} />
            ))}
          </colgroup>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowKey ? rowKey(row, rowIndex) : rowIndex}
                className="border-b border-gray-50 last:border-b-0"
              >
                {columns.map((col) => {
                  const isSelected =
                    selectedCell?.rowIndex === rowIndex && selectedCell?.accessor === col.accessor;
                  return (
                    <td
                      key={`${rowIndex}-${String(col.accessor)}`}
                      className={cn(
                        "h-[48px] bg-white-100 text-text-base typo-body-m-regular transition-all hover:bg-yellow-50",
                        isSelected ? "ring-2 ring-yellow-300 ring-inset" : "",
                      )}
                    >
                      {renderCell(col, row, rowIndex)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
